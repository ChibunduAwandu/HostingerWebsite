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
        <div className="rounded-full border border-white/10 bg-black/35 px-5 py-2 font-heading text-lg font-semibold tracking-[0.08em] text-white shadow-2xl">
          {title}
        </div>
      </div>
    </Html>
  );
};
