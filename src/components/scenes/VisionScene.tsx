import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { SceneLabel } from '../ui/SceneLabel';

type VisionSceneProps = {
  worldPosition: [number, number, number];
  isActive: boolean;
};

type LayerState = {
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

export const VisionScene = ({ worldPosition, isActive }: VisionSceneProps) => {
  const [layers, setLayers] = useState<LayerState>({
    raw: true,
    edge: false,
    lane: true,
    boxes: true
  });
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
      const z = ((state.clock.elapsedTime * 2.5 + config.offset) % 16) - 8;
      vehicle.position.set(config.lane, -1.15, z);
    });
  });

  return (
    <group position={worldPosition}>
      <SceneLabel eyebrow="Scene 05" position={[0, 6.4, 0]} title="Vision & Autonomy" />

      {layers.raw ? (
        <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 20]} />
          <meshStandardMaterial color="#0f1018" emissive="#091421" emissiveIntensity={0.12} />
        </mesh>
      ) : null}

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

      <mesh position={[0, 1.85, -7.6]}>
        <planeGeometry args={[9.5, 3.4]} />
        <meshBasicMaterial color="#0d1726" transparent opacity={0.8} />
      </mesh>
      <Html position={[0, 1.85, -7.55]} center distanceFactor={10}>
        <div className="flex h-44 w-[28rem] items-center justify-center rounded-[32px] border border-cyan/20 bg-gradient-to-br from-cyan/10 via-slate-950 to-purple/10 text-center text-sm uppercase tracking-[0.38em] text-cyan/70">
          road feed / simulated perception plane
        </div>
      </Html>

      <Html position={[6.1, 2.6, 0]} distanceFactor={11}>
        <div className="glass-panel w-72 rounded-3xl p-5 text-white">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
            Perception Layers
          </div>
          <div className="mb-4 font-heading text-lg font-semibold">Runtime toggles</div>
          <div className="grid gap-2">
            {[
              ['raw', 'Raw View'],
              ['edge', 'Edge Detection'],
              ['lane', 'Lane Overlay'],
              ['boxes', 'Bounding Boxes']
            ].map(([key, label]) => {
              const typedKey = key as keyof LayerState;
              const active = layers[typedKey];

              return (
                <button
                  className={`rounded-2xl px-4 py-3 text-left text-sm transition ${
                    active ? 'bg-cyan/15 text-cyan' : 'bg-white/5 text-slate-300'
                  }`}
                  key={key}
                  onClick={() =>
                    setLayers((current) => ({
                      ...current,
                      [typedKey]: !current[typedKey]
                    }))
                  }
                  type="button"
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-xs uppercase tracking-[0.28em] text-slate-400">
            CARLA · OpenCV · CNN YOLO · MLP Lane Classifier · Viola-Jones
          </div>
        </div>
      </Html>
    </group>
  );
};
