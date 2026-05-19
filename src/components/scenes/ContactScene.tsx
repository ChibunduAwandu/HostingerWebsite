import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { resumeHref } from '../../data/scenes.config';

type ContactSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  prefersReducedMotion: boolean;
  pulseSignal: number;
};

const orbitLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/chibundu-awandu-013a78201',
    icon: Linkedin
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ChibunduAwandu',
    icon: Github
  },
  {
    label: 'Email',
    href: 'mailto:chibunduawandu@gmail.com',
    icon: Mail
  },
  {
    label: 'Resume',
    href: resumeHref,
    icon: FileText
  }
] as const;

export const ContactScene = ({
  worldPosition,
  prefersReducedMotion,
  pulseSignal
}: ContactSceneProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRefs = useRef<Array<THREE.Group | null>>([]);
  const pulseBoostRef = useRef(0);

  const orbitAngles = useMemo(() => orbitLinks.map((_, index) => index * (Math.PI / 2)), []);

  useEffect(() => {
    if (pulseSignal > 0) {
      pulseBoostRef.current = 1;
    }
  }, [pulseSignal]);

  useFrame((state, delta) => {
    if (ringRef.current) {
      const cycle = ((state.clock.elapsedTime * 0.5) % 1) * 2.2;
      const base = 0.45 + cycle + pulseBoostRef.current * 0.48;
      ringRef.current.scale.set(base, base, base);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 0.72 - (cycle * 0.22 + pulseBoostRef.current * 0.08));
    }

    orbitRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      const speed = prefersReducedMotion ? 0.18 : 0.36;
      const angle = state.clock.elapsedTime * speed + orbitAngles[index];
      group.position.set(Math.cos(angle) * 3.5, 1.8 + Math.sin(angle * 1.4) * 0.3, Math.sin(angle) * 2.2);
      group.lookAt(new THREE.Vector3(0, 1.4, 0));
    });

    if (pulseBoostRef.current > 0) {
      pulseBoostRef.current = Math.max(0, pulseBoostRef.current - delta * 0.5);
    }
  });

  return (
    <group position={worldPosition}>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 3.2, 24]} />
        <meshStandardMaterial color="#0d1829" emissive="#00D4FF" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[0, -0.3, 0]} ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.34, 72]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.75} />
      </mesh>

      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 72]} />
        <meshBasicMaterial color="#07111d" opacity={0.55} transparent />
      </mesh>

      {orbitLinks.map((item, index) => {
        const Icon = item.icon;
        return (
          <group key={item.label} ref={(node) => (orbitRefs.current[index] = node)}>
            <Html center distanceFactor={10}>
              <a
                className="glass-panel flex min-w-40 items-center gap-3 rounded-full px-4 py-3 text-sm text-white transition hover:scale-[1.03]"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </a>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
