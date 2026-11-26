'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpenCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import { PRODUCT_VISION_DOC } from '@/content/seed/productVisionDoc';
import {
  derivePhase5Progress,
  getCoreBusinessModules,
  getPhase5Capabilities,
  getProjectIdentity,
  getSnapshotProvenance,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentLayout } from '@/components/layout/ContentLayout';
import {
  MobileTableOfContents,
  TableOfContents,
} from '@/components/layout/TableOfContents';
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
import type { SourceManifestEntry } from '@/content/models/knowledge';

export interface ProductVisionViewProps {
  visionSourceEntry?: SourceManifestEntry;
}

const VISION_TOC = [
  { id: 'identity', level: 2 as const, title: { ar: '1. ما هو Teranoo ERP والهوية المعتمدة', en: '1. What Is Teranoo ERP & Identity' } },
  { id: 'problem-market', level: 2 as const, title: { ar: '2. المشكلة السوقية والعملاء والقطاعات الأربعة', en: '2. Problem Statement, Customers & 4 Industries' } },
  { id: 'positioning', level: 2 as const, title: { ar: '3. التموضع التجاري ومعنى Enterprise-Grade', en: '3. Commercial Positioning & Enterprise-Grade' } },
  { id: 'architecture-scope', level: 2 as const, title: { ar: '4. خريطة المنتج: النواة والمنصة والتوسعات', en: '4. Product Scope: Core, Platform & Extensions' } },
  { id: 'core-principles', level: 2 as const, title: { ar: '5. المبادئ المعمارية السبعة الأساسية', en: '5. Seven Core Architectural Principles' } },
  { id: 'anti-goals', level: 2 as const, title: { ar: '6. حدود المنتج وما لا يمثّله (Anti-Goals)', en: '6. Product Boundaries & Anti-Goals' } },
  { id: 'success-criteria', level: 2 as const, title: { ar: '7. معايير النجاح العشرة والقرارات المفتوحة', en: '7. Ten Success Criteria & Open Decisions' } },
] as const;

