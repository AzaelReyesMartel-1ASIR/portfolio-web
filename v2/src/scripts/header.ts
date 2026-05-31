/* ──────────────────────────────────────────────
   header.ts — scroll state, mobile menu, theme
   ────────────────────────────────────────────── */

const SCROLL_OFFSET = 40;

// ── Scroll progress bar ──────────────────────
function updateScrollBar(progressBar: HTMLElement): void {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
}

// ── Header glass state ───────────────────────
function updateHeaderState(header: HTMLElement): void {
  if (window.scrollY > SCROLL_OFFSET) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// ── Back to top button ───────────────────────
function updateBackToTop(button: HTMLButtonElement): void {
  const isVisible = window.scrollY > 300;
  button.style.opacity = isVisible ? "1" : "0";
  button.style.transform = isVisible ? "translateY(0)" : "translateY(12px)";
  button.style.pointerEvents = isVisible ? "auto" : "none";
}

// ── Mobile menu ──────────────────────────────
function setupMobileMenu(
  menuBtn: HTMLButtonElement,
  mobileMenu: HTMLElement,
): void {
  if (menuBtn.dataset.initialized) return;
  menuBtn.dataset.initialized = "true";

  const setMenuState = (open: boolean): void => {
    mobileMenu.dataset.open = String(open);
    menuBtn.dataset.open = String(open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute(
      "aria-label",
      open ? "Cerrar menú de navegación" : "Abrir menú de navegación",
    );
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.dataset.open === "true";
    setMenuState(!isOpen);
  });

  mobileMenu.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

// ── Theme system ─────────────────────────────
type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  // Respect OS preference on first visit
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme, toggleBtn: HTMLButtonElement): void {
  const root    = document.documentElement;
  const iconMoon = toggleBtn.querySelector<SVGElement>("#icon-moon");
  const iconSun  = toggleBtn.querySelector<SVGElement>("#icon-sun");

  if (theme === "light") {
    root.setAttribute("data-theme", "light");
    // In light mode: show moon (clicking switches to dark)
    if (iconMoon) iconMoon.classList.remove("hidden");
    if (iconSun)  iconSun.classList.add("hidden");
    toggleBtn.setAttribute("aria-label", "Cambiar a tema oscuro");
  } else {
    root.removeAttribute("data-theme");
    // In dark mode: show sun (clicking switches to light)
    if (iconMoon) iconMoon.classList.add("hidden");
    if (iconSun)  iconSun.classList.remove("hidden");
    toggleBtn.setAttribute("aria-label", "Cambiar a tema claro");
  }
}

function setupThemeToggle(toggleBtn: HTMLButtonElement): void {
  if (toggleBtn.dataset.initialized) return;
  toggleBtn.dataset.initialized = "true";

  // Apply persisted / OS-inferred theme immediately
  const initial = getStoredTheme();
  applyTheme(initial, toggleBtn);

  toggleBtn.addEventListener("click", () => {
    const current: Theme =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    const next: Theme = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next, toggleBtn);
  });
}

// ── Init ─────────────────────────────────────
let _scrollListener: (() => void) | null = null;

export function initHeader(): void {
  const header       = document.getElementById("site-header");
  const progressBar  = document.getElementById("scroll-bar");
  const menuToggle   = document.getElementById("menu-toggle");
  const mobileMenu   = document.getElementById("mobile-menu");
  const backToTop    = document.getElementById("back-to-top");
  const themeToggle  = document.getElementById("theme-toggle");

  if (!(header instanceof HTMLElement) || !(progressBar instanceof HTMLElement)) {
    return;
  }

  // Remove old scroll listener to prevent duplicate triggers and memory leaks on SPA page transitions
  if (_scrollListener) {
    window.removeEventListener("scroll", _scrollListener);
  }

  // Initial state
  updateHeaderState(header);
  updateScrollBar(progressBar);
  if (backToTop instanceof HTMLButtonElement) {
    updateBackToTop(backToTop);
  }

  // Scroll listener (passive for performance)
  _scrollListener = () => {
    updateHeaderState(header);
    updateScrollBar(progressBar);
    if (backToTop instanceof HTMLButtonElement) {
      updateBackToTop(backToTop);
    }
  };

  window.addEventListener("scroll", _scrollListener, { passive: true });

  // Mobile menu
  if (menuToggle instanceof HTMLButtonElement && mobileMenu instanceof HTMLElement) {
    setupMobileMenu(menuToggle, mobileMenu);
  }

  // Back to top
  if (backToTop instanceof HTMLButtonElement && !backToTop.dataset.initialized) {
    backToTop.dataset.initialized = "true";
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Theme toggle
  if (themeToggle instanceof HTMLButtonElement) {
    setupThemeToggle(themeToggle);
  }
}
