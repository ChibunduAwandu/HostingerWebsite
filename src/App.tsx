import { Loader } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { type MutableRefObject, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { LayerState as VisionLayerState } from './components/scenes/VisionScene';
import { GlowLight } from './components/shared/GlowLight';
import { ParticleField } from './components/shared/ParticleField';
import { ActiveSectionOverlay } from './components/ui/ActiveSectionOverlay';
import { NavBar } from './components/ui/NavBar';
import { heroMetrics, proofCards } from './data/proof.data';
import {
  getSceneAnchor,
  resumeHref,
  sceneAnchors,
  sectionOrder,
  type SectionId
} from './data/scenes.config';
import { useCameraTransition } from './hooks/useCameraTransition';
import { useExperienceProfile } from './hooks/useExperienceProfile';

const HeroScene = lazy(() =>
  import('./components/scenes/HeroScene').then((module) => ({ default: module.HeroScene }))
);
const AboutScene = lazy(() =>
  import('./components/scenes/AboutScene').then((module) => ({ default: module.AboutScene }))
);
const AIPipelineScene = lazy(() =>
  import('./components/scenes/AIPipelineScene').then((module) => ({
    default: module.AIPipelineScene
  }))
);
const MarketLabScene = lazy(() =>
  import('./components/scenes/MarketLabScene').then((module) => ({
    default: module.MarketLabScene
  }))
);
const VisionScene = lazy(() =>
  import('./components/scenes/VisionScene').then((module) => ({ default: module.VisionScene }))
);
const ContactScene = lazy(() =>
  import('./components/scenes/ContactScene').then((module) => ({ default: module.ContactScene }))
);
const SceneEffects = lazy(() =>
  import('./components/shared/SceneEffects').then((module) => ({ default: module.default }))
);

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

const CameraRig = ({
  cameraStateRef,
  reducedMotion
}: {
  cameraStateRef: MutableRefObject<{
    position: [number, number, number];
    target: [number, number, number];
  }>;
  reducedMotion: boolean;
}) => {
  const { camera } = useThree();
  const lookAtRef = useRef(new THREE.Vector3(...cameraStateRef.current.target));

  useFrame(() => {
    const targetCamera = new THREE.Vector3(...cameraStateRef.current.position);
    const targetLookAt = new THREE.Vector3(...cameraStateRef.current.target);
    const damping = reducedMotion ? 0.16 : 0.08;

    camera.position.lerp(targetCamera, damping);
    lookAtRef.current.lerp(targetLookAt, damping);
    camera.lookAt(lookAtRef.current);
  });

  return null;
};

const StaticFallback = () => {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-20 text-white">
      <div className="noise-overlay" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan/80">
              WebGL fallback
            </div>
            <h1 className="font-heading text-5xl font-semibold leading-none md:text-7xl">
              Chibundu Awandu
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Software engineer at Apple building AI-ready systems, backend infrastructure,
              computer vision experiments, and quantitative research tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="glass-button" href={resumeHref} rel="noreferrer" target="_blank">
                View Resume
              </a>
              <a className="glass-button glass-button--secondary" href="mailto:chibunduawandu@gmail.com">
                Email
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <div className="metric-pill" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-cyan/75">
              Proof Matrix
            </div>
            <div className="grid gap-4">
              {proofCards.slice(0, 3).map((card) => (
                <div className="rounded-[24px] border border-white/10 bg-black/30 p-4" key={card.title}>
                  <div className="text-[10px] uppercase tracking-[0.32em] text-slate-400">
                    {card.eyebrow}
                  </div>
                  <div className="mt-2 font-heading text-xl">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {sceneAnchors.map((scene) => (
            <div className="glass-panel rounded-3xl p-6" key={scene.id}>
              <div className="mb-2 text-[10px] uppercase tracking-[0.35em] text-cyan/80">
                {scene.eyebrow}
              </div>
              <div className="font-heading text-2xl font-semibold">{scene.title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-300">{scene.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const initialSection =
    typeof window === 'undefined'
      ? 'lab'
      : ((window.location.hash.replace('#', '') as SectionId) || 'lab');
  const [activeSection, setActiveSection] = useState<SectionId>(
    sectionOrder.includes(initialSection) ? initialSection : 'lab'
  );
  const [webglSupported] = useState<boolean>(() => supportsWebGL());
  const [visionLayers, setVisionLayers] = useState<VisionLayerState>({
    raw: true,
    edge: false,
    lane: true,
    boxes: true
  });
  const [marketHighlight, setMarketHighlight] = useState<{ index: number | null; token: number }>({
    index: null,
    token: 0
  });
  const [contactPulse, setContactPulse] = useState(0);
  const experienceProfile = useExperienceProfile();
  const cameraStateRef = useCameraTransition(activeSection);

  useEffect(() => {
    const handleHashChange = () => {
      const next = window.location.hash.replace('#', '') as SectionId;
      if (sectionOrder.includes(next)) {
        setActiveSection(next);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeIndex = useMemo(() => sectionOrder.indexOf(activeSection), [activeSection]);
  const navigateToSection = (sectionId: SectionId) => {
    window.location.hash = sectionId;
    setActiveSection(sectionId);
  };

  if (!webglSupported) {
    return <StaticFallback />;
  }

  return (
    <div className="app-shell relative h-screen w-screen overflow-hidden">
      <div className="noise-overlay" />
      <a className="skip-link" href="#site-content">
        Skip to content
      </a>
      <NavBar
        activeSection={activeSection}
        isCompact={experienceProfile.isMobile}
        onNavigate={navigateToSection}
      />
      <ActiveSectionOverlay
        activeSection={activeSection}
        onContactPulse={() => setContactPulse((current) => current + 1)}
        onNavigate={navigateToSection}
        onSelectMarketStrategy={(index) =>
          setMarketHighlight((current) => ({
            index,
            token: current.token + 1
          }))
        }
        onToggleVisionLayer={(key) =>
          setVisionLayers((current) => ({
            ...current,
            [key]: !current[key]
          }))
        }
        visionLayers={visionLayers}
      />

      <div className="pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur-xl">
        <div className="text-[10px] uppercase tracking-[0.35em] text-slate-300">
          {getSceneAnchor(activeSection).eyebrow} · {getSceneAnchor(activeSection).title}
        </div>
      </div>

      <main className="sr-only" id="site-content">
        <h1>Chibundu Awandu portfolio</h1>
        <p>
          Interactive portfolio covering AI systems, backend engineering, markets, computer vision,
          and contact information.
        </p>
        {sceneAnchors.map((scene) => (
          <section key={scene.id}>
            <h2>{scene.title}</h2>
            <p>{scene.description}</p>
          </section>
        ))}
      </main>

      <Canvas
        camera={{ fov: 45, position: [0, 1.6, 14] }}
        dpr={experienceProfile.dpr}
        gl={{
          alpha: true,
          antialias: experienceProfile.performanceTier !== 'low',
          powerPreference:
            experienceProfile.performanceTier === 'high' ? 'high-performance' : 'default'
        }}
      >
        <color attach="background" args={['#020408']} />
        <fog attach="fog" args={['#020408', 18, 150]} />
        <GlowLight />
        <CameraRig
          cameraStateRef={cameraStateRef}
          reducedMotion={experienceProfile.prefersReducedMotion}
        />
        <Suspense fallback={null}>
          <ParticleField
            count={experienceProfile.particleCount}
            lowMotion={experienceProfile.prefersReducedMotion}
          />
          {Math.abs(activeIndex - 0) <= experienceProfile.sceneMountRadius ? (
            <HeroScene
              isActive={activeSection === 'lab'}
              isMobile={experienceProfile.isMobile}
              onNavigate={navigateToSection}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              worldPosition={sceneAnchors[0].world}
            />
          ) : null}
          {Math.abs(activeIndex - 1) <= experienceProfile.sceneMountRadius ? (
            <AboutScene
              isActive={activeSection === 'engineer'}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              worldPosition={sceneAnchors[1].world}
            />
          ) : null}
          {Math.abs(activeIndex - 2) <= experienceProfile.sceneMountRadius ? (
            <AIPipelineScene
              isActive={activeSection === 'ai-systems'}
              isMobile={experienceProfile.isMobile}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              worldPosition={sceneAnchors[2].world}
            />
          ) : null}
          {Math.abs(activeIndex - 3) <= experienceProfile.sceneMountRadius ? (
            <MarketLabScene
              highlightIndex={marketHighlight.index}
              highlightToken={marketHighlight.token}
              isActive={activeSection === 'markets'}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              worldPosition={sceneAnchors[3].world}
            />
          ) : null}
          {Math.abs(activeIndex - 4) <= experienceProfile.sceneMountRadius ? (
            <VisionScene
              isActive={activeSection === 'vision'}
              layers={visionLayers}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              worldPosition={sceneAnchors[4].world}
            />
          ) : null}
          {Math.abs(activeIndex - 5) <= experienceProfile.sceneMountRadius ? (
            <ContactScene
              isActive={activeSection === 'connect'}
              prefersReducedMotion={experienceProfile.prefersReducedMotion}
              pulseSignal={contactPulse}
              worldPosition={sceneAnchors[5].world}
            />
          ) : null}
          <SceneEffects
            enableAberration={experienceProfile.enableAberration}
            enableBloom={experienceProfile.enableBloom}
            lowPower={experienceProfile.performanceTier === 'low'}
          />
        </Suspense>
      </Canvas>

      <Loader />
    </div>
  );
}
