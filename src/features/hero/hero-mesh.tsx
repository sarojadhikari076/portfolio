'use client';

import { Button } from '@heroui/react';
import { cn } from '@heroui/styles';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { EventLog } from './event-log';
import { MeshDiagram } from './mesh-diagram';
import { createMeshStore } from './mesh-store';
import { FLOWS, type NodeId, NODES } from './topology';
import { useAfterIdle, useCanAnimate, useIsOnScreen } from './use-hero-runtime';

// three.js and the scene load only here, only in the browser, and only once the page is idle.
const MeshCanvas = dynamic(() => import('./mesh-canvas'), { ssr: false });

export function HeroMesh() {
  const [store] = useState(() => createMeshStore());
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const frame = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<NodeId, HTMLElement>());
  const { resolvedTheme } = useTheme();

  const canAnimate = useCanAnimate();
  const isIdle = useAfterIdle();
  const isOnScreen = useIsOnScreen(frame);
  const [isReady, setReady] = useState(false);
  const [fallbackEdges, setFallbackEdges] = useState<ReadonlySet<string>>(new Set());

  const showCanvas = canAnimate && isIdle;
  const isLive = showCanvas && isOnScreen;

  useEffect(() => {
    store.setAmbient(isLive, performance.now());
  }, [isLive, store]);

  useEffect(
    () => () => {
      store.stop();
    },
    [store],
  );

  return (
    <div className="flex flex-col border border-border bg-background/60 sm:rounded-sm">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="label-mono">mela · event flow</p>
        <p className="inline-flex items-center gap-1.5 label-mono">
          <span
            aria-hidden
            className={cn('size-1.5 rounded-full', isLive ? 'bg-accent' : 'bg-(--scene-node)')}
          />
          {isLive ? 'live' : 'static'}
        </p>
      </div>

      <div
        ref={frame}
        aria-hidden
        className="relative aspect-[4/3] w-full overflow-hidden select-none sm:aspect-[16/11]"
      >
        <MeshDiagram
          activeEdges={fallbackEdges}
          className={cn(
            'absolute inset-0 p-3 transition-opacity duration-700',
            isReady && 'opacity-0',
          )}
        />

        {showCanvas ? (
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              isReady ? 'opacity-100' : 'opacity-0',
            )}
          >
            <MeshCanvas
              isRunning={isOnScreen}
              labels={labels}
              store={store}
              theme={resolvedTheme === 'light' ? 'light' : 'dark'}
              onReady={() => {
                setReady(true);
              }}
            />
            <div className="pointer-events-none absolute inset-0">
              {NODES.map((node) => (
                <span
                  key={node.id}
                  ref={(element) => {
                    if (element) labels.current.set(node.id, element);
                    else labels.current.delete(node.id);
                  }}
                  className="group absolute top-0 left-0 will-change-transform"
                  data-layer={node.layer}
                >
                  <span className="absolute -top-6 left-2.5 font-mono text-[0.6875rem] whitespace-nowrap text-muted transition-colors group-data-[active=true]:text-foreground max-sm:hidden max-sm:group-data-[active=true]:inline">
                    {node.label}
                  </span>
                  <span className="absolute top-3 left-2.5 hidden w-56 border border-border bg-overlay px-2.5 py-2 text-xs leading-snug text-foreground group-data-[hovered=true]:block">
                    <span className="block label-mono">{node.label}</span>
                    {node.detail}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border px-3 py-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Send a flow through the mesh"
        >
          {FLOWS.map((flow) => (
            <Button
              key={flow.id}
              className="font-mono text-xs"
              size="sm"
              variant={snapshot.running.has(flow.id) ? 'primary' : 'tertiary'}
              onPress={() => {
                store.dispatchNow(flow.id, 'user');
                if (!isLive) store.runWithoutCanvas(setFallbackEdges);
              }}
            >
              {flow.title}
            </Button>
          ))}
        </div>
        <EventLog entries={snapshot.log} />
        <p aria-live="polite" className="sr-only">
          {snapshot.announcement}
        </p>
      </div>
    </div>
  );
}
