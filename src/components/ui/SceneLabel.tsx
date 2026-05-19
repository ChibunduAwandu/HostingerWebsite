import { Html } from '@react-three/drei';

type SceneLabelProps = {
  position: [number, number, number];
  eyebrow: string;
  title: string;
};

export const SceneLabel = ({ position, eyebrow, title }: SceneLabelProps) => {
  return (
    <Html position={position} center distanceFactor={10}>
      <div className="pointer-events-none flex flex-col items-center gap-2">
        <div className="hud-badge">{eyebrow}</div>
        <div className="font-heading text-lg font-semibold tracking-[0.08em] text-white">
          {title}
        </div>
      </div>
    </Html>
  );
};
