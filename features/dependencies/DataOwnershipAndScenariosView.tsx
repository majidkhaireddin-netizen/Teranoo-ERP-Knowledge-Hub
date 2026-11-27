'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Database,
  FileText,
  GitBranch,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type {
  DependencyEducationalGuidanceBundle,
  ExtractedDependencyArchitecture,
} from '@/content/extractors/dependencyArchitectureExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import {
  DataOwnershipDesignGuideSection,
  DependencyProvenanceStrip,
  SourceAnchorLinksStrip,
} from '@/features/dependencies/DependencyEducationalGuides';
import { cn } from '@/lib/utils';

export interface DataOwnershipExplorerProps {
  matrix: ExtractedDependencyArchitecture['matrix'];
  guidance?: DependencyEducationalGuidanceBundle;
}

export function DataOwnershipExplorer({
  matrix,
  guidance,
}: DataOwnershipExplorerProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const [filterMode, setFilterMode] = useState<
    'all' | 'core' | 'shared' | 'deferred'
  >('all');

  const filteredRecords = useMemo(() => {
    return matrix.dataOwnershipRecords.filter((rec) => {
      if (filterMode === 'all') return true;
      if (filterMode === 'deferred') return rec.isDeferredBoundary;
      if (filterMode === 'shared') return /Shared Platform/i.test(rec.ownerAtPhase2);
      return (
        !rec.isDeferredBoundary && !/Shared Platform/i.test(rec.ownerAtPhase2)
      );
    });
  }, [matrix.dataOwnershipRecords, filterMode]);

  const ownershipExamples = useMemo(
    () =>
      guidance?.educationalExamples.filter(
        (ex) => ex.placement === 'ownership'
      ) ?? [],
    [guidance]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? `مستكشف ملكية البيانات ومصادر الحقيقة (${matrix.dataOwnershipRecords.length} كائنًا)`
            : `Data Ownership & Source-of-Truth Explorer (${matrix.dataOwnershipRecords.length} Objects)`
        }
        subtitle={
          isAr
            ? 'مستخلص مباشرةً من القسم 8 في MODULE_DEPENDENCY_MATRIX.md — ملكية البيانات مستقلة تمامًا عن أنواع الاعتماديات (Data Ownership ≠ Dependency Type). رموز OWN-CORE-* مراجع صفوف داخلية لمركز المعرفة وليست معرّفات ERP رسمية.'
            : 'Extracted from MODULE_DEPENDENCY_MATRIX.md Section 8 — strictly independent of Dependency Types (Data Ownership ≠ Dependency Type). OWN-CORE-* tags are Knowledge Hub internal row references, not official ERP IDs.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {guidance ? (
              <a
                href="#data-ownership-design-guide"
                className="text-xs font-medium text-primary hover:underline"
              >
                {isAr ? 'دليل تصميم الملكية والأمثلة' : 'Ownership Design Guide & Examples'}
              </a>
            ) : null}
            <Link
              href={`/knowledge/${matrix.documentSlug}#kh-h-8-data-ownership-cross-reference-ليس-dependency-register`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAr ? 'القسم 8 في المصدر' : 'Section 8 in Source'}</span>
            </Link>
          </div>
        }
      />

      {guidance ? (
        <DependencyProvenanceStrip provenance={guidance.provenance} />
      ) : null}

      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            {
              key: 'all',
              label: isAr
                ? `الكل (${matrix.dataOwnershipRecords.length})`
                : `All (${matrix.dataOwnershipRecords.length})`,
            },
            {
              key: 'core',
              label: isAr ? 'ملكية الأنظمة الأساسية (9)' : 'Core Module Owned (9)',
            },
            {
              key: 'shared',
              label: isAr ? 'منصة مشتركة (2)' : 'Shared Platform (2)',
            },
            {
              key: 'deferred',
              label: isAr
                ? `حدود مؤجلة (${matrix.deferredOwnershipCount})`
                : `Deferred Boundaries (${matrix.deferredOwnershipCount})`,
            },
          ] as const
        ).map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setFilterMode(btn.key)}
            aria-pressed={filterMode === btn.key}
            className={cn(
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer',
              filterMode === btn.key
                ? 'border-primary bg-primary-subtle text-primary'
                : 'border-border bg-surface text-text-secondary hover:border-border-strong'
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Ownership Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-text-primary">
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'الكائن / الهوية' : 'Business Object / Identity'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'المالك / مصدر الحقيقة (Phase 2)' : 'Owner / Source of Truth'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'المستهلكون / مالكو السياق' : 'Consumers / Context Owners'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'سلطة التعديل (Mutation Authority)' : 'Mutation Authority'}
              </th>
              <th className="px-3 py-2.5 text-start font-semibold">
                {isAr ? 'ملاحظة الاعتمادية' : 'Dependency Note'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRecords.map((rec) => (
              <tr key={rec.id} className="bg-surface hover:bg-surface-hover/40">
                <td className="px-3 py-2.5 font-semibold text-text-primary bidi-ltr text-start space-y-1">
                  <div>{rec.businessObject}</div>
                  <span
                    title={
                      isAr
                        ? 'مرجع صف داخلي لمركز المعرفة (ليس معرّف ERP رسميًا)'
                        : 'Knowledge Hub internal row reference (not an official ERP identifier)'
                    }
                    className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[9px] font-medium text-text-muted bidi-ltr"
                  >
                    <span>{rec.id}</span>
                    <span>·</span>
                    <span>{isAr ? 'مرجع داخلي' : 'KH Ref'}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-medium',
                      rec.isDeferredBoundary
                        ? 'border-warning-border bg-warning-bg text-warning'
                        : /Shared Platform/i.test(rec.ownerAtPhase2)
                          ? 'border-info-border bg-info-bg text-info'
                          : 'border-success-border bg-success-bg text-success'
                    )}
                  >
                    {rec.isDeferredBoundary ? (
                      <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    ) : /Shared Platform/i.test(rec.ownerAtPhase2) ? (
                      <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    ) : (
                      <Database className="h-3 w-3 shrink-0" aria-hidden="true" />
                    )}
                    <span className="bidi-ltr">{rec.ownerAtPhase2}</span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-text-secondary leading-relaxed">
                  {rec.consumers}
                </td>
                <td className="px-3 py-2.5 text-text-secondary leading-relaxed">
                  {resolveLocalizedText(rec.mutationAuthority, locale)}
                </td>
                <td className="px-3 py-2.5 text-text-secondary leading-relaxed">
                  {rec.dependencyNote}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* R04 Data Ownership Design Guide & R05 Conceptual Examples #1-#3 */}
      {guidance ? (
        <DataOwnershipDesignGuideSection
          guide={guidance.ownershipGuide}
          examples={ownershipExamples}
        />
      ) : null}
    </div>
  );
}

