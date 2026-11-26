'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  FileWarning,
  FilterX,
  Telescope,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SourceManifestEntry } from '@/content/models/knowledge';
import type {
  ExtractedFacRegister,
  FacSourceStatus,
} from '@/content/extractors/facRegisterExtractor';
import { getSnapshotProvenance } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { MetricCard } from '@/components/visualization/MetricCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { QueryParamSync } from '@/components/navigation/QueryParamSync';

export interface FutureConsiderationsViewProps {
  facSourceEntry?: SourceManifestEntry;
  extractedFac: ExtractedFacRegister;
}

const STATUS_STYLE: Record<FacSourceStatus, string> = {
  'RESEARCH REQUIRED':
    'border-warning-border bg-warning-bg text-warning',
  'REVIEW LATER': 'border-border bg-surface-secondary text-text-primary',
  WATCH: 'border-border bg-surface text-text-secondary',
};

export function FutureConsiderationsView({
  facSourceEntry,
  extractedFac,
}: FutureConsiderationsViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    FacSourceStatus | 'all'
  >('all');
  const [expandedFacId, setExpandedFacId] = useState<string | null>(
    extractedFac.records[0]?.facId ?? null
  );

  const handleQueryParam = useCallback((param: string | null) => {
    if (!param) return;
    const normalized = param.trim().toUpperCase();
    setSelectedStatus('all');
    setQuery('');
    setExpandedFacId(normalized);
  }, []);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return extractedFac.records.filter((rec) => {
      if (selectedStatus !== 'all' && rec.status !== selectedStatus) {
        return false;
      }
      if (q) {
        const haystack = [
          rec.facId,
          rec.title,
          rec.status,
          rec.owner,
          rec.summary,
          rec.referencedDetailedDoc ?? '',
          ...rec.ownerPhaseIds,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [extractedFac.records, query, selectedStatus]);

  const hasFilters = query.trim().length > 0 || selectedStatus !== 'all';

  return (
    <PageContainer>
      <QueryParamSync paramName="fac" onValue={handleQueryParam} />

      <PageHeader
        kicker={
          <ContentClassification
            classification="future"
            label={t('classification.future.label')}
          />
        }
        title={t('foundations.futureConsiderations.title')}
        subtitle={t('foundations.futureConsiderations.subtitle')}
        meta={
          <>
            {facSourceEntry ? (
              <>
                <code className="font-mono text-xs bidi-ltr text-text-secondary">
                  {facSourceEntry.sourcePath}
                </code>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <Link
              href="/knowledge/future-architecture-considerations"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('foundations.futureConsiderations.openFullDoc')}</span>
            </Link>
          </>
        }
      />

      {/* Mandatory Non-Approved Governance Notice */}
      <InformationCallout
        title={t('foundations.futureConsiderations.nonApprovedTitle')}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle
            className="h-4 w-4 mt-0.5 text-warning shrink-0"
            aria-hidden="true"
          />
          <span>{t('foundations.futureConsiderations.nonApprovedBody')}</span>
        </div>
      </InformationCallout>

      {/* Authoritative Metrics Strip Derived from Extractor */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={isAr ? 'إجمالي الاعتبارات (FAC)' : 'Total FAC Records'}
          value={extractedFac.records.length}
          emphasis="primary"
          note={isAr ? 'FAC-001 حتى FAC-024 (ليست قرارات معتمدة)' : 'FAC-001 through FAC-024 (NOT approved decisions)'}
          className="bg-surface"
        />
        <MetricCard
          label="RESEARCH REQUIRED"
          value={extractedFac.byStatusCounts['RESEARCH REQUIRED']}
          emphasis="accent"
          note={isAr ? 'تتطلب بحثًا مسبقًا قبل أي قرار' : 'Require prior research before any decision'}
          className="bg-surface"
        />
        <MetricCard
          label="REVIEW LATER"
          value={extractedFac.byStatusCounts['REVIEW LATER']}
          note={isAr ? 'مراجعة في مراحل لاحقة محددة' : 'Scheduled for later phase review'}
          className="bg-surface"
        />
        <MetricCard
          label="WATCH"
          value={extractedFac.byStatusCounts.WATCH}
          note={isAr ? 'مراقبة مستقبلية (+ 7 أفكار رُقِّيت لضوابط)' : 'Ongoing watch (+ 7 ideas promoted to Guardrails)'}
          className="bg-surface"
        />
      </div>

      {/* Filter & Search Toolbar */}
      <section
        aria-label={t('foundations.futureConsiderations.title')}
        className="space-y-3"
      >
        <div className="rounded-lg border border-border bg-surface p-3.5 space-y-3">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <div className="flex-1 min-w-0">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={t(
                  'foundations.futureConsiderations.searchPlaceholder'
                )}
                aria-label={t(
                  'foundations.futureConsiderations.searchPlaceholder'
                )}
                clearLabel={t('controls.clearSearch')}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'all',
                  'RESEARCH REQUIRED',
                  'REVIEW LATER',
                  'WATCH',
                ] as const
              ).map((st) => {
                const count =
                  st === 'all'
                    ? extractedFac.records.length
                    : extractedFac.byStatusCounts[st];
                const active = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    aria-pressed={active}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-primary bg-primary-subtle text-primary'
                        : 'border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    {st === 'all'
                      ? t('foundations.futureConsiderations.statusAll', {
                          count,
                        })
                      : `${st} (${count})`}
                  </button>
                );
              })}

              {hasFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setSelectedStatus('all');
                  }}
                >
                  <FilterX className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('knowledge.filters.clearFilters')}</span>
                </Button>
              ) : null}
            </div>
          </div>

          <p className="border-t border-border pt-2 text-xs text-text-muted tabular-nums">
            {t('foundations.futureConsiderations.resultsCount', {
              shown: filteredRecords.length,
              total: extractedFac.records.length,
            })}
          </p>
        </div>

        {/* 24 FAC Expandable Explorer */}
        {filteredRecords.length === 0 ? (
          <EmptyState
            title={t('knowledge.emptyTitle')}
            description={t('knowledge.emptyDescription')}
            icon={<Telescope className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {filteredRecords.map((rec) => {
              const isExpanded =
                expandedFacId?.toUpperCase() === rec.facId.toUpperCase();
              return (
                <div key={rec.facId} id={rec.facId}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedFacId(isExpanded ? null : rec.facId)
                    }
                    aria-expanded={isExpanded}
                    className={`flex w-full items-start justify-between gap-4 px-4 py-3.5 text-start transition-colors cursor-pointer ${
                      isExpanded
                        ? 'bg-surface-subtle/70'
                        : 'hover:bg-surface-hover/50'
                    }`}
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <code className="rounded-sm bg-primary-subtle px-2 py-0.5 font-mono font-bold text-primary bidi-ltr">
                          {rec.facId}
                        </code>
                        <span
                          className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] font-semibold bidi-ltr ${STATUS_STYLE[rec.status]}`}
                        >
                          {rec.status}
                        </span>
                        <span className="rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-[11px] text-text-secondary">
                          {isAr ? `المالك: ${rec.owner}` : `Owner: ${rec.owner}`}
                        </span>
                        <span className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] text-text-muted">
                          {isAr ? 'ليس قرارًا معتمدًا' : 'Not an approved decision'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {rec.title}
                      </h3>
                      {!isExpanded ? (
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {rec.summary}
                        </p>
                      ) : null}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 mt-1 text-text-muted transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded ? (
                    <div className="border-t border-border bg-surface-subtle/30 px-4 py-4 space-y-3 text-xs">
                      {rec.detailSections.map((sec) => (
                        <div key={sec.heading} className="space-y-1">
                          <h4 className="font-semibold text-text-primary">
                            {sec.heading}
                          </h4>
                          {sec.body ? (
                            <p className="leading-relaxed text-text-secondary">
                              {sec.body}
                            </p>
                          ) : null}
                          {sec.bullets.length > 0 ? (
                            <ul className="space-y-1 list-disc ps-4 text-text-secondary">
                              {sec.bullets.map((b, idx) => (
                                <li key={`${sec.heading}-${idx}`} className="leading-relaxed">
                                  {b}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}

                      {rec.referencedDetailedDoc ? (
                        <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-bg/70 px-3 py-2 text-warning">
                          <FileWarning
                            className="h-4 w-4 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>
                            {t(
                              'foundations.futureConsiderations.detailedDocUnavailable'
                            )}{' '}
                            <code className="font-mono bidi-ltr font-semibold">
                              {rec.referencedDetailedDoc}
                            </code>
                          </span>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5">
                        <span className="text-text-muted">
                          {isAr
                            ? 'مصدر السجل: FUTURE_ARCHITECTURE_CONSIDERATIONS.md'
                            : 'Source: FUTURE_ARCHITECTURE_CONSIDERATIONS.md'}
                        </span>
                        <Link
                          href={`/knowledge/${rec.sourceDocumentSlug}#${rec.sourceSectionAnchor}`}
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          <span>
                            {isAr
                              ? 'فتح القسم في الوثيقة الرسمية'
                              : 'Open section in official document'}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Promoted Ideas -> Cross-Phase Product Guardrails */}
      <section
        aria-label={t('foundations.futureConsiderations.promotedTitle')}
        className="space-y-3"
      >
        <SectionHeader
          title={t('foundations.futureConsiderations.promotedTitle')}
          subtitle={t('foundations.futureConsiderations.promotedSubtitle')}
        />
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-xs">
          {extractedFac.promotedIdeas.map((idea) => (
            <div
              key={idea.title}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-success bidi-ltr">
                  PROMOTED
                </span>
                <span className="font-medium text-text-primary">
                  {idea.title}
                </span>
              </div>
              <Link
                href={`/knowledge/${idea.targetSlug}`}
                className="inline-flex shrink-0 items-center gap-1 text-primary hover:underline"
              >
                <span className="font-mono text-[11px] bidi-ltr">
                  CROSS_PHASE_PRODUCT_GUARDRAILS.md
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Official Review Rules */}
      {extractedFac.reviewRulePoints.length > 0 ? (
        <section
          aria-label={t('foundations.futureConsiderations.reviewRulesTitle')}
          className="rounded-lg border border-border bg-surface p-4 space-y-2.5 text-xs"
        >
          <h2 className="text-sm font-semibold text-text-primary">
            {t('foundations.futureConsiderations.reviewRulesTitle')}
          </h2>
          <ol className="space-y-1.5 list-decimal ps-4 text-text-secondary">
            {extractedFac.reviewRulePoints.map((rule) => (
              <li key={rule} className="leading-relaxed">
                {rule}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md (${(provenance.reviewedCommitSha ?? provenance.reviewedTreeSha).slice(0, 12)})`}
        identifier="src-pf-06-future-architecture-considerations"
      />
    </PageContainer>
  );
}
