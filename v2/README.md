# Azael's Portfolio — Frontend

Personal portfolio site. Built to be fast, light, and not annoying.

Live at: [portfolio-azaelrm.vercel.app](https://portfolio-azaelrm.vercel.app/en/)

---

## Tech Stack

| Layer        | Tool                        |
| ------------ | --------------------------- |
| Framework    | Astro 6 (static output)     |
| Styling      | Tailwind CSS v4             |
| Language     | TypeScript                  |
| 3D Background | Vanta.js (Three.js r134)  |
| Transitions  | Astro View Transitions API  |
| Fonts        | Syne, Manrope, JetBrains Mono (self-hosted) |

## Core Features

- **Static i18n (ES/EN)** — No runtime i18n library. Routes are `/` (Spanish) and `/en/`. Language detection is a compile-time Astro function. Zero client-side overhead.
- **SPA-like navigation** — Uses Astro's `<ViewTransitions />` for instant page swaps without a full reload. Still ships as a static MPA under the hood.
- **WebGL GPU kill-switch** — On mobile (`< 768px`) or touch-only devices (`pointer: coarse`), Vanta.js never initializes. A static CSS gradient takes its place. This prevents GPU crashes when users pinch-zoom and saves battery.
- **Theme toggle** — Dark/light mode with OS preference detection, `localStorage` persistence, and zero-flash on load (inline blocking script sets `data-theme` before first paint).
- **Custom cursor** — Dot + trailing ring with hover states. Auto-disabled on touch devices via `@media (hover: none)`.
- **Easter egg** — The 404 page. Go find it.

## Quick Start

```bash
# Clone and enter the project
git clone https://github.com/AzaelReyesMartel-1ASIR/portfolio-web.git
cd portfolio-web/v2

# Install dependencies
npm install

# Dev server (hot reload)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

Default dev server: `http://localhost:4321`

## Project Structure

```
v2/
├── src/
│   ├── components/     # Astro components (Header, Footer, cards, etc.)
│   ├── layouts/        # Layout.astro (single layout, handles <head> + Vanta)
│   ├── pages/          # Route files: index.astro, en/index.astro, 404.astro
│   ├── i18n/           # Translation strings (es.ts, en.ts) + utility functions
│   ├── scripts/        # Client-side TS: header, cursor, terminal, typewriter
│   └── styles/         # global.css (Tailwind config + custom properties)
├── public/             # Static assets: images, CV, favicon
└── astro.config.mjs
```

## Deployment

The output is fully static (`output: "static"` in Astro config). Deploy the `dist/` folder to any CDN or static host: Cloudflare Pages, Vercel, Netlify, GitHub Pages, a Raspberry Pi — it doesn't matter.

```bash
npm run build
# Upload dist/ to your host
```

## License

Personal project. If you want to fork the structure for your own portfolio, go ahead. Just swap out the content, don't pretend to be me.
