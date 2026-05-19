import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getSceneAnchor, type SectionId } from '../data/scenes.config';

export type CameraFrameState = {
  position: [number, number, number];
  target: [number, number, number];
};

export const useCameraTransition = (sectionId: SectionId) => {
  const initial = getSceneAnchor(sectionId);

  const cameraStateRef = useRef<CameraFrameState>({
    position: initial.camera,
    target: initial.target
  });

  useEffect(() => {
    const scene = getSceneAnchor(sectionId);
    const proxy = {
      px: cameraStateRef.current.position[0],
      py: cameraStateRef.current.position[1],
      pz: cameraStateRef.current.position[2],
      tx: cameraStateRef.current.target[0],
      ty: cameraStateRef.current.target[1],
      tz: cameraStateRef.current.target[2]
    };

    const tween = gsap.to(proxy, {
      px: scene.camera[0],
      py: scene.camera[1],
      pz: scene.camera[2],
      tx: scene.target[0],
      ty: scene.target[1],
      tz: scene.target[2],
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        cameraStateRef.current = {
          position: [proxy.px, proxy.py, proxy.pz],
          target: [proxy.tx, proxy.ty, proxy.tz]
        };
      }
    });

    return () => {
      tween.kill();
    };
  }, [sectionId]);

  return cameraStateRef;
};
