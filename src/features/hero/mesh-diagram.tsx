import { cn } from '@heroui/styles';

import { pointOnEdge, project } from './geometry';
import { EDGES, NODE_BY_ID, NODES } from './topology';

const SAMPLES = 14;
const PADDING = 0.45;

const projected = NODES.map((node) => ({ node, at: project(node.position) }));
const xs = projected.map(({ at }) => at[0]);
const ys = projected.map(({ at }) => at[1]);
const minX = Math.min(...xs) - PADDING;
const minY = Math.min(...ys) - PADDING;
const width = Math.max(...xs) + PADDING - minX;
const height = Math.max(...ys) + PADDING - minY;

const paths = EDGES.map(({ from, to, key }) => {
  const a = NODE_BY_ID.get(from)?.position;
  const b = NODE_BY_ID.get(to)?.position;
  if (!a || !b) return { key, d: '' };

  const points = Array.from({ length: SAMPLES + 1 }, (_, index) =>
    project(pointOnEdge(a, b, index / SAMPLES)),
  );
  const d = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(3)} ${y.toFixed(3)}`)
    .join(' ');
  return { key, d };
});

type MeshDiagramProps = {
  /** Edges a running flow is crossing, drawn in the accent colour. */
  activeEdges?: ReadonlySet<string>;
  className?: string;
};

/**
 * The same topology as the 3D scene, projected through the same camera. It is the first paint
 * (server-rendered, so it can't delay anything), the poster the canvas fades in over, and the
 * whole picture for anyone with reduced motion or no WebGL.
 */
export function MeshDiagram({ activeEdges, className }: MeshDiagramProps) {
  return (
    <svg
      aria-hidden
      className={cn('h-full w-full', className)}
      preserveAspectRatio="xMidYMid meet"
      viewBox={`${minX.toFixed(3)} ${minY.toFixed(3)} ${width.toFixed(3)} ${height.toFixed(3)}`}
    >
      <g fill="none" strokeWidth={0.012}>
        {paths.map(({ key, d }) => (
          <path
            key={key}
            className={cn(
              'transition-[stroke] duration-300',
              activeEdges?.has(key) ? 'stroke-accent' : 'stroke-(--scene-edge)',
            )}
            d={d}
          />
        ))}
      </g>
      {projected.map(({ node, at: [x, y] }) => (
        <g key={node.id} transform={`translate(${x.toFixed(3)} ${y.toFixed(3)})`}>
          <rect
            className={cn(
              node.layer === 'client' ? 'fill-foreground' : 'fill-(--scene-node)',
              node.layer === 'external' && 'fill-transparent stroke-(--scene-node)',
            )}
            height={0.085}
            strokeWidth={0.012}
            transform="rotate(45) translate(-0.0425 -0.0425)"
            width={0.085}
          />
          <text className="fill-muted font-mono" fontSize={0.105} x={0.1} y={-0.09}>
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
