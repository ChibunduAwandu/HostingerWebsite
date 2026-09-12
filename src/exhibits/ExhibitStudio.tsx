import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import ExhibitModel, { type ModelProps } from "./ExhibitModel";
import type { Exhibit } from "./catalog";

export type ViewAngle = "Perspective" | "Front" | "Side" | "Top";
export type StudioProps = ModelProps & {
  angle: ViewAngle;
  resetToken: number;
  rotating: boolean;
  dark: boolean;
  onError: () => void;
};

function ViewRig({
  angle,
  amount,
  isolated,
  resetToken,
  reducedMotion,
  rotating,
  exhibit,
}: StudioProps) {
  const controls = useRef<OrbitControlsType>(null);
  const { camera, size, invalidate } = useThree();
  const moving = useRef(true);
  const destination = useRef(new Vector3());
  const focus = useRef(new Vector3(0, 1.8, 0));
  useEffect(() => {
    const direction = {
      Perspective: [8, 5.6, 10],
      Front: [0, 2.5, 13],
      Side: [13, 2.5, 0],
      Top: [0.01, 14, 0.01],
    };
    const fit = Math.max(1, 0.95 / (size.width / size.height));
    const scale = (isolated ? 0.78 : 0.85 + amount * 0.32) * fit;
    focus.current.set(0, exhibit.id === "car" && !isolated ? 1 : 2, 0);
    destination.current
      .set(...(direction[angle] as [number, number, number]))
      .multiplyScalar(scale)
      .add(focus.current);
    moving.current = true;
    invalidate();
  }, [
    angle,
    amount,
    isolated,
    resetToken,
    size.width,
    size.height,
    exhibit.id,
    invalidate,
  ]);
  useFrame((_, delta) => {
    if (moving.current && controls.current) {
      const t = reducedMotion ? 1 : 1 - Math.exp(-delta * 6);
      camera.position.lerp(destination.current, t);
      controls.current.target.lerp(focus.current, t);
      controls.current.update();
      moving.current = camera.position.distanceTo(destination.current) > 0.004;
      invalidate();
    }
    if (rotating && !reducedMotion) invalidate();
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={!reducedMotion}
      dampingFactor={0.09}
      autoRotate={rotating && !reducedMotion}
      autoRotateSpeed={0.6}
      minDistance={4}
      maxDistance={35}
      maxPolarAngle={Math.PI / 2.02}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}

function Stage({ dark, amount }: { dark: boolean; amount: number }) {
  return (
    <>
      <color attach="background" args={[dark ? "#242b2a" : "#e6e6de"]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[-3, 8, 5]}
        intensity={2.4}
        color="#fff6e7"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-normalBias={0.04}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[5, 4, -5]}
        intensity={dark ? 2 : 1}
        color="#dbe5f2"
      />
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={2.5}
          position={[-5, 5, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          intensity={2}
          position={[5, 3, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 6, 1]}
        />
        <Lightformer
          intensity={3}
          position={[0, 7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[6, 6, 1]}
        />
      </Environment>
      <group position={[0, -amount * 2.2, 0]}>
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[3.8, 3.9, 0.4, 96]} />
          <meshStandardMaterial
            color={dark ? "#363e3b" : "#c9cdc2"}
            roughness={0.85}
          />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[3.65, 3.65, 0.06, 96]} />
          <meshStandardMaterial color="#92998b" />
        </mesh>
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.46, 0]}
        >
          <planeGeometry args={[200, 200]} />
          <shadowMaterial transparent opacity={0.16} />
        </mesh>
      </group>
    </>
  );
}

export function ModelFallback({ exhibit }: { exhibit: Exhibit }) {
  return (
    <div className="model-fallback">
      <img src={`/asset-previews/${exhibit.id}.webp`} alt={exhibit.subtitle} />
      <p>
        3D is unavailable here. The component index, source notes, and resume
        are still accessible.
      </p>
    </div>
  );
}
class RenderBoundary extends Component<
  { children: ReactNode; exhibit: Exhibit; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  componentDidUpdate(previous: { exhibit: Exhibit }) {
    if (this.state.failed && previous.exhibit.id !== this.props.exhibit.id)
      this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? (
      <ModelFallback exhibit={this.props.exhibit} />
    ) : (
      this.props.children
    );
  }
}

export default function ExhibitStudio(props: StudioProps) {
  const [lost, setLost] = useState(false);
  const [supported] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      const ok = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      return ok;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!supported || lost) props.onError();
  }, [supported, lost, props.onError, props.exhibit.id]);
  if (!supported || lost) return <ModelFallback exhibit={props.exhibit} />;
  return (
    <RenderBoundary exhibit={props.exhibit} onError={props.onError}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, window.matchMedia("(max-width: 700px)").matches ? 1 : 1.5]}
        camera={{ position: [8, 7, 10], fov: 36 }}
        gl={{ antialias: true, alpha: false, powerPreference: "default" }}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute(
            "aria-label",
            "Interactive 3D exhibit. Drag to orbit; use the component index for keyboard selection.",
          );
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
              // Renderer disposal also emits this event; it is not a failure of the next exhibit.
              if (gl.domElement.isConnected) setLost(true);
            },
            { once: true },
          );
        }}
      >
        <Stage dark={props.dark} amount={props.amount} />
        <Suspense fallback={null}>
          <ExhibitModel key={props.exhibit.id} {...props} />
        </Suspense>
        <ViewRig {...props} />
      </Canvas>
    </RenderBoundary>
  );
}
