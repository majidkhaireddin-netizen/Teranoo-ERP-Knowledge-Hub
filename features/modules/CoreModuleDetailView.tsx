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
  FileText,
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
            <span className="rounded-sm border border-border bg-surface-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary bidi-ltr">
              {moduleProfile.code}
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

      {/* Band 2 & 3: Architectural Responsibilities & Standalone Operation */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{isAr ? 'المسؤوليات المعمارية المعتمدة' : 'Approved Architectural Responsibilities'}</span>
          </h2>
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
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{isAr ? 'التشغيل المستقل والحدود الحرجة' : 'Standalone Operation & Critical Limitation'}</span>
          </h2>
          <p className="text-xs leading-relaxed text-text-secondary">
            {resolveLocalizedText(moduleProfile.standaloneSummary, locale)}
          </p>
          <ul className="space-y-1.5">
            {moduleProfile.standaloneCapabilities.map((cap) => (
              <li
                key={cap.en}
                className="flex items-start gap-2 text-xs leading-relaxed text-text-primary"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{resolveLocalizedText(cap, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-md border border-warning-border bg-warning-bg/70 p-3 text-xs leading-relaxed text-text-primary">
            <p className="flex items-center gap-1.5 font-semibold text-warning mb-1">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAr ? 'حد معماري حرج عند التشغيل المستقل' : 'Critical Standalone Limitation'}</span>
            </p>
            <p>{resolveLocalizedText(moduleProfile.criticalLimitation, locale)}</p>
          </div>
        </div>
      </section>

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
      <section className="space-y-4">
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
              <span className="font-mono text-[10px] text-primary bidi-ltr">Module Activation</span>
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

      {/* Band 6: Approved Phase 2 Source-Local Decisions (Verbatim) */}
      <section id="approved-decisions" className="space-y-4">
        <SectionHeader
          title={
            isAr
              ? `قرارات المرحلة 2 المعتمدة لهذا النظام (${moduleProfile.decisions.length})`
              : `Approved Phase 2 Source-Local Decisions (${moduleProfile.decisions.length})`
          }
          subtitle={
            isAr
              ? 'مستخلصة مباشرةً وحرفيًا من الوثيقة الرسمية المالكة — معزولة عن عدّاد سجل القرارات المركزي الـ 126 (المراحل 3–5).'
              : 'Deterministically extracted verbatim from the owning Phase 2 official document — tracked separately from the centralized 126-decision register (Phases 3–5).'
          }
          actions={
            <Link
              href="/decisions"
              className="text-xs font-medium text-primary hover:underline"
            >
              {isAr ? 'فتح سجل القرارات الكامل' : 'Open Full Decision Register'}
            </Link>
          }
        />

        <div className="space-y-3">
          {moduleProfile.decisions.map((dec) => (
            <article
              key={dec.decisionId}
              id={dec.decisionId}
              className="rounded-lg border border-border bg-surface p-4 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-class-decision-border bg-class-decision-bg px-2 py-0.5 font-mono text-xs font-bold text-class-decision bidi-ltr">
                    {dec.decisionId}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {dec.title}
                  </h3>
                </div>
                <Link
                  href={`/knowledge/${dec.owningDocumentSlug}#${dec.sectionAnchor}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isAr ? 'الموضع في المصدر' : 'Source Anchor'}</span>
                </Link>
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed text-text-secondary">
                {dec.verbatimBody
                  .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
                  .map((part, idx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={idx} className="font-semibold text-text-primary">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    if (part.startsWith('`') && part.endsWith('`')) {
                      return (
                        <code
                          key={idx}
                          className="rounded-xs bg-surface-secondary px-1 py-0.5 font-mono text-[11px] text-text-primary bidi-ltr"
                        >
                          {part.slice(1, -1)}
                        </code>
                      );
                    }
                    return <React.Fragment key={idx}>{part}</React.Fragment>;
                  })}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Band 7: Explicit Exclusions & Deferred Design */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <XCircle className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span>
              {isAr
                ? `الاستبعادات الصريحة خارج المرحلة 2 (${moduleProfile.explicitExclusions.length})`
                : `Explicit Phase 2 Exclusions (${moduleProfile.explicitExclusions.length})`}
            </span>
          </h2>
          <ul className="space-y-1.5">
            {moduleProfile.explicitExclusions.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-md border border-border bg-surface-secondary/40 px-3 py-1.5 text-xs text-text-secondary"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Clock className="h-4 w-4 text-warning" aria-hidden="true" />
            <span>
              {isAr
                ? `القرارات والحدود المفتوحة والمؤجلة (${moduleProfile.deferredDesignItems.length})`
                : `Open & Deferred Design Commitments (${moduleProfile.deferredDesignItems.length})`}
            </span>
          </h2>
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
      <section className="rounded-lg border border-border bg-surface p-5 space-y-3">
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
