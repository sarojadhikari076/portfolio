import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Camera,
  Color,
  type Group,
  type InstancedMesh,
  NormalBlending,
  Object3D,
  ShaderMaterial,
  Vector3,
} from 'three';

import { CAMERA, easeInOut, pointOnEdge } from './geometry';
import type { MeshStore } from './mesh-store';
import { SCENE_PALETTE } from './palette';
import { edgeKey, EDGES, NODE_BY_ID, type NodeId, NODES } from './topology';

const EDGE_SEGMENTS = 28;
const PACKET_POOL = 24;
const TRAIL = 7;
const TRAIL_SPACING = 0.035;

export type SceneTheme = keyof typeof SCENE_PALETTE;

export type FrameInput = {
  now: number;
  delta: number;
  elapsed: number;
  pointer: { x: number; y: number };
  camera: Camera;
  size: { width: number; height: number };
  dpr: number;
  rig: Group | null;
  nodes: InstancedMesh | null;
  labels: ReadonlyMap<NodeId, HTMLElement>;
};

/**
 * Everything the scene mutates each frame lives here, outside React: the buffers, the eased glow
 * per edge and node, and the scratch objects that keep the frame loop allocation-free. The React
 * component only creates it, hands it the refs and calls `update`.
 */
export class MeshScene {
  readonly edgeGeometry: BufferGeometry;
  readonly packetGeometry: BufferGeometry;
  readonly packetMaterial: ShaderMaterial;

  private readonly edgeColors: BufferAttribute;
  private readonly edgeRanges = new Map<string, { start: number; count: number }>();
  private readonly packetPositions: BufferAttribute;
  private readonly packetSizes: BufferAttribute;
  private readonly packetAlphas: BufferAttribute;
  private readonly uniforms = { uColor: { value: new Color() }, uPixelRatio: { value: 1 } };

  private readonly edgeGlow = new Float32Array(EDGES.length);
  private readonly nodeGlow = new Float32Array(NODES.length);
  private readonly colors = {
    edge: new Color(),
    node: new Color(),
    client: new Color(),
    accent: new Color(),
  };
  private readonly scratch = { object: new Object3D(), color: new Color(), vector: new Vector3() };
  private hovered: NodeId | null = null;
  private readonly store: MeshStore;

  constructor(store: MeshStore) {
    this.store = store;
    const vertexCount = EDGES.length * EDGE_SEGMENTS * 2;
    const positions = new Float32Array(vertexCount * 3);
    let vertex = 0;

    for (const { from, to, key } of EDGES) {
      const a = NODE_BY_ID.get(from)?.position;
      const b = NODE_BY_ID.get(to)?.position;
      if (!a || !b) continue;

      const start = vertex;
      for (let segment = 0; segment < EDGE_SEGMENTS; segment += 1) {
        for (const t of [segment / EDGE_SEGMENTS, (segment + 1) / EDGE_SEGMENTS]) {
          positions.set(pointOnEdge(a, b, t), vertex * 3);
          vertex += 1;
        }
      }
      this.edgeRanges.set(key, { start, count: vertex - start });
    }

    this.edgeGeometry = new BufferGeometry();
    this.edgeColors = new BufferAttribute(new Float32Array(vertexCount * 3), 3);
    this.edgeGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.edgeGeometry.setAttribute('color', this.edgeColors);

    const points = PACKET_POOL * TRAIL;
    this.packetGeometry = new BufferGeometry();
    this.packetPositions = new BufferAttribute(new Float32Array(points * 3), 3);
    this.packetSizes = new BufferAttribute(new Float32Array(points), 1);
    this.packetAlphas = new BufferAttribute(new Float32Array(points), 1);
    this.packetGeometry.setAttribute('position', this.packetPositions);
    this.packetGeometry.setAttribute('aSize', this.packetSizes);
    this.packetGeometry.setAttribute('aAlpha', this.packetAlphas);
    this.packetGeometry.setDrawRange(0, 0);

    this.packetMaterial = new ShaderMaterial({
      vertexShader: PACKET_VERTEX,
      fragmentShader: PACKET_FRAGMENT,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    });

    this.setTheme('dark');
  }

  setTheme(theme: SceneTheme): void {
    const palette = SCENE_PALETTE[theme];
    this.colors.edge.set(palette.edge);
    this.colors.node.set(palette.node);
    this.colors.client.set(palette.client);
    this.colors.accent.set(palette.accent);
    this.uniforms.uColor.value.set(palette.accent);
    // Additive glow vanishes on a light page, so paper gets ordinary blending.
    this.packetMaterial.blending = theme === 'light' ? NormalBlending : AdditiveBlending;
    this.packetMaterial.needsUpdate = true;
  }

