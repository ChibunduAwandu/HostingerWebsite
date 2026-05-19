import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { pipelineEdges, pipelineNodes } from '../../data/pipeline.data';
import { DataFlowEdge } from '../shared/DataFlowEdge';
import { HolographicNode } from '../shared/HolographicNode';

type AIPipelineSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
};

export const AIPipelineScene = ({
  worldPosition,
  isActive,
  isMobile,
  prefersReducedMotion
}: AIPipelineSceneProps) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const nodeLookup = useMemo(
    () =>
      pipelineNodes.reduce<Record<string, [number, number, number]>>((accumulator, node) => {
        accumulator[node.id] = node.position;
        return accumulator;
      }, {}),
    []
  );

  useFrame((state) => {
    if (!pulseRef.current || prefersReducedMotion) {
      return;
    }

    pulseRef.current.position.x = -10.8 + ((state.clock.elapsedTime * 2.8) % 22);
    const material = pulseRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 4) * 0.08;
  });

  return (
    <group position={worldPosition}>
      <gridHelper args={[32, 32, '#103a51', '#091421']} position={[0, -1.6, 0]} />

      <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#050d18" transparent opacity={0.8} />
      </mesh>

      {[-12.2, 12.2].map((x, index) => (
        <mesh key={x} position={[x, 2.25, 0]} rotation={[0, 0, index === 0 ? 0.18 : -0.18]}>
          <boxGeometry args={[0.16, 5, 8.6]} />
          <meshBasicMaterial color={index === 0 ? '#00D4FF' : '#7B2FFF'} opacity={0.18} transparent />
        </mesh>
      ))}

      <mesh position={[0, -1.1, 0]} ref={pulseRef}>
        <boxGeometry args={[1.8, 0.06, 10.5]} />
        <meshBasicMaterial color="#00D4FF" opacity={0.18} transparent />
      </mesh>

      {pipelineEdges.map(([startId, endId], index) => (
        <DataFlowEdge
          key={`${startId}-${endId}`}
          color={index % 2 === 0 ? '#00D4FF' : '#7B2FFF'}
          end={nodeLookup[endId]}
          speed={0.2 + index * 0.03}
          start={nodeLookup[startId]}
        />
      ))}

      {pipelineNodes.map((node, index) => (
        <HolographicNode
          compact={isMobile}
          index={index}
          isActive={isActive}
          key={node.id}
          node={node}
        />
      ))}

      <Html position={[9.8, 4.4, -1]} distanceFactor={11}>
        <div className="glass-panel rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan/80">
          Apple · Splunk · Break Through Tech
        </div>
      </Html>
    </group>
  );
};
