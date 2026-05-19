import { useEffect, useMemo, useState } from 'react';

type PerformanceTier = 'low' | 'mid' | 'high';

type ExperienceProfile = {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  performanceTier: PerformanceTier;
  dpr: [number, number];
  particleCount: number;
  enableBloom: boolean;
  enableAberration: boolean;
  enableHeavyMotion: boolean;
  sceneMountRadius: number;
};

const getTier = (width: number, memory?: number, cores?: number): PerformanceTier => {
  if (width < 820 || (memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4)) {
    return 'low';
  }

  if (width < 1280 || (memory !== undefined && memory <= 8) || (cores !== undefined && cores <= 8)) {
    return 'mid';
  }

  return 'high';
};

export const useExperienceProfile = (): ExperienceProfile => {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 1440 : window.innerWidth,
    reduced:
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () =>
      setViewport({
        width: window.innerWidth,
        reduced: media.matches
      });

    update();
    window.addEventListener('resize', update);
    media.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      media.removeEventListener('change', update);
    };
  }, []);

  return useMemo(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };

    const performanceTier = getTier(
      viewport.width,
      nav.deviceMemory,
      nav.hardwareConcurrency
    );
    const isMobile = viewport.width < 900;
    const prefersReducedMotion = viewport.reduced;

    if (prefersReducedMotion) {
      return {
        isMobile,
        prefersReducedMotion,
        performanceTier: 'low',
        dpr: [1, 1.15],
        particleCount: 600,
        enableBloom: true,
        enableAberration: false,
        enableHeavyMotion: false,
        sceneMountRadius: 1
      };
    }

    if (performanceTier === 'low') {
      return {
        isMobile,
        prefersReducedMotion,
        performanceTier,
        dpr: [1, 1.2],
        particleCount: 1200,
        enableBloom: true,
        enableAberration: false,
        enableHeavyMotion: false,
        sceneMountRadius: 1
      };
    }

    if (performanceTier === 'mid') {
      return {
        isMobile,
        prefersReducedMotion,
        performanceTier,
        dpr: [1, 1.45],
        particleCount: 2400,
        enableBloom: true,
        enableAberration: true,
        enableHeavyMotion: true,
        sceneMountRadius: 2
      };
    }

    return {
      isMobile,
      prefersReducedMotion,
      performanceTier,
      dpr: [1, 1.85],
      particleCount: 4200,
      enableBloom: true,
      enableAberration: true,
      enableHeavyMotion: true,
      sceneMountRadius: 2
    };
  }, [viewport]);
};
