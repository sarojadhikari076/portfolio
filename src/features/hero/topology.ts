/**
 * Mela's event flow, as the hero draws it. Every node is a real app, module or piece of
 * infrastructure in that codebase, and every hop is a call, a queue job or a topic it really
 * makes. Positions are hand-placed rather than laid out by a force simulation: a stable picture
 * reads better than one that settles differently on every load.
 */

export type Layer = 'client' | 'module' | 'infra' | 'external';

export type NodeId =
  | 'storefront'
  | 'dashboard'
  | 'door'
  | 'checkout'
  | 'inventory'
  | 'payments'
  | 'orders'
  | 'promotions'
  | 'ticketing'
  | 'refunds'
  | 'checkin'
  | 'live'
  | 'postgres'
  | 'relay'
  | 'queue'
  | 'stripe'
  | 'email';

export type MeshNode = {
  id: NodeId;
  label: string;
  layer: Layer;
  /** What it does, in one line, for the hover card. */
  detail: string;
  position: readonly [x: number, y: number, z: number];
};

const DEPTH: Record<Layer, number> = { client: 0.9, module: 0, infra: -0.9, external: -0.3 };

function node(
  id: NodeId,
  label: string,
  layer: Layer,
  [x, y]: readonly [number, number],
  detail: string,
): MeshNode {
  return { id, label, layer, detail, position: [x, y, DEPTH[layer]] };
}

export const NODES: readonly MeshNode[] = [
  node(
    'storefront',
    'storefront',
    'client',
    [-2.5, 1.45],
    'Next.js storefront where buyers check out',
  ),
  node(
    'dashboard',
    'dashboard',
    'client',
    [2.45, 1.5],
    'Organiser dashboard, kept current over SSE',
  ),
  node('door', 'door', 'client', [2.75, -1.45], 'Offline PWA that verifies Ed25519 tickets'),

  node(
    'checkout',
    'checkout',
    'module',
    [-1.45, 0.75],
    'Prices a basket, holds stock, completes the order',
  ),
  node(
    'inventory',
    'inventory',
    'module',
    [-2.3, -0.2],
    'Capacity pools. One conditional UPDATE, never read-then-write',
  ),
  node(
    'payments',
    'payments',
    'module',
    [0.25, 1.15],
    'Stripe Connect. Each webhook is stored exactly once',
  ),
  node(
    'orders',
    'orders',
    'module',
    [-0.55, 0.05],
    'The order, its timeline and its state machine',
  ),
  node(
    'promotions',
    'promotions',
    'module',
    [-1.15, -0.95],
    'Promo codes, held with the basket and released on expiry',
  ),
  node('ticketing', 'ticketing', 'module', [1.35, 0.15], 'Signs tickets, renders PDFs, sends them'),
  node('refunds', 'refunds', 'module', [1.3, 1.05], 'Single refunds and bulk refund runs'),
  node(
    'checkin',
    'checkin',
    'module',
    [2.0, -0.65],
    'Scans, gates and offline sync. One admission per ticket',
  ),
  node(
    'live',
    'live',
    'module',
    [2.35, 0.55],
    'Server-Sent Events per organisation over Redis pub/sub',
  ),

  node(
    'postgres',
    'postgres',
    'infra',
    [-0.65, -1.35],
    'PostgreSQL. The outbox row commits with the change',
  ),
  node(
    'relay',
    'outbox relay',
    'infra',
    [0.45, -0.85],
    'Moves committed events to the queue every 5 s, SKIP LOCKED',
  ),
  node('queue', 'bullmq', 'infra', [1.15, -1.5], 'Domain events on Redis, retried with backoff'),

  node(
    'stripe',
    'stripe',
    'external',
    [-0.95, 1.85],
    'Payments on the organiser’s connected account',
  ),
  node('email', 'email', 'external', [0.55, 0.45], 'Resend, for tickets and notices'),
];

export type Hop = { from: NodeId; to: NodeId; label: string };

export type FlowId = 'purchase' | 'hold-expiry' | 'door-scan' | 'refund';

export type Flow = {
  id: FlowId;
  /** The button label. */
  title: string;
  /** Hops in the same stage travel together; a stage starts when the one before it lands. */
  stages: readonly (readonly Hop[])[];
};

