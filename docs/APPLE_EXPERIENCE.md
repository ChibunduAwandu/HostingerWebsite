# Apple experience as the centerpiece

September 12, 2026. Local implementation, not a publication record.

## Content and hierarchy

The primary introduction CTA, main work navigation, and experience index lead to the featured Apple section, which now precedes the general 3D lab. Both `#engineer` and the existing `#work-apple` deep link resolve to this case study. Splunk and EcoCar remain in a separate earlier-experience section. The social preview also features the Apple diagram rather than a public car asset.

Source: the user-supplied **Chibundu Awandu Resume.tex**, last updated June 23, 2026. Career claims are self-reported, not independently verified employer records. No passport/headshot, internal screenshots, confidential documentation, employer assets, or invented testimonials were used. No new external asset or API dependency was introduced.

The reported achievements remain distinct:

- Five production synchronous/reactive streaming AI API endpoints, supporting conversational AI, autofill, and summarization. The five numbered ports are visual placeholders, not endpoint names.
- Roughly 100 sequential database round-trips reworked into bulk operations. This is a database-work reduction, not a 100x speedup or a published latency benchmark.
- Atomic per-record claims, locale-batched downstream calls, and a live-traffic-driven circuit breaker; duplicate processing eliminated across scaled pods.
- Three consumer applications served by a configuration-driven response-building codebase. Three applications are not asserted to map one-to-one to the three AI capabilities.
- First team service on Java 25 / Spring Boot 4, ten build/runtime/security/CI failures resolved, and reusable scaffolding.
- Configuration profiles supporting legacy/new authentication pipelines across concurrent release trains, and a same-day advisor-blocking outage fix.
- A separate identity-endpoint migration across four services in five days with zero downtime. This is not a diagram of the authentication rollout or the separate AI-assisted three-service framework upgrade.
- OAuth2/structured logging for per-tenant observability, and an organization-wide multi-server MCP talk.

## Interactive explanation

**AI platform:** manually advance an example through ready, accepted, partial/waiting, and complete states. Streaming reveals a partial result before completion; synchronous delivery waits for a complete response. Reset or changing mode clears the trace. MongoDB is shown as a persistence relationship, not a measured execution sequence.

**Distributed processing:** a 100-cell visual contrasts repeated operations with bulk work. Three illustrative workers compete for one browser-local record. The first owner persists until reset; later claims produce a readable rejection. This is not a replica of distributed database coordination, scheduling, leasing, or failure recovery.

**Platform delivery:** choose a legacy/new profile to select an illustrative branch from the same entry point. No real commands, credentials, endpoint names, topology, or release schedules are exposed. The four-service/five-day/zero-downtime fact is explicitly separated below the diagram.

The diagrams are semantic HTML/CSS, not another canvas. Their state remains usable without WebGL, and they do not transmit requests to a server. The personal Three.js lab and its lazy loading are preserved.

## Design and accessibility

Warm paper and graphite continue the existing portfolio language. A large typographic Apple heading, open metric row, and indexed story tabs establish hierarchy. Opaque node surfaces sit over a subtle technical grid, with restrained offset shadows distinguishing the backend boundary. Color is not the sole indicator: tabs have selected semantics and an underline; worker ownership and deployment profiles have text and check marks.

Controls have a 44 px minimum project target and visible keyboard focus. Story tabs use roving focus with Left/Right/Home/End navigation. Discrete results are exposed as status messages. There is no autoplay or decorative animation in the Apple section. Container queries reflow diagrams based on available width and root text size, including the synchronous response label that initially overflowed at 200% text size.

Measured solid-color contrast ratios: secondary text on the diagram board **5.64:1**, secondary text on the backend node **8.54:1**, claim-rejection text **7.21:1**, focus green on the board **6.86:1**, and worker borders on paper **3.01:1**. Disabled-control text retains **4.70:1** even though disabled controls are exempt from minimum contrast.

The JavaScript-disabled page includes the main Apple outcomes and resume access. Detailed source boundaries remain visible below the interactive case study and in its captions.

## Verification

Final local result: production build passed, all **45 Apple section scans** and **56 whole-page scans** reported zero automated violations, and all **nine lab plus ten collection** functional configurations passed. The Apple scans returned no incomplete axe checks; incomplete contrast checks elsewhere in the full page remain documented rather than suppressed. Actual screenshots of desktop, mobile, processing, and delivery states were visually reviewed. All final test commands exited successfully.

Run `npm run build`, `npm run verify:apple`, `npm run verify:a11y`, `npm run verify:lab`, and `npm run verify:layout`. The Apple suite starts its own production preview on port 4279 and retains screenshots, axe violations, incomplete checks, and pass IDs under ignored `test-artifacts/apple/`.

The nine Apple configurations are desktop 1440 px, tablet 768 px, mobile 390 px, reflow 320 px, 200% root text size, increased text spacing, reduced motion, forced colors, and unavailable WebGL. Each exercises all three stories, response completion/reset/mode changes, all three workers winning and rejecting later claims, both migration profiles, arrow/Home/End focus, minimum targets, text overflow, node/narrative separation, browser errors, and absence of network writes. Five states per configuration receive section-scoped axe scans with no rule exclusions. The existing whole-page suite remains separate and has no region exclusions.

Browser emulation uses Chrome on macOS. Automated checks do not constitute WCAG certification or physical-device testing. Native browser zoom, VoiceOver/NVDA, actual high-contrast themes, Safari, Firefox, and physical iOS/Android devices still need human verification. No production push, deployment, DNS change, or SSL change is part of this implementation.

Two otherwise-passing runs exposed a Chrome teardown hang. The owned-browser helper now releases only its own child-process pipes after that process exits, allowing Playwright's close/cleanup sequence to finish when Chrome helpers have inherited a pipe. No user browser, dev server, or unrelated process is closed by this helper.
