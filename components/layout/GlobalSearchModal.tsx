'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import {
  buildUnifiedSearchIndex,
  searchUnifiedKnowledge,
  type KnowledgeSearchEntry,
} from '@/content/search/knowledgeSearch';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppLocale } from '@/providers/LocaleProvider';

export interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  searchEntries?: readonly KnowledgeSearchEntry[];
}

export function GlobalSearchModal({
  open,
  onClose,
  searchEntries,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const t = useTranslations();
  const { locale } = useAppLocale();

  const searchIndex = useMemo(
    () => searchEntries ?? buildUnifiedSearchIndex([]),
    [searchEntries]
  );
  const results = useMemo(
    () => searchUnifiedKnowledge(query, searchIndex),
    [query, searchIndex]
  );

  const displayedResults = useMemo(() => results.slice(0, 30), [results]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (href: string) => {
    setQuery('');
    onClose();
    router.push(href);
  };

  const categoryBadgeKey = (
    category: KnowledgeSearchEntry['category']
  ): string | null => {
    switch (category) {
      case 'document':
        return 'knowledge.searchDocBadge';
      case 'decision':
        return 'knowledge.searchDecisionBadge';
      case 'module':
        return 'knowledge.searchModuleBadge';
      case 'contract':
        return 'knowledge.searchContractBadge';
      case 'dependency':
        return 'knowledge.searchDependencyBadge';
      case 'lifecycle':
        return 'knowledge.searchLifecycleBadge';
      case 'ownership':
        return 'knowledge.searchOwnershipBadge';
      case 'fac':
        return 'knowledge.searchFacBadge';
      case 'phase':
        return 'knowledge.searchPhaseBadge';
      case 'guardrail':
        return 'knowledge.searchGuardrailBadge';
      default:
        return null;
    }
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
        <SearchInput
          data-autofocus
          value={query}
          onChange={setQuery}
          placeholder={t('controls.searchPlaceholder')}
          aria-label={t('controls.searchModalTitle')}
          clearLabel={t('controls.clearSearch')}
        />

        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>{t('controls.searchResultsCount', { count: results.length })}</span>
          <span className="font-mono bidi-ltr">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border rounded-md border border-border">
          {displayedResults.length === 0 ? (
            <EmptyState
              title={t('controls.searchEmptyTitle')}
              description={t('controls.searchEmptyDescription')}
              icon={<Search className="h-4 w-4" aria-hidden="true" />}
              className="border-0 rounded-none"
            />
          ) : (
            displayedResults.map((item) => {
              const badgeKey = categoryBadgeKey(item.category);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {badgeKey ? (
                        <span className="rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] font-medium text-text-secondary shrink-0">
                          {t(badgeKey)}
                        </span>
                      ) : null}
                      {item.isSuperseded ? (
                        <span className="rounded-sm border border-warning-border bg-warning-bg px-1.5 py-0.5 text-[10px] font-medium text-warning shrink-0">
                          {t('knowledge.supersededShortBadge')}
                        </span>
                      ) : null}
                      {item.code ? (
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <code className="font-mono text-xs font-semibold text-primary bidi-ltr">
                            {item.code}
                          </code>
                          {item.identifierScope === 'knowledge-hub-internal' ? (
                            <span
                              title={
                                locale === 'ar'
                                  ? 'معرّف داخلي لمركز المعرفة (ليس معرّف ERP رسميًا)'
                                  : 'Knowledge Hub internal identifier (not an official ERP ID)'
                              }
                              className="rounded-sm border border-border bg-surface-secondary px-1 py-0.5 text-[9px] font-medium text-text-muted"
                            >
                              {locale === 'ar' ? 'داخلي' : 'KH ID'}
                            </span>
                          ) : item.identifierScope === 'official-erp' ? (
                            <span
                              title={
                                locale === 'ar'
                                  ? 'معرّف رسمي من وثائق Teranoo ERP'
                                  : 'Official Teranoo ERP identifier'
                              }
                              className="rounded-sm border border-success-border bg-success-bg px-1 py-0.5 text-[9px] font-medium text-success"
                            >
                              {locale === 'ar' ? 'رسمي' : 'ERP ID'}
                            </span>
                          ) : null}
                        </span>
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
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
