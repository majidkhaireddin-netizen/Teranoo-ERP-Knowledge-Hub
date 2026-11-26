'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import type {
  DecisionRegisterEntryModel,
  SourceManifestEntry,
} from '@/content/models/knowledge';
import {
  getPhase5Capabilities,
  getReferenceCounts,
  getSnapshotProvenance,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { MetricCard } from '@/components/visualization/MetricCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

export interface DecisionRegisterViewProps {
  decisionRegisterSourceEntry?: SourceManifestEntry;
}

export function DecisionRegisterView({
  decisionRegisterSourceEntry,
}: DecisionRegisterViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const counts = useMemo(() => getReferenceCounts(), []);
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const [query, setQuery] = useState('');

  // Strictly derived from verified Phase 5 snapshot references — zero fabricated decisions
  const verifiedEntries: readonly DecisionRegisterEntryModel[] = useMemo(() => {
    return getPhase5Capabilities()
      .filter((cap) => cap.decisionId !== null)
      .map((cap) => ({
        decisionId: cap.decisionId as string,
        title: cap.name,
        owningPhase: 'phase-5',
        classification: 'approved-decision',
        status: 'approved',
        sourceDocumentPath:
          'teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md',
        relatedDecisions: [],
        relatedRequirements: [],
        canonicalHref: '/platform',
      }));
  }, []);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return verifiedEntries;
    return verifiedEntries.filter((entry) => {
      const haystack = [
        entry.decisionId,
        entry.title.ar,
        entry.title.en,
        entry.owningPhase,
        entry.sourceDocumentPath,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [verifiedEntries, query]);

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <ContentClassification
            classification="approved-decision"
            label={t('classification.approved-decision.label')}
          />
        }
        title={t('foundations.decisions.title')}
        subtitle={t('foundations.decisions.subtitle')}
        meta={
          decisionRegisterSourceEntry ? (
            <>
              <code className="font-mono text-xs bidi-ltr text-text-secondary">
                {decisionRegisterSourceEntry.sourcePath}
              </code>
              <span aria-hidden="true">·</span>
              <span>
                {t(
                  `foundations.sourceManifest.importStatuses.${decisionRegisterSourceEntry.importStatus}`
                )}
              </span>
            </>
          ) : undefined
        }
      />

      {/* Explicit Index vs Owning Document & Source Count vs Locally Available Distinction */}
      <InformationCallout title={t('foundations.decisions.indexNoticeTitle')}>
        {t('foundations.decisions.indexNoticeBody')}
      </InformationCallout>

      {/* Source-Declared vs Locally Available Counts */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        <MetricCard
          label={t('foundations.decisions.sourceDeclaredLabel')}
          value={counts.approvedArchitecturalDecisions}
          emphasis="primary"
          note={t('sections.decisions.metricNote')}
          className="bg-surface"
        />
        <MetricCard
          label={t('foundations.decisions.locallyAvailableLabel')}
          value={verifiedEntries.length}
          suffix={`/ ${counts.approvedArchitecturalDecisions}`}
          emphasis="accent"
          note={t('foundations.decisions.locallyAvailableNote')}
          className="bg-surface"
        />
      </div>

      {/* Searchable Decision Register Table Foundation */}
      <section
        aria-label={t('foundations.decisions.title')}
        className="space-y-3"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('foundations.decisions.searchPlaceholder')}
              aria-label={t('foundations.decisions.searchPlaceholder')}
              clearLabel={t('controls.clearSearch')}
            />
          </div>
          <p className="text-xs text-text-muted tabular-nums">
            {t('foundations.decisions.resultsCount', {
              shown: filteredEntries.length,
              total: verifiedEntries.length,
            })}
          </p>
        </div>

        {filteredEntries.length === 0 ? (
          <EmptyState
            title={t('foundations.decisions.emptyTitle')}
            description={t('foundations.decisions.emptyDescription')}
            icon={<FileCheck2 className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-text-primary">
                  <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                    {t('foundations.decisions.headers.decisionId')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold">
                    {t('foundations.decisions.headers.title')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                    {t('foundations.decisions.headers.phase')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                    {t('foundations.decisions.headers.status')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold">
                    {t('foundations.decisions.headers.impact')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.decisionId}
                    className="hover:bg-surface-hover/50 transition-colors"
                  >
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <code className="font-mono font-semibold text-primary bidi-ltr">
                        {entry.decisionId}
                      </code>
                    </td>
                    <td className="px-3.5 py-3 font-medium text-text-primary">
                      {entry.canonicalHref ? (
                        <Link
                          href={entry.canonicalHref}
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <span>{resolveLocalizedText(entry.title, locale)}</span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-text-muted"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : (
                        resolveLocalizedText(entry.title, locale)
                      )}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className="font-mono rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-secondary bidi-ltr">
                        {entry.owningPhase}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <StatusIndicator
                        status="approved"
                        label={t('status.approved')}
                      />
                    </td>
                    <td className="px-3.5 py-3 text-text-secondary">
                      {t('foundations.decisions.defaultImpact')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md (${provenance.reviewedTreeSha.slice(0, 12)})`}
        identifier="src-pf-05-decision-register"
      />
    </PageContainer>
  );
}
