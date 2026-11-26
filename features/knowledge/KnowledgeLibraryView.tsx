'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, FilterX, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  resolveLocalizedText,
  type ContentClassificationType,
} from '@/content/models/types';
import type {
  DocumentLanguage,
  KnowledgeRecordMetadata,
  SourceManifestEntry,
  SourceManifestSummary,
} from '@/content/models/knowledge';
import {
  BUSINESS_MODULES_TAXONOMY,
  CONTENT_CLASSIFICATION_VALUES,
  CONTENT_TYPES,
  JOURNEY_STAGES,
  KNOWLEDGE_DEPTHS,
  KNOWN_OFFICIAL_PHASES,
  PLATFORM_DOMAINS,
  getContentTypeDefinition,
  getTaxonomyLabel,
  type ContentTypeId,
  type JourneyStageId,
  type KnowledgeDepth,
  type PlatformDomainId,
} from '@/content/taxonomy/registry';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceInventorySection } from '@/components/documentation/SourceInventorySection';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export interface KnowledgeLibraryViewProps {
  records: readonly KnowledgeRecordMetadata[];
  sourceManifest?: readonly SourceManifestEntry[];
  sourceManifestSummary?: SourceManifestSummary;
}

export function KnowledgeLibraryView({
  records,
  sourceManifest = [],
  sourceManifestSummary,
}: KnowledgeLibraryViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const snapshotCounts = useMemo(() => getReferenceCounts(), []);

  const [query, setQuery] = useState('');
  const [selectedJourneyStage, setSelectedJourneyStage] = useState<
    JourneyStageId | 'all'
  >('all');
  const [selectedType, setSelectedType] = useState<ContentTypeId | 'all'>('all');
  const [selectedClassification, setSelectedClassification] = useState<
    ContentClassificationType | 'all'
  >('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<PlatformDomainId | 'all'>(
    'all'
  );
  const [selectedDepth, setSelectedDepth] = useState<KnowledgeDepth | 'all'>(
    'all'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<
    DocumentLanguage | 'all'
  >('all');

  const stageCounts = useMemo(() => {
    const counts: Partial<Record<JourneyStageId, number>> = {};
    for (const rec of records) {
      for (const stage of rec.journeyStages) {
        counts[stage] = (counts[stage] ?? 0) + 1;
      }
    }
    return counts;
  }, [records]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedJourneyStage !== 'all' ||
    selectedType !== 'all' ||
    selectedClassification !== 'all' ||
    selectedPhase !== 'all' ||
    selectedModule !== 'all' ||
    selectedDomain !== 'all' ||
    selectedDepth !== 'all' ||
    selectedLanguage !== 'all';

  const clearFilters = () => {
    setQuery('');
    setSelectedJourneyStage('all');
    setSelectedType('all');
    setSelectedClassification('all');
    setSelectedPhase('all');
    setSelectedModule('all');
    setSelectedDomain('all');
    setSelectedDepth('all');
    setSelectedLanguage('all');
  };

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return records.filter((rec) => {
      if (
        selectedJourneyStage !== 'all' &&
        !rec.journeyStages.includes(selectedJourneyStage)
      ) {
        return false;
      }
      if (selectedType !== 'all' && rec.type !== selectedType) return false;
      if (
        selectedClassification !== 'all' &&
        rec.classification !== selectedClassification
      ) {
        return false;
      }
      if (selectedPhase !== 'all' && !rec.phaseRefs.includes(selectedPhase)) {
        return false;
      }
      if (selectedModule !== 'all' && !rec.moduleRefs.includes(selectedModule)) {
        return false;
      }
      if (selectedDomain !== 'all' && !rec.domainRefs.includes(selectedDomain)) {
        return false;
      }
      if (selectedDepth !== 'all' && rec.depth !== selectedDepth) return false;
      if (selectedLanguage !== 'all' && rec.language !== selectedLanguage) {
        return false;
      }

      if (normalizedQuery) {
        const haystack = [
          rec.id,
          rec.slug,
          rec.title.ar,
          rec.title.en,
          rec.subtitle?.ar ?? '',
          rec.subtitle?.en ?? '',
          rec.description.ar,
          rec.description.en,
          rec.type,
          rec.classification,
          ...rec.journeyStages,
          ...rec.topics,
          ...rec.tags,
          ...rec.phaseRefs,
          ...rec.moduleRefs,
          ...rec.domainRefs,
          rec.traceability.officialDocumentId ?? '',
          ...rec.traceability.decisionIds,
          ...rec.traceability.requirementIds,
          ...rec.traceability.researchIds,
          ...rec.traceability.futureConsiderationIds,
          ...rec.traceability.independentReviewIds,
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    }).sort((a, b) => {
      const aSup = a.editorialStatus === 'superseded' ? 1 : 0;
      const bSup = b.editorialStatus === 'superseded' ? 1 : 0;
      if (aSup !== bSup) return aSup - bSup;
      const aOfficial = a.source.kind === 'official-source' ? 0 : 1;
      const bOfficial = b.source.kind === 'official-source' ? 0 : 1;
      if (aOfficial !== bOfficial) return aOfficial - bOfficial;
      return (
        (a.collectionSequence?.order ?? 999) -
        (b.collectionSequence?.order ?? 999)
      );
    });
  }, [
    records,
    query,
    selectedJourneyStage,
    selectedType,
    selectedClassification,
    selectedPhase,
    selectedModule,
    selectedDomain,
    selectedDepth,
    selectedLanguage,
  ]);

  const selectClass =
    'w-full rounded-md border border-border bg-surface px-2.5 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40';

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <ContentClassification
            classification="official"
            label={t('classification.official.shortLabel')}
          />
        }
        title={t('knowledge.libraryTitle')}
        subtitle={t('knowledge.librarySubtitle')}
      />

      <InformationCallout title={t('knowledge.snapshotVsPublishedTitle')}>
        {t('knowledge.snapshotVsPublishedBody', {
          published: records.length,
          decisions: snapshotCounts.approvedArchitecturalDecisions,
          research: snapshotCounts.architecturalResearchPackages,
          future: snapshotCounts.futureArchitectureConsiderations,
          reviews: snapshotCounts.independentReviewNotes,
        })}
      </InformationCallout>

      {/* Project Journey Navigation (Educational Exploration Dimensions) */}
      <section
        aria-label={t('foundations.journeyNav.sectionTitle')}
        className="space-y-3"
      >
        <SectionHeader
          title={t('foundations.journeyNav.sectionTitle')}
          subtitle={t('foundations.journeyNav.sectionSubtitle')}
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedJourneyStage('all')}
            aria-pressed={selectedJourneyStage === 'all'}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              selectedJourneyStage === 'all'
                ? 'border-primary bg-primary-subtle text-primary'
                : 'border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
          >
            <span>{t('foundations.journeyNav.allStages')}</span>
            <span className="font-mono text-[11px] tabular-nums opacity-80">
              {records.length}
            </span>
          </button>
          {JOURNEY_STAGES.map((stage) => {
            const count = stageCounts[stage.id] ?? 0;
            const isSelected = selectedJourneyStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedJourneyStage(stage.id)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary-subtle text-primary'
                    : count > 0
                      ? 'border-border bg-surface text-text-primary hover:bg-surface-hover'
                      : 'border-border bg-surface-subtle/50 text-text-muted hover:bg-surface-hover hover:text-text-secondary'
                }`}
              >
                <span>{resolveLocalizedText(stage.label, locale)}</span>
                <span className="font-mono text-[11px] tabular-nums opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Toolbar */}
      <section
        aria-label={t('knowledge.libraryTitle')}
        className="rounded-lg border border-border bg-surface p-4 space-y-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('knowledge.searchPlaceholder')}
              aria-label={t('knowledge.searchPlaceholder')}
              clearLabel={t('controls.clearSearch')}
            />
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="shrink-0"
            >
              <FilterX className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('knowledge.filters.clearFilters')}</span>
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.classification')}</span>
            <select
              value={selectedClassification}
              onChange={(e) =>
                setSelectedClassification(
                  e.target.value as ContentClassificationType | 'all'
                )
              }
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allClassifications')}</option>
              {CONTENT_CLASSIFICATION_VALUES.map((cls) => (
                <option key={cls} value={cls}>
                  {t(`classification.${cls}.shortLabel`)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.type')}</span>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as ContentTypeId | 'all')
              }
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allTypes')}</option>
              {CONTENT_TYPES.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {resolveLocalizedText(ct.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.phase')}</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allPhases')}</option>
              {KNOWN_OFFICIAL_PHASES.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {resolveLocalizedText(phase.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.module')}</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allModules')}</option>
              {BUSINESS_MODULES_TAXONOMY.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {resolveLocalizedText(mod.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.domain')}</span>
            <select
              value={selectedDomain}
              onChange={(e) =>
                setSelectedDomain(e.target.value as PlatformDomainId | 'all')
              }
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allDomains')}</option>
              {PLATFORM_DOMAINS.map((dom) => (
                <option key={dom.id} value={dom.id}>
                  {resolveLocalizedText(dom.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.depth')}</span>
            <select
              value={selectedDepth}
              onChange={(e) =>
                setSelectedDepth(e.target.value as KnowledgeDepth | 'all')
              }
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allDepths')}</option>
              {KNOWLEDGE_DEPTHS.map((depth) => (
                <option key={depth.id} value={depth.id}>
                  {resolveLocalizedText(depth.label, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-text-secondary">
            <span className="block">{t('knowledge.filters.language')}</span>
            <select
              value={selectedLanguage}
              onChange={(e) =>
                setSelectedLanguage(e.target.value as DocumentLanguage | 'all')
              }
              className={selectClass}
            >
              <option value="all">{t('knowledge.filters.allLanguages')}</option>
              <option value="ar">{t('knowledge.languages.ar')}</option>
              <option value="en">{t('knowledge.languages.en')}</option>
              <option value="mixed">{t('knowledge.languages.mixed')}</option>
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs text-text-muted">
          <span>
            {t('knowledge.resultsCount', {
              shown: filteredRecords.length,
              total: records.length,
            })}
          </span>
        </div>
      </section>

      {/* Compact Documentation Catalog Rows */}
      <section aria-label={t('knowledge.libraryTitle')}>
        {filteredRecords.length === 0 ? (
          <EmptyState
            title={
              selectedJourneyStage !== 'all' &&
              !query.trim() &&
              selectedType === 'all' &&
              selectedClassification === 'all' &&
              selectedPhase === 'all' &&
              selectedModule === 'all' &&
              selectedDomain === 'all' &&
              selectedDepth === 'all' &&
              selectedLanguage === 'all'
                ? t('foundations.journeyNav.emptyStageTitle')
                : t('knowledge.emptyTitle')
            }
            description={
              selectedJourneyStage !== 'all' &&
              !query.trim() &&
              selectedType === 'all' &&
              selectedClassification === 'all' &&
              selectedPhase === 'all' &&
              selectedModule === 'all' &&
              selectedDomain === 'all' &&
              selectedDepth === 'all' &&
              selectedLanguage === 'all'
                ? t('foundations.journeyNav.emptyStageBody')
                : t('knowledge.emptyDescription')
            }
            icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
            action={
              hasActiveFilters ? (
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
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {filteredRecords.map((record) => {
              const typeDef = getContentTypeDefinition(record.type);
              const depthLabel = record.depth
                ? getTaxonomyLabel(KNOWLEDGE_DEPTHS, record.depth)
                : undefined;

              return (
                <Link
                  key={record.id}
                  href={`/knowledge/${record.slug}`}
                  className="group block px-4 py-4 transition-colors hover:bg-surface-hover/70 sm:px-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <ContentClassification
                          classification={record.classification}
                          label={t(
                            `classification.${record.classification}.shortLabel`
                          )}
                        />
                        {typeDef ? (
                          <span className="rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                            {resolveLocalizedText(typeDef.label, locale)}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-0.5 text-[11px] text-text-secondary">
                          <Globe className="h-3 w-3 text-text-muted" aria-hidden="true" />
                          <span>{t(`knowledge.languages.${record.language}`)}</span>
                        </span>
                        {depthLabel ? (
                          <span className="font-mono text-[11px] text-text-muted bidi-ltr">
                            {record.depth}
                          </span>
                        ) : null}
                        {record.editorialStatus === 'superseded' ? (
                          <span className="rounded-sm border border-warning-border bg-warning-bg px-2 py-0.5 text-[11px] font-medium text-warning">
                            {t('knowledge.supersededShortBadge')}
                          </span>
                        ) : record.source.kind === 'official-source' &&
                          record.publicationAuthorization.completeness === 'complete' ? (
                          <span className="rounded-sm border border-success-border bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
                            {t('knowledge.fullSourceBadge')}
                          </span>
                        ) : null}
                        <span className="font-mono text-[11px] text-text-muted bidi-ltr">
                          {t('knowledge.revisionLabel', {
                            revision: record.versioning.revision,
                          })}
                        </span>
                      </div>

                      <h2 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {resolveLocalizedText(record.title, locale)}
                      </h2>

                      <p className="text-sm leading-relaxed text-text-secondary max-w-3xl">
                        {resolveLocalizedText(record.description, locale)}
                      </p>

                      {record.traceability.decisionIds.length > 0 ||
                      record.phaseRefs.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-text-muted">
                          {record.phaseRefs.map((phase) => (
                            <span
                              key={phase}
                              className="font-mono rounded-sm bg-surface-subtle px-1.5 py-0.5 bidi-ltr"
                            >
                              {phase}
                            </span>
                          ))}
                          {record.traceability.decisionIds.slice(0, 4).map((id) => (
                            <code
                              key={id}
                              className="font-mono rounded-sm border border-border px-1.5 py-0.5 text-text-secondary bidi-ltr"
                            >
                              {id}
                            </code>
                          ))}
                          {record.traceability.decisionIds.length > 4 ? (
                            <span className="font-mono bidi-ltr">
                              +{record.traceability.decisionIds.length - 4}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-medium text-text-muted group-hover:text-primary transition-colors pt-1">
                      <span className="hidden sm:inline">
                        {t('knowledge.openDocument')}
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {sourceManifest.length > 0 && sourceManifestSummary ? (
        <SourceInventorySection
          entries={sourceManifest}
          summary={sourceManifestSummary}
        />
      ) : null}
    </PageContainer>
  );
}
