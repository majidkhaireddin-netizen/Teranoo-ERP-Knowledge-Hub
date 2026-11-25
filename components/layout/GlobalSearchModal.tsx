'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import {
  buildSearchIndex,
  searchKnowledgeHub,
} from '@/content/repositories/projectRepository';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppLocale } from '@/providers/LocaleProvider';

export interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations();
  const { locale } = useAppLocale();
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(
    () => searchKnowledgeHub(query, searchIndex),
    [query, searchIndex]
  );

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const input = inputWrapperRef.current?.querySelector('input');
      input?.focus();
    }, 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (href: string) => {
    setQuery('');
    onClose();
    router.push(href);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('controls.searchModalTitle')}
      closeLabel={t('controls.close')}
      className="max-w-2xl"
    >
      <div className="p-4 space-y-3">
        <div ref={inputWrapperRef}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={t('controls.searchPlaceholder')}
            aria-label={t('controls.searchModalTitle')}
            clearLabel={t('controls.close')}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>{t('controls.searchResultsCount', { count: results.length })}</span>
          <span className="font-mono bidi-ltr">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border rounded-md border border-border">
          {results.length === 0 ? (
            <EmptyState
              title={t('controls.searchEmptyTitle')}
              description={t('controls.searchEmptyDescription')}
              icon={<Search className="h-4 w-4" aria-hidden="true" />}
              className="border-0 rounded-none"
            />
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.href)}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.code ? (
                      <code className="font-mono text-xs font-semibold text-primary bidi-ltr shrink-0">
                        {item.code}
                      </code>
                    ) : null}
                    <span className="text-sm font-medium text-text-primary truncate">
                      {resolveLocalizedText(item.title, locale)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">
                    {resolveLocalizedText(item.subtitle, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ContentClassification
                    classification={item.classification}
                    label={t(`classification.${item.classification}.shortLabel`)}
                  />
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-text-muted"
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
