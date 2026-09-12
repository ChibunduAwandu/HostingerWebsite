import { useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Box3,
  Float32BufferAttribute,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { classifyPart, type Exhibit } from "./catalog";

export type ModelProps = {
  exhibit: Exhibit;
  amount: number;
  selected: string | null;
  isolated: boolean;
  hidden: string[];
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onReady: (count: number) => void;
};

function prepareModel(source: Group, exhibit: Exhibit) {
  source.updateMatrixWorld(true);
  const orientation = new Matrix4().makeRotationZ(
    exhibit.id === "hand" ? Math.PI / 2 : 0,
  );
  const bounds = new Box3().setFromObject(source).applyMatrix4(orientation);
  const size = bounds.getSize(new Vector3());
  const scale =
    (exhibit.id === "car" ? 6.2 : exhibit.id === "go2" ? 5.1 : 4.5) /
    Math.max(size.x, size.y, size.z);
  const center = bounds.getCenter(new Vector3());
  const normalization = new Matrix4()
    .makeTranslation(
      -center.x * scale,
      -bounds.min.y * scale + 0.02,
      -center.z * scale,
    )
    .multiply(new Matrix4().makeScale(scale, scale, scale))
    .multiply(orientation);
  const groups = new Map<string, Group>();
  exhibit.parts.forEach((p) => {
    const group = new Group();
    group.name = p.id;
    groups.set(p.id, group);
  });
  source.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const ancestors: string[] = [];
    for (
      let node = object as typeof object | null;
      node;
      node = node.parent as typeof object | null
    )
      ancestors.push(node.name);
    const id = classifyPart(exhibit.id, ancestors);
    const parent = groups.get(id);
    if (!parent) throw new Error(`Unmapped source component: ${object.name}`);
    const geometry = object.geometry.clone();
    // Quantized normalized attributes cannot hold transformed world coordinates.
    // Expand before baking matrices or integer setters will clamp the geometry.
    for (const key of Object.keys(geometry.attributes)) {
      const attribute = geometry.getAttribute(key);
      if (attribute.array instanceof Float32Array) continue;
      const values = new Float32Array(attribute.count * attribute.itemSize);
      for (let i = 0; i < attribute.count; i++) {
        for (let j = 0; j < attribute.itemSize; j++)
          values[i * attribute.itemSize + j] = attribute.getComponent(i, j);
      }
      geometry.setAttribute(
        key,
        new Float32BufferAttribute(values, attribute.itemSize),
      );
    }
    geometry.applyMatrix4(normalization.clone().multiply(object.matrixWorld));
    const original = Array.isArray(object.material)
      ? object.material[0]
      : object.material;
    const material = original.clone() as MeshStandardMaterial;
    if (exhibit.id !== "car") material.color.convertSRGBToLinear();
    // A single, transparent glass pass avoids expensive transmission render targets.
    if ("transmission" in material && Number(material.transmission) > 0) {
      material.transmission = 0;
      material.transparent = true;
      material.opacity = 0.26;
      material.depthWrite = false;
    }
    material.userData.sourceMaterial = original.uuid;
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = !material.transparent;
    mesh.receiveShadow = true;
    parent.add(mesh);
  });
  return [...groups]
    .filter(([, g]) => g.children.length)
    .map(([id, group], index) => {
      // Merge only within an assembly and material: picking/exploding remains lossless.
      const buckets = new Map<string, Mesh[]>();
      for (const child of group.children as Mesh[]) {
        const mat = child.material as MeshStandardMaterial;
        const key = `${mat.userData.sourceMaterial}:${Object.keys(child.geometry.attributes).join(",")}`;
        buckets.set(key, [...(buckets.get(key) || []), child]);
      }
      for (const meshes of buckets.values()) {
        if (meshes.length < 2) continue;
        const geometry = mergeGeometries(meshes.map((m) => m.geometry));
        if (!geometry) continue;
        const merged = new Mesh(geometry, meshes[0].material);
        merged.castShadow = meshes[0].castShadow;
        merged.receiveShadow = true;
        group.add(merged);
        meshes.forEach((mesh, i) => {
          group.remove(mesh);
          mesh.geometry.dispose();
          if (i) (mesh.material as MeshStandardMaterial).dispose();
        });
      }
      const partBox = new Box3().setFromObject(group);
      const origin = partBox.getCenter(new Vector3());
      for (const mesh of group.children as Mesh[])
        mesh.geometry.translate(-origin.x, -origin.y, -origin.z);
      group.position.copy(origin);
      const direction = new Vector3(
        origin.x,
        (origin.y - (size.y * scale) / 2) * 0.65,
        origin.z,
      );
      if (direction.length() < 0.1) direction.set(0, 1, 0);
      direction.normalize().multiplyScalar(1.7);
      if (exhibit.id === "car") {
        if (id === "roof" || id === "windshield")
          direction.set(
            0,
            id === "roof" ? 3 : 1.8,
            id === "windshield" ? 0.7 : 0,
          );
        if (id === "cabin") direction.set(0, 1.7, 0);
        if (id === "chassis") direction.set(0, -0.25, 0);
        if (id === "engine") direction.set(0, 0.9, -1.7);
        if (id === "controls") direction.set(0, 2.8, 1);
      } else {
        direction.y += (index / exhibit.parts.length) * 1.3;
      }
      return {
        id,
        group,
        origin,
        direction,
        radius: partBox.getSize(new Vector3()).length() / 2,
      };
    });
}

