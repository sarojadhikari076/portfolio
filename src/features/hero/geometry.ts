export type Vec3 = readonly [number, number, number];

/** Edges arc towards the viewer and slightly to one side, so A→B and B→A never overlap. */
export function controlPoint(a: Vec3, b: Vec3): Vec3 {
  const [mx, my, mz] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const length = Math.hypot(dx, dy) || 1;
  const bend = 0.12 * length;

  return [mx - (dy / length) * bend, my + (dx / length) * bend, mz + 0.35];
}

/** A point `t` of the way along the quadratic Bézier from `a` to `b`. */
export function pointOnEdge(a: Vec3, b: Vec3, t: number): Vec3 {
  const c = controlPoint(a, b);
  const u = 1 - t;

  return [
    u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
    u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
    u * u * a[2] + 2 * u * t * c[2] + t * t * b[2],
  ];
}

/** Packets ease in and out of each hop, like a request leaving and landing. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** The camera both renderers agree on: distance, field of view and resting tilt. */
export const CAMERA = { distance: 7.2, fov: 38, tiltX: -0.16, tiltY: 0.2 } as const;

/**
 * Perspective projection matching the canvas camera at rest, for the SVG drawing. Returns
 * coordinates in the unit square the SVG viewBox is built on.
 */
export function project([x, y, z]: Vec3): [number, number] {
  const { distance, tiltX, tiltY } = CAMERA;

  // Rotate about Y, then X: the same order three.js applies the rig's Euler angles.
  const x1 = x * Math.cos(tiltY) + z * Math.sin(tiltY);
  const z1 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);
  const y2 = y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
  const z2 = y * Math.sin(tiltX) + z1 * Math.cos(tiltX);

  const scale = distance / (distance - z2);
  return [x1 * scale, -y2 * scale];
}
