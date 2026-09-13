# The Systems Collection: Model Notes

## Provenance

Reviewed September 12, 2026. Model and preview credits are displayed in the page, not only in this repository. The website, assembly interaction, stage, and layout are Chibundu's portfolio implementation; the imported hardware assets are credited to their creators. No passport image or personal headshot is used.

| Asset | Original Creator / Source | License | Inspectable Assemblies |
| --- | --- | --- | --- |
| CarConcept | Eric Chadwick, Darmstadt Graphics Group / Khronos glTF Sample Assets | CC BY 4.0, separate Khronos mark notice | 15 |
| Shadow Hand | Shadow Robot Company / MuJoCo Menagerie | Apache 2.0 | 23 visual links |
| Unitree Go2 | Unitree Robotics / MuJoCo Menagerie | BSD 3-Clause | 13 visual links |
| Franka Emika Panda | Franka Emika / MuJoCo Menagerie | Apache 2.0 | 11 visual links |
| Server Rack preview | Shalmon / Sketchfab | CC BY 4.0 | Image only |
| MotherBoard 3d Model preview | ARComputerFundamentals / Sketchfab | CC BY 4.0 | Image only |

Source links are recorded in `src/exhibits/catalog.ts`, `docs/ASSET_RESEARCH.md`, and the website credits. Source revisions:

- Khronos glTF Sample Assets: `90d7ede14c7e280af263824604b427a1ca02cb66`.
- MuJoCo Menagerie: `8161bba264d7fa7c99ca301e91e7fb44737676ad`.

CarConcept model/textures: Copyright 2024 Darmstadt Graphics Group GmbH; Eric Chadwick. Its included Khronos and 3D Commerce marks remain subject to the separate notice in `public/licenses/khronos-marks.txt`, with no endorsement or rights granted outside this asset. Full license texts are shipped in `public/licenses/`.

## Modifications and Fidelity

### Intelligence in Motion Addition

The opening laboratory is a separate viewing mode sharing the renderer budget with the original explorer: only one Canvas is mounted at a time. Camera transitions connect three architectural stages. Public car geometry is reused; servers, pathways, pedestals, and scan visuals are original procedural geometry. The machine view is a stylized wireframe and GLSL sweep, not actual YOLO inference, LiDAR, or missing vehicle internals.

`public/models/panda-motion.glb` is a new export from the same pinned, Apache-2.0-licensed Panda source. Unlike the original static exhibit, it retains all 11 body transforms, visual mesh parents, and an embedded 9.5-second animation. `scripts/build-panda-motion.py` uses damped least-squares IK with source joint limits and source wrist orientation. `scripts/prepare-panda-motion.mjs` packages translation/quaternion tracks and Meshopt compression. The gripped object follows the hand frame. This is offline kinematics, not a dynamics simulation, collision-checked path, controller, or safety-rated hardware instruction. The hand and Go2 remain inspection assets; they have not been given fabricated articulation.

The guided sequence is opt-in. Manual chapter or control input cancels it. Ambient animation and playback stop when the laboratory is offscreen or the page is hidden. Reduced-motion users get instant camera changes and a manual timeline. The Panda animation loads only on reaching Act. Failed WebGL or assets preserve HTML controls, career content, and credited previews.

The car's original uncompressed glTF and PNG textures are downloaded at the pinned revision. Meshes are welded/deduplicated and Meshopt-compressed. Textures are resized to at most 1024 pixels and converted to WebP. Source hierarchy maps the 97 source meshes to 15 useful assemblies. The source deliberately omits small hidden fasteners. The engine is labeled as supplied, not misrepresented as an EV battery or the EcoCar prototype.

Robot visual meshes (MJCF geometry group 2) are baked in their source reference/home poses with MuJoCo, converted from Z-up to Y-up, and exported through Trimesh. Collision-only geometry and the physics runtime are not shipped. The hand is oriented upright in the exhibit. The hand has 25 source bodies but only 23 contain included visual geometry, so it does not expose empty/invented components. Robot colors/roughness are approximate PBR adaptations, not calibrated manufacturer finishes.

At runtime, quantized attributes are expanded before world matrices are baked. Geometry is merged only within a component and material, retaining independent picking and explosion. Selected components receive a subtle emissive highlight. Car glass uses a transparent approximation rather than a costly transmission render pass.

Explosion offsets are illustrative. No motors, tendons, battery packs, processor internals, real-time controllers, or physical disassembly order are invented. There is no robotics physics simulation or live inference. The failure sandbox is a conceptual UI demonstration, not Apple infrastructure. Robot associations with the resume are thematic, not claims of employment or hardware authorship.

Sketchfab model downloads are sign-in gated. Only the publicly available, licensed model thumbnails are used, resized to local WebP and explicitly labeled as previews. Interactive rack/board geometry remains deferred until a legitimate archive is supplied.

## Performance and Accessibility

Only the selected GLB is requested. One Canvas is retained across switches; the 3D module is lazy-loaded separately from the 174 KB uncompressed HTML application entry. Three.js remains a separate substantial chunk; this is not a zero-cost 3D experience. Demand rendering avoids continuous idle frames unless rotation is explicitly enabled. DPR is capped at 1 on small screens and 1.5 otherwise; shadows are 1024 pixels, environment resolution 128, and there is no full-screen bloom stack.

Layout controls stay outside the Canvas. Search, selection, hide, isolate, views, source dialogs, and separation are keyboard-accessible. Reduced motion disables auto-rotation and camera/part interpolation. Unavailable WebGL or a failed model displays a preview and leaves career/contact content usable. No-JavaScript visitors receive resume/contact fallback content.

Manrope and IBM Plex Mono are locally served with SIL Open Font License texts. Human Atlas by ashemag inspired the selection/isolation/explode interaction vocabulary; no code or anatomy assets are copied. Career metrics come from the user-supplied resume and are not independently verified.