export default function ExhibitModel(props: ModelProps) {
  const {
    exhibit,
    amount,
    selected,
    isolated,
    hidden,
    reducedMotion,
    onSelect,
    onReady,
  } = props;
  const { scene } = useGLTF(`/models/${exhibit.id}.glb`, false, true);
  const assemblies = useMemo(
    () => prepareModel(scene, exhibit),
    [scene, exhibit],
  );
  const { invalidate } = useThree();
  const committed = useRef(0);
  useEffect(() => {
    onReady(assemblies.length);
    invalidate();
    // Disposal is deferred across StrictMode's setup/cleanup probe, but not a real unmount.
    const version = ++committed.current;
    return () => {
      queueMicrotask(() => {
        if (committed.current !== version) return;
        assemblies.forEach(({ group }) =>
          group.traverse((o) => {
            if (o instanceof Mesh) {
              o.geometry.dispose();
              (o.material as MeshStandardMaterial).dispose();
            }
          }),
        );
      });
    };
  }, [assemblies, invalidate, onReady]);
  useEffect(() => {
    assemblies.forEach(({ id, group }) =>
      group.traverse((o) => {
        if (o instanceof Mesh) {
          const mat = o.material as MeshStandardMaterial;
          mat.emissive.set(id === selected ? "#ba5128" : "#000000");
          mat.emissiveIntensity = id === selected ? 0.24 : 0;
        }
      }),
    );
    invalidate();
  }, [selected, assemblies, invalidate]);
  const target = useRef(new Vector3());
  useFrame((_, delta) => {
    let moving = false;
    for (const part of assemblies) {
      const show =
        !hidden.includes(part.id) && (!isolated || selected === part.id);
      part.group.visible = show;
      target.current.copy(part.origin).addScaledVector(part.direction, amount);
      if (isolated) target.current.set(0, 2.1, 0);
      const scale = isolated
        ? Math.min(2.7, 1.8 / Math.max(0.2, part.radius))
        : 1;
      if (
        part.group.position.distanceTo(target.current) > 0.001 ||
        Math.abs(part.group.scale.x - scale) > 0.001
      ) {
        const t = reducedMotion ? 1 : 1 - Math.exp(-delta * 8);
        part.group.position.lerp(target.current, t);
        part.group.scale.lerp(new Vector3(scale, scale, scale), t);
        moving = true;
      }
    }
    if (moving) invalidate();
  });
  const select = (event: ThreeEvent<MouseEvent>, id: string) => {
    if (event.delta < 5) {
      event.stopPropagation();
      onSelect(id);
    }
  };
  return (
    <group>
      {assemblies.map((p) => (
        <primitive
          key={p.id}
          object={p.group}
          dispose={null}
          onClick={(e: ThreeEvent<MouseEvent>) => select(e, p.id)}
        />
      ))}
    </group>
  );
}
