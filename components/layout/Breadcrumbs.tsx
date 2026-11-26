'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { findNavGroupById, findNavItemByPath } from '@/config/navigation';
import { useAppLocale } from '@/providers/LocaleProvider';

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations();
  const { direction } = useAppLocale();

  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const isKnowledgeDocumentRoute = normalizedPath.startsWith('/knowledge/');
  const knowledgeSlug = isKnowledgeDocumentRoute
    ? decodeURIComponent(normalizedPath.slice('/knowledge/'.length))
    : null;

  const currentItem = isKnowledgeDocumentRoute
    ? findNavItemByPath('/knowledge')
    : findNavItemByPath(normalizedPath);
  const currentGroup = currentItem
    ? findNavGroupById(currentItem.groupId)
    : undefined;

  const Separator = direction === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label={t('nav.breadcrumbLabel')}
      className="flex items-center gap-1.5 min-w-0 overflow-hidden text-xs sm:text-sm"
    >
      <Link
        href="/"
        className="text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap shrink-0"
      >
        {t('app.shortName')}
      </Link>

      {currentGroup && currentItem && currentItem.href !== '/' ? (
        <>
          <Separator
            className="hidden md:inline h-3.5 w-3.5 text-text-muted shrink-0"
            aria-hidden="true"
          />
          <span className="hidden md:inline text-text-muted whitespace-nowrap shrink-0">
            {t(currentGroup.labelKey)}
          </span>
          <Separator
            className="h-3.5 w-3.5 text-text-muted shrink-0"
            aria-hidden="true"
          />
          {isKnowledgeDocumentRoute && knowledgeSlug ? (
            <>
              <Link
                href="/knowledge"
                className="hidden sm:inline text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap shrink-0"
              >
                {t(currentItem.labelKey)}
              </Link>
              <Separator
                className="hidden sm:inline h-3.5 w-3.5 text-text-muted shrink-0"
                aria-hidden="true"
              />
              <span
                aria-current="page"
                className="font-mono text-xs font-medium text-text-primary truncate min-w-0 bidi-ltr"
              >
                {knowledgeSlug}
              </span>
            </>
          ) : (
            <span
              aria-current="page"
              className="font-medium text-text-primary truncate min-w-0"
            >
              {t(currentItem.labelKey)}
            </span>
          )}
        </>
      ) : (
        <>
          <Separator
            className="h-3.5 w-3.5 text-text-muted shrink-0"
            aria-hidden="true"
          />
          <span
            aria-current="page"
            className="font-medium text-text-primary truncate"
          >
            {t('nav.items.dashboard')}
          </span>
        </>
      )}
    </nav>
  );
}
