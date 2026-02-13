import i18n from './i18n';

export type TranslationKeys = typeof import('./translations/en.json');

/**
 * Get translation by key (dot-notation supported, e.g. "onboarding.next").
 * Supports interpolation: use {{key}} in strings and pass params as second argument.
 */
export function translate(key: string, params?: Record<string, string | number>): string {
  return i18n.t(key, params as Record<string, unknown>);
}

export function setLocale(locale: string): void {
  i18n.changeLanguage(locale);
}

export function getLocale(): string {
  return i18n.language;
}

export { default as i18n } from './i18n';
