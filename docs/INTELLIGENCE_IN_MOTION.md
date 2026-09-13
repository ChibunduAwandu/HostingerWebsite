# Intelligence in Motion

## Experience

This iteration replaces the default model-viewer entrance with a connected Perceive / Process / Act laboratory. The original 62-assembly collection remains available through Open component explorer or a direct `#explorer` link. Returning to the lab unmounts the explorer Canvas, avoiding two simultaneous rendering contexts.

- Perceive: material/wireframe view, GLSL scan field, pointer-draggable obstacle with keyboard-equivalent slider, and a deterministic blocked/clear trajectory state.
- Process: instanced request particles follow three worker paths. Failing one worker redistributes all 48 visual packets across two paths. The workload shares are conceptual, not real throughput measurements.
- Act: an Apache-licensed Panda, re-exported with its body hierarchy and animation, performs a scrub-controlled pick/place cycle. Its token follows the hand transform between pickup and release. Replay works after the animation clamps at the final pose.
- Follow the signal: an optional guided sequence demonstrates perception, failover/recovery, and the robot action. Manual input interrupts it; it never captures the page scroll or hides resume/contact navigation.

## Art Direction

Warm architectural concrete, dark mineral green, ivory typography, amber objects, and mint diagnostic marks. Perspective camera moves connect platforms in a single coordinate space. A repeated column structure provides scale and directional shadows. Text and controls occupy their own CSS grid columns and stack below the scene on mobile.

## Verification

Run `npm run build`, `npm run verify:lab`, and `npm run verify:layout`. The lab suite covers nine browser configurations: desktop, laptop, tablet, mobile, 320px, landscape, reduced motion, no WebGL, and a deliberately unavailable asset. It checks chapter keyboard navigation, rendered differences, worker recovery, robot scrubbing/replay, one mounted Canvas, control bounds, and original-explorer round trips. The original suite retains its ten configurations.

Screenshots and machine-readable results are written to ignored `test-artifacts/motion` and `test-artifacts/collection`. CI runs both suites and retains both artifact folders. Automated browser coverage uses Chromium; real Safari/iOS, long-duration thermal behavior, and physical-device frame rates are not certified by these checks.

## Intentional Limits

No audio autoplay, paid assets, new tracking, credentials, backend changes, or passport/headshot usage. No live AI model or physical robot connection. Exploded views remain illustrative, not manufacturer disassembly instructions. No guaranteed 60fps claim: the large Three.js runtime remains separately loaded and requires device profiling. The browser renderer is WebGL, not a WebGPU migration.

The new scene, interactions, and model conversion are original implementation work inspired by public maker breakdowns, not copied site code. Research references are linked in the preceding conversation. All imported assets retain source credit and license notices.