export interface CrossModuleScenariosViewProps {
  matrix: ExtractedDependencyArchitecture['matrix'];
  guidance?: DependencyEducationalGuidanceBundle;
}

export function CrossModuleScenariosView({
  matrix,
  guidance,
}: CrossModuleScenariosViewProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const FlowArrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-5">
      <SectionHeader
        title={
          isAr
            ? 'السيناريوهات البينية المفاهيمية للأنظمة الأساسية (6 مسارات CIC)'
            : 'Cross-Module Conceptual Scenarios (6 Core CIC Flow Lanes)'
        }
        subtitle={
          isAr
            ? 'شرح تعليمي منظم لكيفية تعاون الأنظمة المستقلة عبر عقود التكامل المشروط الـ 6: سبب التكامل، شروطه المسبقة، مراجع البيانات المتبادلة، قواعد الفشل والتدقيق، والقرارات المؤجلة دون اختلاق APIs أو Payloads.'
            : 'Structured educational visualization of how independent modules collaborate through all 6 Core CICs: why integration exists, preconditions, activation conditions, conceptual refs exchanged, failure/audit/idempotency rules, and deferred Phase 5/6 decisions.'
        }
      />

      <InformationCallout
        className="border-warning-border bg-warning-bg/60"
        title={
          isAr
            ? 'تصنيف إلزامي: مسارات مفاهيمية للمرحلة 2 — التحقق الوظيفي مؤجل للمرحلة 6.5'
            : 'Mandatory Label: Conceptual Phase 2 Flows — End-to-End Validation Deferred to Phase 6.5'
        }
      >
        {isAr
          ? 'تمثل هذه المسارات حدود التعاون المفاهيمية المعتمدة في MODULE_DEPENDENCY_MATRIX.md (v0.1-conceptual). التحقق التنفيذي الكامل لمسارات P2P وO2C وInventory-to-Finance وتفاصيل API/Events/Retry مؤجلة رسميًا للمرحلتين 5 و6.5.'
          : 'These lanes visualize approved Phase 2 conceptual collaboration boundaries (v0.1-conceptual). Full Procure-to-Pay / Order-to-Cash validation and API/event/retry mechanics are formally deferred to Phases 5 and 6.5.'}
      </InformationCallout>

      {guidance ? (
        <DependencyProvenanceStrip
          provenance={guidance.provenance}
          pinnedDocumentSlugs={['moduleDependencyMatrix', 'moduleLifecycleRules'].map((k) =>
            k === 'moduleDependencyMatrix'
              ? 'module-dependency-matrix'
              : 'module-lifecycle-rules'
          )}
        />
      ) : null}

      <div className="space-y-4">
        {matrix.coreCics.map((cic, idx) => {
          const cicGuide = guidance?.cicGuidanceByContractId[cic.contractId];
          return (
            <article
              key={cic.contractId}
              id={`scenario-${cic.contractId}`}
              className="rounded-lg border border-border bg-surface p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-primary/30 bg-primary-subtle px-2 py-0.5 font-mono text-xs font-bold text-primary bidi-ltr">
                    0{idx + 1} · {cic.contractId}
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {isAr
                      ? 'مفاهيمي · Phase 2 (التحقق التنفيذي في Phase 6.5)'
                      : 'Conceptual · Phase 2 (Phase 6.5 Validation)'}
                  </span>
                  {cic.hasDeferredBoundary ? (
                    <span className="text-xs font-medium text-warning">
                      · {isAr ? 'يتضمن حدودًا مؤجلة' : 'Includes Deferred Boundary'}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <Link
                    href={`/knowledge/${matrix.documentSlug}#${cic.sectionAnchor}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{isAr ? 'القسم الرسمي في المصفوفة' : 'Matrix Source Section'}</span>
                  </Link>
                  <Link
                    href={`/dependencies?tab=matrix&cic=${encodeURIComponent(cic.contractId)}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {isAr ? 'فحص حقول العقد الـ 16' : 'Inspect 16 Contract Fields'}
                  </Link>
                </div>
              </div>

              {/* Educational Rationale: Why Integration Exists */}
              {cicGuide ? (
                <div className="rounded-md border border-border bg-surface-secondary/35 px-3.5 py-2.5 text-xs leading-relaxed text-text-secondary">
                  {resolveLocalizedText(cicGuide.whyIntegrationExists, locale)}
                </div>
              ) : null}

              {/* 3-Step Visual Conceptual Lane */}
              <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-11">
                <div className="rounded-md border border-border bg-surface-secondary/50 p-3.5 md:col-span-3 space-y-1">
                  <p className="text-[11px] font-semibold text-text-muted">
                    {isAr ? 'المبادر / مالك المصدر' : 'Source / Initiator Owner'}
                  </p>
                  <p className="text-sm font-semibold text-text-primary bidi-ltr text-start">
                    {cic.sourceInitiator}
                  </p>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {cic.metadata.sourceOwner}
                  </p>
                </div>

                <div className="flex items-center justify-center md:col-span-1">
                  <FlowArrow className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>

                <div className="rounded-md border border-primary/30 bg-primary-subtle/30 p-3.5 md:col-span-3 space-y-1.5">
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <GitBranch className="h-3 w-3" aria-hidden="true" />
                    <span>{isAr ? 'عقد التكامل المشروط (CIC)' : 'Integration Contract (CIC)'}</span>
                  </p>
                  <p className="text-xs font-semibold text-text-primary">
                    {cic.metadata.businessScenario}
                  </p>
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    <strong className="text-text-primary">{isAr ? 'المُحفّز: ' : 'Trigger: '}</strong>
                    {cic.metadata.triggerInitiator}
                  </p>
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    <strong className="text-text-primary">{isAr ? 'شرط التفعيل: ' : 'Activation Condition: '}</strong>
                    {cic.metadata.activationCondition}
                  </p>
                </div>

                <div className="flex items-center justify-center md:col-span-1">
                  <FlowArrow className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>

                <div className="rounded-md border border-border bg-surface-secondary/50 p-3.5 md:col-span-3 space-y-1">
                  <p className="text-[11px] font-semibold text-text-muted">
                    {isAr ? 'المستقبل / مالك الهدف' : 'Target Owner'}
                  </p>
                  <p className="text-sm font-semibold text-text-primary bidi-ltr text-start">
                    {cic.target}
                  </p>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {cic.metadata.targetOwner}
                  </p>
                </div>
              </div>

              {/* Required Preconditions & Conceptual Business Object References Exchanged */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-xs">
                <div className="rounded-md border border-border bg-surface-secondary/25 p-3 space-y-1">
                  <p className="font-semibold text-text-primary">
                    {isAr ? 'الشروط المسبقة المطلوبة (Required Preconditions)' : 'Required Preconditions'}
                  </p>
                  <p className="leading-relaxed text-text-secondary">
                    {cic.metadata.requiredPreconditions}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface-secondary/25 p-3 space-y-1">
                  <p className="font-semibold text-text-primary">
                    {isAr
                      ? 'المراجع المفاهيمية المتبادلة (بدون Payloads/APIs)'
                      : 'Conceptual Business Object References Exchanged'}
                  </p>
                  <p className="leading-relaxed text-text-secondary">
                    {cic.metadata.businessObjectRefs}
                  </p>
                </div>
              </div>

              {/* Outcome, Failure & Audit guardrails */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
                <div className="rounded-md border border-border bg-surface-secondary/30 p-3 space-y-1">
                  <p className="font-semibold text-text-primary">
                    {isAr ? 'النتيجة المتوقعة وحفظ الملكية' : 'Expected Outcome & Ownership'}
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {cic.metadata.expectedOutcome}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface-secondary/30 p-3 space-y-1">
                  <p className="font-semibold text-text-primary">
                    {isAr ? 'سلوك الفشل والتعذر (منع Silent Success)' : 'Failure / Unavailable Behavior'}
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {cic.metadata.failureBehavior}
                  </p>
                </div>
                <div className="rounded-md border border-border bg-surface-secondary/30 p-3 space-y-1">
                  <p className="flex items-center gap-1 font-semibold text-text-primary">
                    <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
                    <span>{isAr ? 'مبادئ التدقيق ومنع التكرار' : 'Audit & Idempotency Principles'}</span>
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {cic.metadata.auditRequirement} — {cic.metadata.idempotencyPrinciple}
                  </p>
                  {cicGuide ? (
                    <p className="text-[11px] leading-relaxed text-text-muted pt-0.5">
                      {resolveLocalizedText(cicGuide.auditAndIdempotencyPrincipleNote, locale)}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Deferred Design Decisions & Source Anchors */}
              {cicGuide ? (
                <div className="border-t border-border pt-3 space-y-2 text-xs">
                  <p className="leading-relaxed text-text-secondary">
                    <strong className="text-warning">
                      {isAr ? 'قرارات تصميمية مؤجلة (Phase 5/6): ' : 'Deferred Design Decisions (Phase 5/6): '}
                    </strong>
                    {resolveLocalizedText(cicGuide.deferredDesignDecisions, locale)}
                  </p>
                  <SourceAnchorLinksStrip
                    label={isAr ? 'روابط المصادر:' : 'Source Anchors:'}
                    refs={cicGuide.sourceRefs}
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

