# Design Decisions & Architecture

Notes on why things are built the way they are. Read this before refactoring anything.

---

## 1. Why Astro

The site is a portfolio. It doesn't need React state management, a virtual DOM, or client-side routing logic shipping 80KB of JavaScript just to render text and images.

**Astro gives us:**
- Zero JS by default. Pages are static HTML until you explicitly opt into interactivity.
- Component-based authoring (`.astro` files) without a framework runtime.
- View Transitions API for SPA-style page swaps — no router library needed.
- Build output is plain HTML/CSS/JS files. Deploy anywhere.

**What was rejected:**
- **Next.js** — Overkill. SSR, API routes, React hydration — none of that is needed for a portfolio.
- **Plain HTML** — Would work, but duplicating layouts and nav across pages is painful and error-prone.
- **SvelteKit** — Reasonable choice, but Astro's island architecture made more sense for a content-heavy site with minimal interactivity.

---

## 2. Performance & UX Hacks

### 2.1 The i18n Race Condition

**Problem:** Switching language (ES → EN or vice versa) caused the page to jump to the top, losing the user's scroll position.

**Why it happens:** The language switch is a full navigation to a different URL (`/` vs `/en/`). Astro's View Transitions try to handle this gracefully, but the new page has no memory of where you were scrolled to.

**Solution — two parts working together:**

1. The language links have `data-astro-reload`, which forces a native full-page reload instead of a View Transition swap. This avoids the SPA transition fighting with the scroll position.

2. Before navigating, an inline `onclick` saves `window.scrollY` to `sessionStorage`:
   ```html
   onclick="sessionStorage.setItem('langLockY', window.scrollY)"
   ```

3. A **blocking inline script in `<head>`** (runs before any rendering) reads that value back and force-scrolls to it on an interval until `window.load` fires:
   ```js
   const lockInterval = setInterval(() => {
     window.scrollTo(0, targetY);
   }, 10);
   ```
   After load, it clears the interval and removes the stored value.

**Why an interval?** Because the browser tries to restore its own scroll position during load, and a single `scrollTo` gets overridden. The interval brute-forces the correct position until the page is fully loaded.

> **Do not move or refactor this script.** It must stay in `<head>` as `is:inline` to execute synchronously before first paint. Moving it to a deferred module will break it.

---

### 2.2 WebGL Mobile Crash

**Problem:** Vanta.js (Three.js WebGL background) causes mobile browsers to freeze or crash when the user pinch-zooms. The GPU runs out of memory trying to render the 3D scene at an inflated resolution.

**Solution — three defense layers:**

1. **CSS fallback** (`global.css`):
   ```css
   @media (max-width: 768px) {
     #vanta-bg { background: #04081a !important; }
     #vanta-bg canvas { display: none !important; }
   }
   ```
   This fires immediately, no JS needed. Even if the script fails to load, the background is covered.

2. **JS kill-switch** (`Layout.astro`, inline script):
   ```js
   if (window.innerWidth < 768 || matchMedia('(pointer:coarse)').matches) {
     applyMobileFallback(el); // static CSS gradient
     return; // never call VANTA.NET()
   }
   ```
   Catches both small screens AND touch-only tablets that might have a wider viewport.

3. **Zoom kill-switch** (separate inline script):
   Monitors `devicePixelRatio`. If the user zooms past 125%, it adds `body.low-power-mode` which hides the Vanta canvas and disables all `backdrop-filter` effects via CSS.

**Why not just reduce Vanta's quality on mobile?** Because even at minimum settings, the WebGL context itself is the problem. The only fix is to not create it at all.

---

### 2.3 Asset Optimization

- All decorative images converted from PNG to WebP. Average size reduction: ~70%.
- Dual-image pattern for dark/light mode: two `<img>` tags stacked with CSS opacity toggle. No JavaScript image swapping.
- Fonts are self-hosted (no Google Fonts CDN call). Three families: Syne (headings), Manrope (body), JetBrains Mono (code/labels).

---

### 2.4 Theme System

