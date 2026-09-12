import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const cache = "test-artifacts/source-assets";
const menagerie = "8161bba264d7fa7c99ca301e91e7fb44737676ad";
const khronos = "90d7ede14c7e280af263824604b427a1ca02cb66";
const robots = ["unitree_go2", "shadow_hand", "franka_emika_panda"];
async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, buffer);
  return {
    url,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}
await fs.mkdir("public/models", { recursive: true });
await fs.mkdir("public/asset-previews", { recursive: true });
await fs.mkdir("public/licenses", { recursive: true });
const treeResponse = await fetch(
  `https://api.github.com/repos/google-deepmind/mujoco_menagerie/git/trees/${menagerie}?recursive=1`,
);
if (!treeResponse.ok) throw new Error(`GitHub tree: ${treeResponse.status}`);
const { tree } = await treeResponse.json();
const files = tree.filter(
  (f) =>
    f.type === "blob" &&
    robots.some((r) => f.path.startsWith(`${r}/`)) &&
    /\.(obj|stl|xml|mtl)$|\/LICENSE$/.test(f.path),
);
const provenance = [];
for (let i = 0; i < files.length; i += 6) {
  const batch = await Promise.all(
    files
      .slice(i, i + 6)
      .map(async (f) => ({
        path: f.path,
        ...(await download(
          `https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/${menagerie}/${f.path}`,
          `${cache}/${f.path}`,
        )),
      })),
  );
  provenance.push(...batch);
}
for (const r of robots)
  await fs.copyFile(`${cache}/${r}/LICENSE`, `public/licenses/${r}.txt`);
// Use the original PNG textures so the build can resize them without shipping a KTX runtime.
const carBase = `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/${khronos}/Models/CarConcept/glTF`;
provenance.push(
  await download(
    `${carBase}/CarConcept.gltf`,
    `${cache}/car-source/CarConcept.gltf`,
  ),
);
const car = JSON.parse(
  await fs.readFile(`${cache}/car-source/CarConcept.gltf`, "utf8"),
);
for (const resource of [...car.buffers, ...car.images])
  provenance.push(
    await download(
      `${carBase}/${resource.uri}`,
      `${cache}/car-source/${resource.uri}`,
    ),
  );
for (const [id, file] of [
  ["go2", "unitree_go2/go2.png"],
  ["hand", "shadow_hand/shadow_hand.png"],
  ["panda", "franka_emika_panda/panda.png"],
])
  await download(
    `https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/${menagerie}/${file}`,
    `${cache}/${id}-preview.png`,
  );
await download(
  `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/${khronos}/Models/CarConcept/screenshot/screenshot_Large.jpg`,
  `${cache}/car-preview.jpg`,
);
for (const [name, id] of [
  ["server", "c144d837358d446998c7b63cd1bdf825"],
  ["board", "99a5f94e130a41c48590d59877f08663"],
]) {
  const response = await fetch(`https://api.sketchfab.com/v3/models/${id}`);
  if (!response.ok) throw new Error(`Sketchfab metadata ${response.status}`);
  const metadata = await response.json();
  if (metadata.license?.slug !== "by")
    throw new Error(`Review changed license: ${name}`);
  const preview =
    metadata.thumbnails.images.find((i) => i.width === 1920) ||
    metadata.thumbnails.images.at(-1);
  provenance.push({
    name,
    license: metadata.license,
    author: metadata.user.displayName,
    ...(await download(preview.url, `${cache}/${name}-preview.jpg`)),
  });
}
await fs.writeFile(
  `${cache}/provenance.json`,
  JSON.stringify({ menagerie, khronos, files: provenance }, null, 2),
);
console.log(`Fetched ${files.length} source files; pinned revisions recorded.`);
