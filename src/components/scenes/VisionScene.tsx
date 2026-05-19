import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type VisionSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
  prefersReducedMotion: boolean;
  layers: LayerState;
};

export type LayerState = {
  raw: boolean;
  edge: boolean;
  lane: boolean;
  boxes: boolean;
};

const vehicleConfigs = [
  { lane: -1.3, offset: 0, color: '#00D4FF' },
  { lane: 0.35, offset: 2.6, color: '#00FF94' },
  { lane: 1.5, offset: 5.1, color: '#FF6B35' },
  { lane: -0.15, offset: 8.4, color: '#7B2FFF' }
];

export const VisionScene = ({
  worldPosition,
  prefersReducedMotion,
  layers
}: VisionSceneProps) => {
  const vehiclesRef = useRef<Array<THREE.Group | null>>([]);

  const laneLeft = useMemo(
    () => [
      [-2.25, -1.58, -7],
      [-2.1, -1.58, -3],
      [-2.15, -1.58, 0],
      [-2.08, -1.58, 3.4],
      [-2.2, -1.58, 7]
    ],
    []
  );
  const laneRight = useMemo(
    () => [
      [2.25, -1.58, -7],
      [2.08, -1.58, -3],
      [2.15, -1.58, 0],
      [2.1, -1.58, 3.4],
      [2.2, -1.58, 7]
    ],
    []
  );

  useFrame((state) => {
    vehiclesRef.current.forEach((vehicle, index) => {
      if (!vehicle) {
        return;
      }

      const config = vehicleConfigs[index];
      const speed = prefersReducedMotion ? 1.2 : 2.4;
      const z = ((state.clock.elapsedTime * speed + config.offset) % 16) - 8;
      vehicle.position.set(config.lane, -1.15, z);
    });
  });

  return (
    <group position={worldPosition}>
      {layers.raw ? (
        <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 20]} />
          <meshStandardMaterial color="#0f1018" emissive="#091421" emissiveIntensity={0.12} />
        </mesh>
      ) : null}

      {[-3.6, 3.6].map((x, index) => (
        <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, index === 0 ? 0.22 : -0.22]}>
          <boxGeometry args={[0.14, 4.2, 16.5]} />
          <meshBasicMaterial color={index === 0 ? '#00D4FF' : '#00FF94'} opacity={0.18} transparent />
        </mesh>
      ))}

      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[0, -1.57, index * 2.2 - 8.8]}>
          <boxGeometry args={[0.12, 0.02, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}

      {layers.edge ? (
        <mesh position={[0, -1.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.1, 20.2, 10, 24]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.12} wireframe />
        </mesh>
      ) : null}

      {layers.lane ? (
        <>
          <Line color="#00FF94" lineWidth={2.2} points={laneLeft as [number, number, number][]} />
          <Line color="#00FF94" lineWidth={2.2} points={laneRight as [number, number, number][]} />
        </>
      ) : null}

      <group position={[0, -1.1, 5.8]}>
        <Line
          color="#00D4FF"
          points={[
            [0, 0, 0],
            [-2.8, 0, -4],
            [2.8, 0, -4],
            [0, 0, 0]
          ]}
        />
      </group>

      {vehicleConfigs.map((config, index) => (
        <group key={index} ref={(node) => (vehiclesRef.current[index] = node)}>
          <mesh>
            <boxGeometry args={[0.95, 0.35, 1.8]} />
            <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.15} />
          </mesh>
          {layers.boxes ? (
            <mesh>
              <boxGeometry args={[1.16, 0.52, 2.05]} />
              <meshBasicMaterial color="#00FF94" transparent opacity={0.8} wireframe />
            </mesh>
          ) : null}
        </group>
      ))}

      <mesh position={[0, 1.9, -7.6]}>
        <planeGeometry args={[9.8, 3.6]} />
        <meshBasicMaterial color="#0d1726" transparent opacity={0.8} />
      </mesh>
      <Html position={[0, 1.9, -7.55]} center distanceFactor={10}>
        <div className="flex h-44 w-[min(30rem,80vw)] flex-col justify-between rounded-[32px] border border-cyan/20 bg-gradient-to-br from-cyan/10 via-slate-950 to-purple/10 p-5 text-left">
          <div className="text-[10px] uppercase tracking-[0.32em] text-cyan/70">Perception Feed</div>
          <div className="grid gap-2 text-sm text-slate-300">
            <div>YOLO pedestrian tracking · real-time object localization</div>
            <div>Lane classification logic with OpenCV + MLP features</div>
            <div>CARLA simulation used as controlled test surface</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">FPS 29</div>
            <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">CONF 0.94</div>
            <div className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">LANE OK</div>
          </div>
        </div>
      </Html>
    </group>
  );
};
