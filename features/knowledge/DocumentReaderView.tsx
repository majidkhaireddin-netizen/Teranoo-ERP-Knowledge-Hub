'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  ExternalLink,
  Globe,
  Link2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import type {
  CollectionNeighbors,
  KnowledgeDocument,
  KnowledgeRecordMetadata,
  ResolvedRelationship,
} from '@/content/models/knowledge';
import {
  BUSINESS_MODULES_TAXONOMY,
  CONTROLLED_TOPICS,
  KNOWLEDGE_DEPTHS,
  KNOWN_OFFICIAL_PHASES,
  PLATFORM_DOMAINS,
  getContentTypeDefinition,
  getRelationshipDefinition,
  getTaxonomyLabel,
} from '@/content/taxonomy/registry';
import type { DocumentRendererDescriptor } from '@/content/renderers/rendererRegistry';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentLayout } from '@/components/layout/ContentLayout';
import {
  MobileTableOfContents,
  TableOfContents,
} from '@/components/layout/TableOfContents';
import { DocumentationArticle } from '@/components/documentation/DocumentationArticle';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { MarkdownContent } from '@/components/documentation/MarkdownContent';

export interface DocumentReaderViewProps {
  document: KnowledgeDocument;
  outgoingRelationships: readonly ResolvedRelationship[];
  incomingRelationships: readonly ResolvedRelationship[];
  translations: readonly KnowledgeRecordMetadata[];
  revisions: readonly KnowledgeRecordMetadata[];
  neighbors: CollectionNeighbors;
  rendererDescriptor: DocumentRendererDescriptor;
}