- Theme state lives in `data-theme` attribute on `<html>`.
- A blocking inline script in `<body>` reads `localStorage` and sets the attribute **before first paint** to prevent FOUC (flash of unstyled content).
- The theme toggle button in the header just flips the attribute and saves to `localStorage`. Everything else reacts via CSS selectors:
  ```css
  [data-theme="light"] .some-element { ... }
  ```
- Vanta.js listens for theme changes via a `MutationObserver` on `data-theme` and swaps its color palette in real-time.

---

### 2.5 Graceful Degradation (No-JS Fallback)

**Problem:** When JavaScript is disabled, the website completely broke. Specifically:
- **Blank Page Syndrome:** All major page sections (Hero, About, Skills, Projects, Contact) defaulted to `opacity: 0` because they utilized the `.reveal` class for scroll-reveal animations, which depends entirely on JS scroll listeners to toggle visibility.
- **Broken Submissions:** The interactive contact form remained visible but became unusable because the submit event relies on client-side JS validation and a `fetch()` API request to the backend workers gateway. Submitting it statically would only refresh the page without sending any email.
- **Visual Glitches:** JS-only components (custom cursor dots, trailing outlines, dynamic back-to-top buttons) would remain stuck, unrendered, or floated awkwardly on screen.

**Solution — a complete, automatic No-JS fallback strategy:**

1. **CSS Overrides (`<noscript>` in `<head>`):**
   We injected a `<noscript>` tag within the head of `Layout.astro` containing global CSS overrides. If JS is disabled:
   - All `.reveal` classes are instantly set to `opacity: 1 !important` and `transform: none !important`, making the full site instantly visible and readable.
   - The interactive `#contact-form` is hidden (`display: none !important`).
   - Stuck interactive components like `#cursor-dot`, `#cursor-outline`, `.c-trail`, and `#back-to-top` are hidden completely.
   - The native browser cursor and hover indicators are fully restored (`cursor: auto` / `cursor: pointer`).
   - The header's position is adjusted to `relative` instead of `fixed` to allow normal static scrolling.

2. **Top-Level warning banner:**
   A `<noscript>` block inside the layouts displays a warning banner at the top of the webpage. This banner is styled using premium theme-aware glassmorphism (soft orange borders and background with high-contrast text matching the light/dark theme) and is localized into Spanish or English depending on the current route.

3. **Static Contact Path:**
   Within `Contact.astro`, the hidden `#contact-form` is replaced inside a `<noscript>` block with an amber warning panel that details the JS limitation and immediately directs the user to the direct email (`mailto:`) and social media anchors positioned directly below, keeping the layout fully functional and beautiful.

---

## 3. Mobile Menu Architecture

The mobile hamburger menu uses a `data-open` attribute pattern instead of toggling CSS classes on individual SVG icons:

- `#menu-toggle` button has `data-open="false"` by default.
- CSS controls which icon is visible:
  ```css
  #menu-toggle[data-open="false"] .menu-icon-bars  { display: block; }
  #menu-toggle[data-open="false"] .menu-icon-close { display: none;  }
  #menu-toggle[data-open="true"]  .menu-icon-bars  { display: none;  }
  #menu-toggle[data-open="true"]  .menu-icon-close { display: block; }
  ```
- JS only toggles the `data-open` attribute. No `classList` manipulation on SVG children.

**Why?** Astro's View Transitions can swap DOM nodes, which makes JS references to specific elements go stale. Data attributes on the parent are more resilient — CSS always resolves them from the current DOM.

---

## 4. What's Not Here (Yet)

The frontend is complete and sealed. What's planned next is a **backend API**:

- **Stack:** Hono.js on Cloudflare Workers.
- **Purpose:** Contact form processing, project data from a CMS or database, analytics without third-party trackers.
- **Integration:** The frontend will fetch from the API at build time (Astro's `fetch` in frontmatter) or at runtime via client-side `fetch` for dynamic features.

The frontend doesn't need to change to support this — it's already structured to receive data from external sources.
