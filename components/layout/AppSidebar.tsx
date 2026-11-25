'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Blocks,
  BookOpenText,
  Boxes,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Compass,
  Database,
  FileCheck2,
  FlaskConical,
  GitFork,
  History,
  Info,
  Layers,
  LayoutDashboard,
  Map,
  Network,
  Telescope,
  Workflow,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  NAVIGATION_GROUPS,
  type NavIconKey,
} from '@/config/navigation';
import { useSidebar } from '@/providers/SidebarProvider';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';

const NAV_ICONS: Record<NavIconKey, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  compass: Compass,
  map: Map,
  layers: Layers,
  boxes: Boxes,
  'git-fork': GitFork,
  blocks: Blocks,
  'building-2': Building2,
  database: Database,
  'file-check-2': FileCheck2,
  'flask-conical': FlaskConical,
  telescope: Telescope,
  'clipboard-check': ClipboardCheck,
  workflow: Workflow,
  network: Network,
  'book-open-text': BookOpenText,
  history: History,
  info: Info,
};

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const renderSidebarInner = (isMobile: boolean) => {
    const isIconOnly = !isMobile && collapsed;

    return (
      <div className="flex h-full flex-col bg-surface text-text-primary">
        {/* Brand Identity Header */}
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b border-border px-4',
            isIconOnly ? 'justify-center px-2' : 'justify-between gap-2'
          )}
        >
          <Link
            href="/"
            onClick={isMobile ? closeMobile : undefined}
            className="flex items-center gap-2.5 min-w-0"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-primary text-xs font-mono font-bold text-primary-foreground"
              aria-hidden="true"
            >
              T
            </span>
            {!isIconOnly ? (
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-semibold tracking-tight text-text-primary truncate">
                  {t('app.shortName')}
                </p>
                <p className="text-[11px] text-text-secondary truncate">
                  {t('app.subtitle')}
                </p>
              </div>
            ) : null}
          </Link>

          {isMobile ? (
            <IconButton
              label={t('nav.closeMenu')}
              size="sm"
              onClick={closeMobile}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          ) : null}
        </div>

        {/* Navigation Groups */}
        <nav
          aria-label={t('nav.mainNavigation')}
          className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4"
        >
          {NAVIGATION_GROUPS.map((group) => {
            const isGroupCollapsed = Boolean(collapsedGroups[group.id]);

            return (
              <div key={group.id} className="space-y-1">
                {!isIconOnly ? (
                  <button
                    type="button"
                    aria-expanded={!isGroupCollapsed}
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-semibold text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <span className="truncate">{t(group.labelKey)}</span>
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 shrink-0 transition-transform duration-150',
                        isGroupCollapsed && '-rotate-90 rtl:rotate-90'
                      )}
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <div className="mx-2 my-1 border-t border-border" />
                )}

                {!isGroupCollapsed || isIconOnly ? (
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = NAV_ICONS[item.icon];
                      const normalizedPath =
                        pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
                      const isActive = normalizedPath === item.href;
                      const label = t(item.labelKey);

                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            onClick={isMobile ? closeMobile : undefined}
                            title={isIconOnly ? label : undefined}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                              'group flex items-center rounded-md text-[13px] transition-colors duration-150',
                              isIconOnly
                                ? 'justify-center h-9 w-9 mx-auto'
                                : 'gap-2.5 px-2.5 py-2',
                              isActive
                                ? 'bg-primary-subtle text-primary font-semibold'
                                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary font-medium'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0',
                                isActive
                                  ? 'text-primary'
                                  : 'text-text-muted group-hover:text-text-primary'
                              )}
                              aria-hidden="true"
                            />
                            {!isIconOnly ? (
                              <span className="truncate">{label}</span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        {/* Quiet Structural Footer Marker */}
        {!isIconOnly ? (
          <div className="shrink-0 border-t border-border px-4 py-2.5 text-[11px] text-text-muted flex items-center justify-between gap-2">
            <span>Teranoo ERP</span>
            <span className="font-mono bidi-ltr">TASK-001</span>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 border-e border-border sticky top-0 h-screen transition-[width] duration-200',
          collapsed ? 'w-[64px]' : 'w-[268px]'
        )}
      >
        {renderSidebarInner(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/50"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMobile();
          }}
        >
          <aside
            aria-label={t('nav.mainNavigation')}
            className="fixed inset-y-0 start-0 w-[280px] max-w-[85vw] border-e border-border shadow-lg"
          >
            {renderSidebarInner(true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
