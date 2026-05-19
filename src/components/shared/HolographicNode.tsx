import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { PipelineNodeData } from '../../data/pipeline.data';

type HolographicNodeProps = {
  node: PipelineNodeData;
  index: number;
  isActive: boolean;
};

export const HolographicNode = ({ node, index, isActive }: HolographicNodeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!groupRef.current || !isActive) {
      return;
    }

    gsap.fromTo(
      groupRef.current.position,
      { y: node.position[1] + 1.6 },
      {
        y: node.position[1],
        duration: 1,
        delay: index * 0.08,
        ease: 'power3.out'
      }
    );

    gsap.fromTo(
      groupRef.current.scale,
      { x: 0.8, y: 0.8, z: 0.8 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.9,
        delay: index * 0.08,
        ease: 'power3.out'
      }
    );
  }, [index, isActive, node.position]);

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) {
      return;
    }

    const hoverScale = hovered ? 1.06 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.12);
    groupRef.current.position.y =
      node.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.08;
    const pulseStrength = isActive ? Math.max(0, Math.sin(state.clock.elapsedTime * 2.2 - index * 0.55)) : 0;
    materialRef.current.emissiveIntensity = 0.9 + pulseStrength * 0.9 + (hovered ? 0.5 : 0);
  });

  return (
    <group ref={groupRef} position={node.position}>
      <RoundedBox
        args={[2.8, 1.2, 0.34]}
        radius={0.14}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          ref={materialRef}
          color="#09142b"
          emissive={node.accent}
          emissiveIntensity={1}
          metalness={0.35}
          roughness={0.18}
        />
      </RoundedBox>

      <Html center distanceFactor={10}>
        <div className="pointer-events-none flex min-w-[170px] flex-col items-center gap-2">
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan/80">
            Node {index + 1}
          </div>
          <div className="max-w-[180px] text-center text-sm font-semibold text-white">
            {node.title}
          </div>
        </div>
      </Html>

      {hovered && (
        <Html position={[0, 1.25, 0]} center distanceFactor={10}>
          <div className="glass-panel w-60 rounded-2xl p-4 text-left shadow-glass">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan/75">
              Real-World Context
            </div>
            <div className="mb-2 text-sm font-semibold text-white">{node.title}</div>
            <p className="text-sm leading-6 text-slate-300">{node.blurb}</p>
          </div>
        </Html>
      )}
    </group>
  );
};
