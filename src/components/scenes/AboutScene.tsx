import { Html, MeshReflectorMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DataFlowEdge } from '../shared/DataFlowEdge';
import { GlassCard } from '../ui/GlassCard';
import { SceneLabel } from '../ui/SceneLabel';

type AboutSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
};

const cardPositions: Array<[number, number, number]> = [
  [-4.2, 1.6, -0.6],
  [0, 2.4, 0.75],
  [4.1, 1.55, -0.4]
];

export const AboutScene = ({ worldPosition, isActive }: AboutSceneProps) => {
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const avatarRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      gsap.fromTo(
        card.position,
        { y: cardPositions[index][1] - 1.4 },
        {
          y: cardPositions[index][1],
          duration: 0.95,
          delay: index * 0.16,
          ease: 'power3.out'
        }
      );
    });
  }, [isActive]);

  const connectorPairs = useMemo(
    () => [
      [cardPositions[0], cardPositions[1]],
      [cardPositions[1], cardPositions[2]],
      [cardPositions[0], cardPositions[2]]
    ],
    []
  );

  useFrame((state) => {
    if (!avatarRef.current) {
      return;
    }

    avatarRef.current.position.y = 3.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    avatarRef.current.rotation.y += 0.005;
  });

  return (
    <group position={worldPosition}>
      <SceneLabel eyebrow="Scene 02" position={[0, 4.8, 0]} title="The Engineer" />

      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 10]} />
        <MeshReflectorMaterial
          blur={[200, 60]}
          resolution={1024}
          mirror={0.7}
          mixBlur={1}
          mixStrength={18}
          roughness={0.8}
          depthScale={0.4}
          minDepthThreshold={0.4}
          color="#07111e"
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, -1.45, 0]}>
        <boxGeometry args={[10, 0.18, 4.8]} />
        <meshStandardMaterial color="#091421" emissive="#00D4FF" emissiveIntensity={0.12} />
      </mesh>

      {connectorPairs.map(([start, end], index) => (
        <DataFlowEdge
          key={index}
          color={index === 1 ? '#00FF94' : '#00D4FF'}
          end={end as [number, number, number]}
          speed={0.16 + index * 0.05}
          start={start as [number, number, number]}
        />
      ))}

      <group ref={avatarRef} position={[0, 3.3, -1.8]}>
        <mesh>
          <circleGeometry args={[1, 40]} />
          <meshStandardMaterial color="#0c1529" emissive="#7B2FFF" emissiveIntensity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.04, 16, 80]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} />
        </mesh>
        <Html center distanceFactor={10}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-black/40 font-heading text-3xl font-semibold text-white">
            CA
          </div>
        </Html>
      </group>

      <group position={cardPositions[0]} ref={(node) => (cardRefs.current[0] = node)}>
        <Html center distanceFactor={9}>
          <GlassCard className="w-72 hover:scale-[1.03] transition" eyebrow="Identity" title="Software engineer, builder, operator">
            <p>Software Engineer @ Apple | Austin, TX</p>
            <p>4.0 GPA — Bethune-Cookman University, Computer Engineering</p>
            <p>Break Through Tech AI Fellow | Presidential Honors Scholar</p>
            <p>8,300+ LinkedIn followers</p>
          </GlassCard>
        </Html>
      </group>

      <group position={cardPositions[1]} ref={(node) => (cardRefs.current[1] = node)}>
        <Html center distanceFactor={9}>
          <GlassCard className="w-80 hover:scale-[1.03] transition" eyebrow="Stack" title="Systems-grade tools">
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
              {[
                'Java',
                'Python',
                'TypeScript',
                'Three.js',
                'TensorFlow',
                'PyTorch',
                'OpenCV',
                'Node.js',
                'Spring Boot',
                'Kafka',
                'Kubernetes',
                'SQL'
              ].map((item) => (
                <div
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        </Html>
      </group>

      <group position={cardPositions[2]} ref={(node) => (cardRefs.current[2] = node)}>
        <Html center distanceFactor={9}>
          <GlassCard className="w-72 hover:scale-[1.03] transition" eyebrow="Philosophy" title="How I build">
            <p>
              I build systems that think, from AI decision pipelines at enterprise scale to
              autonomous perception experiments and market simulators.
            </p>
          </GlassCard>
        </Html>
      </group>
    </group>
  );
};
