import { Html, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { resumeHref, type SectionId } from '../../data/scenes.config';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { SceneLabel } from '../ui/SceneLabel';

type HeroSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  onNavigate: (sectionId: SectionId) => void;
};

export const HeroScene = ({ worldPosition, isActive, onNavigate }: HeroSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const mouse = useMouseParallax();

  useEffect(() => {
    if (!groupRef.current || !orbRef.current || !ringRef.current) {
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo(groupRef.current.position, { y: -1.8 }, { y: 0, duration: 1.4, ease: 'power3.out' })
      .fromTo(
        orbRef.current.scale,
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.out' },
        0.18
      )
      .fromTo(
        ringRef.current.scale,
        { x: 0.6, y: 0.6, z: 0.6 },
        { x: 1, y: 1, z: 1, duration: 1.3, ease: 'power3.out' },
        0.25
      );

    return () => {
      timeline.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !orbRef.current || !ringRef.current) {
      return;
    }

    const hoverOffset = new THREE.Vector3(mouse.current.x * 0.7, mouse.current.y * 0.4, 0);
    orbRef.current.position.lerp(new THREE.Vector3(hoverOffset.x, 1.7 + hoverOffset.y, 0), 0.05);
    orbRef.current.rotation.y += delta * 0.22;
    orbRef.current.rotation.x += delta * 0.06;
    ringRef.current.rotation.z -= delta * 0.35;
    ringRef.current.rotation.x += delta * 0.08;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.18;
  });

  return (
    <group position={worldPosition} ref={groupRef}>
      <SceneLabel eyebrow="Scene 01" position={[0, 4.8, 0]} title="The Lab Entrance" />

      <Sphere args={[1.85, 32, 32]} ref={orbRef} position={[0, 1.7, 0]}>
        <meshPhysicalMaterial
          color="#091830"
          emissive="#00D4FF"
          emissiveIntensity={1.1}
          roughness={0.18}
          metalness={0.4}
          wireframe
        />
      </Sphere>

      <mesh ref={ringRef} position={[0, 1.7, 0]} rotation={[0.8, 0.1, 0]}>
        <torusGeometry args={[2.6, 0.05, 16, 160]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0, 1.7, 0]} rotation={[1.1, 0.2, 0.8]}>
        <torusGeometry args={[2.95, 0.02, 16, 160]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.5} />
      </mesh>

      <Html fullscreen>
        <section
          className={`section-shell transition-opacity duration-700 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan/80">
                Interactive AI & Systems Laboratory
              </div>
              <h1 className="font-heading text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Chibundu Awandu
              </h1>
              <div className="mt-3 text-2xl font-medium text-cyan md:text-3xl">
                Software Engineer @ Apple
              </div>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
                AI infrastructure, backend systems, computer vision, and quantitative
                experimentation rendered as one navigable world.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-slate-400">
                <span>AI</span>
                <span>Systems</span>
                <span>Markets</span>
                <span>Vision</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="glass-button" onClick={() => onNavigate('engineer')} type="button">
                  Explore The Lab
                </button>
                <a
                  className="glass-button"
                  href={resumeHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </section>
      </Html>
    </group>
  );
};
