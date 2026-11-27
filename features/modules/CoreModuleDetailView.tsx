'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  GitBranch,
  Layers,
  Lock,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { CoreModuleArchitecturalProfile } from '@/content/extractors/moduleModelsExtractor';
import type { CoreCicContract } from '@/content/extractors/dependencyArchitectureExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { cn } from '@/lib/utils';
import {
  ModuleAbsentPeerImpactSection,
  ModuleDeferredRationaleSection,
  ModuleDesignReasoningSection,
  ModuleOwnershipBoundaryMatrixSection,
  ModulePurposeAndImpactSection,
} from './ModuleEducationalSections';
import { ModuleDecisionEducationList } from './ModuleDecisionEducationList';

export interface CoreModuleDetailViewProps {
  moduleProfile: CoreModuleArchitecturalProfile;
  linkedCics: readonly CoreCicContract[];
  siblingModules: readonly {
    readonly id: string;
    readonly code: string;
    readonly shortName: { readonly ar: string; readonly en: string };
  }[];
}

export function CoreModuleDetailView({
  moduleProfile,
  linkedCics,
  siblingModules,
}: CoreModuleDetailViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const DirectionArrow = isAr ? ArrowLeft : ArrowRight;
  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const [showFullLifecycle, setShowFullLifecycle] = useState(false);

  return (
    <PageContainer>
      {/* Breadcrumb & Sibling Module Switcher */}
      <nav
        aria-label={isAr ? 'التنقل بين الأنظمة الأساسية' : 'Core Module Navigation'}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3"
      >
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-primary"
        >
          <BackArrow className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{isAr ? 'العودة إلى الأنظمة الأساسية الأربعة' : 'Back to Core Business Modules'}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1.5">
          {siblingModules.map((sib) => {
            const active = sib.id === moduleProfile.id;
            return (
              <Link
                key={sib.id}
                href={`/modules/${sib.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary-subtle text-primary'
                    : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary'
                )}
              >
                {resolveLocalizedText(sib.shortName, locale)}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Band 1: Module Identity & Overview */}
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification="official"
              label={t('classification.official.label')}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <span
              title={
                isAr
                  ? 'معرّف عرض داخلي لمركز المعرفة (ليس معرّف ERP رسميًا)'
                  : 'Knowledge Hub internal display code (not an official ERP identifier)'
              }
              className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary bidi-ltr"
            >
              <span>{moduleProfile.code}</span>
              <span className="text-[9px] font-normal text-text-muted">
                {isAr ? 'داخلي' : 'KH ID'}
              </span>
            </span>
            <span aria-hidden="true" className="text-text-muted">·</span>
            <StatusIndicator
              status="completed"
              label={resolveLocalizedText(moduleProfile.phaseStatus, locale)}
            />
          </>
        }
        title={resolveLocalizedText(moduleProfile.name, locale)}
        subtitle={resolveLocalizedText(moduleProfile.identitySummary, locale)}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/knowledge/${moduleProfile.documentSlug}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {isAr ? 'قراءة الوثيقة الرسمية الكاملة' : 'Read Complete Official Document'}
              </span>
            </Link>
            <Link
              href="/dependencies"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <Network className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{isAr ? 'مصفوفة الاعتماديات والمحاكاة' : 'Dependencies & Simulator'}</span>
            </Link>
          </div>
        }
        meta={
          <>
            <code className="font-mono text-xs bidi-ltr text-text-secondary">
              {moduleProfile.officialSourcePath}
            </code>
            {moduleProfile.sourceDocumentDate ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-xs bidi-ltr">
                  {moduleProfile.sourceDocumentDate}
                </span>
              </>
            ) : null}
          </>
        }
      />

      {/* Quick Authoritative Counters */}
      <section
        aria-label={isAr ? 'مؤشرات النموذج المعماري' : 'Module Architecture Metrics'}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
      >
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'قرارات المرحلة 2 المعتمدة' : 'Phase 2 Decisions'}
          </p>
          <p className="font-mono text-xl font-semibold text-primary bidi-ltr">
            {moduleProfile.decisions.length}
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'الاعتماديات الصلبة (HBMD)' : 'Approved HBMDs'}
          </p>
          <p className="font-mono text-xl font-semibold text-success bidi-ltr">
            {moduleProfile.hbmdCount}
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'قدرات المنصة (PCD R / C)' : 'Platform PCDs (R / C)'}
          </p>
          <p className="font-mono text-xl font-semibold text-text-primary bidi-ltr">
            {moduleProfile.requiredPcds.length} / {moduleProfile.conditionalPcds.length}
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'عقود CIC المرتبطة' : 'Linked Core CICs'}
          </p>
          <p className="font-mono text-xl font-semibold text-text-primary bidi-ltr">
            {linkedCics.length}
          </p>
        </div>
      </section>

      {/* KH-028 / KH-037: Curated Projection Provenance, 4 Knowledge States & Source Freshness */}
      {(() => {
        const isStale =
          moduleProfile.projectionMetadata.mappingFreshnessStatus ===
          'review-required-source-changed';
        return (
          <InformationCallout
            className={
              isStale
                ? 'border-danger-border bg-danger-bg'
                : 'border-info-border bg-info-bg/50'
            }
            title={
              isStale
                ? isAr
                  ? 'تحذير صلاحية التفسير المنظّم: تغيّر المصدر الرسمي — لا يُعتمد كمعرفة حالية (Review Required)'
                  : 'Projection Freshness Alert: Official Source Changed — Do Not Treat Curated Summaries as Current Verified Knowledge'
                : isAr
                  ? 'مصدرية العرض والتمييز بين النص الرسمي والتفسير التعليمي وخط الأساس التاريخي'
                  : 'Content Provenance: Verbatim Source, Reviewed Educational Projection & Historical Baseline'
            }
          >
            <div className="space-y-2 text-xs">
              {isStale && moduleProfile.projectionMetadata.reviewWarning ? (
                <div className="rounded-md border border-danger-border bg-surface px-3 py-2 space-y-1">
                  <p className="font-semibold text-danger">
                    {resolveLocalizedText(
                      moduleProfile.projectionMetadata.reviewWarning,
                      locale
                    )}
                  </p>
                  <Link
                    href={`/knowledge/${moduleProfile.documentSlug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {isAr
                        ? 'افتح النص الرسمي الكامل مباشرةً كمرجع أعلى'
                        : 'Open Verbatim Official Document Directly as Authority'}
                    </span>
                  </Link>
                </div>
              ) : null}
              <p className="leading-relaxed text-text-secondary">
                {resolveLocalizedText(
                  moduleProfile.projectionMetadata.projectionDisclosure,
                  locale
                )}
              </p>
              <p className="text-[11px] text-text-secondary">
                {t('foundations.historicalBaseline.body')}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-surface px-2.5 py-1.5 text-[11px] text-text-secondary">
                <span className="font-semibold text-text-primary">
                  {t('foundations.knowledgeStates.heading')}:
                </span>
                <span>{isAr ? '1. مصدر رسمي حرفي' : '1. Verbatim Official Source'}</span>
                <span>·</span>
                <span className={!isStale ? 'font-semibold text-success' : 'text-text-muted line-through'}>
                  {isAr ? '2. إسقاط تعليمي مُراجع' : '2. Reviewed Educational Projection'}
                </span>
                <span>·</span>
                <span className={isStale ? 'font-semibold text-danger' : 'text-text-muted'}>
                  {isAr ? '3. إسقاط يتطلب مراجعة' : '3. Projection Requiring Review'}
                </span>
                <span>·</span>
                <span>{isAr ? '4. خط أساس تاريخي (397a94e0d82f)' : '4. Historical Baseline (397a94e0d82f)'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 font-mono text-[11px] text-text-muted bidi-ltr">
                <span className={isStale ? 'font-semibold text-danger' : 'font-semibold text-success'}>
                  {isStale ? 'Review Required — Source Changed' : 'Reviewed Against Pinned Source'}
                </span>
                <span>·</span>
                <span>
                  Pinned Rev:{' '}
                  {moduleProfile.projectionMetadata.mappedSourceRevision.slice(0, 12)}
                </span>
                <span>·</span>
                <span>
                  Body SHA-256:{' '}
                  {moduleProfile.projectionMetadata.actualSourceBodySha256.slice(0, 12)}
                </span>
                <span>·</span>
                <span>
                  Reviewed: {moduleProfile.projectionMetadata.lastCuratedReviewDate}
                </span>
              </div>
            </div>
          </InformationCallout>
        );
      })()}

      {/* In-Page Architectural Depth Navigation */}
      <nav
        aria-label={isAr ? 'أقسام الدليل المعماري للنظام' : 'Module Guide Sections'}
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface p-2.5"
      >
        {[
          {
            href: '#module-purpose',
            ar: '1. الغرض والأثر',
            en: '1. Purpose & Impact',
          },
          {
            href: '#architecture-reasoning',
            ar: '2. التعليل المعماري',
            en: '2. Design Reasoning',
          },
          {
            href: '#absent-peer-impacts',
            ar: '3. غياب الأنظمة النظيرة',
            en: '3. Peer Absence',
          },
          {
            href: '#ownership-matrix',
            ar: '4. مصفوفة الملكية',
            en: '4. Ownership Matrix',
          },
          {
            href: '#dependencies-and-cics',
            ar: '5. الاعتماديات وCIC',
            en: '5. Dependencies & CICs',
          },
          {
            href: '#approved-decisions',
            ar: `6. القرارات (${moduleProfile.decisions.length})`,
            en: `6. Decisions (${moduleProfile.decisions.length})`,
          },
          {
            href: '#deferred-rationale',
            ar: '7. حدود التأجيل',
            en: '7. Deferred Boundaries',
          },
          {
            href: '#lifecycle-blueprint',
            ar: '8. خارطة 17 قسمًا',
            en: '8. 17-Slot Lifecycle',
          },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-md border border-border bg-surface-secondary/60 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            {isAr ? item.ar : item.en}
          </a>
        ))}
      </nav>

      {/* R01 (1, 2, 9): Purpose, Business Problems & Future Functional Impact */}
      <div className="scroll-mt-20">
        <ModulePurposeAndImpactSection
          moduleProfile={moduleProfile}
          locale={locale}
        />
      </div>

      {/* Band 2 & 3: Architectural Responsibilities & Standalone Operation */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>{isAr ? 'المسؤوليات المعمارية المعتمدة' : 'Approved Architectural Responsibilities'}</span>
            </h2>
            <span className="rounded-sm border border-info-border bg-info-bg px-1.5 py-0.5 text-[10px] font-medium text-info">
              {isAr ? 'ملخص تعليمي منظّم' : 'Curated Educational Projection'}
            </span>
          </div>
          <ul className="space-y-2">
            {moduleProfile.responsibilities.map((item) => (
              <li
                key={item.en}
                className="flex items-start gap-2 rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-xs leading-relaxed text-text-primary"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                <span>{resolveLocalizedText(item, locale)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>{isAr ? 'التشغيل المستقل والحدود الحرجة' : 'Standalone Operation & Critical Limitation'}</span>
            </h2>
            <span className="rounded-sm border border-info-border bg-info-bg px-1.5 py-0.5 text-[10px] font-medium text-info">
              {isAr ? 'ملخص تعليمي منظّم' : 'Curated Educational Projection'}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {resolveLocalizedText(moduleProfile.standaloneSummary, locale)}
          </p>
          <ol className="space-y-1.5">
            {moduleProfile.standaloneCapabilities.map((cap, idx) => (
              <li
                key={cap.en}
                className="flex items-start gap-2 text-xs leading-relaxed text-text-primary"
              >
                <span className="font-mono text-[11px] font-semibold text-primary tabular-nums">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span>{resolveLocalizedText(cap, locale)}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-md border border-warning-border bg-warning-bg/70 p-3 text-xs leading-relaxed text-text-primary">
            <p className="flex items-center gap-1.5 font-semibold text-warning mb-1">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAr ? 'حد معماري حرج عند التشغيل المستقل' : 'Critical Standalone Limitation'}</span>
            </p>
            <p>{resolveLocalizedText(moduleProfile.criticalLimitation, locale)}</p>
          </div>
        </div>
      </section>

      {/* R02: Architecture Design Reasoning (Official Reasoning vs. Educational Interpretation) */}
      <div className="scroll-mt-20">
        <ModuleDesignReasoningSection
          moduleProfile={moduleProfile}
          locale={locale}
        />
      </div>

      {/* R01 (5, 6): Standalone Operation vs. What Becomes Unavailable Without Peer Modules */}
      <div className="scroll-mt-20">
        <ModuleAbsentPeerImpactSection
          moduleProfile={moduleProfile}
          locale={locale}
        />
      </div>

      {/* R03: 4-Perspective Ownership & Non-Ownership Comparison Matrix */}
      <div className="scroll-mt-20">
        <ModuleOwnershipBoundaryMatrixSection
          moduleProfile={moduleProfile}
          locale={locale}
        />
      </div>

      {/* Module-Specific Architectural Comparison Matrix (e.g., Procurement 6 Concepts) */}
      {moduleProfile.educationalComparisonRows &&
      moduleProfile.educationalComparisonRows.length > 0 ? (
        <section className="space-y-3">
          <SectionHeader
            title={
              moduleProfile.educationalComparisonTitle
                ? resolveLocalizedText(moduleProfile.educationalComparisonTitle, locale)
                : isAr
                  ? 'مقارنة حدود الملكية'
                  : 'Ownership Boundary Comparison'
            }
            subtitle={
              moduleProfile.educationalComparisonNote
                ? resolveLocalizedText(moduleProfile.educationalComparisonNote, locale)
                : undefined
            }
            actions={
              <span className="rounded-sm border border-info-border bg-info-bg px-2 py-0.5 text-[10px] font-medium text-info">
                {isAr ? 'جدول تعليمي منظّم' : 'Curated Educational Table'}
              </span>
            }
          />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-text-primary">
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'المفهوم / العملية' : 'Concept / Operation'}
                  </th>
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'المالك المعتمد' : 'Approved Owner'}
                  </th>
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'أثر على On-hand؟' : 'Affects On-Hand?'}
                  </th>
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'أثر على GL؟' : 'Affects GL?'}
                  </th>
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'الأنظمة المطلوبة' : 'Required Modules'}
                  </th>
                  <th className="px-3 py-2.5 text-start font-semibold">
                    {isAr ? 'حد المرحلة 2' : 'Phase 2 Boundary'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {moduleProfile.educationalComparisonRows.map((row) => (
                  <tr key={row.concept.en} className="bg-surface hover:bg-surface-hover/50">
                    <td className="px-3 py-2.5 font-semibold text-text-primary">
                      {resolveLocalizedText(row.concept, locale)}
                    </td>
                    <td className="px-3 py-2.5 text-text-primary">
                      {resolveLocalizedText(row.owner, locale)}
                    </td>
                    <td className="px-3 py-2.5 text-text-secondary">
                      {resolveLocalizedText(row.affectsOnHand, locale)}
                    </td>
                    <td className="px-3 py-2.5 text-text-secondary">
                      {resolveLocalizedText(row.affectsGl, locale)}
                    </td>
                    <td className="px-3 py-2.5 text-text-secondary">
                      {resolveLocalizedText(row.requiresModules, locale)}
                    </td>
                    <td className="px-3 py-2.5 leading-relaxed text-text-secondary">
                      {resolveLocalizedText(row.phase2BoundaryNote, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Band 4: Data Ownership & Shared References */}
      <section className="space-y-3">
        <SectionHeader
          title={isAr ? 'ملكية البيانات والمراجع المشتركة' : 'Data Ownership & Shared References'}
          subtitle={
            isAr
              ? 'وفق DEPENDENCY_MODEL.md: ملكية البيانات واستهلاك المراجع المشتركة لا ينشئان HBMD تلقائيًا.'
              : 'Per DEPENDENCY_MODEL.md: Data ownership and shared reference consumption never implicitly create an HBMD.'
          }
          actions={
            <span className="rounded-sm border border-info-border bg-info-bg px-2 py-0.5 text-[10px] font-medium text-info">
              {isAr ? 'ملخص تعليمي منظّم' : 'Curated Educational Summary'}
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Database className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              <span>
                {isAr
                  ? 'البيانات المملوكة حصريًا لهذا النظام (Source of Truth)'
                  : 'Exclusively Owned Data Domains (Source of Truth)'}
              </span>
            </h3>
            <ul className="space-y-1.5">
              {moduleProfile.ownedDataDomains.map((d) => (
                <li
                  key={d.en}
                  className="rounded-md border border-success-border/60 bg-success-bg/40 px-3 py-2 text-xs font-medium text-text-primary"
                >
                  {resolveLocalizedText(d, locale)}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Lock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'المراجع المشتركة المستهلكة (دون ملكية حصرية)'
                  : 'Shared References Consumed (Non-Exclusive)'}
              </span>
            </h3>
            <ul className="space-y-1.5">
              {moduleProfile.sharedReferencesConsumed.map((ref) => (
                <li
                  key={ref.en}
                  className="rounded-md border border-border bg-surface-secondary/50 px-3 py-2 text-xs text-text-secondary"
                >
                  {resolveLocalizedText(ref, locale)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Band 5: Dependencies & Integrations (PCD, 0 HBMD, CIC, FLD) */}
      <section id="dependencies-and-cics" className="scroll-mt-20 space-y-4">
        <SectionHeader
          title={
            isAr
              ? 'الاعتماديات وعقود التكامل (PCD / HBMD / CIC / FLD)'
              : 'Dependencies & Integration Boundaries (PCD / HBMD / CIC / FLD)'
          }
          actions={
            <Link
              href="/dependencies?tab=simulator"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <span>{isAr ? 'محاكاة تفعيل هذا النظام' : 'Simulate Module Activation'}</span>
              <DirectionArrow className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        />

        {/* PCD Tables */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="border-b border-border bg-surface-secondary px-4 py-2.5 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-text-primary">
                {isAr
                  ? `قدرات المنصة المطلوبة (Required PCD · ${moduleProfile.requiredPcds.length})`
                  : `Required Platform Capabilities (PCD · ${moduleProfile.requiredPcds.length})`}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success">
                  {isAr ? 'استخلاص رسمي' : 'Official Extraction'}
                </span>
                <span className="font-mono text-[10px] text-primary bidi-ltr">Module Activation</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {moduleProfile.requiredPcds.map((pcd) => (
                <div key={pcd.capability} className="px-4 py-2.5 space-y-0.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-text-primary bidi-ltr">
                      {pcd.capability}
                    </span>
                    <span className="rounded-sm border border-primary/30 bg-primary-subtle px-1.5 py-0.5 font-mono text-[10px] text-primary bidi-ltr">
                      {pcd.classification}
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{pcd.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="border-b border-border bg-surface-secondary px-4 py-2.5 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-text-primary">
                {isAr
                  ? `قدرات المنصة المشروطة (Conditional PCD · ${moduleProfile.conditionalPcds.length})`
                  : `Conditionally Required PCDs (${moduleProfile.conditionalPcds.length})`}
              </h3>
              <span className="font-mono text-[10px] text-text-muted bidi-ltr">Feature / Scenario</span>
            </div>
            <div className="divide-y divide-border">
              {moduleProfile.conditionalPcds.map((pcd) => (
                <div key={pcd.capability} className="px-4 py-2.5 space-y-0.5 text-xs">
                  <span className="font-semibold text-text-primary bidi-ltr block">
                    {pcd.capability}
                  </span>
                  <p className="text-text-secondary leading-relaxed">{pcd.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Linked CICs & FLDs */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-7">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <GitBranch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? `عقود التكامل المشروط المرتبطة (CIC · ${linkedCics.length})`
                  : `Linked Conditional Integration Contracts (CIC · ${linkedCics.length})`}
              </span>
            </h3>
            <div className="space-y-2">
              {linkedCics.map((cic) => (
                <Link
                  key={cic.contractId}
                  href={`/dependencies?tab=matrix&cic=${encodeURIComponent(cic.contractId)}`}
                  className="block rounded-md border border-border bg-surface-secondary/40 p-3 transition-colors hover:border-primary/40 hover:bg-surface-hover"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-primary bidi-ltr">
                      {cic.contractId}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted bidi-ltr">
                      {cic.sourceInitiator} → {cic.target}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-primary">{cic.businessScenario}</p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">{cic.summaryStatus}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Scale className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'اعتماديات مستوى الميزة (FLD) وغياب HBMD'
                  : 'Feature-Level Dependencies (FLD) & Zero HBMD'}
              </span>
            </h3>
            <div className="rounded-md border border-success-border bg-success-bg/50 px-3 py-2 text-xs text-text-primary">
              <span className="font-semibold text-success">HBMD = 0: </span>
              {isAr
                ? 'لا يوجد أي اعتماد صلب على أي وحدة تجارية أخرى في النواة الأساسية.'
                : 'Zero Hard Business Module Dependencies on any other Core Module.'}
            </div>
            <ul className="space-y-1.5">
              {moduleProfile.relatedFldLabels.map((fld) => (
                <li
                  key={fld}
                  className="rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-xs text-text-secondary bidi-ltr text-start"
                >
                  {fld}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Band 6 (R04): Approved Phase 2 Source-Local Decisions (Verbatim + Educational Breakdown) */}
      <div className="scroll-mt-20">
        <ModuleDecisionEducationList
          decisions={moduleProfile.decisions}
          locale={locale}
        />
      </div>

      {/* R05: Deferred Design Boundary Rationales */}
      <div className="scroll-mt-20">
        <ModuleDeferredRationaleSection
          moduleProfile={moduleProfile}
          locale={locale}
        />
      </div>

      {/* Band 7: Explicit Exclusions & Deferred Design (Verbatim Extraction) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <XCircle className="h-4 w-4 text-text-muted" aria-hidden="true" />
              <span>
                {isAr
                  ? `الاستبعادات الصريحة خارج المرحلة 2 (${moduleProfile.explicitExclusions.length})`
                  : `Explicit Phase 2 Exclusions (${moduleProfile.explicitExclusions.length})`}
              </span>
            </h2>
            <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success">
              {isAr ? 'استخلاص رسمي' : 'Official Extraction'}
            </span>
          </div>
          <ol className="space-y-1.5">
            {moduleProfile.explicitExclusions.map((item, idx) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-md border border-border bg-surface-secondary/40 px-3 py-1.5 text-xs text-text-secondary"
              >
                <span className="font-mono text-[11px] text-text-muted tabular-nums">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Clock className="h-4 w-4 text-warning" aria-hidden="true" />
              <span>
                {isAr
                  ? `القرارات والحدود المفتوحة والمؤجلة (${moduleProfile.deferredDesignItems.length})`
                  : `Open & Deferred Design Commitments (${moduleProfile.deferredDesignItems.length})`}
              </span>
            </h2>
            <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success">
              {isAr ? 'استخلاص رسمي' : 'Official Extraction'}
            </span>
          </div>
          <ol className="space-y-1.5">
            {moduleProfile.deferredDesignItems.map((item, idx) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-md border border-warning-border/50 bg-warning-bg/30 px-3 py-2 text-xs leading-relaxed text-text-primary"
              >
                <span className="font-mono font-semibold text-warning">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Band 8: Reusable 17-Section Future Knowledge Lifecycle Slots */}
      <section id="lifecycle-blueprint" className="scroll-mt-20 rounded-lg border border-border bg-surface p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              {isAr
                ? 'خارطة المعرفة القابلة للنمو لهذا النظام (9 أقسام مُعبّأة · 8 أقسام مستقبلية)'
                : 'Reusable Module Lifecycle Knowledge Map (9 Populated · 8 Future Slots)'}
            </h2>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'الأقسام المستقبلية (المخطط الوظيفي، الشاشات، قاعدة البيانات، الاختبارات) غير مُعبّأة عمدًا حتى تصل مرحلتها الرسمية.'
                : 'Future sections (Functional Blueprint, Screens, DB Models, Tests) remain intentionally unpopulated until their authorized phase.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFullLifecycle((prev) => !prev)}
            aria-expanded={showFullLifecycle}
            className="rounded-md border border-border bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
          >
            {showFullLifecycle
              ? isAr
                ? 'إخفاء الجدول الكامل'
                : 'Hide Full 17-Slot Map'
              : isAr
                ? 'عرض الأقسام الـ 17 بالكامل'
                : 'Inspect All 17 Lifecycle Slots'}
          </button>
        </div>

        {showFullLifecycle ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {moduleProfile.lifecycleBlueprint.map((slot) => (
              <div
                key={slot.key}
                className="rounded-md border border-border bg-surface-secondary/40 p-3 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">
                    {resolveLocalizedText(slot.title, locale)}
                  </span>
                  <span
                    className={
                      slot.status === 'populated-phase-2'
                        ? 'rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 font-mono text-[10px] text-success'
                        : 'rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted'
                    }
                  >
                    {slot.targetPhase}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {resolveLocalizedText(slot.summary, locale)}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Band 9: Deferred Research Reference & Complete Original Source Link */}
      <InformationCallout
        title={
          isAr
            ? 'مرجع البحث الداعم (بانتظار دفعة الأبحاث المعتمدة)'
            : 'Supporting Research Reference (Deferred Research Batch)'
        }
      >
        <div className="space-y-1">
          <p>
            {isAr
              ? 'يرتبط هذا النموذج المعماري بتقرير بحثي رسمي لم يُستورد نصه الكامل في BATCH-002 بعد، ولذلك لا يُعرض له محتوى مختلق:'
              : 'This architectural model cites an official research report not yet included in BATCH-002; no research content is fabricated:'}
          </p>
          <code className="block font-mono text-xs bidi-ltr text-start text-text-primary">
            {moduleProfile.researchDeferredPath}
          </code>
        </div>
      </InformationCallout>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-subtle/40 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-text-primary">
              {isAr ? 'المرجع الأعلى: الوثيقة الرسمية الكاملة دون اختصار' : 'Highest Reference: Complete Verbatim Official Document'}
            </p>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'يمكنك قراءة النص الرسمي الكامل المصدّق بـ Git Blob SHA-1 مباشرة في مكتبة المعرفة.'
                : 'Read the complete Git-blob-verified verbatim source document directly in the Knowledge Library.'}
            </p>
          </div>
        </div>
        <Link
          href={`/knowledge/${moduleProfile.documentSlug}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{isAr ? 'فتح الوثيقة الكاملة' : 'Open Full Document'}</span>
          <DirectionArrow className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={moduleProfile.officialSourcePath}
        identifier={`${moduleProfile.documentId} · BATCH-002`}
      />
    </PageContainer>
  );
}
