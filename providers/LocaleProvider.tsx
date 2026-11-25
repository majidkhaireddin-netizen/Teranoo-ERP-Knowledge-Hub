'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import arMessages from '@/i18n/locales/ar.json';
import enMessages from '@/i18n/locales/en.json';
import {
  DEFAULT_LOCALE,
  getDirection,
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  type AppLocale,
  type TextDirection,
} from '@/i18n/config';

interface LocaleContextValue {
  locale: AppLocale;
  direction: TextDirection;
  setLocale: (next: AppLocale) => void;
  toggleLocale: () => void;
}

const MESSAGES_MAP = {
  ar: arMessages,
  en: enMessages,
} as const;

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  initialLocale: AppLocale;
  children: React.ReactNode;
}

export function LocaleProvider({
  initialLocale,
  children,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  const applyLocaleToDocument = useCallback((target: AppLocale) => {
    const dir = getDirection(target);
    document.documentElement.lang = target;
    document.documentElement.dir = dir;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, target);
    } catch {
      // Ignore storage restrictions in private browsing environments.
    }
    document.cookie = `${LOCALE_COOKIE_NAME}=${target}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  // Synchronize external DOM attributes and storage with the active locale.
  useEffect(() => {
    applyLocaleToDocument(locale);
  }, [applyLocaleToDocument, locale]);

  const setLocale = useCallback(
    (next: AppLocale) => {
      setLocaleState(next);
      applyLocaleToDocument(next);
    },
    [applyLocaleToDocument]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }, [locale, setLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: getDirection(locale),
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES_MAP[locale]}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useAppLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      direction: getDirection(DEFAULT_LOCALE),
      setLocale: () => {},
      toggleLocale: () => {},
    };
  }
  return ctx;
}
