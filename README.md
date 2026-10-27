# Chibundu Awandu / Engineering Portfolio

Chibundu Awandu's interactive engineering portfolio. A featured Apple case study explains his work on production AI APIs, duplicate-safe processing, and platform delivery. It precedes the personal Perceive / Process / Act laboratory and the detailed Systems Collection inspector. Career evidence is explicitly separated from conceptual diagrams and third-party asset authorship.

## Experience

- Explore the Apple case study: step through SSE versus synchronous responses, compete for an illustrative record claim, and switch deployment profiles. Outcomes come from the supplied resume; the diagrams are not internal Apple architecture. See [Apple experience notes](docs/APPLE_EXPERIENCE.md).
- Follow the signal through three camera-linked stages, or explore each chapter manually. Drag a perception obstacle, interrupt simulated workers, and scrub a source-rigged pick/place cycle.
- Inspect, explode, isolate, hide, and search 62 actual source-mesh assemblies across four models.
- Orbit, zoom, switch viewing angles, and choose daylight or studio lighting.
- Locally hosted assets/fonts, Meshopt geometry, WebP textures, demand rendering, capped DPR, lazy 3D code and models.
- Employer-first introduction and experience links, a responsive 3D lab, keyboard controls, reduced motion, failed-model recovery, WebGL and no-JavaScript fallbacks.
- Resume-backed Apple, Splunk, and EcoCar experience in an Apple/Notion-style layout: highlights bento, case study, about, and footnoted caveats.
- Server rack and motherboard are credited preview images, not interactive geometry. Their Sketchfab archives require a signed-in download before conversion can proceed.

These are public visual assets, not Chibundu's hardware designs or a complete disassembly guide. No passport/headshot is used. See [model notes](docs/MODEL_NOTES.md) and [asset research](docs/ASSET_RESEARCH.md).

## Development

Requires Node 22.18+ (tested with Node 26) and npm. The lab test imports TypeScript using Node's built-in type stripping.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4175
npm run build
npm run verify:layout
npm run verify:lab
npm run verify:a11y
npm run verify:apple
```

Verification starts an isolated production preview on port 4276. Use `BASE_URL=https://example.com/ npm run verify:layout` for another target. On macOS it uses installed Chrome; elsewhere run `npx playwright install --with-deps chromium`. `TEST_CASE=mobile` runs one configuration. Screenshots and JSON results go to ignored `test-artifacts/collection/`.

The ten configurations cover desktop, laptop, tablet, mobile, small mobile, landscape, reduced motion, unavailable WebGL, a failed model request, and disabled JavaScript. All 62 selectable assemblies are exercised on desktop; all four models are exercised on mobile. Browser emulation is not a claim of physical-device testing or a measured 60 FPS guarantee.

The lab suite uses port 4277 and covers nine configurations. `CASE=mobile npm run verify:lab` selects one. Screenshots and results are in `test-artifacts/motion/`. It checks camera-linked navigation, direct 3D dragging, rendered changes, failover/recovery, robot scrubbing/replay, the guided sequence, and inspector round trips. See [experience notes](docs/INTELLIGENCE_IN_MOTION.md).

The accessibility suite uses port 4278, with seven viewport/preference configurations and eight state scans each. It covers contrast, keyboard focus, 320 px reflow, text enlargement/spacing, selected-hover states, forced colors, and control sizing. Reports retain checks requiring manual review. See [design and accessibility decisions](docs/DESIGN_ACCESSIBILITY.md); these checks are not a WCAG certification.

The Apple suite uses port 4279. Nine configurations exercise the three case-study interactions, keyboard tabs, state/reset behavior, reflow, enlarged text, reduced motion, forced colors, and operation without WebGL. Five axe scans per configuration focus on the featured section; the separate accessibility suite still audits the whole page. `CASE=mobile npm run verify:apple` selects one configuration. Screenshots and reports go to `test-artifacts/apple/` and are retained by CI.

## Asset Pipeline

The optimized GLBs are included, so a normal build does not require Python, MuJoCo, network downloads, or source conversions.

```sh
node scripts/fetch-assets.mjs
python3 -m venv test-artifacts/asset-venv
test-artifacts/asset-venv/bin/python -m pip install -r scripts/asset-requirements.txt
test-artifacts/asset-venv/bin/python scripts/convert-robots.py
node scripts/prepare-assets.mjs
test-artifacts/asset-venv/bin/python scripts/build-panda-motion.py
node scripts/prepare-panda-motion.mjs
```

Upstream revisions are pinned. `public/models/manifest.json` records optimized file hashes and source node names. Full original license texts are in `public/licenses/`; conversion and grouping details are in model notes. Runtime never loads textures, fonts, decoders, or models from third-party CDNs.

## Publishing

Production: [chibunduawandu.com](https://chibunduawandu.com). Keep the current hostname and SSL configuration.

`scripts/deploy-hostinger.sh` requires `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USER`, `HOSTINGER_PATH`, and optionally `HOSTINGER_KEY`. It checks the existing SSH known-hosts entry, backs up the site outside the document root, uploads only release files, retains old hashed assets, and atomically replaces `index.html` last. No `--delete`, DNS changes, or certificate changes are used. Restore the backup's index and overwritten public files for rollback.

The GitHub workflow builds and verifies each main push. Automatic deployment is opt-in via repository variable `HOSTINGER_DEPLOY_ENABLED=true` and secrets `HOSTINGER_SSH_KEY`, `HOSTINGER_KNOWN_HOSTS`, `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USER`, `HOSTINGER_PATH`. Verify the host key out of band; never commit credentials. With no secrets configured, CI tests run but deployment is skipped.

The contact CTA opens an email composer; it does not fabricate a sent-message state. The pre-existing Hostinger PHP endpoint is left untouched by the release allowlist. The current PDF was compiled from the supplied TeX using a temporary compatibility/layout-adjusted copy; the original Downloads file is unchanged.
