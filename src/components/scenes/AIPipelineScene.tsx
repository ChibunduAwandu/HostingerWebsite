import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import { pipelineEdges, pipelineNodes } from '../../data/pipeline.data';
import { DataFlowEdge } from '../shared/DataFlowEdge';
import { HolographicNode } from '../shared/HolographicNode';
import { SceneLabel } from '../ui/SceneLabel';

type AIPipelineSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
};

export const AIPipelineScene = ({ worldPosition, isActive }: AIPipelineSceneProps) => {
  const nodeLookup = useMemo(
    () =>
      pipelineNodes.reduce<Record<string, [number, number, number]>>((accumulator, node) => {
        accumulator[node.id] = node.position;
        return accumulator;
      }, {}),
    []
  );

  return (
    <group position={worldPosition}>
      <SceneLabel eyebrow="Scene 03" position={[0, 5.1, 0]} title="AI & ML Systems" />

      <gridHelper args={[28, 28, '#103a51', '#091421']} position={[0, -1.6, 0]} />

      <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#050d18" transparent opacity={0.8} />
      </mesh>

      {pipelineEdges.map(([startId, endId], index) => (
        <DataFlowEdge
          key={`${startId}-${endId}`}
          color={index % 2 === 0 ? '#00D4FF' : '#7B2FFF'}
          end={nodeLookup[endId]}
          speed={0.22 + index * 0.03}
          start={nodeLookup[startId]}
        />
      ))}

      {pipelineNodes.map((node, index) => {
        return (
          <HolographicNode
            index={index}
            isActive={isActive}
            key={node.id}
            node={node}
          />
        );
      })}

      <Html position={[9, 4.2, -1]} distanceFactor={11}>
        <div className="glass-panel rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan/80">
          Apple · Splunk · Break Through Tech
        </div>
      </Html>
    </group>
  );
};
