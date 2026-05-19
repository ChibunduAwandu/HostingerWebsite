import { Icosahedron, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { type SectionId } from '../../data/scenes.config';
import { useMouseParallax } from '../../hooks/useMouseParallax';

type HeroSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  onNavigate: (sectionId: SectionId) => void;
  isMobile: boolean;
  prefersReducedMotion: boolean;
};

export const HeroScene = ({
  worldPosition,
  prefersReducedMotion
}: HeroSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const pillarRefs = useRef<Array<THREE.Mesh | null>>([]);
  const mouse = useMouseParallax();

  useEffect(() => {
    if (!groupRef.current || !coreRef.current || !ringARef.current || !ringBRef.current) {
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo(groupRef.current.position, { y: -1.8 }, { y: 0, duration: 1.3, ease: 'power3.out' })
      .fromTo(
        coreRef.current.scale,
        { x: 0.55, y: 0.55, z: 0.55 },
        { x: 1, y: 1, z: 1, duration: 1.1, ease: 'power3.out' },
        0.1
      )
      .fromTo(
        [ringARef.current.scale, ringBRef.current.scale],
        { x: 0.8, y: 0.8, z: 0.8 },
        { x: 1, y: 1, z: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out' },
        0.16
      )
      .fromTo(
        pillarRefs.current.filter(Boolean),
        { y: -1.5, opacity: 0.2 },
        { y: 0, opacity: 1, duration: 1.15, stagger: 0.06, ease: 'power3.out' },
        0.22
      );

    return () => {
      timeline.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current || !ringARef.current || !ringBRef.current) {
      return;
    }

    const parallaxX = prefersReducedMotion ? 0 : mouse.current.x * 0.75;
    const parallaxY = prefersReducedMotion ? 0 : mouse.current.y * 0.42;
    coreRef.current.position.lerp(new THREE.Vector3(1.4 + parallaxX, 1.55 + parallaxY, -0.2), 0.05);

    if (!prefersReducedMotion) {
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x += delta * 0.08;
      ringARef.current.rotation.z -= delta * 0.18;
      ringARef.current.rotation.x += delta * 0.05;
      ringBRef.current.rotation.y += delta * 0.16;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.44) * 0.18;
    }
  });

  return (
    <group position={worldPosition} ref={groupRef}>
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.3, 4.9, 96]} />
        <meshBasicMaterial color="#00D4FF" opacity={0.18} transparent />
      </mesh>

      {[
        [-3.8, 0, -1.8],
        [-2.4, 0.5, 1.8],
        [2.4, 0.45, -2],
        [3.8, 0, 1.7]
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} ref={(node) => (pillarRefs.current[index] = node)}>
          <boxGeometry args={[0.5, 3.6 + (index % 2) * 1.2, 0.5]} />
          <meshStandardMaterial
            color="#08111d"
            emissive={index % 2 === 0 ? '#00D4FF' : '#7B2FFF'}
            emissiveIntensity={0.22}
            metalness={0.55}
            roughness={0.18}
          />
        </mesh>
      ))}

      <Icosahedron args={[1.95, 1]} position={[1.4, 1.55, -0.2]} ref={coreRef}>
        <meshPhysicalMaterial
          color="#07111d"
          emissive="#00D4FF"
          emissiveIntensity={1.05}
          roughness={0.14}
          metalness={0.55}
          wireframe
        />
      </Icosahedron>

      <Torus
        args={[2.6, 0.06, 18, 160]}
        position={[1.4, 1.55, -0.2]}
        ref={ringARef}
        rotation={[0.85, 0.1, 0]}
      >
        <meshBasicMaterial color="#00D4FF" opacity={0.82} transparent />
      </Torus>

      <Torus
        args={[3.2, 0.03, 18, 160]}
        position={[1.4, 1.55, -0.2]}
        ref={ringBRef}
        rotation={[1.08, 0.22, 0.75]}
      >
        <meshBasicMaterial color="#7B2FFF" opacity={0.48} transparent />
      </Torus>

    </group>
  );
};
