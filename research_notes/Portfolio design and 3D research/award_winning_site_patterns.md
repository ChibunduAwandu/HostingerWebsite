# Award-Winning Site Patterns: Developer Portfolios, Product Marketing Sites, and Purposeful 3D

> Research note on method: WebFetch and curl could not reach awwwards.com, tympanus.net (Codrops), github.blog, or stripe.com from this environment (DNS failure or proxy 403). Every finding below comes from search-engine excerpts of those pages, not full reads. Where I added detail from prior knowledge (pre-2026), it is marked **[prior knowledge, unverified here]** and kept to Inferences or Gaps. Treat award thresholds and exact dates as needing a check against the live Awwwards pages.

## 1. Which developer/creative-technologist portfolios won Awwwards/FWA/CSSDA in 2024–2026, and what patterns recur?

### Takeaway
Recent award-winning individual portfolios are mostly creative-developer sites built on Three.js / React Three Fiber + GSAP (often with Blender assets), and many are documented in Codrops case studies. The best-known engineer-adjacent example is Bruno Simon's rebuilt driveable-car portfolio (2025–26, WebGPU/TSL). In 2025 Awwwards gave Developer Site of the Year to a browser game (Messenger), not a portfolio. That shows the developer jury rewards technical craft in real-time 3D, not personal branding.

