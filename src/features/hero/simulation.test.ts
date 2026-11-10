import { describe, expect, it } from 'vitest';

import { createMeshStore } from './mesh-store';
import {
  arrivalsBetween,
  createRandom,
  type Dispatch,
  flowDuration,
  HOP_MS,
  packetsAt,
  STAGE_GAP_MS,
} from './simulation';
import { edgeKey, EDGES, flowForNode, FLOWS, NODE_BY_ID, NODES } from './topology';

const purchase = FLOWS.find(({ id }) => id === 'purchase')!;
const dispatchAt = (startedAt: number): Dispatch => ({
  id: 1,
  flow: purchase,
  startedAt,
  origin: 'user',
});

describe('topology', () => {
  it('only routes between nodes that exist', () => {
    for (const { from, to } of EDGES) {
      expect(NODE_BY_ID.has(from), from).toBe(true);
      expect(NODE_BY_ID.has(to), to).toBe(true);
    }
  });

  it('puts every node in at least one flow, so every click does something', () => {
    const touched = new Set(EDGES.flatMap(({ from, to }) => [from, to]));
    expect(NODES.filter(({ id }) => !touched.has(id)).map(({ id }) => id)).toEqual([]);
  });

  it('starts the flow a node begins when it begins one', () => {
    expect(flowForNode('door').id).toBe('door-scan');
    expect(flowForNode('dashboard').id).toBe('refund');
    expect(flowForNode('email').id).toBe('purchase');
  });

  it('has unique node ids and no hop from a node to itself', () => {
    expect(new Set(NODES.map(({ id }) => id)).size).toBe(NODES.length);
    expect(EDGES.filter(({ from, to }) => from === to)).toEqual([]);
  });
});

describe('packetsAt', () => {
  it('is empty before a flow starts and after it ends', () => {
    expect(packetsAt([dispatchAt(1000)], 999)).toEqual([]);
    expect(packetsAt([dispatchAt(1000)], 1000 + flowDuration(purchase) + 1)).toEqual([]);
  });

  it('moves the first hop from 0 to 1 over one hop', () => {
    const [start] = packetsAt([dispatchAt(0)], 0);
    const [middle] = packetsAt([dispatchAt(0)], HOP_MS / 2);

    expect(start).toMatchObject({ from: 'storefront', to: 'checkout', progress: 0 });
    expect(middle?.progress).toBeCloseTo(0.5);
  });

  it('shows nothing in the gap between stages', () => {
    expect(packetsAt([dispatchAt(0)], HOP_MS + STAGE_GAP_MS / 2)).toEqual([]);
  });

  it('sends parallel hops together', () => {
    const stage = purchase.stages.findIndex((hops) => hops.length > 1);
    const packets = packetsAt([dispatchAt(0)], stage * (HOP_MS + STAGE_GAP_MS) + 10);

    expect(packets).toHaveLength(2);
  });
});

describe('arrivalsBetween', () => {
  it('reports every hop exactly once across consecutive windows', () => {
    const dispatches = [dispatchAt(0)];
    const total = flowDuration(purchase);
    const seen = [];

    for (let t = 0; t < total + 100; t += 16) {
      seen.push(...arrivalsBetween(dispatches, t, t + 16));
    }

    expect(seen).toHaveLength(purchase.stages.flat().length);
    expect(seen.map(({ from, to }) => edgeKey(from, to))[0]).toBe('storefront->checkout');
  });
});

describe('createRandom', () => {
  it('is deterministic for a seed', () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe('createMeshStore', () => {
  it('logs hops as they land and announces a finished user flow', () => {
    const store = createMeshStore();
    store.tick(1);
    store.dispatch('door-scan', 'user', 1);
    expect(store.getSnapshot().running.has('door-scan')).toBe(true);

    for (let t = 1; t < 4000; t += 16) store.tick(t);

    const { log, running, announcement } = store.getSnapshot();
    expect(log[0]?.label).toBe('SSE · check-ins');
    expect(running.size).toBe(0);
    expect(announcement).toBe('Scan at the door: done.');
  });

  it('keeps ambient traffic to two flows at a time', () => {
    const store = createMeshStore(3);
    store.setAmbient(true, 0);

    let most = 0;
    for (let t = 1; t < 60_000; t += 50) {
      store.tick(t);
      most = Math.max(most, new Set(store.packets(t).map(({ dispatchId }) => dispatchId)).size);
    }

    expect(most).toBeGreaterThan(0);
    expect(most).toBeLessThanOrEqual(2);
  });
});
