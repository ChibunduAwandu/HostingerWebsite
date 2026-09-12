# The Systems Collection

Chibundu Awandu's interactive engineering portfolio. A concept vehicle, Shadow Hand, Unitree Go2, and Franka Panda share one architectural 3D stage. Career evidence is explicitly separated from third-party exhibit authorship.

## Experience

- Inspect, explode, isolate, hide, and search 62 actual source-mesh assemblies across four models.
- Orbit, zoom, switch viewing angles, and choose daylight or studio lighting.
- Locally hosted assets/fonts, Meshopt geometry, WebP textures, demand rendering, capped DPR, lazy 3D code and models.
- Stage-first responsive layout, keyboard controls, reduced motion, failed-model recovery, WebGL and no-JavaScript fallbacks.
- Resume-backed Apple, Splunk, and EcoCar experience; interactive illustrative failover sandbox.
- Server rack and motherboard are credited preview images, not interactive geometry. Their Sketchfab archives require a signed-in download before conversion can proceed.

These are public visual assets, not Chibundu's hardware designs or a complete disassembly guide. No passport/headshot is used. See [model notes](docs/MODEL_NOTES.md) and [asset research](docs/ASSET_RESEARCH.md).

## Development

Requires Node 22.12+ (tested with Node 26) and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4175
npm run build
npm run verify:layout
```

Verification starts an isolated production preview on port 4276. Use `BASE_URL=https://example.com/ npm run verify:layout` for another target. On macOS it uses installed Chrome; elsewhere run `npx playwright install --with-deps chromium`. `TEST_CASE=mobile` runs one configuration. Screenshots and JSON results go to ignored `test-artifacts/collection/`.

The ten configurations cover desktop, laptop, tablet, mobile, small mobile, landscape, reduced motion, unavailable WebGL, a failed model request, and disabled JavaScript. All 62 selectable assemblies are exercised on desktop; all four models are exercised on mobile. Browser emulation is not a claim of physical-device testing or a measured 60 FPS guarantee.

## Asset Pipeline

The optimized GLBs are committed, so a normal build does not require Python, MuJoCo, network downloads, or source conversions.

```sh
node scripts/fetch-assets.mjs
python3 -m venv test-artifacts/asset-venv
test-artifacts/asset-venv/bin/python -m pip install -r scripts/asset-requirements.txt
test-artifacts/asset-venv/bin/python scripts/convert-robots.py
node scripts/prepare-assets.mjs
```

Upstream revisions are pinned. `public/models/manifest.json` records optimized file hashes and source node names. Full original license texts are in `public/licenses/`; conversion and grouping details are in model notes. Runtime never loads textures, fonts, decoders, or models from third-party CDNs.

## Publishing

Production: [chibunduawandu.com](https://chibunduawandu.com). Keep the current hostname and SSL configuration.

`scripts/deploy-hostinger.sh` requires `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USER`, `HOSTINGER_PATH`, and optionally `HOSTINGER_KEY`. It checks the existing SSH known-hosts entry, backs up the site outside the document root, uploads only release files, retains old hashed assets, and atomically replaces `index.html` last. No `--delete`, DNS changes, or certificate changes are used. Restore the backup's index and overwritten public files for rollback.

The GitHub workflow builds and verifies each main push. Automatic deployment is opt-in via repository variable `HOSTINGER_DEPLOY_ENABLED=true` and secrets `HOSTINGER_SSH_KEY`, `HOSTINGER_KNOWN_HOSTS`, `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USER`, `HOSTINGER_PATH`. Verify the host key out of band; never commit credentials. With no secrets configured, CI tests run but deployment is skipped.

The contact CTA opens an email composer; it does not fabricate a sent-message state. The pre-existing Hostinger PHP endpoint is left untouched by the release allowlist. The current PDF was compiled from the supplied TeX using a temporary compatibility/layout-adjusted copy; the original Downloads file is unchanged.
