# Three.js / WebGL Techniques and Libraries for the Portfolio (React + Vite + R3F + drei)

Research date: 2026-10-27. Version and date facts were read directly from the npm registry JSON (registry.npmjs.org) on that date. Docs were read from the pmndrs and three.js GitHub sources, because the docs sites (drei.docs.pmnd.rs, tympanus.net, stripe.com) could not be reached from the research sandbox. Codrops, Stripe and GitHub-blog details below come from search-result excerpts, not full-page reads.

**Project baseline (local):** `/home/user/HostingerWebsite/package.json` pins `@react-three/fiber ^8.17.10`, `@react-three/drei ^9.121.4`, `@react-three/postprocessing ^2.16.3`, `react ^18.3.1`, `three ^0.176.0` and `gsap ^3.12.7`. GSAP is installed, but no file in `src/` imports ScrollTrigger. The source already uses drei `<Line>` (9 uses), `<Html>` (7), `<Environment>`, `<OrbitControls>`, and postprocessing `<EffectComposer>` with `<Bloom>`. This matters for every library choice below: the project is one major version behind the current R3F/drei line.

---

## 1. Scroll-linked 3D storytelling: drei ScrollControls vs GSAP ScrollTrigger vs theatre.js vs Lenis; camera paths; native scroll and accessibility

### Takeaway
For a portfolio that must keep native scroll, anchor links and accessibility, the strongest stack is native document scroll, plus GSAP ScrollTrigger (now free, actively released) driving a progress value that R3F reads in `useFrame`. Lenis is optional for smoothing, and the camera moves along a `CatmullRomCurve3`. drei `ScrollControls` is the quickest option, but it scrolls its own overlay container instead of the page. theatre.js is effectively stalled and its R3F binding does not support R3F v9.

