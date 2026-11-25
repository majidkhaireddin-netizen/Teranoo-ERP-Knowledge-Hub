'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Languages,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { IconButton } from '@/components/ui/IconButton';
import { useAppLocale } from '@/providers/LocaleProvider';
import { useSidebar } from '@/providers/SidebarProvider';

export interface AppHeaderProps {
  onOpenSearch: () => void;
}

const emptySubscribe = () => () => {};

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const t = useTranslations();
  const { locale, toggleLocale } = useAppLocale();
  const { collapsed, toggleCollapsed, setMobileOpen } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === 'dark';

  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-3 sm:px-5 backdrop-blur-xs">
      {/* Start Zone: Sidebar Control + Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="lg:hidden">
          <IconButton
            label={t('nav.openMenu')}
            size="sm"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>

        <div className="hidden lg:block">
          <IconButton
            label={
              collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')
            }
            size="sm"
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            )}
          </IconButton>
        </div>

        <Breadcrumbs />
      </div>

      {/* End Zone: Phase Indicator + Search Entry + Language Switcher + Theme Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/platform"
          className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors whitespace-nowrap px-2 py-1"
        >
          <span>{t('app.currentPhaseBadge')}</span>
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label={t('controls.searchTrigger')}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-app px-2.5 text-xs text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">{t('controls.searchTrigger')}</span>
          <kbd className="hidden md:inline font-mono text-[10px] text-text-muted border border-border rounded-sm px-1 py-0.5 bidi-ltr">
            {t('controls.searchShortcut')}
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleLocale}
          aria-label={t('controls.switchLanguage')}
          title={t('controls.switchLanguage')}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs font-medium text-text-primary hover:bg-surface-hover transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Languages className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
          <span className={locale === 'ar' ? 'font-mono text-[11px]' : ''}>
            {t('controls.languageShort')}
          </span>
        </button>

        <IconButton
          variant="outline"
          size="sm"
          onClick={handleToggleTheme}
          label={isDark ? t('controls.switchToLight') : t('controls.switchToDark')}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-accent" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
          )}
        </IconButton>
      </div>
    </header>
  );
}
