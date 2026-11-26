'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import { PRODUCT_VISION_DOC } from '@/content/seed/productVisionDoc';
import {
  derivePhase5Progress,
  getCoreBusinessModules,
  getPhase5Capabilities,
  getPlanningPhases,
  getProjectIdentity,
  getReferenceCounts,
  getSnapshotProvenance,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentLayout } from '@/components/layout/ContentLayout';
import { TableOfContents } from '@/components/layout/TableOfContents';
import { DocumentationArticle } from '@/components/documentation/DocumentationArticle';
import { DocumentationSection } from '@/components/documentation/DocumentationSection';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { MetadataPanel } from '@/components/documentation/MetadataPanel';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';
import { DefinitionBlock } from '@/components/documentation/DefinitionBlock';
import { DecisionReference } from '@/components/documentation/DecisionReference';
import { SourceReference } from '@/components/documentation/SourceReference';
import { RelatedContent } from '@/components/documentation/RelatedContent';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Timeline } from '@/components/visualization/Timeline';

export function ProductVisionView() {
  const t = useTranslations();
  const { locale } = useAppLocale();

  const identity = useMemo(() => getProjectIdentity(), []);
  const modules = useMemo(() => getCoreBusinessModules(), []);
  const phases = useMemo(() => getPlanningPhases(), []);
  const capabilities = useMemo(() => getPhase5Capabilities(), []);
  const phase5Progress = useMemo(
    () => derivePhase5Progress(capabilities),
    [capabilities]
  );
  const counts = useMemo(() => getReferenceCounts(), []);
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const approvedCapabilities = useMemo(
    () => capabilities.filter((cap) => cap.status === 'approved'),
    [capabilities]
  );

  const tocItems = useMemo(
    () =>
      PRODUCT_VISION_DOC.headings.map((h) => ({
        id: h.id,
        level: h.level,
        title: resolveLocalizedText(h.title, locale),
      })),
    [locale]
  );

  const relatedItems = useMemo(
    () =>
      PRODUCT_VISION_DOC.relatedLinks.map((item) => ({
        href: item.href,
        title: resolveLocalizedText(item.title, locale),
        description: resolveLocalizedText(item.description, locale),
        classification: item.classification,
        classificationLabel: t(
          `classification.${item.classification}.shortLabel`
        ),
      })),
    [locale, t]
  );

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification={PRODUCT_VISION_DOC.metadata.classification}
              label={t('classification.official.label')}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <StatusIndicator
              status="approved"
              label={t('status.reference_snapshot')}
            />
          </>
        }
        title={t('productVision.title')}
        subtitle={t('productVision.subtitle')}
        meta={
          <>
            <code className="font-mono bidi-ltr text-text-primary">
              {PRODUCT_VISION_DOC.metadata.documentId}
            </code>
            <span aria-hidden="true">·</span>
            <code className="font-mono bidi-ltr text-text-secondary">
              {provenance.reviewedTreeSha.slice(0, 12)}
            </code>
            <span aria-hidden="true">·</span>
            <span>
              {resolveLocalizedText(
                PRODUCT_VISION_DOC.metadata.sourceReference,
                locale
              )}
            </span>
          </>
        }
      />

      <ContentLayout
        aside={
          <TableOfContents
            title={t('documentation.tocTitle')}
            items={tocItems}
          />
        }
      >
        <DocumentationArticle>
          {/* Document Metadata & Provenance Panel */}
          <MetadataPanel
            title={t('documentation.metadataTitle')}
            entries={[
              {
                label: t('documentation.documentId'),
                value: (
                  <code className="font-mono text-xs bidi-ltr">
                    {PRODUCT_VISION_DOC.metadata.documentId}
                  </code>
                ),
              },
              {
                label: t('documentation.classificationLabel'),
                value: (
                  <ContentClassification
                    classification={PRODUCT_VISION_DOC.metadata.classification}
                    label={t('classification.official.label')}
                  />
                ),
              },
              {
                label: t('documentation.approvalStatus'),
                value: (
                  <StatusIndicator
                    status="approved"
                    label={t('status.reference_snapshot')}
                  />
                ),
              },
              {
                label: t('provenance.referenceReviewDate'),
                value: (
                  <code className="font-mono text-xs bidi-ltr">
                    {provenance.referenceReviewDate}
                  </code>
                ),
              },
            ]}
          />

          <InformationCallout title={t('documentation.scopeLabel')}>
            {resolveLocalizedText(
              PRODUCT_VISION_DOC.metadata.scopeNote,
              locale
            )}
          </InformationCallout>

          <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5 text-xs">
              <p className="font-semibold text-text-primary">
                {t('productVision.libraryLinkTitle')}
              </p>
              <p className="text-text-secondary">
                {t('productVision.libraryLinkBody')}
              </p>
            </div>
            <Link
              href={
                locale === 'en'
                  ? '/knowledge/teranoo-product-vision-reference-en'
                  : '/knowledge/teranoo-product-vision-reference'
              }
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-hover transition-colors"
            >
              <span>{t('productVision.libraryLinkAction')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Section 1: Product Identity */}
          <DocumentationSection
            id="identity"
            title={t('productVision.toc.identity')}
          >
            <p className="text-text-secondary">
              {t('productVision.identityIntro')}
            </p>

            <ComparisonTable
              caption={t('productVision.toc.identity')}
              headers={[
                t('productVision.identityHeaders.attribute'),
                t('productVision.identityHeaders.value'),
              ]}
              rows={[
                [
                  t('productVision.productNameLabel'),
                  <span key="p" className="font-mono bidi-ltr text-text-primary">
                    {identity.productName}
                  </span>,
                ],
                [
                  t('dashboard.identityStrip.productType'),
                  resolveLocalizedText(identity.productType, locale),
                ],
                [
                  t('dashboard.identityStrip.targetCustomers'),
                  resolveLocalizedText(identity.targetCustomers, locale),
                ],
                [
                  t('dashboard.identityStrip.strategy'),
                  resolveLocalizedText(identity.productStrategy, locale),
                ],
              ]}
            />
          </DocumentationSection>

          {/* Section 2: Strategy & Target Segment */}
          <DocumentationSection
            id="strategy"
            title={t('productVision.toc.strategy')}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DefinitionBlock
                term={t('productVision.strategyTerm')}
                englishTerm="Commercial · Modular · Configurable"
                definition={resolveLocalizedText(
                  identity.productStrategy,
                  locale
                )}
              />
              <DefinitionBlock
                term={t('productVision.targetCustomersTerm')}
                englishTerm="Enterprise Segment"
                definition={resolveLocalizedText(
                  identity.targetCustomers,
                  locale
                )}
              />
            </div>
          </DocumentationSection>

          {/* Section 3: Core Business Modules */}
          <DocumentationSection
            id="modules"
            title={t('productVision.toc.modules')}
          >
            <p className="text-text-secondary">
              {t('productVision.modulesIntro')}
            </p>

            <ComparisonTable
              caption={t('productVision.toc.modules')}
              headers={[
                t('productVision.modulesHeaders.order'),
                t('productVision.modulesHeaders.module'),
                t('productVision.modulesHeaders.englishName'),
              ]}
              rows={modules.map((mod) => [
                <span key={`o-${mod.id}`} className="font-mono tabular-nums">
                  {String(mod.order).padStart(2, '0')}
                </span>,
                resolveLocalizedText(mod.name, locale),
                <span key={`en-${mod.id}`} className="bidi-ltr text-text-secondary">
                  {mod.name.en}
                </span>,
              ])}
            />
          </DocumentationSection>

          {/* Section 4: Deployment & Database Profile */}
          <DocumentationSection
            id="deployment"
            title={t('productVision.toc.deployment')}
          >
            <ComparisonTable
              caption={t('productVision.toc.deployment')}
              headers={[
                t('productVision.deploymentHeaders.dimension'),
                t('productVision.deploymentHeaders.model'),
                t('productVision.deploymentHeaders.note'),
              ]}
              rows={[
                [
                  t('dashboard.identityStrip.deployment'),
                  <code key="saas" className="font-mono text-xs bidi-ltr text-text-primary">
                    {resolveLocalizedText(identity.deploymentStrategy, locale)}
                  </code>,
                  t('productVision.deploymentNotes.primary'),
                ],
                [
                  t('dashboard.identityStrip.futureProfile'),
                  <code key="onprem" className="font-mono text-xs bidi-ltr text-text-primary">
                    {resolveLocalizedText(
                      identity.futureDeploymentProfile,
                      locale
                    )}
                  </code>,
                  t('productVision.deploymentNotes.future'),
                ],
                [
                  t('dashboard.identityStrip.database'),
                  <code key="pg" className="font-mono text-xs bidi-ltr text-text-primary">
                    {identity.databaseEngine}
                  </code>,
                  t('productVision.deploymentNotes.database'),
                ],
              ]}
            />
          </DocumentationSection>

          {/* Section 5: Governance & Planning Phases */}
          <DocumentationSection
            id="governance"
            title={t('productVision.toc.governance')}
          >
            <p className="text-text-secondary">
              {t('productVision.governanceSummary', {
                completed: phase5Progress.completedCount,
                total: phase5Progress.totalCount,
                decisions: counts.approvedArchitecturalDecisions,
              })}
            </p>

            <Timeline
              items={phases.map((phase) => ({
                id: phase.code,
                code: phase.code,
                title: resolveLocalizedText(phase.name, locale),
                status: phase.status,
                statusLabel: t(`status.${phase.status}`),
              }))}
            />

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-text-secondary">
                {t('productVision.approvedDecisionsHeading')}
              </p>
              <div className="flex flex-wrap gap-2">
                {approvedCapabilities.map((cap) =>
                  cap.decisionId ? (
                    <DecisionReference
                      key={cap.id}
                      decisionId={cap.decisionId}
                      title={resolveLocalizedText(cap.name, locale)}
                      href="/platform"
                    />
                  ) : null
                )}
              </div>
            </div>

            <SourceReference
              label={t('documentation.sourceRefPrefix')}
              source={`${provenance.officialSources.join(' · ')} (${provenance.reviewedTreeSha.slice(0, 12)})`}
              identifier={PRODUCT_VISION_DOC.metadata.documentId}
            />
          </DocumentationSection>

          <RelatedContent
            title={t('documentation.relatedContentTitle')}
            items={relatedItems}
          />
        </DocumentationArticle>
      </ContentLayout>
    </PageContainer>
  );
}
