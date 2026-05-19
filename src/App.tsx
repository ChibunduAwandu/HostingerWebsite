import { Loader } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { type MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { AboutScene } from './components/scenes/AboutScene';
import { AIPipelineScene } from './components/scenes/AIPipelineScene';
import { ContactScene } from './components/scenes/ContactScene';
import { HeroScene } from './components/scenes/HeroScene';
import { MarketLabScene } from './components/scenes/MarketLabScene';
import { VisionScene } from './components/scenes/VisionScene';
import { GlowLight } from './components/shared/GlowLight';
import { ParticleField } from './components/shared/ParticleField';
import { NavBar } from './components/ui/NavBar';
import {
  getSceneAnchor,
  resumeHref,
  sceneAnchors,
  sectionOrder,
  type SectionId
} from './data/scenes.config';
import { useCameraTransition } from './hooks/useCameraTransition';

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
};

const CameraRig = ({
  cameraStateRef
}: {
  cameraStateRef: MutableRefObject<{
    position: [number, number, number];
    target: [number, number, number];
  }>;
}) => {
  const { camera } = useThree();
  const lookAtRef = useRef(new THREE.Vector3(...cameraStateRef.current.target));

  useFrame(() => {
    const targetCamera = new THREE.Vector3(...cameraStateRef.current.position);
    const targetLookAt = new THREE.Vector3(...cameraStateRef.current.target);

    camera.position.lerp(targetCamera, 0.08);
    lookAtRef.current.lerp(targetLookAt, 0.08);
    camera.lookAt(lookAtRef.current);
  });

  return null;
};

const StaticFallback = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-noise px-6 py-20 text-white">
      <div className="noise-overlay" />
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan/80">
          WebGL fallback
        </div>
        <h1 className="font-heading text-5xl font-semibold md:text-7xl">Chibundu Awandu</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Software Engineer @ Apple focused on backend systems, AI readiness, computer vision, and
          quantitative experimentation.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a className="glass-button" href={resumeHref} rel="noreferrer" target="_blank">
            View Resume
          </a>
          <a
            className="glass-button"
            href="mailto:chibunduawandu@gmail.com"
          >
            Email
          </a>
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
  const initialSection = (window.location.hash.replace('#', '') as SectionId) || 'lab';
  const [activeSection, setActiveSection] = useState<SectionId>(
    sectionOrder.includes(initialSection) ? initialSection : 'lab'
  );
  const [webglSupported] = useState<boolean>(() => supportsWebGL());
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
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="noise-overlay" />
      <NavBar activeSection={activeSection} onNavigate={navigateToSection} />

      <div className="pointer-events-none fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/25 px-4 py-2 backdrop-blur-xl">
        <div className="text-[10px] uppercase tracking-[0.35em] text-slate-300">
          {getSceneAnchor(activeSection).eyebrow} · {getSceneAnchor(activeSection).title}
        </div>
      </div>

      <Canvas
        camera={{ fov: 45, position: [0, 1.6, 14] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#020408']} />
        <fog attach="fog" args={['#020408', 18, 150]} />
        <GlowLight />
        <CameraRig cameraStateRef={cameraStateRef} />
        <Suspense fallback={null}>
          <ParticleField count={5000} />
          {Math.abs(activeIndex - 0) <= 2 ? (
            <HeroScene
              isActive={activeSection === 'lab'}
              onNavigate={navigateToSection}
              worldPosition={sceneAnchors[0].world}
            />
          ) : null}
          {Math.abs(activeIndex - 1) <= 2 ? (
            <AboutScene isActive={activeSection === 'engineer'} worldPosition={sceneAnchors[1].world} />
          ) : null}
          {Math.abs(activeIndex - 2) <= 2 ? (
            <AIPipelineScene
              isActive={activeSection === 'ai-systems'}
              worldPosition={sceneAnchors[2].world}
            />
          ) : null}
          {Math.abs(activeIndex - 3) <= 2 ? (
            <MarketLabScene
              isActive={activeSection === 'markets'}
              worldPosition={sceneAnchors[3].world}
            />
          ) : null}
          {Math.abs(activeIndex - 4) <= 2 ? (
            <VisionScene isActive={activeSection === 'vision'} worldPosition={sceneAnchors[4].world} />
          ) : null}
          {Math.abs(activeIndex - 5) <= 2 ? (
            <ContactScene worldPosition={sceneAnchors[5].world} />
          ) : null}
        </Suspense>

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.7} />
          <ChromaticAberration
            modulationOffset={0}
            offset={new THREE.Vector2(0.0008, 0.0014)}
            radialModulation={false}
          />
          <Vignette darkness={0.4} offset={0.15} />
        </EffectComposer>
      </Canvas>

      <Loader />
    </div>
  );
}
