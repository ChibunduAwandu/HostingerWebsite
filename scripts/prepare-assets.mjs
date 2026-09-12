import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup,
  weld,
  meshopt,
  textureCompress,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const manifest = [];
for (const name of ["car", "hand", "go2", "panda"]) {
  const doc = await io.read(
    name === "car"
      ? "test-artifacts/source-assets/car-source/CarConcept.gltf"
      : `test-artifacts/source-assets/${name}.glb`,
  );
  await doc.transform(
    dedup(),
    weld(),
    textureCompress({
      encoder: sharp,
      targetFormat: "webp",
      resize: [1024, 1024],
      quality: 82,
    }),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  const destination = `public/models/${name}.glb`;
  await io.write(destination, doc);
  const bytes = await fs.readFile(destination);
  manifest.push({
    name,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    meshes: doc.getRoot().listMeshes().length,
    nodes: doc
      .getRoot()
      .listNodes()
      .map((n) => n.getName()),
  });
  console.log(`${name}: ${(bytes.length / 1024 / 1024).toFixed(2)} MB`);
}
for (const name of ["car", "hand", "go2", "panda", "server", "board"]) {
  const extension = ["hand", "go2", "panda"].includes(name) ? "png" : "jpg";
  await sharp(`test-artifacts/source-assets/${name}-preview.${extension}`)
    .resize({
      width: 1024,
      height: 768,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(`public/asset-previews/${name}.webp`);
}
await fs.writeFile(
  "public/models/manifest.json",
  JSON.stringify(manifest, null, 2),
);
