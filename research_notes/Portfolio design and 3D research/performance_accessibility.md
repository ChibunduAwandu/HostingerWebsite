# Performance and Accessibility of Three.js / R3F on Content-First Sites (Mobile Focus)

Research note context: React 18 + Vite + R3F + drei, static on Hostinger shared hosting. Already uses Meshopt, WebP, `frameloop="demand"`, capped DPR, lazy 3D chunks, a near-viewport lab scene, reduced-motion handling, and no-WebGL fallbacks. Three core is about 700 KB min / 180 KB gzip.

Method caveat: in this session the fetch tool could not resolve threejs.org, web.dev, w3.org, gltf-transform.dev, r3f.docs.pmnd.rs or cdn.jsdelivr.net (DNS failures). Primary docs were read through raw GitHub copies where possible (R3F and drei docs). Everything else comes from search-result summaries. Items marked "(canonical, not fetched)" cite the standard reference page, whose content I could not re-verify in this session. Many numeric "budgets" come from practitioner blogs, not official guidance, and are labelled as such.

## Asset pipeline: Meshopt vs Draco, KTX2, gltf-transform/gltfjsx, texture and payload budgets

### Takeaway
Keep Meshopt. It decodes much faster than Draco, preserves animation and morph data, and is designed to be gzip/brotli'd on top, so make sure the host actually compresses `.glb` and `.bin`. Textures dominate both bytes and VRAM. Cap them at 1024 px on mobile (2048 px as a hard ceiling). Move to KTX2 (ETC1S for color, UASTC for normals) only when GPU memory or upload jank on phones becomes the bottleneck. WebP only shrinks the download, not VRAM.

