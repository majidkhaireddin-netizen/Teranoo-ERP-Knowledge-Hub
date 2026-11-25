'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SITE_CONFIG } from '@/config/site';
import type { AppLocale } from '@/i18n/config';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { SidebarProvider } from '@/providers/SidebarProvider';

interface AppProvidersProps {
  initialLocale: AppLocale;
  children: React.ReactNode;
}

export function AppProviders({ initialLocale, children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey={SITE_CONFIG.storageKeys.theme}
      disableTransitionOnChange
    >
      <LocaleProvider initialLocale={initialLocale}>
        <SidebarProvider>{children}</SidebarProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