### Cited Findings
**Versions and maintenance (npm registry, 2026-10-27)**
- `@react-three/fiber` latest is 9.8.2 (released 2026-10-14). Its peer range is `react >=19 <19.4` and `three >=0.156`. 9.0.0 shipped on 2025-02-19. A `10.0.0-alpha.6` tag and a canary also exist. — [npm registry: @react-three/fiber](https://registry.npmjs.org/@react-three/fiber)
- `@react-three/drei` latest is 10.7.9 (2026-09-25), with peers `react ^19` and `@react-three/fiber ^9.0.0`. So drei 10 requires R3F 9 and React 19, and this project's drei 9 / R3F 8 / React 18 stack is the previous generation. — [npm registry: @react-three/drei](https://registry.npmjs.org/@react-three/drei)
- `@react-three/postprocessing` latest is 3.2.2 (2026-10-21), with peers `react ^19` and `@react-three/fiber >=9.7.0`. `postprocessing` is 6.39.5 (2026-09-09), with peer `three >=0.168 <0.187`. — [npm: @react-three/postprocessing](https://registry.npmjs.org/@react-three/postprocessing), [npm: postprocessing](https://registry.npmjs.org/postprocessing)
- `three` latest is 0.186.1 (2026-09-24). — [npm: three](https://registry.npmjs.org/three)
- R3F v9 is described as "a compatibility release for React 19", with breaking changes in StrictMode. New features include `useLoader` accepting loader instances and a factory form of `extend`. — [R3F v9 migration guide](https://github.com/pmndrs/react-three-fiber/blob/master/docs/tutorials/v9-migration-guide.mdx)
- In R3F v10 alpha.6, WebGPU is the default renderer and WebGL/GLSL moves to `@react-three/fiber/legacy`. A GLSL material on a WebGPU canvas logs a warning. The `@react-three/fiber/webgpu` entry is deprecated and is due to be removed at the first beta. — [newreleases: R3F 10.0.0-alpha.6](https://newreleases.io/project/npm/@react-three/fiber/release/10.0.0-alpha.6)
- `gsap` latest is 3.15.0 (2026-04-13). `@gsap/react` (the `useGSAP` hook) is 2.1.2 (2025-01). — [npm: gsap](https://registry.npmjs.org/gsap), [npm: @gsap/react](https://registry.npmjs.org/@gsap/react)
- GSAP is "now 100% FREE including ALL of the bonus plugins" (SplitText, MorphSVG and others), thanks to Webflow, including for commercial use. The README calls ScrollTrigger the standard for scroll-driven animation. — [GSAP README (jsDelivr)](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md)
- `lenis` latest is 1.3.27 (2026-10-15), so it is actively maintained. — [npm: lenis](https://registry.npmjs.org/lenis)
- `@theatre/core` and `@theatre/r3f` latest is 0.7.2 (2024-05-19), with no release since. `@theatre/r3f` declares peer `@react-three/fiber ^8.13.6`, so it does not officially support R3F v9 or React 19. — [npm: @theatre/r3f](https://registry.npmjs.org/@theatre/r3f)
- The Theatre.js README says "Theatre.js 1.0 is around the corner. We have temporarily moved development to a private repo." — [theatre-js/theatre README](https://github.com/theatre-js/theatre). A third-party tracker reports the last public push was on 2024-08-14. — [gittrend.io](https://gittrend.io/repo/theatre-js/theatre)
- `@14islands/r3f-scroll-rig` ("Progressively enhance any React website with WebGL") latest is 8.15.0 (2024-12-04), with peers `@react-three/fiber >=8` and `react >=18`. — [npm: @14islands/r3f-scroll-rig](https://registry.npmjs.org/@14islands/r3f-scroll-rig)
- `@react-three/a11y` latest is 3.0.0 (2022-05). It has not been updated in over four years. — [npm: @react-three/a11y](https://registry.npmjs.org/@react-three/a11y)

**drei ScrollControls**
- "Scroll controls create an HTML scroll container in front of the canvas." Props include `pages`, `distance`, `damping` (default 0.2s), `maxSpeed`, `horizontal`, `infinite` (experimental), `prepend` and `enabled`. It is marked "Dom only". `useScroll()` returns a damped `offset` and `delta` (0–1) plus `range()`, `curve()` and `visible()` helpers for mapping sub-sections of the scroll. `<Scroll html>` scrolls DOM content alongside. — [drei docs: ScrollControls](https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx)

**Lenis**
- Lenis "runs on native scroll — wraps the browser's own scroll, so position: sticky, anchor links, and accessibility keep working". — [Lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md)
- Lenis honors `prefers-reduced-motion` by default. When the setting is `reduce`, smoothing is disabled (`lerp` is forced to 1) and `scrollTo` and anchor jumps are instant, but Lenis keeps running so WebGL/DOM sync stays intact. — [Lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md)
- The documented GSAP integration is `lenis.on('scroll', ScrollTrigger.update)`, plus `gsap.ticker.add(t => lenis.raf(t*1000))`, plus `gsap.ticker.lagSmoothing(0)`. — [Lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md)
- Documented limitations: no CSS scroll-snap (use `lenis/snap`); capped at 60fps on Safari and 30fps in low-power mode; no smooth scroll over iframes; `position: fixed` lag on pre-M1 macOS Safari; nested scrollers need `data-lenis-prevent` or `allowNestedScroll`. Anchor links only work with `anchors: true`. — [Lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md)

**GSAP + R3F patterns**
- Community guidance: create the ScrollTrigger inside an effect with the camera from `useThree`, use `gsap.context()`/`useGSAP` and revert on cleanup, and drive a proxy object (e.g. `{ progress }` or a mixer `time`) from a scrubbed timeline. A numeric `scrub` value adds catch-up lag, which can make the camera jump between overlapping triggers. — [GSAP forum: GSAP with R3F](https://gsap.com/community/forums/topic/35688-how-to-use-gsap-with-react-three-fiber/), [three.js forum: camera transforms on top of ScrollTrigger](https://discourse.threejs.org/t/change-camera-transforms-on-top-of-gsap-scrolltrigger-controls/58737), [GreenSock forum: ScrollTrigger with R3F](https://greensock.com/forums/topic/29651-scroll-trigger-with-react-three-fiber/)

**Camera path / spline techniques**
- A Codrops tutorial from July 2026 exports a camera path from Blender, builds a `THREE.CatmullRomCurve3` from the points (closed loop, tension 0.5), and drives progress with GSAP. — [Codrops: Scroll-driven 3D gallery using a Blender camera path with Three.js and GSAP (2026-07-07)](https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/)
- An R3F pattern seen in the wild: sample `curve.getPointAt(progress)` for position, `lookAt` a point slightly ahead on the curve, and damp the movement. — [Tunaycel/portfolio (GitHub)](https://github.com/Tunaycel/portfolio)
- Codrops has an R3F + Theatre.js camera fly-through on scroll (2023; uses Vite and drei). — [Codrops: Camera fly-through with Theatre.js and R3F](https://tympanus.net/codrops/2023/02/14/animate-a-camera-fly-through-on-scroll-using-theatre-js-and-react-three-fiber/)
- Codrops has a scroll-driven, infinitely looping 3D image tube in R3F (2026-02-17). — [Codrops: Reactive Depth](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/)
- drei `CatmullRomLine` renders a `Line2` interpolated by `CatmullRomCurve3`, with `centripetal`, `chordal` or `catmullrom` types and dashed support. This makes it useful for drawing the same path the camera follows. — [drei docs: CatmullRomLine](https://github.com/pmndrs/drei/blob/master/docs/shapes/catmull-rom-line.mdx)
- three.js ships `webgl_geometry_extrude_splines` and `webgl_geometry_spline_editor` examples for spline authoring. — [three.js examples list (files.json)](https://github.com/mrdoob/three.js/blob/dev/examples/files.json), [threejs.org/examples](https://threejs.org/examples/#webgl_geometry_spline_editor)

**Performance and accessibility hooks**
- `<Canvas frameloop="demand">` renders only when props change. Code that mutates the scene, such as controls or GSAP tweens on refs, must call `invalidate()`. drei `PerformanceMonitor` adapts DPR to measured FPS, with `flipflops` and `onFallback`. — [R3F docs: Scaling performance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- drei `View` uses `gl.scissor` to cut one canvas into regions that track DOM elements: they "follow their tracking elements, scroll along, resize". The docs advise connecting the event source to a parent holding both canvas and HTML so content stays "accessible/selectable". — [drei docs: View](https://github.com/pmndrs/drei/blob/master/docs/portals/view.mdx)

### Inferences
- **ScrollControls**
  - Pros: zero-config, a `range`/`curve` API ideal for chaptered scenes, built-in damping.
  - Cons: it creates its own overflow container rather than using the window. That tends to fight the page's normal scroll, sticky headers, anchor links, browser find-in-page and screen-reader reading order, and it is awkward on a multi-section site like this one. Best suited to a self-contained full-screen "lab" route, not the case-study page.
- **GSAP ScrollTrigger**
  - Pros: native scroll, mature, free, already a dependency, works with `pin`, `scrub` and `snap`, and handles reduced motion via `gsap.matchMedia()`.
  - Cons: imperative. It needs careful cleanup in React and an `invalidate()` call if `frameloop="demand"` is used.
  - Recommended as the default for the Apple case study: pin a section, then scrub the SSE-vs-sync or batching animation.
- **Lenis**
  - Pros: native-scroll based, honors reduced motion, small, actively released.
  - Cons: Safari 60fps cap, iframe and nested-scroll caveats, and smoothing can feel "floaty" to keyboard users.
  - Optional: add it only if the scroll feel matters. Its reduced-motion default makes it an acceptable accessibility choice.
- **theatre.js**
  - Pros: the best visual keyframe editor for camera choreography.
  - Cons: no public release since May 2024 and an R3F peer pinned to v8.
  - Not recommended for new work. It would block an R3F v9 / React 19 upgrade. Keyframes could be authored in Blender and exported as a curve instead.
- **r3f-scroll-rig**
  - Pros: built for "DOM-first, WebGL-enhanced" sites with native scroll.
  - Cons: last release Dec 2024, and its peer range still allows R3F 8. Its v9 compatibility was not verified.
  - A reasonable reference architecture. For a single-canvas setup, drei `View` plus ScrollTrigger may be enough.
- **Accessibility approach:** keep all case-study content as real DOM text; treat WebGL as decoration (`aria-hidden` on the canvas plus a text alternative); gate camera motion behind `prefers-reduced-motion`, showing a static frame or crossfade; and keep keyboard-reachable controls in the DOM (e.g. buttons that call `bounds.refresh(obj).fit()`), not only canvas pointer events.
- **Upgrade path:** moving to R3F 9 + drei 10 + React 19 is needed for current postprocessing (3.x) and current drei fixes. R3F v10 (WebGPU default) is still alpha, so v9 is the sensible target for 2026.

### Gaps
- I could not open the drei docs site, Codrops or the R3F GitHub releases pages directly (DNS or proxy blocked). Details of the 2026 Codrops Blender-path article come from search excerpts only.
- I found no authoritative statement on whether `@14islands/r3f-scroll-rig` or `@theatre/r3f` 0.7.2 work in practice with R3F v9; only the declared peer ranges were checked.
- I found no official accessibility guidance from pmndrs beyond the `View` note and the stale `@react-three/a11y` package.

---

## 2. Visualizing data flow, distributed systems and streaming in 3D/WebGL

### Takeaway
The proven building blocks are dash-offset animated lines (drei `Line`/`CatmullRomLine`/`QuadraticBezierLine`), instanced "packets" whose positions are sampled along curves each frame (`InstancedMesh`/drei `Instances`), MeshLine-based `Trail`s, and, for thousands of particles, GPGPU/FBO or WebGPU compute. GitHub's and Stripe's globes show the production pattern: dots plus Bezier arcs, real data, and performance tuned per device.

### Cited Findings
- GitHub's homepage globe runs in WebGL via three.js and is fed recent PR data from a JSON file. It has five layers: halo, globe, regions, open-PR spikes and merged-PR arcs. It uses no textures, four lights, about 12,000 five-sided circles for land, and a custom-shader halo. Dot density varies "depending on the performance of your machine". — [GitHub Blog: How we built the GitHub globe (2020)](https://github.blog/engineering/how-we-built-the-github-globe/)
- Each merged PR carries two locations joined by a Bezier curve. The companion data post stresses that the data was "real, and most importantly, live" rather than decorative. — [GitHub Blog: How we built the GitHub globe](https://github.blog/engineering/engineering-principles/how-we-built-the-github-globe/), [GitHub Blog: Visualizing GitHub's global community](https://github.blog/engineering/engineering-principles/visualizing-githubs-global-community/)
- Stripe's globe is a 1:40 million-scale earth in WebGL with three layers: a semi-transparent ocean sphere, a sphere of twinkling dots, and animated arcs between countries. The team said keeping it lively without crashing the browser was the biggest technical hurdle. — [Stripe Blog: Globe](https://stripe.com/blog/globe)
- Libraries for globe and arc visuals: `cobe` 2.0.1 (2026-03), `three-globe` 2.45.6 (2026-10-14) and `react-globe.gl` 2.38.0 (2026-05) are all recently released. — [npm: cobe](https://registry.npmjs.org/cobe), [npm: three-globe](https://registry.npmjs.org/three-globe), [npm: react-globe.gl](https://registry.npmjs.org/react-globe.gl)
- Vercel's docs describe 119 PoPs in 94 cities, anycast routing, a private backbone, and 18 compute regions. I found no write-up of how Vercel's own globe graphic is built. — [Vercel docs: Edge Network regions](https://vercel.com/docs/edge-network/regions)
- A third-party open-source 3D globe visualizes Cloudflare's infrastructure from the public status API (`wbfoss/cf-status-dashboard`). — [Medium: open-source Cloudflare globe](https://medium.com/@alokemajumder/i-built-an-open-source-3d-globe-to-visualize-cloudflares-global-infrastructure-with-status-1854ce9ad921)
- drei `Trail` is a declarative, `three.MeshLine`-based trail that attaches to any mesh. It has `width`, `length`, `decay`, `stride`, `interval` and `attenuation` props. — [drei docs: Trail](https://github.com/pmndrs/drei/blob/master/docs/abstractions/trail.mdx). The `meshline` npm package's last release was 3.3.1 (2024-06). — [npm: meshline](https://registry.npmjs.org/meshline)
- drei `Instances` wraps `InstancedMesh` for "hundreds of thousands of objects in a single draw call", with per-instance events (`onClick`, `onPointerOver`) and `<Html>` annotations on instances. — [drei docs: Instances](https://github.com/pmndrs/drei/blob/master/docs/performances/instances.mdx)
- The three.js `InstancedFlow` (CurveModifier addon) bends instanced meshes along curves and can move an individual instance along its curve by an offset. It works only with WebGLRenderer. — [three.js docs: InstancedFlow](https://threejs.org/docs/pages/InstancedFlow.html)
- An alternative path-following technique: build a `CatmullRomCurve3` and animate a dash offset on a line instead of moving particle objects. — [varun.ca: Three ways to create 3D particle effects](https://varun.ca/three-js-particles/)
- Maxime Heckel's guide covers particles in R3F with buffer geometry attributes, shader-driven motion, and FBO (frame buffer object) simulation for scaling up. — [Maxime Heckel: The magical world of Particles with R3F and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)
- Codrops (Dec 2024) has a GPGPU particle effect that seeds positions with `MeshSurfaceSampler` into a data texture and reacts to the mouse. — [Codrops: Crafting a Dreamy Particle Effect with Three.js and GPGPU](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)
- three.js has WebGPU compute particle examples (`webgpu_compute_particles`, `webgpu_tsl_compute_attractors_particles`, `webgpu_tsl_vfx_linkedparticles`) alongside the WebGL GPGPU examples (`webgl_gpgpu_birds`, `webgl_gpgpu_protoplanet`). — [three.js examples (files.json)](https://github.com/mrdoob/three.js/blob/dev/examples/files.json)
- Codrops (Oct 2024) covers `BatchedMesh` with `WebGPURenderer`, and noted at the time that the renderer was not yet fully production-ready. — [Codrops: Interactive 3D with BatchedMesh and WebGPURenderer](https://tympanus.net/codrops/2024/10/30/interactive-3d-with-three-js-batchedmesh-and-webgpurenderer/)

### Inferences
Concrete mappings to this engineer's work (design proposals, not sourced claims):
- **SSE streaming vs synchronous response**
  - Synchronous: one opaque "packet" travels a `QuadraticBezierLine` after a long server dwell.
  - SSE: many small instanced chunks flow down the same path continuously (dash-offset shader or instanced spheres sampled with `curve.getPointAt((t + i/n) % 1)`), and the client panel fills progressively.
  - Drive both from one ScrollTrigger timeline so scrolling scrubs "time".
- **Atomic per-record claims across scaled pods**
  - Render records as an `Instances` grid and pods as three or four columns.
  - Show a claim as a colored instance (per-instance `color`) plus a short `Trail` from record to pod.
  - Show a contention attempt as a red "bounce" off an already-claimed record. Instanced color updates are cheap.
- **Batched DB ops replacing about 100 sequential round-trips**
  - Left: 100 packets ping-pong one at a time; a counter shows the cumulative latency.
  - Right: one fat packet carries a batch.
  - `InstancedMesh` keeps both sides to a couple of draw calls.
- **Config-profile-driven deployments**
  - One template node fans out into environment nodes via arcs, with per-profile color.
  - A globe is overkill unless multi-region deployment is part of the story.
- Avoid full GPGPU for these diagrams. Packet counts are in the hundreds, so a per-frame CPU update of an `InstancedMesh` (or a vertex-shader offset driven by a `uTime`/`uProgress` uniform) is simpler and debuggable. Use GPGPU/WebGPU compute only for decorative point clouds of 50k+ points.
- The existing code already uses drei `<Line>` heavily. Upgrading those to dashed lines with animated `dashOffset` gives "flow" at near-zero cost.

### Gaps
- I could not read the full Stripe and GitHub posts; tube-geometry, arc-animation and offscreen-pausing details were not verified.
- I found no first-party engineering write-up of Vercel's or Cloudflare's own WebGL network visualizations.
- I found no specific Codrops tutorial on "packets flowing along network graph edges" in R3F.

---

## 3. Computer-vision-style effects: bounding boxes, depth/point clouds, scan lines, LiDAR-like sampling, segmentation masks

### Takeaway
All of these can be built with stock three.js/drei primitives:
- `MeshSurfaceSampler` / drei `<Sampler>` for LiDAR-like point clouds of the existing car and robot glTFs
- `Box3` + `Box3Helper` or drei `Edges`/`Line` for projected bounding boxes
- a world-space "scan band" shader (smoothstep of distance minus progress) for sweeps
- depth texture or `MeshDepthMaterial` for depth views
- an ID/color pass or postprocessing for segmentation-style overlays

### Cited Findings
- drei `<Sampler>` is a "declarative abstraction around MeshSurfaceSampler & InstancedMesh". It samples points from a mesh and transforms an InstancedMesh's matrices onto them, with a `weight` attribute, a `transform` callback and a `count`. — [drei docs: Sampler](https://github.com/pmndrs/drei/blob/master/docs/abstractions/sampler.mdx)
- The Codrops "Surface Sampling in Three.js" tutorial (2021) introduces `MeshSurfaceSampler` from the three.js examples/addons folder. — [Codrops: Surface Sampling in Three.js](https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/)
- `MeshSurfaceSampler` supports weighted sampling from vertex colors or custom attributes, for example to emit only from certain areas. — [three.js MeshSurfaceSampler docs (mirror)](https://neofixer.arizona.edu/css/CSSOrbit/asteroidJS/three/docs/examples/en/math/MeshSurfaceSampler.html)
- Codrops (2025-03-31), "WebGPU Scanning Effect with Depth Maps": a scan light sweeps through an image by depth, using R3F + TSL. The core is a `smoothstep` on `depth - progress`. — [Codrops: WebGPU Scanning Effect with Depth Maps](https://tympanus.net/codrops/2025/03/31/webgpu-scanning-effect-with-depth-maps/)
- The "wireframe scan reveal" pattern draws a `LineSegments` wireframe from the same geometry, and an expanding world-space wavefront reveals wire first, then solid. — [Tessl skill: build-wireframe-scan-reveal](https://tessl.io/registry/skills/github/MengTo/Skills/build-wireframe-scan-reveal)
- three.js examples relevant to "machine vision" looks: `webgl_depth_texture` / `webgpu_depth_texture`, `webgl_postprocessing_pixel`, `webgl_interactive_raycasting_points`, `webgl_points_dynamic`, `webgpu_skinning_points`, `webgpu_tsl_halftone`. — [three.js examples (files.json)](https://github.com/mrdoob/three.js/blob/dev/examples/files.json)
- drei `Edges` wraps `EdgesGeometry` with a `threshold` (default 15°), giving clean CAD/wireframe outlines without postprocessing. — [drei docs: Edges](https://github.com/pmndrs/drei/blob/master/docs/abstractions/edges.mdx)
- drei `Hud` renders an isolated scene on top with its own camera, for example an orthographic HUD for overlay graphics. — [drei docs: Hud](https://github.com/pmndrs/drei/blob/master/docs/portals/hud.mdx)
- `three-custom-shader-material` 6.4.0 (2025-10) extends built-in materials with custom shader chunks. Its peer is R3F >=8, so it works on the current stack. — [npm: three-custom-shader-material](https://registry.npmjs.org/three-custom-shader-material)

### Inferences
Implementation recipes for the "Perceive. Process. Act." lab:
- **Bounding boxes on the draggable obstacle**
  - Each frame, compute a `Box3` from the obstacle and project its eight corners to screen space.
  - Draw a 2D rect in a `Hud` with an orthographic camera, or as DOM via `<Html>`, with a class label and confidence ("pedestrian 0.91").
  - This reads as YOLO-style output rather than a 3D wireframe box, which is closer to the real work. Add a short ID tag that persists while dragging to suggest tracking (ByteTrack/DeepSORT-style IDs).
- **LiDAR / point-cloud mode**
  - Sample 20–50k points from the car and robot meshes once with `MeshSurfaceSampler`, then render them as `THREE.Points` with a small shader: size attenuation, color by height or distance (turbo colormap), and a rotating scan ring that brightens points within a band of `uScanAngle`.
  - Toggling between "RGB" (mesh) and "LiDAR" (points) views is a strong ROS 2 / RViz reference.
- **Depth view:** swap materials to `MeshDepthMaterial` (or a normalized-depth custom material) for a grayscale or turbo "depth camera" thumbnail. drei `View` can show it as a second viewport beside the main scene.
- **Segmentation mask:** assign a flat class color per object (`meshBasicMaterial` with a per-class color) in a second render, composite it at about 40% opacity over the main view, and optionally pixelate it.
- **Scan sweep:** a uniform `uProgress` in a world-space plane-distance `smoothstep` reveals the scene as a sensor sweep. It works in GLSL now and ports to TSL later.
- Keep it restrained: one "sensor" accent color (cyan or green) and monospaced labels, with no CRT noise everywhere.

### Gaps
- I found no maintained, R3F-specific library for "CV overlays". These are bespoke shaders and components.
- I found no authoritative tutorial specifically on segmentation-mask post effects in R3F.

---

## 4. Model inspection and exploded views: Bounds, PresentationControls, outlines/selection, x-ray, section clipping

### Takeaway
Use these components:
- drei `Bounds`/`useBounds` for animated "focus this part" camera fits
- `CameraControls` (or `PresentationControls` for product-style turntables)
- drei `Outlines` (inverted hull, no postprocessing cost) or postprocessing `Selection`/`Outline` for highlighting
- material `clippingPlanes` (or `r3f-cutter` for capped cuts) for section views

Animate explode offsets per part along the vector from the assembly center.

### Cited Findings
- drei `Bounds` calculates a bounding box and centers the camera, with `fit`, `clip`, `observe`, `margin`, `maxDuration` and a custom `interpolateFunc`. `useBounds()` allows `refresh(obj).clip().fit()` to focus a specific object, plus `moveTo()` and `lookAt()`. Camera controls must use `makeDefault`. — [drei docs: Bounds](https://github.com/pmndrs/drei/blob/master/docs/staging/bounds.mdx)
- drei `PresentationControls` are "Semi-OrbitControls with spring-physics, polar zoom and snap-back"; they rotate the contents, not the camera. Props: `global`, `snap`, `speed`, `zoom`, `polar`/`azimuth` limits, spring `config`. Marked "Dom only". — [drei docs: PresentationControls](https://github.com/pmndrs/drei/blob/master/docs/controls/presentation-controls.mdx)
- drei `CameraControls` implements yomotsu's `camera-controls` library (smooth transitions, `makeDefault`). — [drei docs: CameraControls](https://github.com/pmndrs/drei/blob/master/docs/controls/camera-controls.mdx)
- drei `Outlines` draws an inverted-hull outline from the parent geometry (mesh or skinned mesh). It has `thickness`, `screenspace`, `angle` and `clippingPlanes` support. — [drei docs: Outlines](https://github.com/pmndrs/drei/blob/master/docs/abstractions/outlines.mdx)
- react-postprocessing `<Selection>`/`<Select>` declaratively choose objects for effects like `Outline`, and selections can be nested. — [react-postprocessing docs: Selection](https://react-postprocessing.docs.pmnd.rs/selection)
- A forum report says enabling a `<Select>` caused infinite canvas re-renders. — [three.js forum: infinite re-render with @react-three/postprocessing](https://discourse.threejs.org/t/infinite-canvas-re-render-when-using-react-three-postprocessing/86953). Highlighting inside drei `View` with postprocessing is a known pain point. — [three.js forum: highlight in drei View](https://discourse.threejs.org/t/highlight-selected-geometries-in-drei-view-with-react-three-postprocessing/58441)
- Clipping planes in R3F are set from React state (a `Plane` normal and constant). They are render-only and leave the geometry unchanged, and `clipShadows` fixes leftover shadows. For true boolean cuts, use `three-bvh-csg` or `@react-three/csg`. — [three.js forum: clipping plane with R3F](https://discourse.threejs.org/t/how-to-make-clipping-plane-with-react-three-fiber/37291), [three.js forum: cut model with clipping plane](https://discourse.threejs.org/t/how-to-cut-model-using-clipping-plane-properly/37864)
- `r3f-cutter` provides a `<Cutter>` that clips and caps meshes, so cut faces look solid. Only one plane is supported. — [r3f-cutter (GitHub)](https://github.com/r3f-cutter/r3f-cutter)
- three.js examples for section and outline work: `webgl_clipping`, `webgl_clipping_advanced`, `webgl_clipping_intersection`, `webgl_clipping_stencil` (stencil-capped sections), `webgl_postprocessing_outline`, `webgl_postprocessing_unreal_bloom_selective`. — [three.js examples (files.json)](https://github.com/mrdoob/three.js/blob/dev/examples/files.json), [threejs.org/examples#webgl_clipping_stencil](https://threejs.org/examples/#webgl_clipping_stencil)
- `@react-three/csg` latest is 4.0.0 (2025-03). — [npm: @react-three/csg](https://registry.npmjs.org/@react-three/csg)

### Inferences
Recipe for the component explorer:
1. At load, compute each part's world-space center and the assembly center, and store `dir = normalize(partCenter - assemblyCenter)`.
2. Explode with `position = rest + dir * explode * k`, damped with `maath/easing.damp3` or GSAP.
3. Isolate by fading the other parts' opacity to about 0.08 (or switching them to a wireframe/`Edges` "ghost" material) and running `useBounds().refresh(part).clip().fit()`.
4. Highlight hovered parts with drei `Outlines`. It is cheaper and more reliable than a postprocessing outline pass, given the `Select` re-render report.
5. For "x-ray", use a single global clipping plane on all materials, bound to a slider, with `Outlines` respecting `clippingPlanes`. Use stencil caps (the `webgl_clipping_stencil` pattern) or `r3f-cutter` if solid cut faces matter.

Further notes:
- Keyboard and accessibility: mirror the parts list as a DOM list. Each item's button triggers the isolate/fit, and `aria-pressed` reflects selection. The canvas becomes a visual echo of DOM state, which also makes Playwright verification (`verify:lab`) easier.
- Reference experiences named in the brief: Sketchfab inspector, product configurators, BioDigital/Human-atlas-style apps. Their common UX vocabulary is a parts tree, isolate/hide, explode slider, section plane, wireframe/x-ray toggle, and annotations pinned with `<Html>`.

### Gaps
- I could not fetch Sketchfab, BioDigital or Human Atlas documentation to cite their exact UX patterns; the list above is from general knowledge and is unsourced.
- I found no current confirmation of whether the `Select` infinite re-render issue is fixed in `@react-three/postprocessing` 3.x.

---

## 5. Shader and transition techniques on award-winning sites; DOM↔WebGL integration; tasteful vs overused

### Takeaway
The relevant toolset:
- noise-threshold dissolves with emissive edges plus selective bloom
- `MeshTransmissionMaterial` glass
- bloom/DOF postprocessing
- `MeshPortalMaterial` scene portals
- drei `View` (scissor) for many 3D "windows" embedded in DOM layout on one canvas

For an engineering portfolio, the tasteful version is one coherent idea with restraint and performance care. Awwwards itself weights usability at 30%. Heavy transmission glass, chromatic aberration and full-screen bloom are expensive and widely seen on such sites.

### Cited Findings
- Codrops (2025-02-17), "Implementing a Dissolve Effect with Shaders and Particles in Three.js": a noise-based emissive dissolve with particles, finished with Selective Unreal Bloom on the edges. Each step is tied to a commit. — [Codrops: Dissolve Effect](https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/)
- An R3F dissolve package exists on npm (`dissolveit`). — [jsDelivr: dissolveit README](https://cdn.jsdelivr.net/npm/dissolveit@2.2.1/README.md)
- drei `MeshTransmissionMaterial` is an improved `MeshPhysicalMaterial` with chromatic aberration, noise-based roughness blur and anisotropic blur. It "can still be expensive as it causes an additional render pass of the scene". Lower `samples` and `resolution` help, and `transmissionSampler` can share a buffer. — [drei docs: MeshTransmissionMaterial](https://github.com/pmndrs/drei/blob/master/docs/shaders/mesh-transmission-material.mdx)
- drei `MeshPortalMaterial` renders a separate scene inside a mesh, with `blend` (0 = world, 1 = portal) and edge `blur` via an SDF. — [drei docs: MeshPortalMaterial](https://github.com/pmndrs/drei/blob/master/docs/portals/mesh-portal-material.mdx)
- drei `View` lets many 3D views share one canvas via `gl.scissor`, placed inline in the DOM and output with `<View.Port />`. The `track` prop is deprecated in favor of inline Views. — [drei docs: View](https://github.com/pmndrs/drei/blob/master/docs/portals/view.mdx)
- three.js ships `webgl_postprocessing_transition` / `webgpu_postprocessing_transition` (texture-mask scene transitions), DOF (`webgl_postprocessing_dof`, `dof2`, `webgpu_postprocessing_dof_basic`) and selective bloom examples. — [three.js examples (files.json)](https://github.com/mrdoob/three.js/blob/dev/examples/files.json)
- The three.js manual describes `WebGPURenderer` as the successor to `WebGLRenderer`, with a WebGL 2 fallback backend. — [three.js manual: WebGPURenderer](https://threejs.org/manual/en/webgpurenderer)
- A vendor blog (Utsubo) claims WebGPU has been "production-ready since r171", that TSL compiles to WGSL or GLSL, and that WebGPU is not universally faster. Treat these as a vendor claim. — [Utsubo: WebGPU + Three.js migration guide (2026)](https://www.utsubo.com/blog/webgpu-threejs-migration-guide), [Utsubo: 100 Three.js tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips). A Codrops piece from 2024 said the renderer was "not yet fully production-ready". — [Codrops (Oct 2024)](https://tympanus.net/codrops/2024/10/30/interactive-3d-with-three-js-batchedmesh-and-webgpurenderer/)
- Bruno Simon rebuilt his driving-game portfolio with WebGPU support and TSL. — [Awwwards: Bruno's portfolio case study](https://www.awwwards.com/brunos-portfolio-case-study.html), [Codrops: Speakers of the first Three.js Conference (2026-07-16)](https://tympanus.net/codrops/2026/07/16/meet-the-speakers-of-the-first-three-js-conference/)
- The `lamina` (layered materials) package's latest release, 1.2.2 (2025-06), now requires React 19 and three >=0.170. — [npm: lamina](https://registry.npmjs.org/lamina)
- A self-described Awwwards juror says sites are scored on Design 40%, Usability 30%, Creativity 20% and Content 10%, and that a winning portfolio is "one clear idea executed with craft, not a pile of added animations". — [hontran.dev: How to build an award-winning portfolio site (2026)](https://www.hontran.dev/blog/how-to-build-an-award-winning-portfolio-site)
- Active Theory's Site of the Month (2018) stacked colour shifts, DOF, volumetric lighting and RGB shift. This illustrates the "maximal effects" style. — [Awwwards: Active Theory v4](https://www.awwwards.com/active-theory-v4-wins-january-2018-site-of-the-month.html)
- One showcase portfolio stops the render loop when the hero leaves the viewport, a common restraint and performance practice. — [Freelancehunt showcase](https://freelancehunt.com/en/showcase/work/premium-portfolio-webgl/2044052.html)
- drei `useIntersect` exists for visibility-gated animation, and `AdaptiveDpr` and `PerformanceMonitor` exist for regressing quality. — [drei docs: useIntersect](https://github.com/pmndrs/drei/blob/master/docs/misc/use-intersect.mdx), [drei docs: AdaptiveDpr](https://github.com/pmndrs/drei/blob/master/docs/performances/adaptive-dpr.mdx), [drei docs: PerformanceMonitor](https://github.com/pmndrs/drei/blob/master/docs/performances/performance-monitor.mdx)

### Inferences
These are editorial judgments. The only sourced input is the juror opinion above; no source was found that ranks effects as overused.
- **Tasteful for this portfolio**
  - Noise dissolve between lab scenes (car, failover, robot), tied to the scene's meaning: the "failover" dissolve could literally dissolve the failed worker.
  - Subtle selective bloom only on emissive "signal" elements (packets, scan line), which the project already does.
  - drei `View` for embedding small live 3D diagrams in the Apple case-study text, all on one canvas.
  - DOF only for focus during isolate-mode in the explorer.
  - Restraint signals craft to an engineering audience: stable 60fps, `frameloop="demand"` when idle, reduced-motion fallbacks.
- **Likely overused or costly**
  - Full-scene `MeshTransmissionMaterial` glass blobs (extra render pass)
  - Constant chromatic aberration, RGB shift or film grain
  - Smooth-scroll hijacking with long inertia
  - Cursor-following blobs
  - Particle "explode-into-dust" logos without narrative purpose
- **WebGPU/TSL:** promising (R3F v10 is moving to WebGPU by default, and Bruno Simon's rebuild uses it), but still alpha in R3F. Writing new shaders in GLSL on R3F v9 is lower risk today. Keep shaders small so they can be ported to TSL later.

### Gaps
- I found no authoritative, sourced critique listing "overused" WebGL effects; the tasteful/overused split above is opinion.
- I did not verify the Utsubo "production-ready since r171" claim against three.js release notes.
- I could not confirm the publication date of the Codrops WebGPU "Gommage" dissolve tutorial mentioned in search results.

---

## 6. Notable tutorials and examples directly relevant

### Takeaway
The most directly reusable resources are listed below, mapped to this site's needs.

### Cited Findings
- **Camera on a path, scroll-driven:** [Codrops: Blender camera path + Three.js + GSAP (2026-07)](https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/); [Codrops: Theatre.js + R3F camera fly-through (2023)](https://tympanus.net/codrops/2023/02/14/animate-a-camera-fly-through-on-scroll-using-theatre-js-and-react-three-fiber/); [Codrops: Reactive Depth, R3F scroll tube (2026-02)](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/)
- **Point clouds / sampling:** [Codrops: Surface Sampling in Three.js](https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/); [Codrops: GPGPU dreamy particles (2024-12)](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/); [drei Sampler](https://github.com/pmndrs/drei/blob/master/docs/abstractions/sampler.mdx)
- **Scan / sensor look:** [Codrops: WebGPU Scanning Effect with Depth Maps (R3F + TSL, 2025-03)](https://tympanus.net/codrops/2025/03/31/webgpu-scanning-effect-with-depth-maps/)
- **Transitions:** [Codrops: Dissolve Effect with Shaders and Particles (2025-02)](https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/); three.js `webgl_postprocessing_transition` example ([threejs.org/examples](https://threejs.org/examples/#webgl_postprocessing_transition))
- **Particles in R3F:** [Maxime Heckel: Particles with R3F and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)
- **Data globes:** [GitHub: How we built the GitHub globe](https://github.blog/engineering/how-we-built-the-github-globe/); [Stripe: Globe](https://stripe.com/blog/globe)
- **WebGPU/TSL learning:** [Three.js Journey WebGPU & TSL course](https://threejs-journey.com/webgpu-tsl) (21 lessons, about 23 hours per its listing); [three.js manual: WebGPURenderer](https://threejs.org/manual/en/webgpurenderer)
- **Section / outline / clipping references:** three.js `webgl_clipping_stencil`, `webgl_postprocessing_outline`, `webgl_postprocessing_unreal_bloom_selective`, `webgl_instancing_raycast`, `webgl_lines_fat` ([threejs.org/examples](https://threejs.org/examples/)); [r3f-cutter](https://github.com/r3f-cutter/r3f-cutter)
- **pmndrs building blocks:**
  - [View](https://github.com/pmndrs/drei/blob/master/docs/portals/view.mdx)
  - [Bounds](https://github.com/pmndrs/drei/blob/master/docs/staging/bounds.mdx)
  - [Outlines](https://github.com/pmndrs/drei/blob/master/docs/abstractions/outlines.mdx)
  - [Edges](https://github.com/pmndrs/drei/blob/master/docs/abstractions/edges.mdx)
  - [Instances](https://github.com/pmndrs/drei/blob/master/docs/performances/instances.mdx)
  - [Trail](https://github.com/pmndrs/drei/blob/master/docs/abstractions/trail.mdx)
  - [CatmullRomLine](https://github.com/pmndrs/drei/blob/master/docs/shapes/catmull-rom-line.mdx)
  - [Hud](https://github.com/pmndrs/drei/blob/master/docs/portals/hud.mdx)
  - [ScrollControls](https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx)
  - [R3F scaling performance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- **Bruno Simon:** portfolio rebuild with WebGPU and TSL. — [Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html)

### Inferences
Suggested priority for this codebase, ordered by value per effort:
1. Animated dash-offset flow on existing drei `<Line>`s, plus instanced packets, for the Apple SSE, batching and claims diagrams, scrubbed by GSAP ScrollTrigger (already installed).
2. LiDAR point-cloud toggle via `MeshSurfaceSampler` on the car and robot glTFs, plus 2D YOLO-style bounding-box overlays in the lab.
3. Explorer: `Bounds` focus, `Outlines` hover, explode-along-centroid, and a clipping-plane x-ray slider with a DOM parts list.
4. A noise-dissolve transition between lab scenes.
5. Later: an R3F 9 / drei 10 / React 19 upgrade, then evaluate WebGPU/TSL once R3F v10 reaches beta.

### Gaps
- I could not verify a pmndrs examples-gallery entry dedicated to exploded views or network flows.
- I could not access the Three.js Journey lesson list to cite specific lessons beyond the WebGPU/TSL course listing.