### Cited Findings
**Awwwards portfolio-category winners (late 2025 / early 2026)**
- Awwwards' portfolio-winners listing shows these 2025 Site of the Day (SOTD) portfolios: Elliott Mangham (SOTD Dec 2, 2025, with Developer Award and Portfolio Honors), Artiom Yakushev (SOTD Dec 27, 2025), MAX MILKIN Portfolio (SOTD Dec 13, 2025), Olha Lazarieva (SOTD Oct 2, 2025). Studio sites in the same list include Phantom.Land (Jun 2, 2025), Studio Null (May 2, 2025) and Fiddle.Digital (Mar 3, 2025). The listing mixes studios and individuals. — [Awwwards: Best Web Portfolios](https://www.awwwards.com/websites/winner_category_portfolio/)
- The same listing shows Bruno Simon's portfolio with a Site of the Month award, January 2026. A separate search found no confirmation of a SOTM for the new version, so this needs a direct check. — [Awwwards portfolio winners](https://www.awwwards.com/websites/winner_category_portfolio/)
- Other listed examples: "Creative Developer Portfolio" (Honorable Mention), "Portfolio 25'" (Honorable Mention), "AW Portfolio" (SOTD). — [Creative Developer Portfolio](https://www.awwwards.com/sites/creative-developer-portfolio-2); [Portfolio 25'](https://www.awwwards.com/sites/portfolio-25); [AW Portfolio](https://www.awwwards.com/sites/aw-portfolio)

**Bruno Simon (bruno-simon.com): the reference engineer portfolio**
- First launched in 2019 as a Three.js world where you drive a red car and crash into things. He rebuilt it about five years later "for the WebGPU era", kept the driving concept, and used the project to practise TSL (Three.js Shading Language, i.e. shaders written in JS). The Awwwards case study is dated Mar 11, 2026. — [Awwwards: Bruno's portfolio case study](https://www.awwwards.com/brunos-portfolio-case-study.html)
- The code and Blender files are reported as open source (MIT, music CC0). The site has achievements, secrets, and a visitor-message feature. This comes from a secondary aggregator. — [GeekNews](https://news.hada.io/topic?id=24963)

**Developer Site of the Year 2025 and Site of the Year 2025**
- Awwwards' 2025 annual winners list **Messenger** as Developer Site of the Year (54 votes) and **Lando Norris** as Site of the Year (43 votes) and Users' Choice (596 votes). — [Awwwards Annual Awards Winners](https://www.awwwards.com/annual-awards/winners); [Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/)
- Messenger is a 2025 multiplayer browser game by Vicente Lucendo and Michael Sungaila, published by Abeto. It is built on WebGL/Three.js with Houdini and Blender models. The tech-stack detail comes from a forum post. — [Wikipedia: Messenger](https://en.wikipedia.org/wiki/Messenger_(video_game)); [TechEnclave](https://techenclave.com/t/a-cool-little-browser-game-messenger/429835)
- Lando Norris (by OFF+BRAND): SOTD Nov 17, 2025, score 8.18/10. Design features include blob-like reactive overlays following the cursor across the hero, neon accents drawn from his helmet design, and a modular split between "On Track" and "Off Track" content. — [Awwwards: Lando Norris](https://www.awwwards.com/sites/lando-norris); [DesignRush](https://designrush.com/best-designs/websites/lando-norris-website-design)

**Codrops case studies of award-recognized portfolios (2025–2026)**
- Stefan Vitasović portfolio 2025 (Mar 2025): Three.js + React Three Fiber shader effects. He is an Awwwards juror and Lead Creative Developer at 14islands. — [Codrops](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
- Tomasz Szmajda (Jun 2026): "a 3D portfolio built without a single 3D model". It uses flat planes in Three.js/R3F and won a GSAP SOTD, an FWA of the Day and an Awwwards Honorable Mention. — [Codrops: Sketching the Impossible](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)
- Joseph Santamaria (Apr 2026): a scroll-driven 3D world "with something to say". Stack is Three.js, GSAP, WebGL and Blender, with notes on compressed textures and mobile performance. — [Codrops: More Than a Portfolio](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- Roman Jean-Elie (Nov 2025): Next.js + Three.js/R3F + GSAP, with a fold effect and MorphSVG. — [Codrops: Letting the Creative Process Shape a WebGL Portfolio](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)
- Merouane Bali (Jan 2025): a Blender-to-Three.js portfolio focused on performance challenges. — [Codrops: The Journey of Creating a 3D Portfolio](https://tympanus.net/codrops/2025/01/21/the-journey-of-creating-a-3d-portfolio/)
- Robin Payot developer spotlight (Jun 2025): contributor to multiple Awwwards/FWA winners and an FWA juror. — [Codrops](https://tympanus.net/codrops/2025/06/12/developer-spotlight-robin-payot/)
- Codrops portfolio tag index (more case studies): [tympanus.net/codrops/tag/portfolio](https://tympanus.net/codrops/tag/portfolio/); [case-study tag](https://tympanus.net/codrops/tag/case-study/page/6/)

**Non-award but widely cited engineer portfolios (contrast set)**
- Brittany Chiang (brittanychiang.com), senior frontend engineer: dark background, sticky left-side nav to jump between Experience, Projects and Writing, no imagery, a cursor-following glow, and a switcher to view older versions of the site. — [Hostinger](https://www.hostinger.com/ca/tutorials/web-developer-portfolio/); [WeAreDevelopers](https://www.wearedevelopers.com/magazine/561-web-developer-portfolio-inspiration-and-examples-march-2025)
- Paco Coursey (paco.me): listed as a design engineer at Linear. — [Hostinger](https://www.hostinger.com/ca/tutorials/web-developer-portfolio/)

### Inferences
- Recurring patterns in the 2025–26 winners: (a) a single strong concept carries the whole site (driving world, flat-plane sketch world, a "world with something to say"); (b) R3F + GSAP + Blender is the de facto stack; (c) performance engineering (compressed textures, mobile fallbacks) is written up as part of the story, which matters for a developer award; (d) the authors publish a Codrops write-up, which works as a second portfolio piece showing engineering judgment.
- For a backend/AI/infra engineer, Messenger winning Developer SOTY suggests the developer jury values real-time systems craft: networking, state sync, performance. A portfolio whose 3D *demonstrates a system* (data flow, inference pipeline, threat model) fits that value better than ornamental 3D does.
- **[prior knowledge, unverified here]** Common hero treatments on these sites: an oversized display name or statement, a WebGL canvas behind or under the type, a custom cursor, a minimal fixed nav (name, Work, About, Contact), and an email or "copy email" contact rather than a form. Case studies usually run hero media → role/year/stack metadata row → problem → process → outcome → next-project link.

### Gaps
- Could not open individual Awwwards entry pages to confirm which SOTD winners are individual *engineers* versus designers or studios, or to read their jury score breakdowns.
- Could not verify FWA or CSS Design Awards developer-portfolio winners for 2024–26 beyond the Szmajda FWA of the Day. thefwa.com and cssdesignawards.com were not reachable or not surfaced by search.
- Could not confirm Bruno Simon's January 2026 SOTM independently of the category listing.
- No sourced details on rauno.me, leerob.com or other design-engineer portfolios. Search returned nothing on them.

## 2. Product marketing sites (Apple, Linear, Vercel, Stripe, etc.): typography, scroll storytelling, bento grids, motion

### Takeaway
Apple's signature technique is a **sticky/pinned stage inside a tall scroll container**, with scroll progress mapped to a canvas image sequence or JS-advanced video, so the product "assembles" as you scroll. This can now be partly reproduced with native CSS scroll-driven animations (`view-timeline` / `scroll-timeline`). Linear and Vercel define the "dev-tool aesthetic": near-achromatic dark or light palettes, one accent color, a grotesk (Inter / Geist) with tight negative tracking at display sizes, a mono face for labels and code, and visible grid or blueprint lines.

### Cited Findings
**Apple scroll-scrubbed product reveals**
- Apple's AirPods and MacBook pages are described as drawing pre-extracted frames onto a `<canvas>` on scroll rather than playing a `<video>`. Scroll progress maps to a frame index and the frame is redrawn on each tick. Third-party write-ups, not Apple docs. — [mejba.me](https://www.mejba.me/blog/3d-scroll-animations-ai-claude-code); [skills.sh image-sequence-scrubbing](https://www.skills.sh/avnehsbhatia/ultraui/image-sequence-scrubbing)
- Why canvas rather than video: setting `video.currentTime` is asynchronous and lags scroll input, while drawing an already-decoded image is effectively instant. One library comparison rates video scrubbing as "janky" and frame sequences as 1:1. — [skills.sh](https://www.skills.sh/avnehsbhatia/ultraui/image-sequence-scrubbing); [react-scroll-media README](https://cdn.jsdelivr.net/npm/react-scroll-media@1.1.0/README.md)
- Structure: a tall scroll container with a sticky/pinned stage keeps the canvas fixed while the page scrolls. — [react-scroll-media README](https://cdn.jsdelivr.net/npm/react-scroll-media@1.1.0/README.md)
- Practical tactics:
  - Preload the current frame first, then nearby frames. — [tessl.io scroll-scrubbed-visual-sequence](https://tessl.io/registry/skills/github/MengTo/Skills/scroll-scrubbed-visual-sequence)
  - Use WebP rather than JPEG; one author roughly halved a 14MB payload. — [mejba.me](https://www.mejba.me/blog/3d-scroll-animations-ai-claude-code)
  - Cap devicePixelRatio at 2 and redraw only when progress changes. — [tessl.io](https://tessl.io/registry/skills/github/MengTo/Skills/scroll-scrubbed-visual-sequence)
- Common stack for recreations: GSAP ScrollTrigger + Lenis smooth scroll. — [Webflow GSAP AirPods sequence](https://webflow.com/made-in-webflow/website/gsap-video-animation-on-scroll)
- Vision Pro page: a two-stage reveal. Stage 1 is hardware layers rising apart. Stage 2 is the device flipping to reveal the eyepieces, done as a video advanced by JS on scroll, with the headset held in view by sticky positioning. A CSS-only rebuild uses sticky containers, scroll-timeline-driven background layers, and keyframed opacity/scale/translate, with `background-position: bottom center` and `background-size: cover/contain` so the layers stay anchored. The original appears to be a CSS-Tricks article, but the copies found were on low-quality mirror domains. — [Framer University](https://framer.university/resources/apple-vision-pro-scroll-animation); [mirror of CSS-Tricks article](https://emeditor.it.com/a/7494.html)
- Browser support for CSS scroll-driven animations is reported inconsistently: Chrome/Edge full, Firefox lagging, Safari disputed. Verify on caniuse/MDN. — [mirror](https://casinolinks.it.com/a/5744.html)
- Builder.io (Oct 2025), "Create Apple-style scroll animations with CSS view-timeline": a sticky video container pinned while text scrolls, with stacked absolutely positioned media inside. — [Builder.io](https://www.builder.io/blog/view-timeline)
- Small screens: one source says Apple often swaps the animation for a static image on small screens. Unconfirmed. — [mirror](https://emeditor.it.com/a/7494.html)

**Linear (linear.app)**
- These are third-party design-system extractions, not official docs. Type is Inter Variable at weights from 300 to 590, with 510 as the "signature" medium weight. Display sizes (about 48–72px) use aggressive negative letter-spacing. Berkeley Mono is used for code and labels. The palette is near-achromatic dark with a single indigo accent (#5e6ad2). — [jsDelivr Linear design reference](https://cdn.jsdelivr.net/npm/oh-my-opencode@4.18.2/dist/skills/frontend/references/design/linear.app.md); [open-design.ai](https://open-design.ai/plugins/design-system-linear-app/)
- Inter (by Rasmus Andersson) has Display and Tight variants. — [Wikipedia: Inter](https://en.wikipedia.org/wiki/Inter_(typeface))

**Vercel (vercel.com)**
- Official Geist design system: Geist Sans and Geist Mono. Vercel itself describes the grid as "a core part of the Vercel aesthetic." — [Vercel Geist font](https://vercel.com/geist/font); [Geist components](https://vercel.com/design/components)
- Geist Pixel (Feb 2026): a bitmap-style variant built on Geist Sans/Mono and reinterpreted through a strict pixel grid. — [Vercel blog: Introducing Geist Pixel](https://vercel.com/blog/introducing-geist-pixel)
- "Blueprint grid" aesthetic: a subtle background grid behind hero content. Rauno Freiberg's breakdown at rauno.me/craft/vercel is credited, secondhand. Third-party notes cite tight negative tracking on Geist display text and shadow-based borders. — [Setproduct: Blueprint Grid](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design); [GridStamp DESIGN.md](https://cdn.jsdelivr.net/npm/gridstamp@1.4.0/DESIGN.md)

### Inferences
- The engineer's current "Apple/Notion-like" site is closest to the Linear/Vercel register. The upgrade path is (1) a stricter type system: one grotesk with negative tracking at display sizes plus a mono for metadata like stack, latency, year; (2) visible structure such as grid lines and labelled sections, so the page reads like a spec; (3) one pinned, scroll-scrubbed "system reveal" in the Apple style, used once and not everywhere.
- Prefer CSS scroll-driven animations with a JS/GSAP fallback for a single pinned section over global smooth-scroll hijacking (see Q4).
- **[prior knowledge, unverified here]** Bento grids (Apple's feature-summary tiles, Linear/Raycast feature sections) are mixed-size cards each holding one claim plus one visual. They work well for "capabilities at a glance" (CV, infra security, AI systems). Stripe's homepage is known for animated gradient meshes (WebGL) and dense, carefully set copy. Raycast and Cash App use bold product-render heroes. None of these were verified this session.

### Gaps
- No primary Apple engineering source. Apple does not publish how its product pages work, so all Apple claims come from reverse-engineering write-ups.
- No official Linear redesign blog post was found (searches returned only third-party extractions). Raycast, Cash App, Notion and Stripe homepage techniques were not researched in sources this session because of the tool budget and fetch failures.
- Could not read the original CSS-Tricks Vision Pro article, only mirrors.

## 3. How award-winning sites make 3D purposeful (3D that explains vs. ornament)

### Takeaway
The canonical "purposeful 3D" examples render **real data or real mechanisms**. The GitHub globe shows live pull requests. Stripe's globe conveys global payment reach. Bartosz Ciechanowski's explainers let you rotate and slice a mechanism to understand it. In each, the 3D answers a question the visitor has, interaction reveals information, and the build is tuned to perform well (no textures, density scaled to device).

### Cited Findings
- **GitHub globe (github.com homepage, 2020, older classic):** WebGL via three.js, fed by a JSON file of recent pull requests. It uses no textures, only four lights, about 12,000 small circles for land regions, and a custom halo shader. Circle density varies with machine performance. The stated goal was good performance on all devices across many iterations. — [GitHub Blog: How we built the GitHub globe](https://github.blog/engineering/engineering-principles/how-we-built-the-github-globe/)
- **Stripe globe (stripe.com, 2020, older classic):** a 1:40-million-scale interactive Earth. It aims to convey the interconnected internet economy and Stripe's global reach, "while acknowledging how much ground remains". Design goals were to inspire awe, invite exploration, and conceal details for discovery. A globe was chosen over a map because it shows relative size and shape more accurately and spinning it is satisfying. Built on Three.js because a custom engine was out of scope, starting from a Photoshop mockup. — [Stripe Blog: To design and develop an interactive globe](https://stripe.com/blog/globe)
- **Bartosz Ciechanowski, "Mechanical Watch" (ciechanow.ski, 2022, older classic):** interactive 3D models and animations of a movement (mainspring, gear train, escapement). Readers drag to change the viewing angle and use sliders to "peek inside". It renders in real time with hand-written JS (base.js, watch.js). The site archive holds more mechanical explainers. — [Pixel Envy](https://pxlnv.com/linklog/mechanical-watch-movement/); [feedbagel summary](https://feedbagel.com/post/mechanical-watch); [HN thread mirror](https://hn.nuxt.dev/item/48553550)
- **Josh W. Comeau (joshwcomeau.com):** articles and interactive tutorials on CSS, SVG and React. Embedded interactive widgets illustrate each concept. Build details were not found. — [Toolradar](https://toolradar.com/companies/joshwcomeau-com)
- **Tomasz Szmajda (2026):** shows a "3D" feel can come from flat planes without any 3D models, which cuts asset weight. — [Codrops](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)
- **Joseph Santamaria (2026):** frames the scroll-driven 3D world as carrying a message ("with something to say") and documents texture compression and mobile tuning. — [Codrops](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)
- **Three.js/WebGPU context:** WebGPU is reported as supported in all major browsers, including Safari on iOS since Sept 2025. Three.js r171 is described as making WebGPU production-ready with zero-config imports. Vendor blog; verify against release notes. — [Utsubo: Three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed)

### Inferences
- Heuristic for this portfolio's Three.js lab: each 3D piece should (1) visualize a real artifact from the engineer's work, (2) have one interaction that reveals information, (3) degrade to a static image or SVG with the same information, and (4) carry a one-line caption saying what you are looking at. Possible work artifacts are a CV detection pipeline (bounding boxes and feature maps on a point cloud or image plane), a request path through an infra or security boundary (packets crossing trust zones, with blocked attacks shown), or an embedding-space or RAG retrieval visualization.
- The GitHub approach of real data, no textures and density scaled to device is the model to copy for engineering credibility. Writing up the performance budget becomes content in itself.
- Ciechanowski/Comeau-style explainers (scrubbable diagrams inside long-form writing) are probably the strongest fit for a backend/AI engineer. They show depth of understanding, which hiring managers value (Q5), and still earn craft recognition.

### Gaps
- Could not read the full GitHub post's later sections on quality tiers, pixel-ratio capping or fallbacks.
- No sourced technical write-ups found for Vercel's or Linear's homepage visuals (e.g., Vercel's prism/triangle WebGL or Linear's 3D hero renders).
- Could not confirm whether Ciechanowski uses WebGL or Canvas2D. Sources only confirm custom JS.

## 4. Judging criteria and common pitfalls (scroll-jacking, loaders, performance, accessibility)

### Takeaway
Awwwards reportedly weights Design 40%, Usability 30%, Creativity 20%, Content 10%. Design and usability make up 70% of the score, so an impressive 3D portfolio with long loaders, a broken mobile layout or no reduced-motion path loses points. Scroll-jacking is widely criticized as a usability and vestibular-accessibility harm.

### Cited Findings
- Weights: Design 40%, Usability 30%, Creativity 20%, Content 10%, judged by at least 18 jurors with the three scores furthest from the average discarded. From secondary sources; the official evaluation page was unreachable. — [Utsubo guide](https://www.utsubo.com/blog/award-winning-website-design-guide); [Hon Tran: Awwwards judging criteria](https://www.hontran.dev/blog/awwwards-judging-criteria)
- Thresholds conflict across sources: Honorable Mention at 6.5+, SOTD at about 8.0 average. Developer Award is described (unverified) as SOTD winners sent to a developer jury scored on Development Guidelines, with above 7 earning the award. — [Hon Tran](https://www.hontran.dev/blog/how-to-win-an-awwwards-site-of-the-day); [Utsubo](https://www.utsubo.com/blog/award-winning-website-design-guide)
- Usability covers "navigation, clarity, performance, responsiveness, accessibility". — [Hon Tran](https://www.hontran.dev/blog/awwwards-judging-criteria)
- A juror's view: a 6-second loader is a usability penalty, not art direction. Missing focus states, no reduced-motion path and poor contrast read as carelessness. A desktop-only site with a broken phone layout "caps at an Honorable Mention". Winning comes from "a clear concept, ruthless usability, and technical polish". — [Hon Tran: judging criteria](https://www.hontran.dev/blog/awwwards-judging-criteria); [Hon Tran: award-winning portfolio](https://www.hontran.dev/blog/how-to-build-an-award-winning-portfolio-site)
- Counterpoint: a Greenspector audit of Awwwards Mobile Excellence nominees found high usability scores even for sites with many accessibility errors (e.g., betterup.com). Juror usability scores are subjective and do not reliably reflect WCAG. — [Greenspector](https://blog.greenspector.com/en/analysis_sites_nominated_mobile_excellence_awwwards/)
- Mobile Excellence track criteria: Friendliness, Performance, Usability, PWA. — [Greenspector](https://blog.greenspector.com/en/analysis_sites_nominated_mobile_excellence_awwwards/); [Google Developers Blog (2017)](https://developers.googleblog.com/en/introducing-the-mobile-excellence-award-to-celebrate-great-work-on-mobile-web/)
- Scroll-jacking criticism:
  - Robin Rendle calls scroll-hijacking sites "the usability equivalent of nails on a chalkboard". — [robinrendle.com](https://robinrendle.com/notes/scrolljacking)
  - Critics say it overrides expected browser behaviour, ignores accessibility norms, and penalizes users who skim. — [WebdesignerDepot](https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/)
  - Users with vestibular disorders and keyboard users can be blocked or disoriented if motion isn't optional. — [Red Sky Studios](https://redskystudios.co.uk/news/scroll-jacking-annoying-when-abused-delightful-when-done-right)
  - In Baymard's testing, scroll areas that hijack page scrolling caused "great annoyance". — [Baymard](https://baymard.com/blog/inline-scroll-areas)
  - Middle-ground views say it can work in context. — [Alvaro Trigo](https://alvarotrigo.com/blog/what-is-scroll-hijacking/); [HubSpot](https://blog.hubspot.com/marketing/scrolljacking-the-good-the-bad-the-ugly)

### Inferences
- Pitfalls checklist for this redesign:
  - No blocking loader; load 3D lazily after the main content.
  - Keep native scroll. If Lenis is used, keep it light and disable it under `prefers-reduced-motion`.
  - Pin at most one or two sections.
  - Give every WebGL scene a static fallback with the same information.
  - Keep visible focus states and WCAG-AA contrast.
  - Test at 375px.
- These choices also cost little against the 30% usability weight, which is where 3D-heavy portfolios most often lose points.

### Gaps
- The official Awwwards evaluation and Development Guidelines pages could not be read, so exact weights, thresholds and the developer-award rubric are unverified.
- No Nielsen Norman Group source on scroll-jacking surfaced.
- FWA and CSSDA judging criteria were not found.

## 5. What hiring managers value vs. what wins design awards — where they conflict

### Takeaway
Hiring reviewers want a few concrete case studies, scannable in about 30 seconds, that state the problem, the candidate's own role, the technical approach and trade-offs, and measurable outcomes. Award juries want concept, visual craft and novel interaction. The two conflict on load time, scannability and content density. They agree on polish, performance and clarity.

### Cited Findings
- Engineers are judged on GitHub repos, technical write-ups and production case studies. Case studies should cover problem, role, technical approach and measurable results. — [Fonzi: Engineering portfolio](https://fonzi.ai/blog/portfolio-for-engineer)
- Show 3–5 projects with context, role, tech stack and measurable outcomes. "Ship-focused case studies beat stack laundry lists." — [Foliox: Software engineer portfolios](https://foliox.me/portfolio-for/software-engineers)
- "Show decisions, not just deliverables. Include constraints and trade-offs." Unclear personal contribution on team projects is a common mistake. — [UX Design Institute](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/); [Designcase](https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/)
- The reviewer should understand the context "in under 30 seconds". — [Designcase](https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/)
- Offer a PDF or backup, because corporate firewalls block hosted portfolios more often than people expect. — [UX Design Institute](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/)
- Projects matter more than styling; design should "get out of the way". — [Scrimba](https://scrimba.com/articles/minimal-web-developer-portfolio-examples/)
- Personality can come from color and type rather than experimental layouts. — [Hostinger](https://www.hostinger.com/ca/tutorials/web-developer-portfolio/)
- On the award side, winning portfolios are concept-led 3D worlds (Bruno Simon's driveable world, scroll-driven worlds). — [Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html); [Codrops](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/)

### Inferences
- **Conflicts:**
  - Immersive-first heroes delay the content; reviewers want role and impact within 30 seconds.
  - Heavy WebGL hurts load on corporate laptops and VPNs, and may be blocked.
  - Game-like navigation hides the case studies.
  - Award copy is minimal (Content is only 10% of the score), while hiring needs dense, specific technical content.
- **Alignment:** both reward performance, clarity, accessibility and a coherent concept.
- **Resolution pattern for this portfolio:** a fast, text-first, Linear/Vercel-register landing page (name, role, three headline outcomes with numbers, links to case studies, resume PDF). The 3D lab sits behind an explicit "Lab" entry, with one purposeful, data-driven 3D or interactive diagram per case study that explains the system. Each case study follows problem → constraints → architecture diagram (interactive) → decisions/trade-offs → results → what I'd do next.
- Mind Apple confidentiality: reviewers want metrics, but an Apple engineer may need abstracted or anonymized systems. Interactive diagrams of a *generalized* architecture keep the depth without disclosure.

### Gaps
- No rigorous study (e.g., eye-tracking or recruiter surveys) on time spent per engineering portfolio. The "30 seconds" figure is a heuristic from design-hiring sources.
- Most hiring-manager sources are about UX/design portfolios. Backend/AI-engineer-specific evidence is thin and comes from vendor blogs (Fonzi, Foliox).
