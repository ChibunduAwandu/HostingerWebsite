import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

type SceneEffectsProps = {
  enableBloom: boolean;
  enableAberration: boolean;
  lowPower: boolean;
};

export default function SceneEffects({
  enableBloom,
  enableAberration,
  lowPower
}: SceneEffectsProps) {
  return (
    <EffectComposer>
      {enableBloom ? (
        <Bloom
          intensity={lowPower ? 0.7 : 1.15}
          luminanceSmoothing={0.7}
          luminanceThreshold={0.22}
        />
      ) : (
        <></>
      )}
      {enableAberration ? (
        <ChromaticAberration
          modulationOffset={0}
          offset={new THREE.Vector2(lowPower ? 0.00045 : 0.0008, lowPower ? 0.0008 : 0.0014)}
          radialModulation={!lowPower}
        />
      ) : (
        <></>
      )}
      <Vignette darkness={lowPower ? 0.3 : 0.42} offset={0.18} />
    </EffectComposer>
  );
}
