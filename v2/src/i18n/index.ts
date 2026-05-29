/**
 * i18n/index.ts — Phase 6 architecture stub
 *
 * Current: locale strings loaded statically, selector stores to localStorage.
 * Phase 6: Switch to Astro's native i18n routing (/es/*, /en/*)
 *          and replace getTranslation() with Astro.currentLocale.
 */

export type Locale = "es" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

// Inline imports — avoids async complexity until Phase 6 routing is live
import es from "../locales/es.json";
import en from "../locales/en.json";

const TRANSLATIONS: Record<Locale, typeof es> = { es, en };

/** Returns the active locale from localStorage (client) or DEFAULT (SSR). */
export function getActiveLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem("lang") as Locale | null;
  return SUPPORTED_LOCALES.includes(stored as Locale) ? (stored as Locale) : DEFAULT_LOCALE;
}

/** Returns the full translation object for a given locale. */
export function getTranslations(locale: Locale = DEFAULT_LOCALE): typeof es {
  return TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE];
}

/**
 * Accessor helper — dot-path lookup.
 * @example t("hero.whoami") => "$ whoami"
 */
export function t(key: string, locale?: Locale): string {
  const dict = getTranslations(locale ?? getActiveLocale()) as Record<string, unknown>;
  const parts = key.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}
