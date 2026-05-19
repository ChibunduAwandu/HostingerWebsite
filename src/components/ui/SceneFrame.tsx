import type { ReactNode } from 'react';

type SceneFrameProps = {
  isActive: boolean;
  layout?: 'hero' | 'split' | 'balanced';
  primary: ReactNode;
  secondary?: ReactNode;
};

export const SceneFrame = ({
  isActive,
  layout = 'balanced',
  primary,
  secondary
}: SceneFrameProps) => {
  return (
    <section
      aria-hidden={!isActive}
      className={`scene-frame transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`scene-grid scene-grid--${layout}`}>
        <div className="scene-panel scene-panel--primary">{primary}</div>
        {secondary ? <aside className="scene-panel scene-panel--secondary">{secondary}</aside> : null}
      </div>
    </section>
  );
};
