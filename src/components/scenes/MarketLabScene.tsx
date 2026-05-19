import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { generateOrderBook, strategyCards } from '../../data/market.data';
import { useSceneTicker } from '../../hooks/useSceneTicker';
import { SceneLabel } from '../ui/SceneLabel';

type MarketLabSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
};

const buildSparkline = (color: string) => {
  const points = Array.from({ length: 16 }, (_, index) => {
    const x = index * 14;
    const y = 40 - (Math.sin(index * 0.72) * 10 + Math.cos(index * 0.38) * 6 + 16);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="h-16 w-full" viewBox="0 0 210 44">
      <polyline
        fill="none"
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
};

export const MarketLabScene = ({ worldPosition, isActive }: MarketLabSceneProps) => {
  const tick = useSceneTicker(800);
  const [burstIndex, setBurstIndex] = useState<number | null>(null);
  const burstRef = useRef<THREE.Mesh>(null);
  const strategyRefs = useRef<Array<THREE.Group | null>>([]);
  const { bids, asks } = useMemo(() => generateOrderBook(tick), [tick]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    strategyRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }

      gsap.fromTo(
        group.position,
        { x: 8.4, y: 2.8 - index * 1.7, z: -1 + index * 1.2 },
        {
          x: 6.2,
          y: 2.8 - index * 1.7,
          z: -1 + index * 1.2,
          duration: 1,
          delay: index * 0.12,
          ease: 'power3.out'
        }
      );
    });
  }, [isActive]);

  useFrame((state) => {
    if (!burstRef.current || burstIndex === null) {
      return;
    }

    const scale = 0.4 + (Math.sin(state.clock.elapsedTime * 8) + 1) * 0.2;
    burstRef.current.scale.setScalar(scale);
    const material = burstRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 7) * 0.2;
  });

  return (
    <group position={worldPosition}>
      <SceneLabel eyebrow="Scene 04" position={[0, 5.1, 0]} title="Market Lab" />

      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7.5, 8.3, 0.2, 48]} />
        <meshStandardMaterial color="#091421" emissive="#00D4FF" emissiveIntensity={0.08} />
      </mesh>

      {bids.map((level, index) => {
        const height = level.volume * 1.5;
        const width = level.volume * 2.2;
        return (
          <mesh
            key={`bid-${index}`}
            position={[-1.4 - width / 2, height / 2 - 1.65, index * 0.68 - 3.1]}
          >
            <boxGeometry args={[width, height, 0.34]} />
            <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={0.15} />
          </mesh>
        );
      })}

      {asks.map((level, index) => {
        const height = level.volume * 1.5;
        const width = level.volume * 2.2;
        return (
          <mesh
            key={`ask-${index}`}
            position={[1.4 + width / 2, height / 2 - 1.65, index * 0.68 - 3.1]}
          >
            <boxGeometry args={[width, height, 0.34]} />
            <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.15} />
          </mesh>
        );
      })}

      <Html position={[0, 5.2, 0]} center distanceFactor={10}>
        <div className="glass-panel w-[min(92vw,620px)] overflow-hidden rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
          <div className="ticker-track whitespace-nowrap">
            AAPL +0.4% · BTC -1.2% · SPY +0.1% · QQQ +0.3% · NVDA +1.1% · ETH +0.8%
          </div>
        </div>
      </Html>

      {strategyCards.map((card, index) => (
        <group
          key={card.id}
          position={[6.2, 2.8 - index * 1.7, -1 + index * 1.2]}
          ref={(node) => (strategyRefs.current[index] = node)}
        >
          <Html center distanceFactor={10}>
            <button
              className="glass-panel w-80 rounded-3xl p-5 text-left transition hover:scale-[1.02]"
              onClick={() => setBurstIndex(index)}
              type="button"
            >
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
                Strategy {index + 1}
              </div>
              <div className="mb-3 font-heading text-lg font-semibold text-white">{card.title}</div>
              <div className="mb-3 text-sm text-slate-300">
                {card.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              {buildSparkline(card.accent)}
            </button>
          </Html>
        </group>
      ))}

      {burstIndex !== null ? (
        <mesh
          position={[6.2, 2.8 - burstIndex * 1.7, -1 + burstIndex * 1.2]}
          ref={burstRef}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.78, 48]} />
          <meshBasicMaterial
            color={strategyCards[burstIndex].accent}
            opacity={0.8}
            transparent
          />
        </mesh>
      ) : null}
    </group>
  );
};
