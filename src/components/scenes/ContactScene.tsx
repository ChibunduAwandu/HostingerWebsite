import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { resumeHref } from '../../data/scenes.config';
import { ContactForm } from '../ui/ContactForm';
import { SceneLabel } from '../ui/SceneLabel';

type ContactSceneProps = {
  worldPosition: [number, number, number];
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

export const ContactScene = ({ worldPosition }: ContactSceneProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRefs = useRef<Array<THREE.Group | null>>([]);
  const pulseBoostRef = useRef(0);

  const orbitAngles = useMemo(() => orbitLinks.map((_, index) => index * (Math.PI / 2)), []);

  useFrame((state, delta) => {
    if (ringRef.current) {
      const base =
        0.4 + ((state.clock.elapsedTime * 0.5) % 1) * 2.3 + pulseBoostRef.current * 0.4;
      ringRef.current.scale.set(base, base, base);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(
        0,
        0.7 - (((state.clock.elapsedTime * 0.5) % 1) * 0.6 + pulseBoostRef.current * 0.1)
      );
    }

    orbitRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      const angle = state.clock.elapsedTime * 0.4 + orbitAngles[index];
      group.position.set(Math.cos(angle) * 3.4, 1.8 + Math.sin(angle * 1.4) * 0.28, Math.sin(angle) * 2.1);
      group.lookAt(new THREE.Vector3(0, 1.4, 0));
    });

    if (pulseBoostRef.current > 0) {
      pulseBoostRef.current = Math.max(0, pulseBoostRef.current - delta * 0.5);
    }
  });

  return (
    <group position={worldPosition}>
      <SceneLabel eyebrow="Scene 06" position={[0, 4.8, 0]} title="Connect" />

      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 3.2, 24]} />
        <meshStandardMaterial color="#0d1829" emissive="#00D4FF" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[0, -0.3, 0]} ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.34, 72]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.75} />
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

      <Html position={[0, -2.8, 0]} center distanceFactor={10}>
        <div className="max-w-2xl text-center">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
            Opportunity Radar
          </div>
          <h2 className="font-heading text-3xl font-semibold text-white">
            Open to AI infrastructure, backend systems, and quantitative engineering roles.
          </h2>
        </div>
      </Html>

      <Html position={[0, 0.2, 6.1]} center distanceFactor={11}>
        <ContactForm
          onSuccess={() => {
            pulseBoostRef.current = 1;
          }}
        />
      </Html>
    </group>
  );
};
