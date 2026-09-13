import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { Environment, Lightformer, Line, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimationMixer,
  Box3,
  Color,
  Group,
  InstancedMesh,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Plane,
  ShaderMaterial,
  Vector3,
} from "three";
import { isObstructed, type Chapter, type Surface } from "./labState";

type Props = {
  chapter: Chapter;
  surface: Surface;
  obstacle: number;
  failed: number | null;
  progress: number;
  running: boolean;
  reducedMotion: boolean;
  onReady: (ready: boolean) => void;
  onFail: (failed: boolean) => void;
  onObstacle: (value: number) => void;
};
const centers = [-8, 3, 14];
const amber = "#f7aa59",
  mint = "#a3e8d3";
function useOwnedMaterials(model: Group) {
  const version = useRef(0);
  useEffect(() => {
    const current = ++version.current;
    return () =>
      queueMicrotask(() => {
        if (current !== version.current) return;
        model.traverse((o) => {
          if (o instanceof Mesh) (o.material as MeshStandardMaterial).dispose();
        });
      });
  }, [model]);
}
function Ready({ onReady }: Pick<Props, "onReady">) {
  useEffect(() => {
    onReady(true);
  }, [onReady]);
  return null;
}
function Unavailable({ onFail }: Pick<Props, "onFail">) {
  useEffect(() => {
    onFail(true);
  }, [onFail]);
  return null;
}

function CameraDirector({ chapter, reducedMotion, running }: Props) {
  const { camera, size, invalidate, gl } = useThree();
  const target = useRef(new Vector3(-8, 1, 0));
  const position = useRef(new Vector3());
  const focus = useRef(new Vector3());
  const active = useRef(true);
  useEffect(() => {
    const fit = Math.max(
      1,
      (chapter === 2 ? 1.05 : 1.35) / (size.width / size.height),
    );
    const center = centers[chapter];
    focus.current.set(
      center + (chapter === 2 ? 1.6 : 0),
      chapter === 2 ? 1.6 : chapter === 1 ? 1.5 : 1,
      0,
    );
    position.current.set(7.8 * fit, 6.2 * fit, 10 * fit).add(focus.current);
    active.current = true;
    invalidate();
  }, [chapter, size.width, size.height, invalidate]);
  useEffect(() => {
    if (running) invalidate();
  }, [running, invalidate]);
  useFrame((_, delta) => {
    if (!active.current && !running) return;
    const speed = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 4);
    camera.position.lerp(position.current, speed);
    target.current.lerp(focus.current, speed);
    camera.lookAt(target.current);
    active.current = camera.position.distanceTo(position.current) > 0.005;
    if (active.current || running) invalidate();
  });
  useEffect(() => {
    const canvas = gl.domElement;
    // Ignore the context release from unmounting the experience/inspector mode.
    const lost = () => {
      if (canvas.isConnected)
        canvas.dispatchEvent(
          new CustomEvent("lab-context-lost", { bubbles: true }),
        );
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl]);
  return null;
}

