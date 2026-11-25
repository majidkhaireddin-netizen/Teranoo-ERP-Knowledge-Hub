'use client';

import React, { useMemo } from 'react';
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

  const isAr = locale === 'ar';

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
          {/* Document Metadata Panel */}
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
                label: t('documentation.sourceReference'),
                value: resolveLocalizedText(
                  PRODUCT_VISION_DOC.metadata.sourceReference,
                  locale
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

          {/* Section 1: Product Identity */}
          <DocumentationSection
            id="identity"
            title={t('productVision.toc.identity')}
          >
            <p className="text-text-secondary">
              {isAr
                ? 'يمثل Teranoo ERP منتجًا تجاريًا لبناء نظام تخطيط موارد مؤسسات (Enterprise-Grade Modular ERP) موجّهًا للمؤسسات المتوسطة والكبيرة، ومصمّمًا بهيكلة معيارية قابلة للتهيئة.'
                : 'Teranoo ERP is a commercial product initiative to build an Enterprise-Grade Modular ERP tailored for Medium & Large Enterprises, architected as a configurable modular platform.'}
            </p>

            <ComparisonTable
              caption={t('productVision.toc.identity')}
              headers={
                isAr
                  ? ['السمة المرجعية', 'القيمة المعتمدة في اللقطة المرجعية']
                  : ['Reference Attribute', 'Authorized Snapshot Value']
              }
              rows={[
                [
                  isAr ? 'اسم المنتج' : 'Product',
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
                term={isAr ? 'استراتيجية المنتج' : 'Product Strategy'}
                englishTerm="Commercial · Modular · Configurable"
                definition={resolveLocalizedText(
                  identity.productStrategy,
                  locale
                )}
              />
              <DefinitionBlock
                term={isAr ? 'الفئة المستهدفة' : 'Target Customers'}
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
              {isAr
                ? 'يتركز النطاق التجاري الأساسي للمنتج على أربعة أنظمة رئيسية تعمل فوق طبقة المنصة المشتركة (Shared Platform Foundation):'
                : 'The core commercial scope centers on four foundational business modules operating atop the Shared Platform Foundation:'}
            </p>

            <ComparisonTable
              caption={t('productVision.toc.modules')}
              headers={
                isAr
                  ? ['#', 'الرمز', 'النظام التجاري الأساسي']
                  : ['#', 'Code', 'Business Core Module']
              }
              rows={modules.map((mod) => [
                <span key={`o-${mod.id}`} className="font-mono tabular-nums">
                  {String(mod.order).padStart(2, '0')}
                </span>,
                <code
                  key={`c-${mod.id}`}
                  className="font-mono text-xs bidi-ltr text-primary"
                >
                  {mod.code}
                </code>,
                resolveLocalizedText(mod.name, locale),
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
              headers={
                isAr
                  ? ['البُعد التقني', 'النموذج المعتمد', 'ملاحظة النطاق']
                  : ['Technical Dimension', 'Authorized Model', 'Scope Note']
              }
              rows={[
                [
                  t('dashboard.identityStrip.deployment'),
                  <code key="saas" className="font-mono text-xs bidi-ltr text-text-primary">
                    {resolveLocalizedText(identity.deploymentStrategy, locale)}
                  </code>,
                  isAr
                    ? 'استراتيجية التشغيل الأساسية للمنتج'
                    : 'Primary deployment strategy for Teranoo ERP',
                ],
                [
                  t('dashboard.identityStrip.futureProfile'),
                  <code key="onprem" className="font-mono text-xs bidi-ltr text-text-primary">
                    {resolveLocalizedText(
                      identity.futureDeploymentProfile,
                      locale
                    )}
                  </code>,
                  isAr
                    ? 'ملف استضافة مستقبلي مخطط ضمن الرؤية المعمارية'
                    : 'Future deployment profile recognized in architecture',
                ],
                [
                  t('dashboard.identityStrip.database'),
                  <code key="pg" className="font-mono text-xs bidi-ltr text-text-primary">
                    {identity.databaseEngine}
                  </code>,
                  isAr
                    ? 'محرك قاعدة البيانات المعتمد للمنتج'
                    : 'Authorized relational database engine',
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
              {isAr
                ? `يُوثَّق تقدم المشروع وفق مراحل تخطيط واعتماد معماري متتابعة. أُنجزت المراحل من 1 إلى 4، فيما يجري حاليًا استكمال المرحلة الخامسة (قدرات المنصة المشتركة) بنسبة اعتماد ${phase5Progress.completedCount} من ${phase5Progress.totalCount} بندًا، ضمن إجمالي ${counts.approvedArchitecturalDecisions} قرارًا معماريًا معتمدًا في اللقطة المرجعية.`
                : `Project progression follows structured architectural planning and approval phases. Phases 1 through 4 are completed, while Phase 5 (Shared Platform Capabilities) is in progress with ${phase5Progress.completedCount} of ${phase5Progress.totalCount} items approved within a reference snapshot of ${counts.approvedArchitecturalDecisions} approved architectural decisions.`}
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
                {isAr
                  ? 'معرفات القرارات المعتمدة في المرحلة الخامسة:'
                  : 'Approved Phase 5 Decision Identifiers:'}
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
              source={resolveLocalizedText(
                PRODUCT_VISION_DOC.metadata.sourceReference,
                locale
              )}
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
