'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';

import { APP_SHELL_ROOT_ID } from '@/components/ui/Modal';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div id={APP_SHELL_ROOT_ID} className="min-h-screen flex bg-app text-text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-xs focus:font-medium focus:text-primary-foreground"
      >
        {t('app.skipToContent')}
      </a>

      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenSearch={() => setSearchOpen(true)} />
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
