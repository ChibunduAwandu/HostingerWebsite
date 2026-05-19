import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type DataFlowEdgeProps = {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  speed?: number;
};

export const DataFlowEdge = ({
  start,
  end,
  color = '#00D4FF',
  speed = 0.18
}: DataFlowEdgeProps) => {
  const packetRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().lerp(endVec, 0.5);
    mid.y += 0.65;
    mid.z += (startVec.z - endVec.z) * 0.1;

    return new THREE.CatmullRomCurve3([startVec, mid, endVec]);
  }, [end, start]);

  const points = useMemo(() => curve.getPoints(48), [curve]);

  useFrame((state) => {
    if (!packetRef.current) {
      return;
    }

    const t = (state.clock.elapsedTime * speed) % 1;
    const point = curve.getPoint(t);
    packetRef.current.position.copy(point);
  });

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.45} lineWidth={1.2} />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};
