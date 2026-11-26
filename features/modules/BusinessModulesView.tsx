'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Database,
  GitBranch,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { ExtractedCoreModulesCatalog } from '@/content/extractors/moduleModelsExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

export interface BusinessModulesViewProps {
  catalog: ExtractedCoreModulesCatalog;
  hbmdEdgeCount: number;
  coreCicCount: number;
  coreFldCount: number;
}

export function BusinessModulesView({
  catalog,
  hbmdEdgeCount,
  coreCicCount,
  coreFldCount,
}: BusinessModulesViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const DirectionArrow = isAr ? ArrowLeft : ArrowRight;

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
              status="completed"
              label={isAr ? 'المرحلة 2 مغلقة (2026-09-09)' : 'Phase 2 Closed (2026-09-09)'}
            />
          </>
        }
        title={isAr ? 'الأنظمة التجارية الأساسية الأربعة' : 'Core Business Modules'}
        subtitle={
          isAr
            ? 'البنية المعمارية المعتمدة للأنظمة الأربعة القابلة للتفعيل المستقل في Teranoo ERP — حدود المسؤولية، ملكية البيانات، الاعتماديات، و34 قرارًا محليًا معتمدًا في المرحلة 2.'
            : 'Approved Phase 2 architecture for Teranoo ERP’s four independently activatable Core Business Modules — boundaries, data ownership, dependencies, and 34 source-local decisions.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dependencies"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Network className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {isAr
                  ? 'مركز الاعتماديات والمحاكاة'
                  : 'Dependencies & Simulator Center'}
              </span>
            </Link>
            <Link
              href="/decisions"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>
                {isAr ? 'سجل القرارات' : 'Decision Register'}
              </span>
            </Link>
          </div>
        }
        meta={
          <>
            <code className="font-mono text-xs bidi-ltr text-text-secondary">
              teranoo-erp-planning/03-modules/*
            </code>
            <span aria-hidden="true">·</span>
            <span>BATCH-002</span>
          </>
        }
      />

      {/* Key Authoritative Architecture Metrics */}
      <section
        aria-label={isAr ? 'ملخص النواة الأساسية' : 'Business Core Summary'}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4"
      >
        <div className="bg-surface p-4 space-y-1">
          <p className="text-xs font-medium text-text-muted">
            {isAr ? 'الأنظمة الأساسية المستقلة' : 'Standalone Core Modules'}
          </p>
          <p className="font-mono text-2xl font-semibold text-text-primary bidi-ltr">
            {catalog.modules.length}
          </p>
          <p className="text-xs text-text-secondary">
            {isAr ? 'جميعها First-Class Sellable' : 'All First-Class Sellable'}
          </p>
        </div>

        <div className="bg-surface p-4 space-y-1">
          <p className="text-xs font-medium text-text-muted">
            {isAr ? 'الاعتماديات الصلبة (HBMD)' : 'Hard Dependencies (HBMD)'}
          </p>
          <p className="font-mono text-2xl font-semibold text-success bidi-ltr">
            {hbmdEdgeCount}
          </p>
          <p className="text-xs text-text-secondary">
            {isAr ? 'صفر دورات (Acyclic by construction)' : '0 cycles (Acyclic by construction)'}
          </p>
        </div>

        <div className="bg-surface p-4 space-y-1">
          <p className="text-xs font-medium text-text-muted">
            {isAr ? 'قرارات المرحلة 2 المحلية' : 'Phase 2 Source-Local Decisions'}
          </p>
          <p className="font-mono text-2xl font-semibold text-primary bidi-ltr">
            {catalog.totalPhase2DecisionsCount}
          </p>
          <p className="text-xs text-text-secondary">
            {isAr ? 'D-FIN (6) · D-INV (8) · D-PROC (9) · D-SALES (11)' : 'D-FIN (6) · D-INV (8) · D-PROC (9) · D-SALES (11)'}
          </p>
        </div>

        <div className="bg-surface p-4 space-y-1">
          <p className="text-xs font-medium text-text-muted">
            {isAr ? 'عقود التكامل وميزات FLD' : 'Core CICs & FLDs'}
          </p>
          <p className="font-mono text-2xl font-semibold text-text-primary bidi-ltr">
            {coreCicCount} / {coreFldCount}
          </p>
          <p className="text-xs text-text-secondary">
            {isAr ? '6 عقود CIC مفاهيمية · 5 اعتماديات FLD' : '6 conceptual CICs · 5 FLDs'}
          </p>
        </div>
      </section>

      {/* Architectural Scope Boundary Notice */}
      <InformationCallout
        title={
          isAr
            ? 'نطاق المرحلة 2 المعتمدة — معمارية وحدود وليست مخططات وظيفية أو تنفيذًا برمجيًا'
            : 'Phase 2 Scope Boundary — Approved Architecture, Not Functional Blueprints or Code'
        }
      >
        {isAr
          ? 'توثّق هذه الصفحات النماذج المعمارية المعتمدة والمغلقة للمرحلة 2 فقط (الاستقلالية، ملكية البيانات، اعتماديات المنصة، وعقود التكامل المفاهيمية). المخططات الوظيفية التفصيلية، الشاشات، نماذج قواعد البيانات، والتنفيذ البرمجي مؤجلة للمرحلة 6 وما بعدها وتظهر صراحةً كأقسام مستقبلية غير مُعبّأة.'
          : 'These pages document closed Phase 2 architectural models only (standalone capability, data ownership, platform dependencies, and conceptual CIC boundaries). Detailed Functional Blueprints, screens, database schemas, and ERP software code belong to Phase 6 and later phases and are explicitly marked as future unpopulated sections.'}
      </InformationCallout>

      {/* 4 Core Module Cards */}
      <section aria-label={isAr ? 'خريطة الأنظمة الأساسية' : 'Core Modules Map'} className="space-y-4">
        <SectionHeader
          title={isAr ? 'استكشاف النماذج المعمارية للأنظمة الأربعة' : 'Explore the Four Core Module Models'}
          subtitle={
            isAr
              ? 'اختر أي نظام لاستعراض مسؤولياته، تشغيله المستقل، ملكية بياناته، اعتمادياته، قراراته المعتمدة حرفيًا، وبنية دورة حياته القابلة للتوسع.'
              : 'Open any module to inspect its responsibilities, standalone boundaries, data ownership, dependencies, verbatim Phase 2 decisions, and reusable lifecycle blueprint.'
          }
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {catalog.modules.map((mod) => (
            <article
              key={mod.id}
              className="flex flex-col rounded-lg border border-border bg-surface p-5 space-y-4 transition-colors hover:border-primary/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-sm border border-border bg-surface-secondary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary bidi-ltr">
                      {mod.code}
                    </span>
                    <span className="rounded-sm border border-success-border bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
                      {isAr ? 'Standalone · 0 HBMD' : 'Standalone · 0 HBMD'}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-text-primary">
                    {resolveLocalizedText(mod.name, locale)}
                  </h2>
                </div>
                <span className="rounded-sm border border-class-decision-border bg-class-decision-bg px-2 py-0.5 font-mono text-xs font-medium text-class-decision bidi-ltr">
                  {mod.decisions.length}{' '}
                  {isAr ? 'قرارات' : 'decisions'}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-text-secondary">
                {resolveLocalizedText(mod.identitySummary, locale)}
              </p>

              {/* Ownership & Dependency Quick Facts */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-surface-secondary/50 p-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <Database className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{isAr ? 'ملكية البيانات (Source of Truth)' : 'Data Ownership'}</span>
                  </p>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {mod.ownedDataDomains.slice(0, 3).map((d) => (
                      <li key={d.en} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" aria-hidden="true" />
                        <span>{resolveLocalizedText(d, locale)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-border bg-surface-secondary/50 p-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <GitBranch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{isAr ? 'الاعتماديات والعقود' : 'Dependencies & CICs'}</span>
                  </p>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    <li>
                      {isAr
                        ? `PCD مطلوبة: ${mod.requiredPcds.length} · مشروطة: ${mod.conditionalPcds.length}`
                        : `Required PCDs: ${mod.requiredPcds.length} · Conditional: ${mod.conditionalPcds.length}`}
                    </li>
                    <li>
                      {isAr
                        ? `عقود CIC مرتبطة: ${mod.relatedCicIds.length}`
                        : `Linked Core CICs: ${mod.relatedCicIds.length}`}
                    </li>
                    <li>
                      {isAr
                        ? `بنود مؤجلة للمرحلة 5/6: ${mod.deferredDesignItems.length}`
                        : `Deferred to Phase 5/6: ${mod.deferredDesignItems.length}`}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Critical Boundary Note */}
              <p className="rounded-md border border-warning-border/70 bg-warning-bg/50 px-3 py-2 text-xs leading-relaxed text-text-primary">
                <span className="font-semibold text-warning">
                  {isAr ? 'حد مهم: ' : 'Key Boundary: '}
                </span>
                {resolveLocalizedText(mod.criticalLimitation, locale)}
              </p>

              {/* Actions */}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <Link
                  href={`/modules/${mod.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isAr ? 'استكشاف النموذج المعماري للنظام' : 'Inspect Module Architecture'}
                  </span>
                  <DirectionArrow className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href={`/knowledge/${mod.documentSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-secondary px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
                >
                  <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>{isAr ? 'النص الأصلي الكامل' : 'Full Official Source'}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reusable 17-Section Future Module Knowledge Blueprint */}
      <section
        aria-label={isAr ? 'الهيكل الموحّد القابل لإعادة الاستخدام' : 'Reusable Module Knowledge Architecture'}
        className="rounded-lg border border-border bg-surface p-5 space-y-4"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'الهيكل المعرفي الموحّد القابل للنمو عبر دورة حياة كل نظام (17 قسمًا)'
                  : 'Reusable 17-Section Module Lifecycle Knowledge Architecture'}
              </span>
            </h2>
            <p className="text-xs leading-relaxed text-text-secondary">
              {isAr
                ? 'تشترك الأنظمة الأساسية الأربعة في قالب معماري واحد جاهز لاستيعاب مخرجات المراحل اللاحقة دون إعادة تصميم: الأقسام 1–9 مُعبّأة رسميًا من المرحلة 2 (BATCH-002)، بينما تبقى الأقسام 10–17 محجوزة صراحةً للمراحل المستقبلية دون اختلاق محتوى.'
                : 'All four Core Modules share one reusable lifecycle structure ready to absorb future artifacts without redesign: sections 1–9 are authoritatively populated from Phase 2 (BATCH-002), while sections 10–17 remain explicitly unpopulated for future phases.'}
            </p>
          </div>
          <Link
            href="/dependencies?tab=extensions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {isAr ? 'قواعد الأنظمة المستقبلية' : 'Future Extension Governance'}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.modules[0]?.lifecycleBlueprint.map((slot) => (
            <div
              key={slot.key}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-xs"
            >
              <span className="font-medium text-text-primary">
                {resolveLocalizedText(slot.title, locale)}
              </span>
              <span
                className={
                  slot.status === 'populated-phase-2'
                    ? 'shrink-0 rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 font-mono text-[10px] font-medium text-success bidi-ltr'
                    : 'shrink-0 rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted bidi-ltr'
                }
              >
                {slot.status === 'populated-phase-2'
                  ? isAr
                    ? 'المرحلة 2'
                    : 'Phase 2'
                  : slot.targetPhase}
              </span>
            </div>
          ))}
        </div>
      </section>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source="FINANCE / INVENTORY / PROCUREMENT / SALES_ORDER_MANAGEMENT_MODULE_MODEL.md + MODULE_DEPENDENCY_MATRIX.md"
        identifier="BATCH-002 · Phase 2 Closed (2026-09-09)"
      />
    </PageContainer>
  );
}
