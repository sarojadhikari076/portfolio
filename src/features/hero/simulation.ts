import { edgeKey, type Flow, type NodeId } from './topology';

/** How long one hop takes to cross its edge, and the pause before the next stage leaves. */
export const HOP_MS = 520;
export const STAGE_GAP_MS = 90;
const STAGE_MS = HOP_MS + STAGE_GAP_MS;

export type Origin = 'user' | 'ambient';

export type Dispatch = { id: number; flow: Flow; startedAt: number; origin: Origin };

export type Packet = { dispatchId: number; from: NodeId; to: NodeId; progress: number };

export type Arrival = {
  dispatchId: number;
  origin: Origin;
  flowTitle: string;
  from: NodeId;
  to: NodeId;
  label: string;
  at: number;
};

export function flowDuration(flow: Flow): number {
  return flow.stages.length * STAGE_MS - STAGE_GAP_MS;
}

/** Where every packet in flight is at `now`. Pure: the same inputs always draw the same frame. */
export function packetsAt(dispatches: readonly Dispatch[], now: number): Packet[] {
  const packets: Packet[] = [];

  for (const { id, flow, startedAt } of dispatches) {
    const elapsed = now - startedAt;
    if (elapsed < 0) continue;

    const index = Math.floor(elapsed / STAGE_MS);
    const within = elapsed - index * STAGE_MS;
    const stage = flow.stages[index];

    if (!stage || within > HOP_MS) continue;

    for (const { from, to } of stage) {
      packets.push({ dispatchId: id, from, to, progress: within / HOP_MS });
    }
  }

  return packets;
}

/** Hops that landed in the window `(after, until]`, oldest first. */
export function arrivalsBetween(
  dispatches: readonly Dispatch[],
  after: number,
  until: number,
): Arrival[] {
  const arrivals: Arrival[] = [];

  for (const { id, flow, startedAt, origin } of dispatches) {
    flow.stages.forEach((stage, index) => {
      const at = startedAt + index * STAGE_MS + HOP_MS;
      if (at <= after || at > until) return;

      for (const { from, to, label } of stage) {
        arrivals.push({ dispatchId: id, origin, flowTitle: flow.title, from, to, label, at });
      }
    });
  }

  return arrivals.sort((a, b) => a.at - b.at);
}

export function activeEdgeKeys(packets: readonly Packet[]): Set<string> {
  return new Set(packets.map(({ from, to }) => edgeKey(from, to)));
}

/** mulberry32: small, fast and seedable, so ambient traffic is reproducible in tests. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AMBIENT_MIN_MS = 2600;
const AMBIENT_SPREAD_MS = 1800;

/** When the next background flow should leave, so the mesh never looks idle or busy. */
export function nextAmbientDelay(random: () => number): number {
  return AMBIENT_MIN_MS + random() * AMBIENT_SPREAD_MS;
}