function Architecture() {
  const columns = useRef<InstancedMesh>(null);
  useEffect(() => {
    const object = new Object3D();
    for (let i = 0; i < 24; i++) {
      object.position.set(-18 + i * 2.4, 4, -7.5);
      object.updateMatrix();
      columns.current?.setMatrixAt(i, object.matrix);
    }
    if (columns.current) columns.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <>
      <color attach="background" args={["#202b29"]} />
      <fog attach="fog" args={["#202b29", 23, 57]} />
      <ambientLight intensity={0.75} color="#c4d4cb" />
      <directionalLight
        position={[-5, 12, 8]}
        intensity={3.8}
        color="#ffe5c5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-normalBias={0.04}
      />
      <directionalLight
        position={[12, 5, -7]}
        intensity={2.7}
        color="#afdce0"
      />
      <Environment frames={1} resolution={128}>
        <Lightformer
          position={[0, 9, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[30, 5, 1]}
          intensity={4}
        />
        <Lightformer
          position={[-5, 4, 6]}
          scale={[12, 7, 1]}
          intensity={3}
          color="#fff0d6"
        />
        <Lightformer
          position={[12, 4, -5]}
          scale={[14, 8, 1]}
          intensity={2}
          color="#9ed8d1"
        />
      </Environment>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.3, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#454a40"
          roughness={0.72}
          metalness={0.2}
        />
      </mesh>
      <instancedMesh ref={columns} args={[undefined, undefined, 24]} castShadow>
        <boxGeometry args={[0.1, 8, 0.45]} />
        <meshStandardMaterial
          color="#789288"
          metalness={0.65}
          roughness={0.35}
        />
      </instancedMesh>
      <mesh position={[8, 8.1, -7.5]}>
        <boxGeometry args={[60, 0.12, 0.5]} />
        <meshStandardMaterial
          color="#b3d8cc"
          emissive="#74ad9e"
          emissiveIntensity={0.5}
        />
      </mesh>
      {centers.map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[4.45, 4.55, 0.28, 80]} />
            <meshStandardMaterial
              color={i === 1 ? "#354743" : "#747d6c"}
              metalness={0.25}
              roughness={0.55}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]}>
            <ringGeometry args={[4.36, 4.39, 96]} />
            <meshBasicMaterial color={i === 1 ? mint : amber} />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <cylinderGeometry args={[4.05, 4.05, 0.16, 64]} />
            <meshStandardMaterial color="#172322" />
          </mesh>
        </group>
      ))}
      <Line
        points={[
          [-8, 0.01, -3.4],
          [3, 0.01, -3.4],
          [14, 0.01, -3.4],
        ]}
        color={mint}
        lineWidth={1}
        transparent
        opacity={0.45}
      />
    </>
  );
}

function Car({ surface, onReady }: Pick<Props, "surface" | "onReady">) {
  const { scene } = useGLTF("/models/car.glb", false, true);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (o instanceof Mesh) {
        o.material = (
          Array.isArray(o.material) ? o.material[0] : o.material
        ).clone();
        const m = o.material as MeshStandardMaterial & {
          transmission?: number;
        };
        if (m.transmission) {
          m.transmission = 0;
          m.transparent = true;
          m.opacity = 0.28;
          m.depthWrite = false;
        }
        o.castShadow = !m.transparent;
        o.receiveShadow = true;
      }
    });
    const bounds = new Box3().setFromObject(clone),
      size = bounds.getSize(new Vector3()),
      center = bounds.getCenter(new Vector3());
    const scale = 5.9 / Math.max(size.x, size.y, size.z);
    clone.scale.multiplyScalar(scale);
    clone.position.set(
      -center.x * scale,
      -bounds.min.y * scale + 0.06,
      -center.z * scale,
    );
    return clone;
  }, [scene]);
  useOwnedMaterials(model);
  useEffect(() => {
    model.traverse((o) => {
      if (o instanceof Mesh) {
        const m = o.material as MeshStandardMaterial;
        m.wireframe = surface === "scan";
        m.emissive.set(surface === "scan" ? "#3b8d7b" : "#000000");
        m.emissiveIntensity = 0.5;
      }
    });
  }, [surface, model]);
  return (
    <>
      <group rotation={[0, Math.PI / 2, 0]} position={[-0.6, 0, 0]}>
        <primitive object={model} />
      </group>
      <Ready onReady={onReady} />
    </>
  );
}

