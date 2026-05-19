import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type ParticleFieldProps = {
  count?: number;
};

export const ParticleField = ({ count = 5000 }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#dff8ff');
    const colorB = new THREE.Color('#6ee7ff');

    for (let index = 0; index < count; index += 1) {
      pos[index * 3] = (Math.random() - 0.5) * 180;
      pos[index * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[index * 3 + 2] = (Math.random() - 0.5) * 120;

      const mixed = colorA.clone().lerp(colorB, Math.random());
      col[index * 3] = mixed.r;
      col[index * 3 + 1] = mixed.g;
      col[index * 3 + 2] = mixed.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.01;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.8;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors sizeAttenuation transparent opacity={0.9} />
    </points>
  );
};
