import { heroMetrics, proofCards, signalTimeline } from '../../data/proof.data';
import { resumeHref, type SectionId } from '../../data/scenes.config';
import { strategyCards } from '../../data/market.data';
import type { LayerState as VisionLayerState } from '../scenes/VisionScene';
import { ContactForm } from './ContactForm';
import { SceneFrame } from './SceneFrame';

type ActiveSectionOverlayProps = {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  onContactPulse: () => void;
  onSelectMarketStrategy: (index: number) => void;
  visionLayers: VisionLayerState;
  onToggleVisionLayer: (key: keyof VisionLayerState) => void;
};

const buildSparkline = (color: string) => {
  const points = Array.from({ length: 18 }, (_, index) => {
    const x = index * 12;
    const y = 42 - (Math.sin(index * 0.72) * 10 + Math.cos(index * 0.38) * 6 + 16);
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

export const ActiveSectionOverlay = ({
  activeSection,
  onNavigate,
  onContactPulse,
  onSelectMarketStrategy,
  visionLayers,
  onToggleVisionLayer
}: ActiveSectionOverlayProps) => {
  switch (activeSection) {
    case 'lab':
      return (
        <SceneFrame
          isActive
          layout="hero"
          primary={
            <div className="w-full max-w-[44rem]">
              <div className="scene-kicker">Interactive Engineering Lab</div>
              <h1 className="scene-heading text-white">
                Spatial systems for AI, vision, and market intelligence.
              </h1>
              <p className="scene-body mt-5">
                Chibundu Awandu designs resilient backend platforms, intelligent workflow
                primitives, and research environments that turn abstract technical depth into
                navigable product systems.
              </p>
              <div className="scene-chip-row mt-5">
                {['AI pipelines', 'backend architecture', 'quant research', 'vision systems'].map(
                  (item) => (
                    <div className="scene-chip" key={item}>
                      {item}
                    </div>
                  )
                )}
              </div>
              <div className="mt-7 flex flex-wrap gap-4">
                <button className="glass-button" onClick={() => onNavigate('engineer')} type="button">
                  Enter the Lab
                </button>
                <a
                  className="glass-button glass-button--secondary"
                  href={resumeHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  View Resume
                </a>
              </div>
              <div className="scene-stat-grid mt-7">
                {heroMetrics.map((metric) => (
                  <div className="metric-pill" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={
            <div className="scene-compact-grid scene-panel-scroll pr-1">
              {proofCards.slice(0, 2).map((card) => (
                <article className="glass-panel rounded-[28px] p-5" key={card.title}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.32em] text-cyan/75">
                        {card.eyebrow}
                      </div>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-white">
                        {card.title}
                      </h2>
                    </div>
                    {card.asset ? (
                      <img
                        alt={`${card.title} mark`}
                        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 object-contain p-2"
                        src={card.asset}
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.copy}</p>
                  <div className="mt-4 grid gap-2">
                    {card.bullets.slice(0, 2).map((bullet) => (
                      <div
                        className="rounded-2xl border border-white/8 bg-black/25 px-3 py-2 text-sm text-slate-200"
                        key={bullet}
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          }
        />
      );

    case 'engineer':
      return (
        <SceneFrame
          isActive
          layout="split"
          primary={
            <div className="w-full max-w-[24rem] rounded-[32px] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
              <div className="scene-kicker">Operator profile</div>
              <h2 className="font-heading text-4xl font-semibold leading-tight text-white">
                Systems builder with product instincts and research range.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Software Engineer at Apple in Austin, 4.0 Computer Engineering graduate, Break
                Through Tech AI Fellow, and builder across backend platforms, autonomy research,
                and market simulation.
              </p>
              <div className="scene-chip-row mt-5">
                {['Java', 'Python', 'TypeScript', 'Kafka', 'Three.js', 'OpenCV'].map((item) => (
                  <div className="scene-chip" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={
            <div className="scene-compact-grid scene-panel-scroll pr-1">
              <div className="glass-panel scene-panel-scroll rounded-[30px] p-5">
                <div className="scene-kicker">Trajectory</div>
                <div className="grid gap-3">
                  {signalTimeline.map((item) => (
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3" key={item.year}>
                      <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                        {item.year}
                      </div>
                      <div className="mt-1 font-heading text-lg text-white">{item.title}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel rounded-[30px] p-5">
                <div className="scene-kicker">Proof layer</div>
                <div className="grid gap-3">
                  {proofCards.slice(0, 3).map((card) => (
                    <div className="rounded-[22px] border border-white/10 bg-black/25 p-4" key={card.title}>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                        {card.title}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-slate-200">{card.bullets[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      );

    case 'ai-systems':
      return (
        <SceneFrame
          isActive
          layout="balanced"
          primary={
            <div className="w-full max-w-[26rem] rounded-[30px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <div className="scene-kicker">System notes</div>
              <h2 className="font-heading text-4xl font-semibold leading-tight text-white">
                Platform thinking, not isolated model demos.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This station is about orchestration: intake, feature shaping, inference,
                monitoring, and feedback loops that can survive enterprise product constraints.
              </p>
              <div className="mt-4 grid gap-2">
                {[
                  'Validation layers before model invocation',
                  'Splunk-informed telemetry and regression monitoring',
                  'Advisor-facing backend output surfaces'
                ].map((item) => (
                  <div
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={
            <div className="glass-panel rounded-[30px] p-5">
              <div className="scene-kicker">Proof fragments</div>
              <div className="grid gap-3">
                {proofCards.slice(0, 2).map((card) => (
                  <div className="rounded-[24px] border border-white/10 bg-black/30 p-4" key={card.title}>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                      {card.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-200">{card.bullets[0]}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{card.bullets[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      );

    case 'markets':
      return (
        <SceneFrame
          isActive
          layout="split"
          primary={
            <div className="w-full max-w-[24rem] rounded-[30px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <div className="scene-kicker">Trading thesis</div>
              <h2 className="font-heading text-4xl font-semibold leading-tight text-white">
                Simulate edge before committing capital.
              </h2>
              <div className="mt-4 grid gap-2">
                {[
                  '15% simulated performance lift from strategy refinement',
                  '20% decision-accuracy improvement with AdaBoost classifier support',
                  'Kelly sizing, mean reversion, and momentum modeled in one sandbox'
                ].map((item) => (
                  <div
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={
            <div className="scene-compact-grid">
              <div className="rounded-[30px] border border-orange/20 bg-gradient-to-br from-orange/12 via-black/45 to-cyan/10 p-5 backdrop-blur-xl">
                <div className="text-[10px] uppercase tracking-[0.32em] text-orange-200">
                  Performance snapshot
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    ['PnL Drift', '+12.8%'],
                    ['Win Rate', '61.4%'],
                    ['Max Drawdown', '-4.9%']
                  ].map(([label, value]) => (
                    <div className="rounded-[24px] border border-white/10 bg-black/30 p-4" key={label}>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                        {label}
                      </div>
                      <div className="mt-2 font-heading text-2xl text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel scene-panel-scroll rounded-[30px] p-5">
                <div className="scene-kicker">Strategy dock</div>
                <div className="grid gap-3">
                  {strategyCards.map((card, index) => (
                    <button
                      className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-left transition hover:scale-[1.01]"
                      key={card.id}
                      onClick={() => onSelectMarketStrategy(index)}
                      type="button"
                    >
                      <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                        Strategy {index + 1}
                      </div>
                      <div className="mt-2 font-heading text-lg text-white">{card.title}</div>
                      <div className="mt-2 text-sm text-slate-300">
                        {card.lines.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                      <div className="mt-3">{buildSparkline(card.accent)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      );

    case 'vision':
      return (
        <SceneFrame
          isActive
          layout="balanced"
          primary={
            <div className="w-full max-w-[24rem] rounded-[30px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <div className="scene-kicker">Research notes</div>
              <h2 className="font-heading text-4xl font-semibold leading-tight text-white">
                Perception work grounded in runtime behavior.
              </h2>
              <div className="mt-4 grid gap-2">
                {[
                  'YOLO + TensorFlow experimentation for pedestrian tracking',
                  '35% stronger real-time detection performance during vehicle research',
                  'Lane overlays used as interpretable system output, not decorative UI'
                ].map((item) => (
                  <div
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={
            <div className="glass-panel rounded-[28px] p-5 text-white">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
                Perception layers
              </div>
              <div className="mb-4 font-heading text-lg font-semibold">Runtime toggles</div>
              <div className="grid gap-2">
                {[
                  ['raw', 'Raw View'],
                  ['edge', 'Edge Detection'],
                  ['lane', 'Lane Overlay'],
                  ['boxes', 'Bounding Boxes']
                ].map(([key, label]) => {
                  const typedKey = key as keyof VisionLayerState;
                  const active = visionLayers[typedKey];

                  return (
                    <button
                      className={`rounded-2xl px-4 py-3 text-left text-sm transition ${active ? 'bg-cyan/15 text-cyan' : 'bg-white/5 text-slate-300'}`}
                      key={key}
                      onClick={() => onToggleVisionLayer(typedKey)}
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
          }
        />
      );

    case 'connect':
      return (
        <SceneFrame
          isActive
          layout="balanced"
          primary={
            <div className="w-full rounded-[32px] border border-cyan/15 bg-gradient-to-br from-cyan/10 via-black/45 to-purple/10 p-6 backdrop-blur-xl">
              <div className="mb-3 text-[10px] uppercase tracking-[0.35em] text-cyan/75">
                Opportunity radar
              </div>
              <h2 className="font-heading text-3xl font-semibold text-white">
                Open to AI infrastructure, backend systems, and quantitative engineering work.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                If the role sits at the intersection of system design, intelligent tooling,
                decision-support products, or perception pipelines, that is the right conversation.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  'Enterprise backend platforms',
                  'AI readiness and orchestration',
                  'Computer vision systems',
                  'Quantitative experimentation'
                ].map((item) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
          secondary={<ContactForm onSuccess={onContactPulse} />}
        />
      );

    default:
      return null;
  }
};
