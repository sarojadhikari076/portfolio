import {
  activeEdgeKeys,
  type Arrival,
  arrivalsBetween,
  createRandom,
  type Dispatch,
  flowDuration,
  nextAmbientDelay,
  type Origin,
  type Packet,
  packetsAt,
} from './simulation';
import { type FlowId, FLOWS } from './topology';

const LOG_LENGTH = 6;
const MAX_AMBIENT_IN_FLIGHT = 2;
const FALLBACK_STEP_MS = 100;

export type LogEntry = Arrival & { wallClock: number };

export type MeshSnapshot = {
  log: readonly LogEntry[];
  /** Flows the reader started that are still running, so their buttons can show it. */
  running: ReadonlySet<FlowId>;
  /** A sentence for screen readers when a flow the reader started finishes. */
  announcement: string;
};

export type MeshStore = ReturnType<typeof createMeshStore>;

/**
 * The hero's state, outside React. The canvas calls `tick` every frame and the event log
 * subscribes to the result, so the log re-renders when a hop lands, not sixty times a second.
 * Without the canvas (reduced motion, no WebGL) a timer ticks it instead, and the log still works.
 */
export function createMeshStore(seed = 7) {
  const random = createRandom(seed);
  const listeners = new Set<() => void>();
  let dispatches: Dispatch[] = [];
  let nextId = 1;
  let lastTick = 0;
  let ambient = false;
  let nextAmbientAt = 0;
  let snapshot: MeshSnapshot = { log: [], running: new Set(), announcement: '' };

  const publish = (next: Partial<MeshSnapshot>) => {
    snapshot = { ...snapshot, ...next };
    listeners.forEach((listener) => {
      listener();
    });
  };

  const running = () =>
    new Set(dispatches.filter(({ origin }) => origin === 'user').map(({ flow }) => flow.id));

  function dispatch(flowId: FlowId, origin: Origin, now: number) {
    const flow = FLOWS.find(({ id }) => id === flowId);
    if (!flow) return;

    dispatches = [...dispatches, { id: nextId++, flow, startedAt: now, origin }];
    if (origin === 'user') publish({ running: running() });
  }

  function tick(now: number) {
    const arrivals = arrivalsSince(now);
    const finished = dispatches.filter(
      ({ flow, startedAt }) => now > startedAt + flowDuration(flow),
    );

    if (finished.length > 0) {
      dispatches = dispatches.filter((item) => !finished.includes(item));
    }

    if (ambient && now >= nextAmbientAt) {
      const inFlight = dispatches.filter(({ origin }) => origin === 'ambient').length;
      if (inFlight < MAX_AMBIENT_IN_FLIGHT) {
        const flow = FLOWS[Math.floor(random() * FLOWS.length)];
        if (flow) dispatch(flow.id, 'ambient', now);
      }
      nextAmbientAt = now + nextAmbientDelay(random);
    }

    const userFinished = finished.filter(({ origin }) => origin === 'user');

    if (arrivals.length > 0 || userFinished.length > 0) {
      const wallClock = Date.now();
      const stamped = arrivals.map((arrival) => ({
        ...arrival,
        wallClock: wallClock - (now - arrival.at),
      }));

      publish({
        log: [...stamped.reverse(), ...snapshot.log].slice(0, LOG_LENGTH),
        running: running(),
        announcement: userFinished.length
          ? userFinished.map(({ flow }) => `${flow.title}: done.`).join(' ')
          : snapshot.announcement,
      });
    }
  }

  function arrivalsSince(now: number): Arrival[] {
    const after = lastTick;
    lastTick = now;
    return after === 0 ? [] : arrivalsBetween(dispatches, after, now);
  }

  let fallbackTimer: ReturnType<typeof setInterval> | undefined;

  const activeEdges = (now: number) => activeEdgeKeys(packetsAt(dispatches, now));
  const hasWork = () => dispatches.length > 0;

  return {
    dispatch,
    /** For event handlers: the same as `dispatch`, stamped with the current time. */
    dispatchNow: (flowId: FlowId, origin: Origin) => {
      dispatch(flowId, origin, performance.now());
    },
    tick,
    packets: (now: number): Packet[] => packetsAt(dispatches, now),
    activeEdges,
    hasWork,
    setAmbient: (enabled: boolean, now: number) => {
      ambient = enabled;
      nextAmbientAt = now + 600;
    },
    /**
     * Without the canvas nothing calls `tick`, so a flow started from a button runs on a timer
     * instead, reporting the lit edges each step. The timer stops as soon as the flow does.
     */
    runWithoutCanvas: (onStep: (edges: Set<string>) => void) => {
      if (fallbackTimer) return;
      fallbackTimer = setInterval(() => {
        const now = performance.now();
        tick(now);
        onStep(activeEdges(now));
        if (!hasWork()) {
          clearInterval(fallbackTimer);
          fallbackTimer = undefined;
        }
      }, FALLBACK_STEP_MS);
    },
    stop: () => {
      clearInterval(fallbackTimer);
      fallbackTimer = undefined;
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: (): MeshSnapshot => snapshot,
  };
}
