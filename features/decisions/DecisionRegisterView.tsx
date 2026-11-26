'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  FilterX,
  Info,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SourceManifestEntry } from '@/content/models/knowledge';
import type {
  ExtractedDecisionRegister,
  IndexedArchitecturalDecision,
} from '@/content/extractors/decisionRegisterExtractor';
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
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Button } from '@/components/ui/Button';
import { QueryParamSync } from '@/components/navigation/QueryParamSync';

export interface DecisionRegisterViewProps {
  decisionRegisterSourceEntry?: SourceManifestEntry;
  extractedRegister: ExtractedDecisionRegister;
}

export function DecisionRegisterView({
  decisionRegisterSourceEntry,
  extractedRegister,
}: DecisionRegisterViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const [query, setQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(
    null
  );

  const handleQueryParam = useCallback((param: string | null) => {
    if (!param) return;
    const normalized = param.trim().toUpperCase();
    setSelectedDecisionId(normalized);
    if (normalized !== 'D-MKT-01') {
      setSelectedPhase('all');
      setSelectedFamily('all');
    }
  }, []);

  const allDecisions = extractedRegister.architecturalDecisions;
  const importedOwningCount = useMemo(
    () => allDecisions.filter((d) => d.authoritativeSourceImported).length,
    [allDecisions]
  );

  const phases = useMemo(
    () => Object.entries(extractedRegister.byPhaseCounts),
    [extractedRegister.byPhaseCounts]
  );

  const families = useMemo(
    () => Object.entries(extractedRegister.byFamilyCounts),
    [extractedRegister.byFamilyCounts]
  );

  const filteredDecisions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allDecisions.filter((d) => {
      if (selectedPhase !== 'all' && d.ownerPhaseId !== selectedPhase) {
        return false;
      }
      if (selectedFamily !== 'all' && d.family !== selectedFamily) {
        return false;
      }
      if (q) {
        const haystack = [
          d.decisionId,
          d.family,
          d.shortDecision,
          d.officialSource,
          d.ownerPhaseLabel,
          d.ownerPhaseId,
          d.primaryImpact,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allDecisions, query, selectedPhase, selectedFamily]);

  const selectedDecision: IndexedArchitecturalDecision | null = useMemo(() => {
    if (!selectedDecisionId || selectedDecisionId === 'D-MKT-01') return null;
    return (
      allDecisions.find(
        (d) => d.decisionId.toUpperCase() === selectedDecisionId.toUpperCase()
      ) ?? null
    );
  }, [allDecisions, selectedDecisionId]);

  const isMarketHighlighted = selectedDecisionId === 'D-MKT-01';
  const hasFilters =
    query.trim().length > 0 ||
    selectedPhase !== 'all' ||
    selectedFamily !== 'all';

  const clearFilters = () => {
    setQuery('');
    setSelectedPhase('all');
    setSelectedFamily('all');
  };

  const selectClass =
    'rounded-md border border-border bg-surface px-2.5 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40';

  return (
    <PageContainer>
      <QueryParamSync paramName="decision" onValue={handleQueryParam} />

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
          <>
            {decisionRegisterSourceEntry ? (
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
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <Link
              href="/knowledge/decision-register"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {isAr
                  ? 'قراءة DECISION_REGISTER.md كاملًا'
                  : 'Read full DECISION_REGISTER.md'}
              </span>
            </Link>
          </>
        }
      />

      {/* Strict Index vs Owning Document Authority Boundary */}
      <InformationCallout title={t('foundations.decisions.indexNoticeTitle')}>
        {t('foundations.decisions.indexNoticeBody')}
      </InformationCallout>

      {/* Authoritative Metrics Strip (100% Derived from Extractor) */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t('foundations.decisions.sourceDeclaredLabel')}
          value={allDecisions.length}
          emphasis="primary"
          note={
            isAr
              ? `Phase 3: ${extractedRegister.byPhaseCounts['phase-3'] ?? 0} · Phase 4: ${extractedRegister.byPhaseCounts['phase-4'] ?? 0} · Phase 5: ${extractedRegister.byPhaseCounts['phase-5'] ?? 0}`
              : `Phase 3: ${extractedRegister.byPhaseCounts['phase-3'] ?? 0} · Phase 4: ${extractedRegister.byPhaseCounts['phase-4'] ?? 0} · Phase 5: ${extractedRegister.byPhaseCounts['phase-5'] ?? 0}`
          }
          className="bg-surface"
        />
        <MetricCard
          label={t('foundations.decisions.locallyAvailableLabel')}
          value={importedOwningCount}
          suffix={`/ ${allDecisions.length}`}
          note={t('foundations.decisions.locallyAvailableNote')}
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'قرار بوابة السوق (منفصل)' : 'Market Decision Gate A'}
          value="D-MKT-01"
          emphasis="accent"
          note={
            isAr
              ? 'معتمد مشروطًا (2026-10-02) · خارج عدّاد 126'
              : 'Approved Conditional (2026-10-02) · Outside 126 counter'
          }
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'الوثائق الحاكمة بدون D-*' : 'Governing Artifacts'}
          value={extractedRegister.governingArtifacts.length}
          note={
            isAr
              ? `${extractedRegister.governingArtifacts.filter((g) => g.importedSlug).length} منشورة في BATCH-001 · ${extractedRegister.governingArtifacts.filter((g) => !g.importedSlug).length} بانتظار الدفعات اللاحقة`
              : `${extractedRegister.governingArtifacts.filter((g) => g.importedSlug).length} published in BATCH-001 · ${extractedRegister.governingArtifacts.filter((g) => !g.importedSlug).length} awaiting later batches`
          }
          className="bg-surface"
        />
      </div>

      {/* Selected Decision Detail Drawer/Panel (when clicked or deep-linked via ?decision=D-*) */}
      {selectedDecision ? (
        <section
          aria-label={t('foundations.decisions.detailPanelTitle')}
          className="rounded-lg border-2 border-primary/50 bg-surface p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded-sm bg-primary-subtle px-2 py-0.5 font-mono text-sm font-bold text-primary bidi-ltr">
                  {selectedDecision.decisionId}
                </code>
                <span className="font-mono rounded-sm border border-border bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-secondary bidi-ltr">
                  {selectedDecision.family}
                </span>
                <span className="font-mono rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-secondary bidi-ltr">
                  {selectedDecision.ownerPhaseLabel}
                </span>
                <StatusIndicator
                  status="approved"
                  label={t('status.approved')}
                />
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                {selectedDecision.shortDecision}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDecisionId(null)}
              aria-label={t('controls.close')}
              className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 border-t border-border pt-3">
            <div className="space-y-0.5">
              <dt className="text-text-muted">
                {t('foundations.decisions.headers.impact')}
              </dt>
              <dd className="text-text-primary leading-relaxed">
                {selectedDecision.primaryImpact}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-text-muted">
                {t('foundations.decisions.headers.source')}
              </dt>
              <dd>
                <code className="font-mono text-[11px] bidi-ltr break-all text-text-secondary">
                  {selectedDecision.normalizedOfficialSourcePath}
                </code>
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2 rounded-md border border-border bg-surface-subtle/60 px-3.5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-text-secondary">
              <Info className="h-4 w-4 text-info shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                {t('foundations.decisions.detailAwaitingOwningDoc')}{' '}
                <code className="font-mono text-[11px] bidi-ltr text-text-primary">
                  {selectedDecision.officialSource}
                </code>
              </span>
            </div>
            <Link
              href={`/knowledge/${selectedDecision.indexSourceSlug}#${selectedDecision.indexSectionAnchor}`}
              className="inline-flex shrink-0 items-center gap-1 font-medium text-primary hover:underline"
            >
              <span>{t('foundations.decisions.openInRegisterDoc')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* Separate Decision Gate A (D-MKT-01) — Strictly Outside the 126 Architectural Counter */}
      <section
        id="decision-gate-a-mkt"
        aria-label={t('foundations.decisions.marketDecisionSectionTitle')}
        className={`rounded-lg border p-4 sm:p-5 space-y-3 bg-surface ${
          isMarketHighlighted ? 'border-2 border-primary' : 'border-border'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-sm bg-primary-subtle px-2 py-0.5 font-mono text-xs font-bold text-primary bidi-ltr">
                {extractedRegister.marketDecision.decisionId}
              </code>
              <span className="rounded-sm border border-warning-border bg-warning-bg px-2 py-0.5 text-[11px] font-medium text-warning">
                {isAr
                  ? `معتمد مشروطًا (${extractedRegister.marketDecision.approvedDate}) · خارج عدّاد 126`
                  : `Approved Conditional (${extractedRegister.marketDecision.approvedDate}) · Outside 126 counter`}
              </span>
            </div>
            <h2 className="text-base font-semibold text-text-primary">
              {t('foundations.decisions.marketDecisionSectionTitle')}
            </h2>
          </div>
          <Link
            href={`/knowledge/${extractedRegister.marketDecision.indexSourceSlug}#${extractedRegister.marketDecision.indexSectionAnchor}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>{t('foundations.decisions.openInRegisterDoc')}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <p className="text-sm leading-relaxed text-text-primary">
          {extractedRegister.marketDecision.summary}
        </p>

        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 border-t border-border pt-3">
          <div className="space-y-1">
            <p className="font-semibold text-text-muted">
              {isAr
                ? `شرط النفاذ الإلزامي (${extractedRegister.marketDecision.conditionCode})`
                : `Binding Condition (${extractedRegister.marketDecision.conditionCode})`}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {extractedRegister.marketDecision.conditionSummary}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-text-muted">
              {isAr ? 'الوثيقة المالكة (غير مستوردة في BATCH-001)' : 'Owning Source Document (Not Imported in BATCH-001)'}
            </p>
            <code className="block font-mono text-[11px] bidi-ltr break-all text-text-secondary">
              {extractedRegister.marketDecision.normalizedOfficialSourcePath}
            </code>
          </div>
        </div>
      </section>

      {/* Searchable & Filterable 126-Decision Catalog */}
      <section
        aria-label={t('foundations.decisions.title')}
        className="space-y-3"
      >
        <div className="rounded-lg border border-border bg-surface p-3.5 space-y-3">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <div className="flex-1 min-w-0">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={t('foundations.decisions.searchPlaceholder')}
                aria-label={t('foundations.decisions.searchPlaceholder')}
                clearLabel={t('controls.clearSearch')}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label={t('foundations.decisions.headers.phase')}
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className={selectClass}
              >
                <option value="all">
                  {t('foundations.decisions.phaseFilterAll')} ({allDecisions.length})
                </option>
                {phases.map(([phaseId, count]) => (
                  <option key={phaseId} value={phaseId}>
                    {phaseId.toUpperCase()} ({count})
                  </option>
                ))}
              </select>

              <select
                aria-label={isAr ? 'عائلة القرار' : 'Decision Family'}
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className={selectClass}
              >
                <option value="all">
                  {t('foundations.decisions.familyFilterAll')}
                </option>
                {families.map(([family, count]) => (
                  <option key={family} value={family}>
                    {family} ({count})
                  </option>
                ))}
              </select>

              {hasFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                >
                  <FilterX className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('knowledge.filters.clearFilters')}</span>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs text-text-muted">
            <span className="tabular-nums">
              {t('foundations.decisions.resultsCount', {
                shown: filteredDecisions.length,
                total: allDecisions.length,
              })}
            </span>
            <span>
              {isAr
                ? 'انقر على أي صف لاستعراض بطاقة تفاصيل القرار المفهرس ورابطه المصدري.'
                : 'Select any row to inspect the indexed decision details and source provenance.'}
            </span>
          </div>
        </div>

        {filteredDecisions.length === 0 ? (
          <EmptyState
            title={t('foundations.decisions.emptyTitle')}
            description={t('foundations.decisions.emptyDescription')}
            icon={<FileCheck2 className="h-5 w-5" aria-hidden="true" />}
            action={
              hasFilters ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                >
                  {t('knowledge.filters.clearFilters')}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-text-primary">
                  <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                    {t('foundations.decisions.headers.decisionId')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold min-w-[260px]">
                    {t('foundations.decisions.headers.title')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                    {t('foundations.decisions.headers.phase')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold min-w-[180px]">
                    {t('foundations.decisions.headers.source')}
                  </th>
                  <th className="px-3.5 py-2.5 text-start font-semibold min-w-[200px]">
                    {t('foundations.decisions.headers.impact')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDecisions.map((entry) => {
                  const isSelected =
                    selectedDecisionId?.toUpperCase() ===
                    entry.decisionId.toUpperCase();
                  return (
                    <tr
                      key={entry.decisionId}
                      onClick={() => setSelectedDecisionId(entry.decisionId)}
                      className={`cursor-pointer transition-colors align-top ${
                        isSelected
                          ? 'bg-primary-subtle/50'
                          : 'hover:bg-surface-hover/60'
                      }`}
                    >
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDecisionId(entry.decisionId);
                          }}
                          className="font-mono font-semibold text-primary hover:underline bidi-ltr cursor-pointer"
                        >
                          {entry.decisionId}
                        </button>
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-text-primary leading-relaxed">
                        {entry.shortDecision}
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="font-mono rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-secondary bidi-ltr">
                          {entry.ownerPhaseId}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <code className="font-mono text-[11px] text-text-secondary bidi-ltr break-all">
                          {entry.officialSource}
                        </code>
                      </td>
                      <td className="px-3.5 py-2.5 text-text-secondary leading-relaxed">
                        {entry.primaryImpact}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Governing Artifacts Without D-* IDs (6 Official Documents) */}
      <section
        aria-label={t('foundations.decisions.governingArtifactsTitle')}
        className="space-y-3"
      >
        <SectionHeader
          title={t('foundations.decisions.governingArtifactsTitle')}
          subtitle={
            isAr
              ? 'وثائق حاكمة معتمدة بدون معرفات D-* منفصلة وفق جدول DECISION_REGISTER.md.'
              : 'Approved governing documents without individual D-* identifiers per DECISION_REGISTER.md.'
          }
        />
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3.5 py-2.5 text-start font-semibold">
                  {isAr ? 'الوثيقة الحاكمة' : 'Governing Artifact'}
                </th>
                <th className="px-3.5 py-2.5 text-start font-semibold">
                  {isAr ? 'الدور الحاكم' : 'Governing Role'}
                </th>
                <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                  {isAr ? 'حالة التوفر' : 'Availability'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {extractedRegister.governingArtifacts.map((art) => (
                <tr key={art.normalizedPath} className="align-top">
                  <td className="px-3.5 py-2.5">
                    {art.importedSlug ? (
                      <Link
                        href={`/knowledge/${art.importedSlug}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-primary hover:underline bidi-ltr"
                      >
                        <span>{art.artifactPath}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ) : (
                      <code className="font-mono text-[11px] text-text-secondary bidi-ltr">
                        {art.artifactPath}
                      </code>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 text-text-secondary leading-relaxed">
                    {art.role}
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    {art.importedSlug ? (
                      <span className="rounded-sm border border-success-border bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
                        {isAr ? 'منشور في BATCH-001' : 'Published (BATCH-001)'}
                      </span>
                    ) : (
                      <span className="rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-[11px] text-text-muted">
                        {isAr ? 'دفعة مستقبلية' : 'Future batch'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interpretive Guardrails & Supersession Note */}
      {(extractedRegister.interpretiveGuardrails.length > 0 ||
        extractedRegister.supersessionNote) && (
        <section
          aria-label={t('foundations.decisions.interpretiveGuardrailsTitle')}
          className="rounded-lg border border-border bg-surface p-4 space-y-2.5 text-xs"
        >
          <div className="flex items-center gap-2 font-semibold text-text-primary">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>{t('foundations.decisions.interpretiveGuardrailsTitle')}</span>
          </div>
          {extractedRegister.interpretiveGuardrails.map((note) => (
            <p key={note.codeRange} className="leading-relaxed text-text-secondary">
              {note.note}
            </p>
          ))}
          {extractedRegister.supersessionNote ? (
            <p className="border-t border-border pt-2 leading-relaxed text-text-secondary">
              {extractedRegister.supersessionNote}
            </p>
          ) : null}
        </section>
      )}

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md (${(provenance.reviewedCommitSha ?? provenance.reviewedTreeSha).slice(0, 12)})`}
        identifier="src-pf-05-decision-register"
      />
    </PageContainer>
  );
}