const hop = (from: NodeId, to: NodeId, label: string): Hop => ({ from, to, label });

/** The relay leg every domain event takes: committed row, relay, queue. */
const viaOutbox = (topic: string): readonly (readonly Hop[])[] => [
  [hop('postgres', 'relay', `outbox_event ${topic}`)],
  [hop('relay', 'queue', `enqueue ${topic}`)],
];

const PURCHASE: Flow = {
  id: 'purchase',
  title: 'Buy a ticket',
  stages: [
    [hop('storefront', 'checkout', 'POST /v1/checkouts')],
    [hop('checkout', 'inventory', 'hold · held + sold + n ≤ capacity')],
    [hop('storefront', 'stripe', 'confirm payment')],
    [hop('stripe', 'payments', 'webhook payment_intent.succeeded')],
    [hop('payments', 'postgres', 'webhook_event stored once')],
    ...viaOutbox('stripe.webhook_received'),
    [hop('queue', 'checkout', 'payment.succeeded')],
    [hop('checkout', 'orders', 'holds → sold, order written')],
    [
      hop('orders', 'postgres', 'order.paid in the same transaction'),
      hop('checkout', 'live', 'signal orders'),
    ],
    [hop('postgres', 'relay', 'outbox_event order.paid'), hop('live', 'dashboard', 'SSE · orders')],
    [hop('relay', 'queue', 'enqueue order.paid')],
    [hop('queue', 'ticketing', 'order.paid')],
    [hop('ticketing', 'email', 'signed tickets sent')],
  ],
};

export const FLOWS: readonly Flow[] = [
  PURCHASE,
  {
    id: 'hold-expiry',
    title: 'Expire a hold',
    stages: [
      [hop('queue', 'inventory', 'sweep due holds, SKIP LOCKED')],
      [hop('inventory', 'postgres', 'capacity returned, hold.expired')],
      ...viaOutbox('hold.expired'),
      [hop('queue', 'checkout', 'hold.expired'), hop('queue', 'promotions', 'hold.expired')],
      [hop('checkout', 'live', 'signal inventory')],
      [hop('live', 'dashboard', 'SSE · inventory')],
    ],
  },
  {
    id: 'door-scan',
    title: 'Scan at the door',
    stages: [
      [hop('door', 'checkin', 'sync queued scans')],
      [hop('checkin', 'postgres', 'unique index admits once')],
      [hop('checkin', 'live', 'signal check-ins')],
      [hop('live', 'dashboard', 'SSE · check-ins')],
    ],
  },
  {
    id: 'refund',
    title: 'Refund an order',
    stages: [
      [hop('dashboard', 'refunds', 'POST /v1/refunds')],
      [hop('refunds', 'stripe', 'refund · idempotency key')],
      [hop('stripe', 'payments', 'webhook charge.refunded')],
      [hop('payments', 'postgres', 'refund.changed')],
      ...viaOutbox('refund.changed'),
      [hop('queue', 'refunds', 'refund.changed · settle')],
      [hop('refunds', 'email', 'refund notice')],
    ],
  },
];

/** Which flow a click on a node starts: the one it begins, or failing that the first it is in. */
export function flowForNode(id: NodeId): Flow {
  const starts = FLOWS.find((flow) => flow.stages[0]?.some((step) => step.from === id));
  const within = FLOWS.find((flow) =>
    flow.stages.some((stage) => stage.some((step) => step.from === id || step.to === id)),
  );

  // Every node is in at least one flow; the topology test proves it.
  return starts ?? within ?? PURCHASE;
}

export const edgeKey = (from: NodeId, to: NodeId) => `${from}->${to}`;

/** Every distinct directed hop across all flows. These are the lines drawn. */
export const EDGES: readonly { from: NodeId; to: NodeId; key: string }[] = [
  ...new Map(
    FLOWS.flatMap((flow) => flow.stages.flat()).map(({ from, to }) => [
      edgeKey(from, to),
      { from, to, key: edgeKey(from, to) },
    ]),
  ).values(),
];

export const NODE_BY_ID = new Map(NODES.map((meshNode) => [meshNode.id, meshNode]));