export function ProductVisionView({
  visionSourceEntry,
}: ProductVisionViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  const identity = useMemo(() => getProjectIdentity(), []);
  const modules = useMemo(() => getCoreBusinessModules(), []);
  const capabilities = useMemo(() => getPhase5Capabilities(), []);
  const phase5Progress = useMemo(
    () => derivePhase5Progress(capabilities),
    [capabilities]
  );
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const tocItems = useMemo(
    () =>
      VISION_TOC.map((h) => ({
        id: h.id,
        level: h.level,
        title: resolveLocalizedText(h.title, locale),
      })),
    [locale]
  );

  const relatedItems = useMemo(
    () => [
      {
        href: '/knowledge/project-vision',
        title: isAr
          ? 'النص الرسمي الكامل — 00_PROJECT_VISION.md'
          : 'Full Official Source — 00_PROJECT_VISION.md',
        description: isAr
          ? 'قراءة الوثيقة الرسمية الكاملة كما وردت في مستودع تخطيط Teranoo ERP مع بصمة Git blob SHA.'
          : 'Read the complete verbatim official source document with verified Git blob SHA provenance.',
        classification: 'official' as const,
        classificationLabel: t('classification.official.shortLabel'),
      },
      ...PRODUCT_VISION_DOC.relatedLinks.map((item) => ({
        href: item.href,
        title: resolveLocalizedText(item.title, locale),
        description: resolveLocalizedText(item.description, locale),
        classification: item.classification,
        classificationLabel: t(
          `classification.${item.classification}.shortLabel`
        ),
      })),
    ],
    [isAr, locale, t]
  );

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification="official"
              label={t('classification.official.label')}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <StatusIndicator
              status="approved"
              label={t('status.approved')}
            />
          </>
        }
        title={t('productVision.title')}
        subtitle={t('productVision.subtitle')}
        meta={
          <>
            <code className="font-mono bidi-ltr text-text-primary">
              00_PROJECT_VISION.md
            </code>
            <span aria-hidden="true">·</span>
            <code className="font-mono bidi-ltr text-text-secondary">
              {(provenance.reviewedCommitSha ?? provenance.reviewedTreeSha).slice(0, 12)}
            </code>
            <span aria-hidden="true">·</span>
            <Link
              href="/knowledge/project-vision"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <span>{t('foundations.productVision.readFullSourceAction')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
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
          <MobileTableOfContents
            title={t('documentation.tocTitle')}
            items={tocItems}
          />

          {/* Metadata & Direct Official Source Link */}
          <MetadataPanel
            title={t('documentation.metadataTitle')}
            entries={[
              {
                label: t('documentation.documentId'),
                value: (
                  <code className="font-mono text-xs bidi-ltr">
                    kh-doc-project-vision-ar
                  </code>
                ),
              },
              {
                label: t('documentation.classificationLabel'),
                value: (
                  <ContentClassification
                    classification="official"
                    label={t('classification.official.label')}
                  />
                ),
              },
              {
                label: t('documentation.approvalStatus'),
                value: (
                  <StatusIndicator
                    status="approved"
                    label={isAr ? 'معتمد ومغلق (Phase 1 Closed)' : 'Approved (Phase 1 Closed)'}
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

          {/* Official Source Imported & Verified Banner */}
          <InformationCallout title={t('foundations.productVision.sourceStatusTitle')}>
            <div className="space-y-2">
              <p>{t('foundations.productVision.sourceStatusBody')}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {visionSourceEntry ? (
                  <code className="font-mono text-[11px] text-text-muted bidi-ltr break-all">
                    {visionSourceEntry.sourcePath}
                    {visionSourceEntry.actualGitBlobSha ??
                    visionSourceEntry.expectedGitBlobSha
                      ? ` · git-blob: ${(visionSourceEntry.actualGitBlobSha ?? visionSourceEntry.expectedGitBlobSha)!.slice(0, 12)}`
                      : ''}
                  </code>
                ) : null}
                <Link
                  href="/knowledge/project-vision"
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-primary hover:bg-surface-hover transition-colors"
                >
                  <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('foundations.productVision.readFullSourceAction')}</span>
                </Link>
              </div>
            </div>
          </InformationCallout>

          {/* Section 1: Product Identity */}
          <DocumentationSection
            id="identity"
            title={resolveLocalizedText(VISION_TOC[0].title, locale)}
          >
            <p className="text-sm leading-relaxed text-text-secondary">
              {isAr
                ? 'Teranoo ERP هو نظام تخطيط موارد مؤسسات تجاري بمستوى المؤسسات (Enterprise-Grade Commercial ERP) مصمَّم ليكون منتجًا قياسيًا قابلًا للتهيئة والتوسع، وليس برنامجًا مخصصًا لعميل واحد. ينطلق المنتج بنواة متماسكة من الوحدات الأساسية فوق منصة مشتركة، مع قابلية إضافة وحدات مؤسسية وامتدادات قطاعية دون تشعيب النواة.'
                : 'Teranoo ERP is a commercial Enterprise-Grade Modular ERP product engineered as a configurable, extensible platform rather than a single-customer bespoke build. It launches with a cohesive core of business modules atop a mandatory shared platform foundation, cleanly supporting future enterprise modules and industry extensions without core forks.'}
            </p>

            <ComparisonTable
              caption={resolveLocalizedText(VISION_TOC[0].title, locale)}
              headers={[
                t('productVision.identityHeaders.attribute'),
                t('productVision.identityHeaders.value'),
              ]}
              rows={[
                [
                  t('productVision.productNameLabel'),
                  <code key="p" className="font-mono bidi-ltr text-text-primary">
                    {identity.productName}
                  </code>,
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
                [
                  t('dashboard.identityStrip.deployment'),
                  <code key="dep" className="font-mono text-xs bidi-ltr text-text-primary">
                    SaaS-first · Future: Connected On-Premises
                  </code>,
                ],
                [
                  t('dashboard.identityStrip.database'),
                  <code key="pg" className="font-mono text-xs bidi-ltr text-text-primary">
                    PostgreSQL (Single-Engine Policy — D-DEP-05/06)
                  </code>,
                ],
              ]}
            />
          </DocumentationSection>

          {/* Section 2: Problem Statement, Target Customers & 4 Industries */}
          <DocumentationSection
            id="problem-market"
            title={resolveLocalizedText(VISION_TOC[1].title, locale)}
          >
            <p className="text-sm leading-relaxed text-text-secondary">
              {isAr
                ? 'تعالج وثيقة الرؤية خمس فجوات جوهرية تعاني منها الشركات المتوسطة والكبيرة: تشتّت الأنظمة وضعف التكامل بين المالية والمخزون والمشتريات والمبيعات، وصعوبة التوسع في الأنظمة التقليدية، والتعقيد وتكلفة الامتلاك المرتفعة للأنظمة العالمية، وضعف الدعم الحقيقي للغة العربية وواجهات RTL والامتثال المحلي، وقابلية الكسر عند التخصيص العشوائي.'
                : 'The official vision addresses five structural gaps facing Medium & Large Enterprises: fragmented silos between Finance, Inventory, Procurement, and Sales; poor scalability of legacy systems; prohibitive TCO and complexity of global legacy ERPs; weak native Arabic/RTL and regional compliance support; and upgrade breakage caused by uncontrolled per-customer code customization.'}
            </p>

            <ComparisonTable
              caption={isAr ? 'القطاعات الصناعية الأربعة المستهدفة وترتيب الإطلاق المعتمد' : 'Four Primary Target Industries & Approved Sequencing'}
              headers={
                isAr
                  ? ['#', 'القطاع المستهدف (00_PROJECT_VISION.md)', 'أولوية الإطلاق وفق بوابة القرار A (D-MKT-01)']
                  : ['#', 'Target Industry (00_PROJECT_VISION.md)', 'Launch Priority per Decision Gate A (D-MKT-01)']
              }
              rows={[
                [
                  '01',
                  isAr ? 'التجارة والتوزيع بالجملة (Trading & Wholesale Distribution)' : 'Trading & Wholesale Distribution',
                  isAr ? 'أولوية الإطلاق الوحيدة للنسخة الأولى V1 (سوق الأردن أولًا — مشروط بـ O-2)' : 'Sole First Launch Priority for V1 (Jordan first — conditional on O-2)',
                ],
                [
                  '02',
                  isAr ? 'التصنيع (Manufacturing)' : 'Manufacturing',
                  isAr ? 'القطاع الثاني بعد Phase 8 (خارج الإطلاق المتزامن لـ V1)' : 'Second priority after Phase 8 (not simultaneous in V1)',
                ],
                [
                  '03',
                  isAr ? 'المقاولات والإنشاءات (Construction & Contracting)' : 'Construction & Contracting',
                  isAr ? 'مؤجّل لما بعد الإطلاق الأول عبر امتدادات قطاعية' : 'Deferred post-V1 via isolated industry extensions',
                ],
                [
                  '04',
                  isAr ? 'الخدمات المهنية والمعتمدة على المشاريع (Professional & Project-Based Services)' : 'Professional & Project-Based Services',
                  isAr ? 'مؤجّل لما بعد الإطلاق الأول عبر وحدات المشاريع والامتدادات' : 'Deferred post-V1 via Projects module & industry extensions',
                ],
              ]}
            />
          </DocumentationSection>

          {/* Section 3: Commercial Positioning & Enterprise-Grade Meaning */}
          <DocumentationSection
            id="positioning"
            title={resolveLocalizedText(VISION_TOC[2].title, locale)}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DefinitionBlock
                term={isAr ? 'التموضع التجاري (Commercial Positioning)' : 'Commercial Positioning'}
                englishTerm="Enterprise-Grade · Configurable · Regional Strength"
                definition={
                  isAr
                    ? 'نظام ERP مؤسسي حديث يجمع بين الانضباط المعماري العالي والمرونة التشغيلية والقدرة على التوطين الإقليمي والعربي الأصيل، دون تعقيد وبطء الأنظمة التقليدية القديمة ودون سطحية أنظمة الشركات الصغيرة.'
                    : 'A modern enterprise ERP combining rigorous architectural discipline, operational configurability, and native Arabic/regional localization — avoiding both legacy ERP rigidity and small-business accounting limitations.'
                }
              />
              <DefinitionBlock
                term={isAr ? 'ماذا يعني Enterprise-Grade في Teranoo؟' : 'What Enterprise-Grade Means in Teranoo'}
                englishTerm="Multi-Entity · Auditability · Isolation · Upgrades"
                definition={
                  isAr
                    ? 'دعم حقيقي لتعدد العملاء والشركات والفروع والعملات واللغات، فصل صلاحيات وسير موافقات دقيق، سجل تدقيق غير قابل للتلاعب، قابلية توسع وتحديث آمن، وانضباط مالي ومحاسبي صارم.'
                    : 'Native multi-tenant, multi-company, multi-branch, multi-currency, and bilingual capabilities paired with granular RBAC, approval workflows, immutable audit trails, upgrade safety, and strict accounting integrity.'
                }
              />
            </div>

            <div className="rounded-lg border border-border bg-surface-subtle/60 p-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <ContentClassification
                  classification="educational"
                  label={t('classification.educational.shortLabel')}
                />
                <span className="font-semibold text-text-primary">
                  {isAr ? 'شرح تعليمي — لماذا يهم هذا التموضع؟' : 'Educational Explanation — Why This Positioning Matters'}
                </span>
              </div>
              <p className="leading-relaxed text-text-secondary">
                {isAr
                  ? 'أغلب مشاريع ERP تفشل مبكرًا إما لأنها تبدأ كأداة محاسبة صغيرة تعجز لاحقًا عن إضافة تعدد الشركات وسير الموافقات وعزل المستأجرين، أو لأنها تحاول بناء 20 وحدة دفعة واحدة فتفقد الجودة. التموضع هنا يحمي المنتج عبر نواة صغيرة عميقة فوق منصة مؤسسية صلبة.'
                  : 'Most ERP initiatives fail either by starting as lightweight accounting tools that cannot retrofit multi-company isolation and workflows later, or by attempting 20 modules simultaneously. This positioning protects the product with a focused, deep four-module core atop an enterprise-grade shared platform.'}
              </p>
            </div>
          </DocumentationSection>

          {/* Section 4: Product Scope: Core Modules, Mandatory Platform, Future Modules & Extensions */}
          <DocumentationSection
            id="architecture-scope"
            title={resolveLocalizedText(VISION_TOC[3].title, locale)}
          >
            <ComparisonTable
              caption={isAr ? 'الأنظمة التجارية الأساسية الأربعة (Core Business Modules)' : 'Four Core Business Modules'}
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-xs">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <h3 className="font-semibold text-text-primary">
                  {isAr
                    ? 'طبقة المنصة المشتركة الإلزامية (Phase 5 — مكتملة 13/13)'
                    : 'Mandatory Shared Platform Foundation (Phase 5 — Completed 13/13)'}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {isAr
                    ? '12 إطار قدرة تشغيلية معتمدة (D-PLAT-01..D-PLAT-12) تخدم جميع الوحدات الأساسية والمستقبلية، إضافة إلى بوابة الاعتماد التجميعي #13 (D-PLAT-13).'
                    : '12 approved runtime capability frameworks (D-PLAT-01..D-PLAT-12) shared across all current and future modules, plus item #13 consolidated adoption gate (D-PLAT-13).'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {capabilities.map((cap) =>
                    cap.decisionId ? (
                      <DecisionReference
                        key={cap.id}
                        decisionId={cap.decisionId}
                        href={`/decisions?decision=${encodeURIComponent(cap.decisionId)}`}
                      />
                    ) : null
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <h3 className="font-semibold text-text-primary">
                  {isAr
                    ? 'الوحدات المؤسسية المستقبلية (Phase 7) والامتدادات القطاعية (Phase 8)'
                    : 'Future Enterprise Modules (Phase 7) & Industry Extensions (Phase 8)'}
                </h3>
                <ul className="space-y-1 text-text-secondary list-disc ps-4">
                  <li>Projects &amp; Project Accounting</li>
                  <li>Human Capital Management (HCM) &amp; Payroll</li>
                  <li>Customer Relationship Management (CRM)</li>
                  <li>Enterprise Asset Management (EAM) / Maintenance</li>
                  <li>Advanced Budgeting &amp; Performance Management</li>
                  <li>
                    {isAr
                      ? 'امتدادات قطاعية معزولة تُبنى للفجوات القطاعية المثبتة فقط دون تعديل النواة'
                      : 'Isolated industry extensions built strictly for verified industry gaps without forking the core'}
                  </li>
                </ul>
              </div>
            </div>
          </DocumentationSection>

          {/* Section 5: Seven Core Architectural Principles + §7.3 Historical Resolution Note */}
          <DocumentationSection
            id="core-principles"
            title={resolveLocalizedText(VISION_TOC[4].title, locale)}
          >
            <ComparisonTable
              caption={isAr ? 'المبادئ المعمارية السبعة في القسم 7 من 00_PROJECT_VISION.md' : 'Seven Architectural Principles from Section 7 of 00_PROJECT_VISION.md'}
              headers={
                isAr
                  ? ['#', 'المبدأ المعماري (00_PROJECT_VISION.md)', 'الوضع المرجعي الحالي بعد المراحل 2–5']
                  : ['#', 'Architectural Principle (00_PROJECT_VISION.md)', 'Current Status After Phases 2–5']
              }
              rows={[
                [
                  '7.1',
                  isAr ? 'المعيارية الصارمة وفصل الوحدات بعقود واضحة (Modular & Loosely Coupled)' : 'Strict Modularity & Clear Contracts',
                  isAr ? 'معتمد ومفصّل في المرحلة 2 (PCD/HBMD/CIC/FLD) والضوابط العابرة' : 'Detailed in Phase 2 (PCD/HBMD/CIC/FLD) & Cross-Phase Guardrails',
                ],
                [
                  '7.2',
                  isAr ? 'تعدد العملاء وتعدد الشركات والفروع كأصل تصميمي (Multi-Tenant / Multi-Company / Multi-Branch)' : 'Native Multi-Tenant, Multi-Company & Multi-Branch',
                  isAr ? 'محسوم بالكامل في المرحلة 3 (D-TEN / D-COMP / D-BR / D-ORG)' : 'Fully resolved in Phase 3 (D-TEN / D-COMP / D-BR / D-ORG)',
                ],
                [
                  '7.3',
                  isAr ? 'عزل بيانات العملاء (Tenant Data Isolation) — لاحظ التنبيه التاريخي أدناه' : 'Tenant Data Isolation — see historical note below',
                  isAr ? 'تم الحسم لاحقًا في المرحلة 3 عبر D-ISO-01..D-ISO-12 (سياسة العزل الرسمية)' : 'Later resolved in Phase 3 via D-ISO-01..D-ISO-12',
                ],
                [
                  '7.4',
                  isAr ? 'التخصيص عبر التهيئة والامتدادات الآمنة للترقية (Config-First & Upgrade-Safe)' : 'Configuration-First & Upgrade-Safe Extensibility',
                  isAr ? 'مُثبّت في الضابط #1 و#8 والمرحلة 5 (D-PLAT-11 / D-PLAT-12)' : 'Codified in Guardrails #1 & #8 and Phase 5 (D-PLAT-11 / D-PLAT-12)',
                ],
                [
                  '7.5',
                  isAr ? 'العربية واللغات المتعددة وRTL كأصل معماري (Native Arabic/RTL & Localization)' : 'Native Arabic, RTL & Multi-Language Localization',
                  isAr ? 'معتمد في المرحلة 5 (D-PLAT-05 Localization Framework)' : 'Approved in Phase 5 (D-PLAT-05 Localization Framework)',
                ],
                [
                  '7.6',
                  isAr ? 'استراتيجية استضافة SaaS-first مع ملف مستقبلي Connected On-Premises' : 'SaaS-First with Future Connected On-Premises Profile',
                  isAr ? 'معتمد في المرحلة 4 (D-DEP-01..D-DEP-04)' : 'Approved in Phase 4 (D-DEP-01..D-DEP-04)',
                ],
                [
                  '7.7',
                  isAr ? 'توحيد محرك قاعدة البيانات — PostgreSQL كمحرك وحيد مدعوم إنتاجيًا' : 'Single Relational Database Engine — PostgreSQL',
                  isAr ? 'مؤكَّد رسميًا في المرحلة 4 (D-DEP-05 & D-DEP-06 Single-Engine Policy)' : 'Confirmed in Phase 4 (D-DEP-05 & D-DEP-06 Single-Engine Policy)',
                ],
              ]}
            />

            {/* Explicit Historical Context Note for §7.3 (Official wording preserved verbatim!) */}
            <InformationCallout
              title={
                isAr
                  ? 'ملاحظة تفسيرية تاريخية حول البند 7.3 (عزل بيانات العملاء)'
                  : 'Historical Context Note on Section 7.3 (Tenant Data Isolation)'
              }
            >
              {isAr
                ? 'لا تزال الوثيقة الأصلية 00_PROJECT_VISION.md (المحفوظة حرفيًا دون تعديل في مكتبة المعرفة) تتضمن في البند 7.3 عبارة تاريخية من المرحلة 1 مفادها أن «نموذج العزل التفصيلي للـTenants لم يُحسم بعد». وقد حُسم هذا الموضوع رسميًا لاحقًا في المرحلة 3 عبر قرارات عزل البيانات (D-ISO-01..D-ISO-12) المسجّلة في سجل القرارات.'
                : 'The verbatim official source 00_PROJECT_VISION.md retains its Phase 1 historical wording in Section 7.3 stating that the detailed tenant isolation model was not yet finalized. That decision was subsequently resolved in Phase 3 via D-ISO-01..D-ISO-12 in the official Decision Register.'}
            </InformationCallout>
          </DocumentationSection>

          {/* Section 6: Product Boundaries & Anti-Goals */}
          <DocumentationSection
            id="anti-goals"
            title={resolveLocalizedText(VISION_TOC[5].title, locale)}
          >
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <ShieldAlert className="h-4 w-4 text-warning shrink-0" aria-hidden="true" />
                <span>
                  {isAr
                    ? 'ما لا يمثّله Teranoo ERP (حدود المنتج المعتمدة — Anti-Goals)'
                    : 'What Teranoo ERP Is NOT (Approved Product Anti-Goals)'}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-text-secondary">
                {(isAr
                  ? [
                      'ليس نظامًا مخصصًا لعميل واحد أو مشروع برمجة حسب الطلب.',
                      'ليس أداة محاسبة بسيطة للشركات المتناهية الصغر (Micro/Freelance).',
                      'ليس مجموعة تطبيقات متفرقة بدون نواة بيانات وهوية موحّدة.',
                      'لا يقبل تشعيب الشيفرة الأساسية (Per-Customer Core Forking).',
                      'لا يطلق جميع القطاعات الأربعة دفعة واحدة في النسخة الأولى V1.',
                      'لا يدعم تعدد محركات قواعد البيانات في الإنتاج (سياسة PostgreSQL وحيد).',
                    ]
                  : [
                      'Not a bespoke single-customer software build.',
                      'Not a lightweight micro-business bookkeeping app.',
                      'Not a loose bundle of disconnected apps lacking unified identity and master data.',
                      'No per-customer core code forking.',
                      'No simultaneous V1 launch across all four target industries.',
                      'No multi-database engine matrix in production (Single-Engine PostgreSQL policy).',
                    ]
                ).map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-surface-subtle/40 px-3 py-2 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </DocumentationSection>

          {/* Section 7: Ten Success Criteria & Open Decisions */}
          <DocumentationSection
            id="success-criteria"
            title={resolveLocalizedText(VISION_TOC[6].title, locale)}
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
              {(isAr
                ? [
                    '1. وضوح حدود الوحدات الأساسية ومنع الاعتماديات الخفية.',
                    '2. قابلية التهيئة المؤسسية دون تعديل الشيفرة الأساسية.',
                    '3. سلامة العزل وتعدد الشركات والفروع والصلاحيات.',
                    '4. موثوقية مالية ومحاسبية وسجل تدقيق كامل.',
                    '5. تجربة عربية وإنجليزية (RTL/LTR) بمستوى مؤسسي أصيل.',
                    '6. قابلية الترقية المستمرة الآمنة لجميع العملاء.',
                    '7. جاهزية التكامل عبر عقود وواجهات عامة مرقّمة.',
                    '8. أداء وقابلية توسع مستقران فوق PostgreSQL.',
                    '9. انضباط النطاق وإطلاق V1 مركّز (الأردن · التجارة والتوزيع).',
                    '10. استدامة التوثيق المعماري كمرجع حي للتنفيذ والتشغيل.',
                  ]
                : [
                    '1. Clear core module boundaries with zero hidden dependencies.',
                    '2. Enterprise configurability without modifying the product core.',
                    '3. Rigorous multi-tenant, multi-company, branch, and RBAC isolation.',
                    '4. Strict financial/accounting integrity with immutable audit trails.',
                    '5. Native enterprise-grade Arabic/RTL and English/LTR experience.',
                    '6. Safe, repeatable upgradeability across the customer base.',
                    '7. Versioned public API and event integration contracts.',
                    '8. Predictable scalability and performance on PostgreSQL.',
                    '9. Disciplined V1 scope focused on Jordan · Trading & Wholesale.',
                    '10. Living architectural documentation guiding implementation & operations.',
                  ]
              ).map((criterion) => (
                <div
                  key={criterion}
                  className="flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 text-text-secondary"
                >
                  <CheckCircle2
                    className="h-3.5 w-3.5 mt-0.5 text-success shrink-0"
                    aria-hidden="true"
                  />
                  <span>{criterion}</span>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed text-text-secondary">
              {isAr
                ? `حالة التخطيط الحالية: أُغلقت المراحل 1–5 بالكامل (المرحلة 5: ${phase5Progress.completedCount}/${phase5Progress.totalCount}) وبوابة القرار A مشروطًا (D-MKT-01)، وتنتظر المرحلة 6 (المخططات الوظيفية للوحدات الأساسية) تكليفًا صريحًا منفصلًا.`
                : `Current planning status: Phases 1–5 are completed (Phase 5: ${phase5Progress.completedCount}/${phase5Progress.totalCount}) and Decision Gate A is conditionally approved (D-MKT-01); Phase 6 (Core Module Functional Blueprints) awaits explicit separate authorization.`}
            </p>

            <SourceReference
              label={t('documentation.sourceRefPrefix')}
              source={`teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md (${(provenance.reviewedCommitSha ?? provenance.reviewedTreeSha).slice(0, 12)})`}
              identifier="src-pf-01-project-vision"
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
