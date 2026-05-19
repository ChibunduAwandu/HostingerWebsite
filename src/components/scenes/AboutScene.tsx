import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DataFlowEdge } from '../shared/DataFlowEdge';

type AboutSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  prefersReducedMotion: boolean;
};

const cardPositions: Array<[number, number, number]> = [
  [-4.3, 1.4, -0.5],
  [0.15, 2.4, 0.8],
  [4.4, 1.55, -0.35]
];

export const AboutScene = ({
  worldPosition,
  isActive,
  prefersReducedMotion
}: AboutSceneProps) => {
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const avatarRef = useRef<THREE.Group>(null);
  const texture = useTexture('/profile-avatar.png');

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
        { y: cardPositions[index][1] - 1.1 },
        {
          y: cardPositions[index][1],
          duration: 0.95,
          delay: index * 0.12,
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
    if (!avatarRef.current || prefersReducedMotion) {
      return;
    }

    avatarRef.current.position.y = 3.35 + Math.sin(state.clock.elapsedTime * 0.66) * 0.12;
    avatarRef.current.rotation.y += 0.004;
  });

  return (
    <group position={worldPosition}>
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[19, 12]} />
        <MeshReflectorMaterial
          blur={[300, 90]}
          color="#050d18"
          depthScale={0.45}
          metalness={0.4}
          minDepthThreshold={0.4}
          mirror={0.72}
          mixBlur={1.1}
          mixStrength={18}
          resolution={1024}
          roughness={0.78}
        />
      </mesh>

      <mesh position={[0, -1.4, 0]}>
        <boxGeometry args={[11.5, 0.22, 5.6]} />
        <meshStandardMaterial color="#07101c" emissive="#00D4FF" emissiveIntensity={0.12} />
      </mesh>

      {[-5.3, 5.3].map((x, index) => (
        <mesh key={x} position={[x, 2, -2.4 + index * 4.8]} rotation={[0, 0, index === 0 ? 0.22 : -0.22]}>
          <boxGeometry args={[0.14, 4.4, 4]} />
          <meshBasicMaterial color={index === 0 ? '#00D4FF' : '#7B2FFF'} opacity={0.24} transparent />
        </mesh>
      ))}

      {connectorPairs.map(([start, end], index) => (
        <DataFlowEdge
          key={index}
          color={index === 1 ? '#00FF94' : '#00D4FF'}
          end={end as [number, number, number]}
          speed={0.15 + index * 0.04}
          start={start as [number, number, number]}
        />
      ))}

      <group position={[0, 3.35, -1.9]} ref={avatarRef}>
        <mesh>
          <circleGeometry args={[1.28, 48]} />
          <meshStandardMaterial color="#091321" emissive="#7B2FFF" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[1.08, 48]} />
          <meshBasicMaterial map={texture} toneMapped={false} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.46, 0.05, 18, 96]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.78} />
        </mesh>
      </group>

      {cardPositions.map((position, index) => (
        <group key={index} position={position} ref={(node) => (cardRefs.current[index] = node)}>
          <mesh>
            <boxGeometry args={[2.8, 1.5, 0.12]} />
            <meshStandardMaterial
              color="#091321"
              emissive={index === 1 ? '#00D4FF' : index === 2 ? '#7B2FFF' : '#00FF94'}
              emissiveIntensity={0.18}
              metalness={0.45}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[2.32, 1.08]} />
            <meshBasicMaterial
              color={index === 1 ? '#00D4FF' : index === 2 ? '#7B2FFF' : '#00FF94'}
              opacity={0.12}
              transparent
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
