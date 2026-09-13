import fs from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, weld, meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const doc = await io.read("test-artifacts/source-assets/panda-rig.glb");
const { times, tracks } = JSON.parse(
  await fs.readFile("test-artifacts/source-assets/panda-motion.json", "utf8"),
);
const buffer = doc.getRoot().listBuffers()[0];
const input = doc
  .createAccessor()
  .setType("SCALAR")
  .setArray(new Float32Array(times))
  .setBuffer(buffer);
const animation = doc.createAnimation("Pick and place");
for (const node of doc.getRoot().listNodes()) {
  const track = tracks[node.getName()];
  if (!track) continue;
  for (const [field, type, target] of [
    ["position", "VEC3", "translation"],
    ["quaternion", "VEC4", "rotation"],
  ]) {
    const output = doc
      .createAccessor()
      .setType(type)
      .setArray(new Float32Array(track[field]))
      .setBuffer(buffer);
    const sampler = doc
      .createAnimationSampler()
      .setInput(input)
      .setOutput(output)
      .setInterpolation("LINEAR");
    animation
      .addSampler(sampler)
      .addChannel(
        doc
          .createAnimationChannel()
          .setTargetNode(node)
          .setTargetPath(target)
          .setSampler(sampler),
      );
  }
}
await doc.transform(
  dedup(),
  weld(),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);
await io.write("public/models/panda-motion.glb", doc);
console.log("Compressed articulated Panda exported with embedded animation.");
