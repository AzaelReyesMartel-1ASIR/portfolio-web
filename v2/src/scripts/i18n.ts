/* ──────────────────────────────────────────────
   i18n.ts — Language toggle (Phase 5 stub)
   Persists selection to localStorage.
   Phase 6: will trigger Astro /es|/en routing.
   ────────────────────────────────────────────── */

export type Locale = "es" | "en";

const SUPPORTED: Locale[] = ["es", "en"];
const STORAGE_KEY = "lang";

export function getStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  return SUPPORTED.includes(stored as Locale) ? (stored as Locale) : "es";
}

export function setLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
  // Phase 6: replace with Astro i18n route redirect
  // window.location.href = `/${locale}${window.location.pathname}`;
  document.dispatchEvent(new CustomEvent("lang:change", { detail: { locale } }));
}

export function initI18n(): void {
  const toggle  = document.getElementById("lang-toggle");
  const current = document.getElementById("lang-current");
  const menu    = document.getElementById("lang-menu");
  const chevron = document.getElementById("lang-chevron");

  if (!toggle || !current || !menu) return;

  // Restore persisted locale label
  const stored = getStoredLocale();
  current.textContent = stored.toUpperCase();
  menu.querySelector<HTMLButtonElement>(`[data-lang="${stored}"]`)
    ?.setAttribute("aria-current", "true");

  // Toggle dropdown open/close
  const openMenu = (): void => {
    menu.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
    chevron?.classList.add("rotate-180");
  };
  const closeMenu = (): void => {
    menu.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
    chevron?.classList.remove("rotate-180");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
  });

  document.addEventListener("click", closeMenu);
  menu.addEventListener("click", (e) => e.stopPropagation());

  // Language selection
  menu.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = (btn.dataset.lang ?? "es") as Locale;

      // Update label
      current.textContent = lang.toUpperCase();

      // Mark active item
      menu.querySelectorAll("[data-lang]").forEach((b) => b.removeAttribute("aria-current"));
      btn.setAttribute("aria-current", "true");

      setLocale(lang);
      closeMenu();
    });
  });

  // Listen for lang:change events (fired by setLocale)
  document.addEventListener("lang:change", (e: Event) => {
    const { locale } = (e as CustomEvent<{ locale: Locale }>).detail;
    console.info(`[i18n] Language changed to: ${locale}. Phase 6 will apply full translation.`);
  });
}
