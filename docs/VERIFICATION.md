# Collection Verification

September 12, 2026. Production build tested with installed Chrome on macOS. This is browser emulation, not physical mobile-device certification.

## Automated Checks

The full ten-configuration suite passed: 1440x1000 desktop, 1280x720 laptop, 768x1024 tablet, 390x844 mobile, 320x568 small mobile, 844x390 landscape, reduced motion, no WebGL, failed GLB request with recovery to another exhibit, and JavaScript disabled.

Checks include all four model loads on desktop/mobile; 62 unique source assemblies selected, isolated, and hidden on desktop; keyboard separation; search/empty results/reset; viewing presets; studio lighting; rotation controls; source-dialog focus return; failover/recovery simulation; resume response/PDF signature; email destination; image loading; no horizontal overflow, overlapping main panels, or overlapping controls; and browser/network errors. Separate desktop regression coverage verifies pointer picking and drag-to-orbit through changed rendered pixels. A targeted no-WebGL regression switches exhibits and confirms a static preview rather than a stuck loading overlay.

Generated screenshots and machine-readable results are in ignored `test-artifacts/collection/`, with targeted checks in `test-artifacts/pointer/` and `test-artifacts/fallback-switch/`. CI reruns the suite and retains verification artifacts for seven days.

## Visual Review

Assembled and exploded views were inspected for the car and robots, including mobile captures. Visual inspection caught and corrected quantized-attribute deformation that a successful TypeScript build alone could not catch. Model switching retains one Canvas to avoid false context-loss failures. The updated resume was rendered and checked as one page. The 1200x630 social image is a screenshot of the actual local application in a dedicated capture layout.

## Build and Release

- TypeScript and Vite production build pass.
- Production dependency audit reports zero known vulnerabilities.
- Application entry: approximately 174 KB uncompressed / 56 KB gzip.
- Lazy 3D module: approximately 285 KB; separate Three.js chunk: approximately 700 KB. Vite still reports its large-chunk advisory.
- Four GLBs together: approximately 5 MB; only the selected model is downloaded. No measured universal FPS guarantee is asserted.
- Hostinger dry run validates the allowlisted release and preserves document-root permissions, existing configuration, and prior assets. Deployment creates an external backup and switches the index last.

## Boundaries

No real contact email is sent during automated testing. The visible contact CTA is a mailto link. The failover study is a UI simulation, not backend infrastructure testing. Robot poses are static source poses with illustrative assembly motion, not physical dynamics or model inference. Rack and motherboard are licensed previews pending signed-in model downloads. Safari, Firefox, and real iOS/Android devices have not been tested in this run.