  /** Larger invisible spheres over each node, so one is easy to hit with a finger. */
  placeHitTargets(mesh: InstancedMesh): void {
    const { object } = this.scratch;
    NODES.forEach((node, index) => {
      object.position.set(...node.position);
      object.rotation.set(0, 0, 0);
      object.scale.setScalar(1);
      object.updateMatrix();
      mesh.setMatrixAt(index, object.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  setHovered(id: NodeId | null, labels: ReadonlyMap<NodeId, HTMLElement>, canvas: HTMLElement) {
    if (this.hovered === id) return;
    if (this.hovered) labels.get(this.hovered)?.removeAttribute('data-hovered');
    if (id) labels.get(id)?.setAttribute('data-hovered', 'true');
    this.hovered = id;
    canvas.style.cursor = id ? 'pointer' : '';
  }

  update(frame: FrameInput): void {
    const { now, delta, elapsed, rig } = frame;
    const ease = Math.min(1, delta * 7);

    this.store.tick(now);
    const inFlight = this.store.packets(now);
    const activeEdges = new Set(inFlight.map(({ from, to }) => edgeKey(from, to)));
    const busyNodes = new Set(inFlight.flatMap(({ from, to }) => [from, to]));

    if (rig) {
      // The rig leans towards the pointer and drifts a little on its own.
      const targetY = CAMERA.tiltY + frame.pointer.x * 0.22 + Math.sin(elapsed * 0.13) * 0.05;
      const targetX = CAMERA.tiltX - frame.pointer.y * 0.1 + Math.sin(elapsed * 0.09) * 0.02;
      const follow = Math.min(1, delta * 2.5);
      rig.rotation.y += (targetY - rig.rotation.y) * follow;
      rig.rotation.x += (targetX - rig.rotation.x) * follow;
      rig.updateMatrixWorld();
    }

    this.updateEdges(activeEdges, ease);
    this.updateNodes(frame, busyNodes, ease);
    this.updatePackets(inFlight);
    this.uniforms.uPixelRatio.value = frame.dpr;
  }

  dispose(): void {
    this.edgeGeometry.dispose();
    this.packetGeometry.dispose();
    this.packetMaterial.dispose();
  }

  private updateEdges(active: ReadonlySet<string>, ease: number): void {
    const { color } = this.scratch;

    EDGES.forEach(({ key }, index) => {
      const current = this.edgeGlow[index] ?? 0;
      const glow = current + ((active.has(key) ? 1 : 0) - current) * ease;
      this.edgeGlow[index] = glow;
      color.copy(this.colors.edge).lerp(this.colors.accent, glow);

      const range = this.edgeRanges.get(key);
      if (!range) return;
      for (let vertex = range.start; vertex < range.start + range.count; vertex += 1) {
        this.edgeColors.setXYZ(vertex, color.r, color.g, color.b);
      }
    });

    this.edgeColors.needsUpdate = true;
  }

  private updateNodes(frame: FrameInput, busy: ReadonlySet<NodeId>, ease: number): void {
    const { nodes: mesh, rig, labels, camera, size, elapsed } = frame;
    const { object, color, vector } = this.scratch;
    if (!mesh) return;

    NODES.forEach((node, index) => {
      // Spin slowly; swell and warm up while traffic passes through, or under the pointer.
      const current = this.nodeGlow[index] ?? 0;
      const target = busy.has(node.id) || this.hovered === node.id ? 1 : 0;
      const glow = current + (target - current) * ease;
      this.nodeGlow[index] = glow;

      object.position.set(...node.position);
      object.rotation.set(0.6, elapsed * 0.35 + index, 0);
      object.scale.setScalar((node.layer === 'external' ? 0.75 : 1) + glow * 0.55);
      object.updateMatrix();
      mesh.setMatrixAt(index, object.matrix);

      const base = node.layer === 'client' ? this.colors.client : this.colors.node;
      mesh.setColorAt(index, color.copy(base).lerp(this.colors.accent, glow));

      // Labels are DOM, placed by projecting the node through the camera.
      const label = labels.get(node.id);
      if (label && rig) {
        vector
          .set(...node.position)
          .applyMatrix4(rig.matrixWorld)
          .project(camera);
        const x = (vector.x * 0.5 + 0.5) * size.width;
        const y = (-vector.y * 0.5 + 0.5) * size.height;
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        label.dataset.active = glow > 0.35 ? 'true' : 'false';
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  /** A bright head and a fading trail per packet, all in one draw call. */
  private updatePackets(inFlight: ReturnType<MeshStore['packets']>): void {
    let point = 0;

    for (const packet of inFlight.slice(0, PACKET_POOL)) {
      const a = NODE_BY_ID.get(packet.from)?.position;
      const b = NODE_BY_ID.get(packet.to)?.position;
      if (!a || !b) continue;

      for (let step = 0; step < TRAIL; step += 1) {
        const t = easeInOut(Math.max(0, packet.progress - step * TRAIL_SPACING));
        const [x, y, z] = pointOnEdge(a, b, t);
        const fade = 1 - step / TRAIL;
        this.packetPositions.setXYZ(point, x, y, z);
        this.packetSizes.setX(point, step === 0 ? 13 : 9 * fade);
        this.packetAlphas.setX(point, step === 0 ? 1 : 0.55 * fade);
        point += 1;
      }
    }

    this.packetGeometry.setDrawRange(0, point);
    this.packetPositions.needsUpdate = true;
    this.packetSizes.needsUpdate = true;
    this.packetAlphas.needsUpdate = true;
  }
}

const PACKET_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uPixelRatio * (7.0 / -viewPosition.z);
    vAlpha = aAlpha;
  }
`;

const PACKET_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float distanceFromCentre = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.2, 0.0, distanceFromCentre);
    float halo = smoothstep(0.5, 0.0, distanceFromCentre) * 0.5;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), core * 0.45), alpha);
  }
`;