export function DocumentReaderView({
  document,
  outgoingRelationships,
  incomingRelationships,
  translations,
  revisions,
  neighbors,
  rendererDescriptor,
}: DocumentReaderViewProps) {
  const t = useTranslations();
  const { locale, direction } = useAppLocale();
  const { metadata } = document;

  const typeDef = getContentTypeDefinition(metadata.type);
  const depthLabel = metadata.depth
    ? getTaxonomyLabel(KNOWLEDGE_DEPTHS, metadata.depth)
    : undefined;

  const docLanguageLabel = t(`knowledge.languages.${metadata.language}`);
  const isDifferentFromUi =
    metadata.language !== 'mixed' && metadata.language !== locale;
  const hasTranslationInCurrentLocale = translations.some(
    (tr) => tr.language === locale
  );

  const showAuthorityDisclaimer =
    rendererDescriptor.showResearchDisclaimerBanner ||
    (metadata.classification !== 'official' &&
      metadata.classification !== 'approved-decision');

  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const PrevIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const NextIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const formatDateOrMissing = (value?: string | null) =>
    value ? (
      <code className="font-mono text-xs bidi-ltr">{value}</code>
    ) : (
      <span className="text-text-muted italic">
        {t('knowledge.reader.notRecorded')}
      </span>
    );

  const renderRelationshipRow = (
    rel: ResolvedRelationship,
    index: number
  ) => {
    const def = getRelationshipDefinition(rel.type);
    const relationLabel = def
      ? resolveLocalizedText(
          rel.direction === 'outgoing' ? def.outgoingLabel : def.incomingLabel,
          locale
        )
      : rel.type;

    if (rel.status === 'resolved' && rel.targetSlug && rel.targetTitle) {
      return (
        <li
          key={`${rel.direction}-${rel.type}-${rel.targetId}-${index}`}
          className="flex items-start justify-between gap-3 py-2.5"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
                {relationLabel}
              </span>
              {rel.targetClassification ? (
                <ContentClassification
                  classification={rel.targetClassification}
                  label={t(
                    `classification.${rel.targetClassification}.shortLabel`
                  )}
                />
              ) : null}
            </div>
            <Link
              href={`/knowledge/${rel.targetSlug}`}
              className="block text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              {resolveLocalizedText(rel.targetTitle, locale)}
            </Link>
          </div>
          <Link
            href={`/knowledge/${rel.targetSlug}`}
            aria-label={resolveLocalizedText(rel.targetTitle, locale)}
            className="shrink-0 pt-1 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
      );
    }

    if (rel.status === 'external' && rel.externalUrl) {
      return (
        <li
          key={`${rel.direction}-${rel.type}-ext-${index}`}
          className="flex items-start justify-between gap-3 py-2.5"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
                {relationLabel}
              </span>
              <span className="rounded-sm border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
                {t('knowledge.reader.externalBadge')}
              </span>
            </div>
            <a
              href={rel.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline break-all"
            >
              <span>
                {rel.customLabel
                  ? resolveLocalizedText(rel.customLabel, locale)
                  : rel.externalUrl}
              </span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </li>
      );
    }

    return (
      <li
        key={`${rel.direction}-${rel.type}-def-${index}`}
        className="flex items-start justify-between gap-3 py-2.5"
      >
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
              {relationLabel}
            </span>
            <span className="rounded-sm border border-border bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-muted">
              {rel.status === 'deferred'
                ? t('knowledge.reader.deferredBadge')
                : t('knowledge.reader.missingBadge')}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            {rel.customLabel
              ? resolveLocalizedText(rel.customLabel, locale)
              : null}
            {rel.deferredRef ? (
              <code className="block mt-0.5 font-mono text-xs text-text-muted bidi-ltr break-all">
                {rel.deferredRef}
              </code>
            ) : rel.targetId ? (
              <code className="block mt-0.5 font-mono text-xs text-text-muted bidi-ltr">
                {rel.targetId}
              </code>
            ) : null}
          </p>
        </div>
      </li>
    );
  };

  return (
    <PageContainer>
      {/* Back to Library navigation */}
      <div>
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-primary transition-colors"
        >
          <BackIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('knowledge.backToLibrary')}</span>
        </Link>
      </div>

      {/* Document Header */}
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification={metadata.classification}
              label={t(`classification.${metadata.classification}.label`)}
            />
            {typeDef &&
            resolveLocalizedText(typeDef.label, locale) !==
              t(`classification.${metadata.classification}.label`) ? (
              <>
                <span aria-hidden="true" className="text-text-muted">·</span>
                <span className="rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-xs font-medium text-text-secondary">
                  {resolveLocalizedText(typeDef.label, locale)}
                </span>
              </>
            ) : null}
            {depthLabel ? (
              <>
                <span aria-hidden="true" className="text-text-muted">·</span>
                <span className="text-xs text-text-secondary">
                  {resolveLocalizedText(depthLabel, locale)}
                </span>
              </>
            ) : null}
          </>
        }
        title={resolveLocalizedText(metadata.title, locale)}
        subtitle={
          metadata.subtitle
            ? resolveLocalizedText(metadata.subtitle, locale)
            : resolveLocalizedText(metadata.description, locale)
        }
        meta={
          <>
            <code className="font-mono text-xs bidi-ltr text-text-primary">
              {metadata.id}
            </code>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-xs bidi-ltr">
              {t('knowledge.revisionLabel', {
                revision: metadata.versioning.revision,
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
              <span>
                {t('knowledge.readingTime', {
                  minutes: document.readingTimeMinutes,
                })}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t('knowledge.reader.rendererMode')}:{' '}
              {resolveLocalizedText(rendererDescriptor.label, locale)}
            </span>
          </>
        }
      />

      {/* Four Independent Status Dimensions Strip */}
      <section
        aria-label={t('knowledge.statusDimensions.title')}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4"
      >
        <div className="bg-surface px-3.5 py-2.5 space-y-0.5">
          <p className="text-[11px] text-text-muted">
            {t('knowledge.statusDimensions.editorial')}
          </p>
          <p className="text-xs font-semibold text-text-primary">
            {t(
              `knowledge.statusDimensions.editorialValues.${metadata.editorialStatus}`
            )}
          </p>
        </div>
        <div className="bg-surface px-3.5 py-2.5 space-y-0.5">
          <p className="text-[11px] text-text-muted">
            {t('knowledge.statusDimensions.approval')}
          </p>
          <p className="text-xs font-semibold text-text-primary">
            {t(
              `knowledge.statusDimensions.approvalValues.${metadata.approvalStatus}`
            )}
          </p>
        </div>
        <div className="bg-surface px-3.5 py-2.5 space-y-0.5">
          <p className="text-[11px] text-text-muted">
            {t('knowledge.statusDimensions.publication')}
          </p>
          <p className="text-xs font-semibold text-text-primary">
            {t(
              `knowledge.statusDimensions.publicationValues.${metadata.publicationStatus}`
            )}
          </p>
        </div>
        <div className="bg-surface px-3.5 py-2.5 space-y-0.5">
          <p className="text-[11px] text-text-muted">
            {t('knowledge.statusDimensions.implementation')}
          </p>
          <p className="text-xs font-semibold text-text-primary">
            {t(
              `knowledge.statusDimensions.implementationValues.${metadata.implementationStatus}`
            )}
          </p>
        </div>
      </section>

      {/* Document Language Independence & Translation Notice */}
      <section className="rounded-lg border border-border bg-surface-subtle/60 px-4 py-3 text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-text-primary font-medium">
            <Globe className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>
              {t('knowledge.languageBanner.originalLanguage')}:{' '}
              <strong>{docLanguageLabel}</strong>
            </span>
          </div>

          {translations.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text-secondary">
                {t('knowledge.languageBanner.availableTranslations')}
              </span>
              {translations.map((tr) => (
                <Link
                  key={tr.id}
                  href={`/knowledge/${tr.slug}`}
                  className="rounded-sm border border-border bg-surface px-2 py-0.5 font-medium text-primary hover:bg-surface-hover transition-colors"
                >
                  {t(`knowledge.languages.${tr.language}`)}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {isDifferentFromUi ? (
          <p className="text-text-secondary">
            {t('knowledge.languageBanner.differentFromUi', {
              docLang: docLanguageLabel,
            })}{' '}
            {!hasTranslationInCurrentLocale
              ? t('knowledge.languageBanner.noTranslationAvailable')
              : null}
          </p>
        ) : null}
      </section>

      {/* Superseded Historical Reference Summary Banner */}
      {metadata.editorialStatus === 'superseded' ? (
        <InformationCallout title={t('knowledge.reader.supersededBannerTitle')}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('knowledge.reader.supersededBannerBody')}</span>
            {(() => {
              const currentTarget =
                incomingRelationships.find(
                  (r) => r.type === 'supersedes' && r.targetSlug
                ) ??
                outgoingRelationships.find(
                  (r) => r.type === 'derived-from' && r.targetSlug
                );
              if (!currentTarget?.targetSlug) return null;
              return (
                <Link
                  href={`/knowledge/${currentTarget.targetSlug}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-primary hover:bg-surface-hover transition-colors"
                >
                  <span>{t('knowledge.reader.supersededOpenCurrent')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              );
            })()}
          </div>
        </InformationCallout>
      ) : null}

      {/* Official Source Knowledge Hub Interpretation Note (Official Text Preserved Verbatim) */}
      {metadata.source.kind === 'official-source' &&
      metadata.source.interpretationNote ? (
        <InformationCallout title={t('knowledge.reader.interpretationNoteTitle')}>
          {resolveLocalizedText(metadata.source.interpretationNote, locale)}
        </InformationCallout>
      ) : null}

      {/* Non-Binding Authority / Research Disclaimer */}
      {showAuthorityDisclaimer ? (
        <InformationCallout title={t('knowledge.reader.researchDisclaimerTitle')}>
          {t('knowledge.reader.researchDisclaimerBody')}
        </InformationCallout>
      ) : null}

      {/* Reading Layout + Desktop Sticky TOC */}
      <ContentLayout
        aside={
          <TableOfContents
            title={t('documentation.tocTitle')}
            items={document.headings}
          />
        }
      >
        <DocumentationArticle>
          {/* Mobile / Tablet Collapsible TOC */}
          <MobileTableOfContents
            title={t('documentation.tocTitle')}
            items={document.headings}
          />

          {/* Server-Sanitized Markdown Body */}
          <MarkdownContent
            html={document.renderedHtml}
            language={metadata.language}
          />

          {/* Linked Official IDs & Discovery Taxonomy */}
          {metadata.traceability.decisionIds.length > 0 ||
          metadata.traceability.officialDocumentId ||
          metadata.phaseRefs.length > 0 ||
          metadata.moduleRefs.length > 0 ||
          metadata.domainRefs.length > 0 ||
          metadata.topics.length > 0 ? (
            <section className="rounded-lg border border-border bg-surface p-4 space-y-3">
              <h2 className="text-sm font-semibold text-text-primary">
                {t('knowledge.reader.taxonomyTitle')}
              </h2>
              <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                {metadata.traceability.officialDocumentId ||
                metadata.traceability.decisionIds.length > 0 ? (
                  <div className="space-y-1 sm:col-span-2">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.officialIds')}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {metadata.traceability.officialDocumentId ? (
                        <code className="font-mono rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-text-primary bidi-ltr">
                          {metadata.traceability.officialDocumentId}
                        </code>
                      ) : null}
                      {metadata.traceability.decisionIds.map((id) => (
                        <code
                          key={id}
                          className="font-mono rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-primary bidi-ltr"
                        >
                          {id}
                        </code>
                      ))}
                    </dd>
                  </div>
                ) : null}

                {metadata.phaseRefs.length > 0 ? (
                  <div className="space-y-1">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.phases')}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {metadata.phaseRefs.map((phase) => {
                        const lbl = getTaxonomyLabel(
                          KNOWN_OFFICIAL_PHASES,
                          phase
                        );
                        return (
                          <span
                            key={phase}
                            className="rounded-sm border border-border px-2 py-0.5 text-text-secondary"
                          >
                            {lbl ? resolveLocalizedText(lbl, locale) : phase}
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                ) : null}

                {metadata.moduleRefs.length > 0 ? (
                  <div className="space-y-1">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.modules')}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {metadata.moduleRefs.map((mod) => {
                        const lbl = getTaxonomyLabel(
                          BUSINESS_MODULES_TAXONOMY,
                          mod
                        );
                        return (
                          <span
                            key={mod}
                            className="rounded-sm border border-border px-2 py-0.5 text-text-secondary"
                          >
                            {lbl ? resolveLocalizedText(lbl, locale) : mod}
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                ) : null}

                {metadata.domainRefs.length > 0 ? (
                  <div className="space-y-1 sm:col-span-2">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.domains')}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {metadata.domainRefs.map((dom) => {
                        const lbl = getTaxonomyLabel(PLATFORM_DOMAINS, dom);
                        return (
                          <span
                            key={dom}
                            className="rounded-sm border border-border px-2 py-0.5 text-text-secondary"
                          >
                            {lbl ? resolveLocalizedText(lbl, locale) : dom}
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                ) : null}

                {metadata.topics.length > 0 ? (
                  <div className="space-y-1 sm:col-span-2">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.topics')}
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {metadata.topics.map((topic) => {
                        const lbl = getTaxonomyLabel(CONTROLLED_TOPICS, topic);
                        return (
                          <span
                            key={topic}
                            className="rounded-sm bg-surface-subtle px-2 py-0.5 text-text-secondary"
                          >
                            {lbl ? resolveLocalizedText(lbl, locale) : topic}
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

          {/* Progressive-Disclosure Source, Attribution & Dates Panel */}
          <details
            open
            className="rounded-lg border border-border bg-surface group"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-text-primary select-none">
              <span>{t('knowledge.reader.provenanceTitle')}</span>
              <span className="inline-flex items-center gap-1 text-xs font-normal text-text-muted">
                <span className="hidden sm:inline">
                  {t('knowledge.reader.provenanceSummary')}
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform duration-150 group-open:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </summary>
            <div className="border-t border-border px-4 py-3">
              <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.sourceKind')}
                  </dt>
                  <dd className="font-medium text-text-primary">
                    {t(`knowledge.reader.sourceKindValues.${metadata.source.kind}`)}
                  </dd>
                </div>

                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.completeness')}
                  </dt>
                  <dd className="font-medium text-text-primary">
                    {t(
                      `knowledge.reader.completenessValues.${metadata.publicationAuthorization.completeness}`
                    )}
                  </dd>
                </div>

                <div className="space-y-0.5 sm:col-span-2">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.attribution')}
                  </dt>
                  <dd className="text-text-primary">
                    {metadata.source.attribution}
                  </dd>
                </div>

                {metadata.source.kind === 'official-source' ||
                metadata.source.kind === 'snapshot-derived' ? (
                  <div className="space-y-0.5 sm:col-span-2">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.sourceRepository')}
                    </dt>
                    <dd>
                      <code className="font-mono text-xs bidi-ltr break-all text-text-primary">
                        {metadata.source.repository}
                      </code>
                    </dd>
                  </div>
                ) : metadata.source.kind === 'external-reference' ? (
                  <div className="space-y-0.5 sm:col-span-2">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.sourceRepository')}
                    </dt>
                    <dd>
                      <a
                        href={metadata.source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-primary hover:underline bidi-ltr break-all"
                      >
                        {metadata.source.sourceUrl}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {metadata.source.kind === 'snapshot-derived' ? (
                  <>
                    <div className="space-y-0.5 sm:col-span-2">
                      <dt className="text-text-muted">
                        {t('knowledge.reader.sourcePaths')}
                      </dt>
                      <dd className="space-y-0.5">
                        {metadata.source.sourcePaths.map((p) => (
                          <code
                            key={p}
                            className="block font-mono text-xs bidi-ltr break-all text-text-secondary"
                          >
                            {p}
                          </code>
                        ))}
                      </dd>
                    </div>
                    <div className="space-y-0.5 sm:col-span-2">
                      <dt className="text-text-muted">
                        {t('knowledge.reader.sourceSha')}
                      </dt>
                      <dd>
                        <code className="font-mono text-xs bidi-ltr break-all text-text-primary">
                          {metadata.source.treeSha}
                        </code>
                      </dd>
                    </div>
                  </>
                ) : metadata.source.kind === 'official-source' ? (
                  <>
                    <div className="space-y-0.5 sm:col-span-2">
                      <dt className="text-text-muted">
                        {t('knowledge.reader.sourcePaths')}
                      </dt>
                      <dd>
                        <code className="font-mono text-xs bidi-ltr break-all text-text-secondary">
                          {metadata.source.sourcePath}
                        </code>
                      </dd>
                    </div>
                    {metadata.source.commitSha ? (
                      <div className="space-y-0.5 sm:col-span-2">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.commitSha')}
                        </dt>
                        <dd>
                          <code className="font-mono text-xs bidi-ltr break-all text-text-primary">
                            {metadata.source.commitSha}
                          </code>
                        </dd>
                      </div>
                    ) : null}
                    {metadata.source.treeSha ? (
                      <div className="space-y-0.5 sm:col-span-2">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.sourceSha')}
                        </dt>
                        <dd>
                          <code className="font-mono text-xs bidi-ltr break-all text-text-primary">
                            {metadata.source.treeSha}
                          </code>
                        </dd>
                      </div>
                    ) : null}
                    {metadata.source.gitBlobSha ? (
                      <div className="space-y-0.5 sm:col-span-2">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.gitBlobSha')}
                        </dt>
                        <dd>
                          <code className="font-mono text-xs bidi-ltr break-all text-success">
                            {metadata.source.gitBlobSha}
                          </code>
                        </dd>
                      </div>
                    ) : null}
                    {metadata.source.verificationStatus ? (
                      <div className="space-y-0.5 sm:col-span-2">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.verificationStatus')}
                        </dt>
                        <dd className="font-medium text-text-primary">
                          {t(
                            `knowledge.reader.verificationStatuses.${metadata.source.verificationStatus}`
                          )}
                        </dd>
                      </div>
                    ) : null}
                    {metadata.source.rawSourceSha256 ? (
                      <div className="space-y-0.5">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.rawSourceSha256')}
                        </dt>
                        <dd>
                          <code className="font-mono text-[11px] bidi-ltr break-all text-text-secondary">
                            {metadata.source.rawSourceSha256}
                          </code>
                        </dd>
                      </div>
                    ) : null}
                    {metadata.source.storedBodySha256 ? (
                      <div className="space-y-0.5">
                        <dt className="text-text-muted">
                          {t('knowledge.reader.storedBodySha256')}
                        </dt>
                        <dd>
                          <code className="font-mono text-[11px] bidi-ltr break-all text-text-secondary">
                            {metadata.source.storedBodySha256}
                          </code>
                        </dd>
                      </div>
                    ) : null}
                  </>
                ) : null}

                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.sourceDocumentDate')}
                  </dt>
                  <dd>{formatDateOrMissing(metadata.source.sourceDocumentDate)}</dd>
                </div>

                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.reviewDate')}
                  </dt>
                  <dd>{formatDateOrMissing(metadata.source.reviewDate)}</dd>
                </div>

                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.publicationDate')}
                  </dt>
                  <dd>{formatDateOrMissing(metadata.source.publicationDate)}</dd>
                </div>

                <div className="space-y-0.5">
                  <dt className="text-text-muted">
                    {t('knowledge.reader.lastVerifiedDate')}
                  </dt>
                  <dd>{formatDateOrMissing(metadata.versioning.lastVerifiedDate)}</dd>
                </div>

                {metadata.publicationAuthorization.scopeNote ? (
                  <div className="space-y-0.5 sm:col-span-2 border-t border-border pt-2.5">
                    <dt className="text-text-muted">
                      {t('knowledge.reader.authorizationNote')}
                    </dt>
                    <dd className="text-text-secondary leading-relaxed">
                      {resolveLocalizedText(
                        metadata.publicationAuthorization.scopeNote,
                        locale
                      )}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </details>

          {/* Related Knowledge: Outgoing Relationships & Incoming Backlinks */}
          <section className="rounded-lg border border-border bg-surface p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-text-muted" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-text-primary">
                {t('knowledge.reader.relationshipsTitle')}
              </h2>
            </div>

            {outgoingRelationships.length === 0 &&
            incomingRelationships.length === 0 ? (
              <p className="text-xs text-text-secondary">
                {t('knowledge.reader.noRelationships')}
              </p>
            ) : (
              <div className="space-y-4">
                {outgoingRelationships.length > 0 ? (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-text-secondary">
                      {t('knowledge.reader.outgoingTitle')}
                    </h3>
                    <ul className="divide-y divide-border">
                      {outgoingRelationships.map(renderRelationshipRow)}
                    </ul>
                  </div>
                ) : null}

                {incomingRelationships.length > 0 ? (
                  <div className="space-y-1 border-t border-border pt-3">
                    <h3 className="text-xs font-semibold text-text-secondary">
                      {t('knowledge.reader.incomingTitle')}
                    </h3>
                    <ul className="divide-y divide-border">
                      {incomingRelationships.map(renderRelationshipRow)}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          {/* Related Revisions (only if present) */}
          {revisions.length > 0 ? (
            <section className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <h2 className="text-sm font-semibold text-text-primary">
                {t('knowledge.reader.revisionsTitle')}
              </h2>
              <ul className="space-y-1.5 text-xs">
                {revisions.map((rev) => (
                  <li key={rev.id}>
                    <Link
                      href={`/knowledge/${rev.slug}`}
                      className="text-primary hover:underline"
                    >
                      v{rev.versioning.revision} —{' '}
                      {resolveLocalizedText(rev.title, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Explicit Collection Sequence Previous / Next Footer (ONLY when meaningful sequence exists) */}
          {neighbors.previous || neighbors.next ? (
            <nav
              aria-label={t('knowledge.reader.sequenceNext')}
              className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2"
            >
              <div>
                {neighbors.previous ? (
                  <Link
                    href={`/knowledge/${neighbors.previous.slug}`}
                    className="group flex flex-col gap-1 rounded-lg border border-border bg-surface p-3.5 hover:bg-surface-hover transition-colors"
                  >
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
                      <PrevIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t('knowledge.reader.sequencePrev')}</span>
                    </span>
                    <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {resolveLocalizedText(neighbors.previous.title, locale)}
                    </span>
                  </Link>
                ) : null}
              </div>

              <div>
                {neighbors.next ? (
                  <Link
                    href={`/knowledge/${neighbors.next.slug}`}
                    className="group flex flex-col items-end text-end gap-1 rounded-lg border border-border bg-surface p-3.5 hover:bg-surface-hover transition-colors"
                  >
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted">
                      <span>{t('knowledge.reader.sequenceNext')}</span>
                      <NextIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {resolveLocalizedText(neighbors.next.title, locale)}
                    </span>
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}
        </DocumentationArticle>
      </ContentLayout>
    </PageContainer>
  );
}
