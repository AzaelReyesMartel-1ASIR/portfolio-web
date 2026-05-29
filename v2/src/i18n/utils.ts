import { ui, defaultLang } from './ui';
import type { Lang, UIKey } from './ui';

/**
 * Extracts the active language from a URL pathname.
 * Supports /en/*, /es/* — falls back to defaultLang ('es').
 *
 * @example
 *   getLangFromUrl(new URL('https://azaelreyes.dev/en/'))  // → 'en'
 *   getLangFromUrl(new URL('https://azaelreyes.dev/'))     // → 'es'
 */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

/**
 * Returns a translation function scoped to the given language.
 * Falls back to defaultLang if the key is missing in the requested lang.
 *
 * @example
 *   const t = useTranslations('en');
 *   t('nav.home')  // → 'Home'
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key]
      ?? (ui[defaultLang] as Record<string, string>)[key]
      ?? key;
  };
}
