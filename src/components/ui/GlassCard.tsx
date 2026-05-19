import { type ReactNode } from 'react';

type GlassCardProps = {
  title?: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
};

export const GlassCard = ({ title, eyebrow, className = '', children }: GlassCardProps) => {
  return (
    <div className={`glass-panel rounded-3xl p-5 text-white shadow-glass ${className}`}>
      {eyebrow ? (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
          {eyebrow}
        </div>
      ) : null}
      {title ? <h3 className="mb-3 font-heading text-lg font-semibold">{title}</h3> : null}
      <div className="scene-card-copy text-sm leading-6 text-slate-300">{children}</div>
    </div>
  );
};
