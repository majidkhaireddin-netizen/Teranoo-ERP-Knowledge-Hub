export type AppLocale = 'ar' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export const DEFAULT_LOCALE: AppLocale = 'ar';
export const SUPPORTED_LOCALES: readonly AppLocale[] = ['ar', 'en'] as const;
export const LOCALE_COOKIE_NAME = 'TERANOO_LOCALE';
export const LOCALE_STORAGE_KEY = 'teranoo-locale';

export function isValidLocale(value: unknown): value is AppLocale {
  return value === 'ar' || value === 'en';
}

export function getDirection(locale: AppLocale): TextDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
