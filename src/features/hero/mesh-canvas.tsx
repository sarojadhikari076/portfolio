'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useEffect, useRef, useState } from 'react';
import type { Group, InstancedMesh } from 'three';

import { CAMERA } from './geometry';
import { MeshScene, type SceneTheme } from './mesh-scene';
import type { MeshStore } from './mesh-store';
import { flowForNode, type NodeId, NODES } from './topology';

type MeshCanvasProps = {
  store: MeshStore;
  /** False while the hero is offscreen or the tab is hidden: the render loop stops entirely. */
  isRunning: boolean;
  theme: SceneTheme;
  labels: RefObject<Map<NodeId, HTMLElement>>;
  onReady: () => void;
};

export default function MeshCanvas({ store, isRunning, theme, labels, onReady }: MeshCanvasProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA.distance], fov: CAMERA.fov }}
      dpr={dpr}
      frameloop={isRunning ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
        }}
        onIncline={() => {
          setDpr(1.75);
        }}
      />
      <Scene labels={labels} store={store} theme={theme} onReady={onReady} />
    </Canvas>
  );
}

type SceneProps = Omit<MeshCanvasProps, 'isRunning'>;

function Scene({ store, theme, labels, onReady }: SceneProps) {
  const [scene] = useState(() => new MeshScene(store));
  const rig = useRef<Group>(null);
  const nodes = useRef<InstancedMesh>(null);
  const hasRendered = useRef(false);
  const canvas = useThree((state) => state.gl.domElement);

  useEffect(() => {
    scene.setTheme(theme);
  }, [scene, theme]);

  useEffect(
    () => () => {
      scene.dispose();
    },
    [scene],
  );

  useFrame((state, delta) => {
    scene.update({
      now: performance.now(),
      delta,
      elapsed: state.clock.elapsedTime,
      pointer: state.pointer,
      camera: state.camera,
      size: state.size,
      dpr: state.viewport.dpr,
      rig: rig.current,
      nodes: nodes.current,
      labels: labels.current,
    });

    if (!hasRendered.current) {
      hasRendered.current = true;
      onReady();
    }
  });

  const nodeAt = (event: ThreeEvent<PointerEvent | MouseEvent>): NodeId | null =>
    event.instanceId === undefined ? null : (NODES[event.instanceId]?.id ?? null);

  return (
    <group ref={rig} rotation={[CAMERA.tiltX, CAMERA.tiltY, 0]}>
      <lineSegments geometry={scene.edgeGeometry}>
        <lineBasicMaterial opacity={0.9} toneMapped={false} transparent vertexColors />
      </lineSegments>

      <instancedMesh ref={nodes} args={[undefined, undefined, NODES.length]} frustumCulled={false}>
        <octahedronGeometry args={[0.075, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh
        ref={(mesh) => {
          if (mesh) scene.placeHitTargets(mesh);
        }}
        args={[undefined, undefined, NODES.length]}
        onClick={(event) => {
          const id = nodeAt(event);
          if (id) store.dispatchNow(flowForNode(id).id, 'user');
        }}
        onPointerMove={(event) => {
          scene.setHovered(nodeAt(event), labels.current, canvas);
        }}
        onPointerOut={() => {
          scene.setHovered(null, labels.current, canvas);
        }}
      >
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </instancedMesh>

      <points
        frustumCulled={false}
        geometry={scene.packetGeometry}
        material={scene.packetMaterial}
      />
    </group>
  );
}