function ScanField({
  running,
  visible,
}: {
  running: boolean;
  visible: boolean;
}) {
  const shader = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new Color(mint) } }),
    [],
  );
  useFrame((_, delta) => {
    if (running && shader.current) shader.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh
      visible={visible}
      position={[0, 1.3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[8, 8]} />
      <shaderMaterial
        ref={shader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={2}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
        void main(){vec2 p=vUv-.5;float radius=length(p);float sweep=fract(uTime*.22);
        float ring=1.-smoothstep(.004,.014,abs(radius-sweep*.65));
        float grid=pow(max(abs(sin(p.x*100.)),abs(sin(p.y*100.))),38.)*.08;
        float alpha=(ring*.45+grid)*(1.-smoothstep(.36,.5,radius));
        gl_FragColor=vec4(uColor,alpha);}`}
      />
    </mesh>
  );
}

function Obstacle({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const dragging = useRef(false);
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), -0.7), []);
  const point = useRef(new Vector3());
  function move(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current) return;
    e.stopPropagation();
    if (e.ray.intersectPlane(plane, point.current))
      onChange(Math.max(-2.5, Math.min(2.5, point.current.z)));
  }
  return (
    <group position={[3, 0.7, value]}>
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
          (e.target as Element).setPointerCapture(e.pointerId);
        }}
        onPointerMove={move}
        onPointerUp={(e) => {
          dragging.current = false;
          (e.target as Element).releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        castShadow
      >
        <boxGeometry args={[0.65, 1.4, 0.65]} />
        <meshStandardMaterial color={amber} roughness={0.38} metalness={0.3} />
      </mesh>
      <mesh scale={[1.04, 1.04, 1.04]}>
        <boxGeometry args={[0.72, 1.5, 0.72]} />
        <meshBasicMaterial color={mint} wireframe transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Perception(props: Props) {
  const blocked = isObstructed(props.obstacle);
  return (
    <group position={[-8, 0, 0]}>
      <Suspense fallback={null}>
        <Car surface={props.surface} onReady={props.onReady} />
      </Suspense>
      {[-0.9, 0.9].map((z) => (
        <Line
          key={z}
          points={[
            [-3, 0.045, z],
            [3.8, 0.045, z],
          ]}
          color={mint}
          lineWidth={1}
          dashed
          dashSize={0.22}
          gapSize={0.2}
        />
      ))}
      <Line
        points={[
          [0, 0.06, 0],
          [blocked ? 2.4 : 4, 0.06, 0],
        ]}
        color={blocked ? amber : mint}
        lineWidth={3}
      />
      <Line
        points={[
          [1, 1, 0],
          [3.8, 0.08, -1.8],
          [3.8, 0.08, 1.8],
          [1, 1, 0],
        ]}
        color={mint}
        lineWidth={1}
        transparent
        opacity={props.surface === "scan" ? 0.8 : 0.3}
      />
      <Obstacle value={props.obstacle} onChange={props.onObstacle} />
      <ScanField running={props.running} visible={props.surface === "scan"} />
    </group>
  );
}

function PacketStreams({ failed, running }: Pick<Props, "failed" | "running">) {
  const packets = useRef<InstancedMesh>(null);
  const time = useRef(0);
  const object = useMemo(() => new Object3D(), []);
  const healthy = [0, 1, 2].filter((i) => i !== failed);
  useFrame((_, delta) => {
    if (running) time.current += delta;
    for (let i = 0; i < 48; i++) {
      const worker = healthy[i % healthy.length],
        z = (worker - 1) * 2.1,
        t =
          (time.current * 0.24 +
            Math.floor(i / healthy.length) / (48 / healthy.length)) %
          1;
      const x = -3.6 + t * 7.2;
      object.position.set(
        x,
        0.9 + Math.sin(t * Math.PI) * 0.65,
        Math.sin(t * Math.PI) * z,
      );
      object.scale.setScalar(0.055);
      object.updateMatrix();
      packets.current?.setMatrixAt(i, object.matrix);
    }
    if (packets.current) packets.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={packets} args={[undefined, undefined, 48]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={mint} />
    </instancedMesh>
  );
}

function Processing(props: Props) {
  return (
    <group position={[3, 0, 0]}>
      {[-3.4, 3.4].map((x, i) => (
        <group key={x} position={[x, 0.8, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial
              color={i ? mint : amber}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
            <ringGeometry args={[0.6, 0.62, 48]} />
            <meshBasicMaterial color={amber} />
          </mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, 0, (i - 1) * 2.1]}>
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 2, 1.1]} />
            <meshStandardMaterial
              color={props.failed === i ? "#493c35" : "#59746a"}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          {[0, 1, 2, 3, 4].map((slot) => (
            <mesh key={slot} position={[0, 0.35 + slot * 0.32, 0.56]}>
              <boxGeometry args={[0.94, 0.04, 0.025]} />
              <meshBasicMaterial
                color={props.failed === i ? "#c57b4c" : mint}
              />
            </mesh>
          ))}
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshBasicMaterial color={props.failed === i ? amber : mint} />
          </mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <Line
          key={i}
          points={Array.from({ length: 41 }, (_, n) => {
            const t = n / 40;
            return [
              -3.6 + t * 7.2,
              0.9 + Math.sin(t * Math.PI) * 0.65,
              Math.sin(t * Math.PI) * (i - 1) * 2.1,
            ] as [number, number, number];
          })}
          color={props.failed === i ? "#68554b" : mint}
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
      <PacketStreams failed={props.failed} running={props.running} />
      <Ready onReady={props.onReady} />
    </group>
  );
}

function ArticulatedPanda({
  progress,
  onReady,
}: Pick<Props, "progress" | "onReady">) {
  const { scene, animations } = useGLTF(
    "/models/panda-motion.glb",
    false,
    true,
  );
  const rig = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((o) => {
      if (o instanceof Mesh) {
        o.material = (
          Array.isArray(o.material) ? o.material[0] : o.material
        ).clone();
        (o.material as MeshStandardMaterial).color.convertSRGBToLinear();
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const mixer = new AnimationMixer(model);
    const clip = mixer.clipAction(animations[0]);
    clip.setLoop(LoopOnce, 1);
    clip.clampWhenFinished = true;
    clip.play();
    return { model, mixer, clip, hand: model.getObjectByName("hand")! };
  }, [scene, animations]);
  useOwnedMaterials(rig.model);
  const token = useRef<Mesh>(null),
    objectPosition = useRef(new Vector3());
  useFrame(() => {
    // Rescrubbing must re-enable a clamped action after its final sample.
    rig.clip.enabled = true;
    rig.clip.paused = false;
    rig.mixer.setTime(progress * 9.5);
    rig.model.updateMatrixWorld(true);
    const seconds = progress * 9.5;
    if (seconds >= 2.8 && seconds <= 6.8) {
      objectPosition.current.set(0, 0.105, 0);
      rig.hand.localToWorld(objectPosition.current);
      token.current?.parent?.worldToLocal(objectPosition.current);
    } else
      objectPosition.current.set(0.45, 0.145, seconds > 6.8 ? -0.22 : 0.22);
    token.current?.position.copy(objectPosition.current);
  });
  return (
    <group scale={6.5}>
      <primitive object={rig.model} />
      <mesh ref={token} position={[0.45, 0.145, 0.22]} castShadow>
        <boxGeometry args={[0.04, 0.035, 0.04]} />
        <meshStandardMaterial
          color={amber}
          emissive={amber}
          emissiveIntensity={0.12}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {[0.22, -0.22].map((z) => (
        <group key={z} position={[0.45, 0.06375, z]}>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.1275, 32]} />
            <meshStandardMaterial
              color="#636e5e"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.064, 0]}>
            <ringGeometry args={[0.09, 0.095, 40]} />
            <meshBasicMaterial color={mint} />
          </mesh>
        </group>
      ))}
      <Ready onReady={onReady} />
    </group>
  );
}

function WorldContents(props: Props) {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [
    props.chapter,
    props.surface,
    props.obstacle,
    props.failed,
    props.progress,
    props.running,
    invalidate,
  ]);
  return (
    <>
      <Architecture />
      <CameraDirector
        {...props}
        running={
          props.running &&
          (props.chapter === 1 ||
            (props.chapter === 0 && props.surface === "scan"))
        }
      />
      {props.chapter === 0 && <Perception {...props} />}
      {props.chapter === 1 && <Processing {...props} />}
      {props.chapter === 2 && (
        <group position={[14, 0, 0]}>
          <Suspense fallback={null}>
            <ArticulatedPanda
              progress={props.progress}
              onReady={props.onReady}
            />
          </Suspense>
        </group>
      )}
    </>
  );
}
export default function LaboratoryWorld(props: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [supported] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      if (!gl) return false;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const element = root.current,
      fail = () => props.onFail(true);
    element?.addEventListener("lab-context-lost", fail);
    return () => element?.removeEventListener("lab-context-lost", fail);
  }, [props.onFail]);
  if (!supported) return <Unavailable onFail={props.onFail} />;
  return (
    <div ref={root} className="lab-canvas" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, window.innerWidth < 600 ? 1 : 1.5]}
        frameloop="demand"
        camera={{ position: [0, 7, 11], fov: 38, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <WorldContents {...props} />
      </Canvas>
    </div>
  );
}
