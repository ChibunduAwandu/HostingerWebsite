# Employer-facing design and accessibility

September 12, 2026. Local redesign; this document does not indicate a GitHub push or Hostinger release.

The subsequent [featured Apple case study](APPLE_EXPERIENCE.md) now precedes the lab and adds 45 section-specific accessibility scans across nine configurations. The 56 whole-page scans and 19 lab/collection configurations described here were rerun successfully with that case study. Both suites preserve incomplete checks rather than treating automation as certification.

## Direction

The portfolio should communicate who Chibundu is, what he has built, and how to contact him before asking a visitor to operate an interactive scene. The opening now gives his name, Apple role, a concrete engineering summary, a resume link, and direct links to Apple, Splunk, and EcoCar experience. The 3D lab is explicitly a personal project, not evidence of employer infrastructure or original hardware authorship.

The visual language is a restrained engineering journal: warm paper, graphite, muted green, and amber reserved for controls and state. Manrope handles identity, body copy, and controls. A single upright serif title distinguishes the experimental lab; monospace is limited to technical metadata. Repeated italic slogans, volume labels, ornamental asterisks, tiny text over the canvas, and the defensive "pretty interface" heading were removed. There are no invented testimonials, client logos, AI-generated portraits, or passport imagery.

Body copy is generally 16 px at the default root size; primary controls are 14 px and supporting labels 12 px. Relative units allow text enlargement. The dense component inspector receives the same control/metadata floor rather than shrinking further on mobile.

## Design-tool availability

Adobe's mandatory initialization and font recommendation tools were attempted with a generic portfolio typography brief. Both returned `UNAUTHORIZED` and require the user to connect Adobe. No document, resume, or image was uploaded. Canva's design-feedback skill was inspected, but it operates on Canva designs; it is not a website accessibility scanner. No plugin critique or plugin-approved typography is claimed. The implemented choices are based on direct visual inspection, WCAG guidance, and browser measurements.

## Contrast

Calculated sRGB relative-luminance ratios for the solid design tokens:

| Use | Foreground | Background | Ratio |
| --- | --- | --- | --- |
| Primary text on paper | `#252b27` | `#f4f4ed` | 13.08:1 |
| Secondary text on paper | `#515f54` | `#f4f4ed` | 6.10:1 |
| Secondary text on education strip | `#515f54` | `#e9eddf` | 5.66:1 |
| Lab primary text | `#edf0df` | `#202b29` | 12.60:1 |
| Lab secondary text | `#c0cdc3` | `#202b29` | 8.87:1 |
| Lab amber labels / focus ring | `#f6b579` | `#202b29` | 8.20:1 |
| Lab control boundary | `#89968c` | `#202b29` | 4.73:1 |
| Selected surface button | `#223228` | `#dce6d1` | 10.47:1 |

The baseline scan found two education/research paragraphs at 4.34:1. The baseline inspector also used translucent labels at 3.69-4.24:1. Those styles are corrected. Selected-button hover states have explicit foreground/background pairs rather than inheriting an incompatible global hover color.

Normal text targets at least 4.5:1; large text at least 3:1, following [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Interactive boundaries use a 3:1 target. Decorative dividers are not treated as controls. The 44 px control target is a project design standard, not a claim that WCAG 2.2 AA mandates 44 px; [AA target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) uses a different threshold and exceptions.

## Interaction and semantics

- The first keyboard link skips the entire lab to a focusable work section. Resume access is next in that reading path.
- Chapter tabs precede the stage and panel in DOM and visual order, with arrow/Home/End navigation and correct tab-panel semantics.
- All essential simulation inputs have HTML button/range equivalents. The canvas is not the only way to operate the study.
- Sliders expose meaningful value text; rapid timeline percentage updates are not live-announced. Discrete simulation states remain available as status text.
- Pausing uses a stable toggle label and pressed state. Reduced-motion users receive an explanation and manual chapter/timeline controls.
- Native dialog Escape dismissal and return focus are verified. Scrollable component rows have inset focus outlines to avoid clipping.
- Forced-color mode uses system text, link, button, and focus colors. Selected states retain outlines/underlines rather than relying on color alone.

## Verification

Final local result: TypeScript/Vite build passed; all 56 accessibility scans reported zero automated violations; all nine lab and ten collection configurations passed. The production dependency audit reported zero known vulnerabilities. Browser teardown uses an owned test process, including the final JavaScript-disabled context, so completed checks do not hang during Chrome shutdown.

Run `npm run build` followed by `npm run verify:a11y`. The suite starts an isolated production preview on port 4278 and uses axe-core with WCAG 2 A/AA, 2.1 A/AA, 2.2 AA, and best-practice tags. No rules or page regions are excluded. `CASE=mobile` selects one configuration; `BASE_URL` selects another server.

Seven configurations: 1440 px desktop, 390 px mobile, 320 CSS px reflow, 200% root text size, increased text spacing, reduced motion, and forced colors. Eight scans per configuration cover initial perception, selected hover, failed-worker state, robot end pose, the component explorer, dark studio mode, isolated-part hover, and the source dialog. Additional assertions check 44 px major control targets, horizontal overflow, text/control clipping, stage/console separation, skip-link focus, tab keyboard behavior, range value text, and dialog focus restoration.

The [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) informs the 320 CSS px check. Root-font enlargement is not a claim of native browser zoom or an OS text-scaling test.

Reports and screenshots are generated under ignored `test-artifacts/accessibility/`. The GitHub workflow retains them alongside the existing nine-configuration lab and ten-configuration collection regression artifacts. The social preview is a screenshot of the real app with a capture-only layout, not a fabricated render.

## Remaining human checks

Automated scans are not WCAG certification. Axe can leave contrast checks incomplete for the chapter underline, subtle section gradient, and offscreen rows inside the component scroller. These are retained in reports rather than silently discarded; solid token ratios and visual inspection supplement them. VoiceOver/NVDA reading order, physical iOS/Android devices, real Windows high-contrast themes, and native zoom still need human testing. Career outcome claims remain sourced to the supplied resume, not independently verified employer records.
