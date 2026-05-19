import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { generateOrderBook, strategyCards } from '../../data/market.data';
import { useSceneTicker } from '../../hooks/useSceneTicker';

type MarketLabSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  prefersReducedMotion: boolean;
  highlightIndex: number | null;
  highlightToken: number;
};

export const MarketLabScene = ({
  worldPosition,
  prefersReducedMotion,
  highlightIndex,
  highlightToken
}: MarketLabSceneProps) => {
  const tick = useSceneTicker(prefersReducedMotion ? 1400 : 800);
  const [burstIndex, setBurstIndex] = useState<number | null>(null);
  const burstRef = useRef<THREE.Mesh>(null);
  const { bids, asks } = useMemo(() => generateOrderBook(tick), [tick]);

  useEffect(() => {
    if (burstIndex === null) {
      return;
    }

    const timeout = window.setTimeout(() => setBurstIndex(null), 1100);
    return () => window.clearTimeout(timeout);
  }, [burstIndex]);

  useEffect(() => {
    if (highlightIndex !== null) {
      setBurstIndex(highlightIndex);
    }
  }, [highlightIndex, highlightToken]);

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
      <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5.9, 6.5, 0.24, 64]} />
        <meshStandardMaterial color="#091421" emissive="#00D4FF" emissiveIntensity={0.08} />
      </mesh>

      <mesh position={[0, 2.1, -5.8]}>
        <planeGeometry args={[14.5, 5.6]} />
        <meshBasicMaterial color="#0d1726" opacity={0.38} transparent />
      </mesh>

      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.18, 5.2, 7.2]} />
        <meshStandardMaterial color="#07111d" emissive="#00D4FF" emissiveIntensity={0.2} />
      </mesh>

      {bids.map((level, index) => {
        const height = level.volume * 1.45;
        const width = level.volume * 2.15;
        return (
          <mesh key={`bid-${index}`} position={[-1.2 - width / 2, height / 2 - 1.65, index * 0.66 - 3]}>
            <boxGeometry args={[width, height, 0.32]} />
            <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={0.16} />
          </mesh>
        );
      })}

      {asks.map((level, index) => {
        const height = level.volume * 1.45;
        const width = level.volume * 2.15;
        return (
          <mesh key={`ask-${index}`} position={[1.2 + width / 2, height / 2 - 1.65, index * 0.66 - 3]}>
            <boxGeometry args={[width, height, 0.32]} />
            <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.16} />
          </mesh>
        );
      })}

      <Html position={[0, 5.15, 0]} center distanceFactor={10}>
        <div className="glass-panel w-[min(92vw,680px)] overflow-hidden rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
          <div className="ticker-track whitespace-nowrap">
            AAPL +0.4% · BTC -1.2% · SPY +0.1% · QQQ +0.3% · NVDA +1.1% · ETH +0.8% · VIX -0.6%
          </div>
        </div>
      </Html>

      {burstIndex !== null ? (
        <mesh
          position={[0, 1.8, 0]}
          ref={burstRef}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.78, 48]} />
          <meshBasicMaterial color={strategyCards[burstIndex].accent} opacity={0.8} transparent />
        </mesh>
      ) : null}
    </group>
  );
};
