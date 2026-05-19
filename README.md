# Chibundu Awandu Interactive Lab

Immersive personal portfolio site built as a single 3D world with React, Vite, Three.js, React Three Fiber, Drei, GSAP, and Tailwind CSS.

## Included

- Six navigable stations: hero, about, AI systems, market lab, vision, and contact
- Fixed holographic navigation with camera transitions
- Real PDF resume linked from `public/Chibundu_Awandu_2026_Resume.pdf`
- WebGL fallback page for unsupported environments
- Hostinger-friendly static build config via `vite.config.ts` with `base: "./"`

## Local run

This environment did not have `npm`, `pnpm`, `yarn`, or `bun` installed, so dependencies were not installed here.

Once a package manager is available:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Deploy to Hostinger

1. Build locally with `npm run build`.
2. Open Hostinger hPanel.
3. Go to `Websites` -> `chibunduawandu.com` -> `Dashboard` -> `File Manager`.
4. Upload the contents of `dist/` into `public_html/`.
5. If the Hostinger default page is still visible, remove the placeholder `index.php` or default `index.html` that Hostinger created.
6. In Hostinger SSL settings, confirm HTTPS is reissued and active if the existing certificate is stale.

## Suggested next pass

- Add a real profile image instead of the current `CA` monogram node
- Wire the contact form to Formspree, Resend, or a small backend endpoint
- Add compressed custom textures and a road video loop for the vision scene
- Hook deploys to GitHub Actions or Hostinger FTP automation