### Cited Findings
- gltf-transform docs: "Meshopt decoding is considerably faster than Draco decoding", and "neither compression method will improve runtime performance directly." Without secondary (gzip) compression, Meshopt's size reduction "is considerably less." — [gltf-transform EXTMeshoptCompression](https://gltf-transform.dev/modules/extensions/classes/EXTMeshoptCompression)
- Khronos meshopt proposal: for mesh data, Meshopt "usually is slightly less efficient than Draco in terms of transmission size". It is designed so gzip can be applied on top, and gzip alone "can't get anywhere close" to its compression. — [KhronosGroup/glTF PR #1830](https://github.com/KhronosGroup/glTF/pull/1830)
- Forum experience: Draco tends to compress high-poly static models better. Meshopt wins for smaller and animated assets and loads faster. — [three.js forum: Draco animation](https://discourse.threejs.org/t/draco-animation/10945)
- Practitioner guidance: Draco files are about 10–20% smaller, Meshopt decodes faster and handles animation better. Draco does not compress animation tracks or morph targets, so use Meshopt for animated characters. — [cinevva: optimize GLB for web](https://app.cinevva.com/de/guides/optimize-glb-for-web); [skills.cat asset-pipeline-3d](https://skills.cat/skills/anthemflynn/dwc/asset-pipeline-3d)
- Unverified claim: Meshopt decodes "5–10x faster" than Draco (no benchmark given). — [svilenkovic: draco vs meshopt](https://www.svilenkovic.com/3d/draco-vs-meshopt)
- Meshopt compression is lossy (quantization), so keep the original source files. — [gltf-transform EXTMeshoptCompression](https://gltf-transform.dev/modules/extensions/classes/EXTMeshoptCompression)
- gltf-transform CLI examples for each step:
  - `meshopt --level medium`
  - `draco --method edgebreaker`
  - `resize --width 1024 --height 1024`
  - `uastc` with level 4, rdo 4 and zstd 18 for normal, occlusion and metallic-roughness slots
  - `etc1s --quality 255` for the remaining textures
  - Source: [npm @gltf-transform/cli README (v3.x via socket.dev)](https://socket.dev/npm/package/@gltf-transform/cli/overview/3.4.3). Version note: these snippets are from v3.x. v4 consolidates them into `optimize` with `--compress` and `--texture-compress` flags; verify against the current CLI help.
- Textures are usually at least 80% of a GLB's bytes and essentially all of its VRAM, so handle them first. Cap at 1024 or 2048 px before compressing. Use WebP for download size and KTX2 when GPU memory or phone performance matters. — [cinevva guide (Sept 2026)](https://app.cinevva.com/de/guides/optimize-glb-for-web)
- VRAM arithmetic: a 2048×2048 RGBA texture is 16 MB decoded, whatever the PNG/WebP file size. KTX2/Basis is claimed to cut texture memory by 4–8× (vendor claim; the real saving depends on the transcode target: BC on desktop, ASTC/ETC2 on mobile). — [cinevva KTX2 compressor](https://app.cinevva.com/tools/ktx2-compressor)
- With mipmaps, a 2048² texture reaches about 21 MiB of VRAM. — [utsubo: 100 Three.js tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- Khronos: Basis Universal in KTX2 is "efficiently transcoded to a variety of GPU compressed texture formats at run-time", which reduces both download and GPU memory size. — [Khronos KTX 2.0 press release](https://www.khronos.org/news/permalink/khronos-ktx-2.0-textures-enable-compact-visually-rich-gltf-3d-assets)
- three.js `KTX2Loader` needs the Basis transcoder (wasm + js) and `detectSupport(renderer)` before loading. — [three.js basis README (r184)](https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/libs/basis/README.md)
- Mobile texture guidance from practitioner blogs: 2048 as the absolute cap, 1024² recommended for mobile, 512² "for best results on phones." — [utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [iErcann Three.js performance gist](https://gist.github.com/iErcann/2a9dfa51ed9fc44854375796c8c24d92)
- Award-style portfolios commonly ship lighter or no WebGL on mobile:
  - Design Embraced chose a non-WebGL mobile version "to keep it lightweight" and skipped three.js entirely because the geometry was only planes. — [Codrops: Design Embraced case study (2024)](https://tympanus.net/codrops/2024/03/21/case-study-design-embraced-portfolio-2024/)
  - Stefan Vitasović kept the same UI motion on mobile minus the WebGL layer. — [Codrops: Stefan Vitasović portfolio (2025)](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
  - Ronin161 used binary glTF with a mesh-optimizer extension to shrink vertex and weight data. — [Codrops: Ronin161 (2024)](https://tympanus.net/codrops/2024/02/20/case-study-ronin161s-portfolio-2024/)
  - Merouane Bali uses a 3D model only in the mobile header and had to cut texture and file sizes so the animations "didn't hog too many resources." — [Codrops: The Journey of Creating a 3D Portfolio (2025)](https://tympanus.net/codrops/2025/01/21/the-journey-of-creating-a-3d-portfolio/)

### Inferences
- For this site: keep Meshopt and add `--texture-compress webp` with `--texture-size 1024` for the mobile variant. Consider serving a separate `*-mobile.glb` at 512–1024 px textures to small screens.
- KTX2 is worth adopting if one of these holds:
  - the total decoded texture set exceeds roughly 50–100 MB VRAM;
  - there is visible jank on texture upload, which KTX2 reduces because upload needs no main-thread image decode;
  - many 2k maps are on screen.
- KTX2 costs about 200 KB+ of transcoder wasm on first use, and ETC1S files are often larger than WebP. For a few 1k textures, WebP is fine.
- Hostinger caution: Meshopt's size advantage relies on HTTP compression. LiteSpeed/Apache on shared hosting may not gzip `model/gltf-binary` or `application/octet-stream` by default. Check `content-encoding` in DevTools for the `.glb`. If it is missing, add an `.htaccess` `AddOutputFilterByType DEFLATE model/gltf-binary` (or brotli) rule, or pre-compress. This is an inference; Hostinger-specific behavior was not verified.
- Suggested budget (inference synthesized from the sources above, not an official standard):
  - Critical path, before the poster/LCP: under about 170 KB gzip of JS, with 3D excluded.
  - The 3D chunk, about 180 KB gzip of three plus R3F/drei, loads after LCP.
  - Per-scene GLB plus textures: about 1–2 MB on mobile and about 3–5 MB on desktop.
  - Under 100 draw calls on mobile.

### Gaps
- No official three.js or Khronos published "payload budget" for 3D sites; Codrops case studies retrieved did not state total MB figures.
- No controlled benchmark of KTX2 vs WebP VRAM/load time in three.js was found.
- Could not verify current gltf-transform v4 `optimize` defaults (doc site unreachable).

## Runtime: demand frameloop, PerformanceMonitor/Adaptive*, instancing, shadows, offscreen pausing, workers, WebGPU

### Takeaway
On-demand rendering plus regression (`PerformanceMonitor` driving DPR, with `performance.regress()` during interaction) are the core R3F levers. Keep draw calls under about 100 on mobile, reuse geometries and materials, instance repeated meshes, and avoid real-time shadows (bake them, or use one 512–1024 shadow map). Pause rendering when off-screen or when the tab is hidden. OffscreenCanvas is viable (Safari 16.4+) but awkward with R3F. WebGPURenderer falls back to WebGL2, but for a content site it adds risk for little gain.

### Cited Findings
- `frameloop="demand"` renders only when props change, so an idle scene stops drawing, which saves battery and fan noise. `invalidate()` "merely requests a new frame". drei controls call it automatically. — [R3F docs: Scaling performance (GitHub source)](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx)
- R3F docs, other levers:
  - Reuse geometries and materials; `useLoader` caches results.
  - Instancing: draw calls "no more than 1000 as the very maximum, and optimally a few hundred or less" (desktop-oriented figure).
  - `<Detailed distances={[0,10,20]}>` for LOD.
  - Nested Suspense to show a low-poly model first, then the high-poly one.
  - `startTransition` for heavy object creation. In their benchmark, creating 510 TextGeometries at once caused about 1.5 s of jank on an M1, while React scheduling kept about 60 fps.
  - Source: [R3F docs: Scaling performance](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx)
- Movement regression: `performance.regress()` alone "will not change or affect anything". The app must read `performance.current` (from `min` to `max`) and scale DPR or effects itself. `debounce` (for example 200 ms) sets how long it takes to return to full quality. — [R3F docs: Scaling performance](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx)
- drei `PerformanceMonitor` defaults:
  - `ms=250` (sampling window)
  - `iterations=10`
  - `threshold=0.75`
  - `factor=0.5` (start value, 0–1)
  - `step=0.1`
  - `flipflops=Infinity`; set it to something like 3 to call `onFallback` and stop monitoring
  - `bounds(refreshrate)` returns `[lower, upper]` fps, for example `[50, 90]` for displays above 90 Hz and `[50, 60]` otherwise.
  - Source: [drei docs: PerformanceMonitor](https://raw.githubusercontent.com/pmndrs/drei/master/docs/performances/performance-monitor.mdx)
- Mobile draw-call budget is about 100 per frame (attributed second-hand to Don McCurdy). Other guides allow up to the low hundreds or 500. Measure with `renderer.info.render.calls`. — [utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [iErcann gist](https://gist.github.com/iErcann/2a9dfa51ed9fc44854375796c8c24d92)
- Shadows:
  - Each shadow-casting light adds a full scene render. Point-light shadows need 6 renders (cube map).
  - Use 512–1024 shadow maps rather than 2048; tightening the shadow camera frustum improves quality more than raising resolution.
  - Prefer one shadow light, or baked shadows.
  - Cap pixel ratio at 2 and consider disabling MSAA on high-DPI phones.
  - Sources: [utsubo 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [DEV: Mastering shadows in Three.js](https://dev.to/outriding/mastering-shadows-in-threejs-setup-configuration-and-optimization-39nn)
- OffscreenCanvas ships in Safari 16.4+. Transferring control to a worker keeps animation smooth when the main thread is busy. three.js expects `canvas.style.width/height`, so these must be stubbed in the worker, and DOM-dependent features (some texture loading, events) need workarounds. — [web.dev: OffscreenCanvas](https://web.dev/articles/offscreen-canvas)
- Shader compile jank:
  - `renderer.compileAsync()` relies on `KHR_parallel_shader_compile`. Without it, programs report ready immediately and may stall on first draw.
  - Ken Russell (Chrome GPU) warned that querying other program state before completion "sabotages the parallelism".
  - A 2023 WebKit bug reports blocking even with the extension.
  - MDN lists the extension as limited availability.
  - Sources: [three.js PR #19752](https://github.com/mrdoob/three.js/pull/19752); [MDN KHR_parallel_shader_compile](https://developer.mozilla.org/docs/Web/API/KHR_parallel_shader_compile); [Khronos public_webgl thread](https://www.khronos.org/webgl/public-mailing-list/public_webgl/1904/msg00038.php); [WebKit bug 251514](https://119184-bug-83566-attachments.webkit.org/show_bug.cgi?id=251514)
- WebGPU:
  - three.js presents WebGPURenderer as the successor to WebGLRenderer, and it automatically falls back to a WebGL 2 backend. — [three.js manual: WebGPURenderer](https://threejs.org/manual/en/webgpurenderer.html)
  - Third-party guides call it "production-ready since r171" with zero-config fallback. — [utsubo migration guide (2026)](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
  - Others note it was still flagged experimental around r170 and recommend WebGL for maximum reach. — [svilenkovic: WebGPU three.js](https://www.svilenkovic.com/3d/webgpu-three-js); [OpenReplay: WebGPU vs WebGL](https://blog.openreplay.com/webgpu-vs-webgl-industry-moving/)
  - Unverified figure: about 95% of users have WebGPU-capable browsers. — [utsubo migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
  - Version note: WebGPURenderer requires TSL/node materials, so custom `ShaderMaterial`/`onBeforeCompile` code does not port directly. I know this from background knowledge; the manual was not fetched to confirm it.
- Headless SwiftShader WebGPU can lose its device within seconds of the first frame, so WebGL2 is the reliably testable path in CI. — [Sashimee/aquarium issue #70](https://github.com/Sashimee/aquarium/issues/70)

### Inferences
- Concrete R3F setup for this site:
  - `<Canvas frameloop="demand" dpr={[1, 1.5]} performance={{ min: 0.5, debounce: 200 }}>` (mobile max DPR 1.5, desktop 2).
  - `<PerformanceMonitor flipflops={3} onDecline={() => setDpr(1)} onFallback={() => setDpr(1)}>` and drei `<AdaptiveDpr pixelated />` plus `<AdaptiveEvents />` (both react to `performance.current` regressions).
- Pausing:
  - With `frameloop="demand"`, nothing renders unless invalidated. Any continuous animation (useFrame loops) should be gated: switch `frameloop` to `"never"` or `"demand"` when an IntersectionObserver reports the canvas off-screen, and on `document.visibilitychange` hidden. Browsers already throttle rAF in hidden tabs.
  - Unmount the lab scene's GPU resources when it leaves the viewport only if memory is a concern. Re-upload costs time, so prefer pausing over unmounting for scenes likely to be re-entered.
- Do not migrate to WebGPURenderer for this portfolio now:
  - It adds bundle size and the TSL rewrite, and creates two code paths to test, all for little visual gain in small scenes.
  - Revisit if compute or particle-heavy effects are planned.
- Skip OffscreenCanvas with R3F: event handling and drei helpers assume the DOM. demand rendering already keeps main-thread cost low.

### Gaps
- drei `AdaptiveDpr`/`AdaptiveEvents` docs pages were not fetched; behavior described from R3F docs and background knowledge.
- No authoritative mobile GPU VRAM budget (MB) was found.
- WebGPU browser share figures could not be verified from a primary source (e.g., caniuse).

## Loading UX and Core Web Vitals: LCP/INP/CLS, code-splitting, preloading, progressive enhancement, single vs multiple canvases

### Takeaway
A `<canvas>` is not an LCP candidate, so the LCP should be a real headline or poster `<img>` that renders before any 3D code. Defer the three.js chunk until after LCP or idle, reserve canvas dimensions to avoid CLS, and keep shader compilation and model parsing off input-critical moments to protect INP. Use one shared canvas with drei `<View>` rather than several canvases.

### Cited Findings
- LCP candidate types:
  - `<img>`
  - `<image>` inside `<svg>`
  - `<video>` (poster image or first frame)
  - elements with `url()` background images
  - block-level text elements
  - Canvas is not listed. Sources: [Chrome DevTools LCP elements reference (derived from web.dev)](https://cdn.jsdelivr.net/npm/chrome-devtools@1.6.0/skills/debug-optimize-lcp/references/elements-and-size.md); [web.dev LCP](https://web.dev/articles/lcp?hl=fr)
- LCP thresholds: "good" at 2.5 s or less, "needs improvement" up to 4 s, "poor" above that, measured at the 75th percentile of page loads. — [corewebvitals.io LCP](https://www.corewebvitals.io/core-web-vitals/largest-contentful-paint); [DebugBear LCP](https://www.debugbear.com/docs/metrics/largest-contentful-paint)
- INP "good" is 200 ms or less and CLS "good" is 0.1 or less, at p75. — [web.dev Core Web Vitals (canonical, not fetched)](https://web.dev/articles/vitals); [corewebvitals.io overview](https://www.corewebvitals.io/core-web-vitals)
- Three.js SEO guide (vendor blog, 2026):
  - Make the LCP element a real image or headline that renders before any 3D, or paint the canvas's first frame fast.
  - Defer the 3D bundle until after load; the authors report this made the headline/CTA the LCP element.
  - The guide says three core is about 600 KB minified before scene code.
  - Source: [utsubo: WebGL & Three.js SEO (2026)](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide)
- Preload the LCP poster image with `fetchpriority="high"`. — [DebugBear LCP](https://www.debugbear.com/docs/metrics/largest-contentful-paint)
- drei `<View>`:
  - Renders multiple scenes into one shared canvas using `gl.scissor`, avoiding a WebGL context per scene.
  - Each view tracks its HTML element, measured with `getBoundingClientRect` each frame; set `frames={1}` for static views.
  - Requires R3F above ^8.1.0 for a non-fullscreen canvas.
  - Set `eventSource` to a parent that contains both the canvas and the HTML.
  - Source: [drei docs: View](https://raw.githubusercontent.com/pmndrs/drei/master/docs/portals/view.mdx)
- React 18 `startTransition` keeps frame rate and input responsive when creating many objects (relevant to INP). — [R3F docs: Scaling performance](https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx)

### Inferences
- Progressive enhancement order:
  1. SSR'd or static HTML headline plus a poster `<img>` (WebP/AVIF, sized with `width`/`height`, `fetchpriority="high"`).
  2. After `load` or `requestIdleCallback`, check WebGL support, reduced-motion and `navigator.connection.saveData`, then `import()` the 3D chunk.
  3. Mount the canvas in the same reserved box (`aspect-ratio` CSS) so there is no CLS.
  4. Crossfade from the poster once the first frame renders (`onCreated`, or after Suspense resolves). Never put a blocking full-screen loader in front of content.
- Vite: keep `three`, `@react-three/fiber` and `drei` in a separate `manualChunks` entry so content routes never download them.
  - Use `<link rel="modulepreload">` for that chunk only on routes that will use it, and only after LCP; an eager preload competes with the LCP image.
  - Import drei helpers individually; drei is tree-shakable from its ESM build.
- INP risks with 3D:
  - GLB parse and Meshopt decode (wasm, mostly fast).
  - First-use shader compilation.
  - Texture upload.
  - Pointer raycasting on every move. Mitigate with `<AdaptiveEvents>`, `compileAsync`/`gl.compile(scene, camera)` during idle before reveal, and limiting raycast targets (`raycast={() => null}` on decorative meshes).
- If the hero and the lab both need 3D, one fixed canvas with two `<View>`s avoids a second context (more memory, separate shader caches). Lazy-mounting the lab view near the viewport remains compatible.

### Gaps
- Did not retrieve the web.dev LCP page directly (DNS failure); canvas exclusion is inferred from element lists, not an explicit statement.
- No measured case study quantifying INP impact of three.js shader compilation on mid-range Android found.

## Accessibility for WebGL: reduced motion, keyboard, screen readers, @react-three/a11y, WCAG 2.2, scroll-jacking

### Takeaway
Treat the canvas as decorative enhancement. All content and navigation must exist in HTML. Give an interactive canvas an accessible name and description, add keyboard-operable HTML controls, honor `prefers-reduced-motion` (a static frame, with no auto-rotation or parallax), and give users a pause control for auto-moving content. `@react-three/a11y` is effectively dormant, and its React 19 / R3F v9 compatibility is unverified. On React 18 / R3F v8 it may still work, but plain HTML overlays are the safer path.

### Cited Findings
- `@react-three/a11y` status and features:
  - The repo is not archived, but its last recorded push was December 2024, with 14 open issues.
  - It provides focus management, roles (content, button, togglebutton, link) and an `A11yAnnouncer` for screen readers.
  - It is still listed in the R3F v9 readme ecosystem.
  - No evidence of v9 / React 19 support was found.
  - Sources: [ecosyste.ms: react-three-a11y](https://opencollective.ecosyste.ms/projects/195318); [react-three-a11y docs](https://docsearch.algolia.com/mcp/docs/repo/pmndrs/react-three-a11y); [R3F 9.6.1 readme](https://cdn.jsdelivr.net/npm/@react-three/fiber@9.6.1/readme.md); [R3F v9 migration guide](https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide)
- WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA:
  - Targets must be at least 24×24 CSS px, or spaced so a 24 px circle centered on each target does not intersect another target.
  - Exceptions: equivalent, inline, user-agent control, essential.
  - Sources: [DAISY KB: target size minimum](https://kb.daisy.org/publishing/docs/wcag/target-size-minimum.html); [Deque axe rule target-size](https://dequeuniversity.com/rules/axe/4.8/target-size)
- WCAG 2.2 SC 2.2.2 Pause, Stop, Hide (Level A): moving or auto-updating content that starts automatically, lasts more than 5 seconds and is shown alongside other content needs a mechanism to pause, stop or hide it. — [W3C Understanding 2.2.2 (canonical, not fetched)](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- WCAG 2.2 SC 2.3.3 Animation from Interactions (Level AAA): motion animation triggered by interaction can be disabled unless essential. This is the usual basis for honoring `prefers-reduced-motion` for scroll- or pointer-driven 3D. — [W3C Understanding 2.3.3 (canonical, not fetched)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum), Level AA: a focused component must not be entirely hidden by author-created content. This is relevant when a fixed full-screen canvas or overlays sit above the HTML. — [W3C Understanding 2.4.11 (canonical, not fetched)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- SC 2.1.1 Keyboard (Level A) and SC 1.1.1 Non-text Content (Level A) apply: interactive 3D needs keyboard operation and a text alternative. — [WCAG 2.2 (canonical, not fetched)](https://www.w3.org/TR/WCAG22/)
- The `prefers-reduced-motion` media query is the mechanism to detect the OS reduce-motion setting. — [MDN prefers-reduced-motion (canonical, not fetched)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

### Inferences
- Canvas markup:
  - Decorative canvas: `aria-hidden="true"` on the wrapper, with the content duplicated in HTML.
  - Interactive canvas: `role="img"` with `aria-label`, or a visible `<figcaption>` describing what the scene shows.
  - Put interactive affordances (rotate, reset, next project, pause) in real `<button>`s at least 24×24 px (44 px preferred for touch), positioned over or near the canvas.
  - Use `aria-live="polite"` to announce state changes (for example the selected object).
- Reduced motion:
  - Under `prefers-reduced-motion: reduce`, render one static frame (demand mode with no invalidation loop), disable auto-rotate, damping inertia, camera tweens and parallax, and swap to the poster where appropriate.
  - Even without the preference, provide a visible pause toggle for any loop longer than 5 s (SC 2.2.2).
- Do not scroll-jack:
  - Keep native scroll.
  - Drive 3D from scroll position passively (`{ passive: true }` listeners, or IntersectionObserver/ScrollTimeline) rather than intercepting wheel or touch events.
  - Do not let OrbitControls capture page scroll on touch devices: disable zoom, or require a click/tap to activate controls.
- Focus:
  - Make sure a fixed or behind-content canvas is not layered above focused elements (SC 2.4.11).
  - Make sure `eventSource` and `pointer-events` settings don't swallow clicks on HTML links.

### Gaps
- Could not fetch W3C or MDN pages directly. Normative wording above is paraphrased from the standard text and should be spot-checked.
- No 2024–2026 case study found that audits a WebGL portfolio with screen readers.

## Testing WebGL in CI

### Takeaway
Run Playwright with explicit SwiftShader/ANGLE flags. Expose a "scene ready / frame rendered" signal instead of using sleeps, freeze animation and time (demand mode, fixed seed, `reducedMotion: 'reduce'`), and compare screenshots with a small tolerance (for example `maxDiffPixelRatio: 0.01`), with baselines generated on the same Linux CI image. Keep CI scenes light, because software rendering can starve workers. Use real-device or GPU runs (for example manual or periodic BrowserStack/real phones) for performance numbers, not CI.

### Cited Findings
- Projects force software WebGL via Chromium flags: `--use-angle=swiftshader` plus `--enable-unsafe-swiftshader` (the latter needed for SwiftShader WebGL in current Chromium), or `--use-gl=swiftshader`. — [spinrvm PR #5879](https://github.com/srikumarimuddana-lab/spinrvm/pull/5879); [IfcCostEstimator PR #1](https://github.com/souravganguli/IfcCostEstimator/pull/1); [Barth Cave: E2E testing for web games](https://barthpaleologue.github.io/Blog/posts/webgl-webgpu-playwright-setup/)
- A WebGL Playwright snapshot suite used `maxDiffPixelRatio: 0.01`. — [Kaleaon/Linkpoint PR #799](https://github.com/Kaleaon/Linkpoint/pull/799)
- Baselines captured without WebGL, or only on macOS, could never match on Linux CI. Regenerate baselines on the CI platform. — [noodles.gl PR #530](https://github.com/joby-aviation/noodles.gl/pull/530)
- Under SwiftShader, shader compilation can hold a page below 1 fps for tens of seconds. Expose a pending-work or ready hook instead of a fixed sleep. Heavy canvases with 4 parallel workers caused 7 test timeouts; the fix was lowering render quality or dropping animated-frame checks. — [kaanmuar.github.io issue #1828](https://github.com/kaanmuar/kaanmuar.github.io/issues/1828); [Barth Cave blog](https://barthpaleologue.github.io/Blog/posts/webgl-webgpu-playwright-setup/)
- Headless SwiftShader WebGPU loses its device shortly after the first frame, so test the WebGL2 path. — [Sashimee/aquarium issue #70](https://github.com/Sashimee/aquarium/issues/70)

### Inferences
- Recommended test pyramid for this site:
  1. Unit and component tests with the 3D lazy chunk mocked.
  2. Playwright E2E for the no-WebGL fallback: launch with `--disable-webgl` / `--disable-3d-apis` and assert the poster plus HTML content.
  3. Playwright E2E for reduced motion (`page.emulateMedia({ reducedMotion: 'reduce' })`): assert no continuous rAF, for example by checking that a `window.__frames` counter stays flat.
  4. One or two WebGL screenshot tests on SwiftShader with `workers: 1`, fixed viewport and DPR 1, `window.__sceneReady` set in R3F `onCreated` plus after Suspense resolves, and a 1% pixel tolerance.
  5. Lighthouse CI (`@lhci/cli`) on the built static site with budgets on LCP, CLS and total JS. CI LCP/INP numbers are directional only.
- axe-core (`@axe-core/playwright`) can catch target-size and missing-name issues on the HTML controls around the canvas. It cannot audit canvas content.

### Gaps
- No three.js/pmndrs official CI testing guide was found; evidence is from individual GitHub repos.
- No source quantified GPU-enabled CI runner (e.g., GitHub GPU runners) costs or setup for WebGL.
