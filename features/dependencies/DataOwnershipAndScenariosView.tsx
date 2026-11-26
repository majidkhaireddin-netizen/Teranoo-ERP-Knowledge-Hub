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
import type { ExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { cn } from '@/lib/utils';

export interface DataOwnershipExplorerProps {
  matrix: ExtractedDependencyArchitecture['matrix'];
}

export function DataOwnershipExplorer({ matrix }: DataOwnershipExplorerProps) {
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

  return (
    <div className="space-y-5">
      <SectionHeader
        title={
          isAr
            ? `مستكشف ملكية البيانات ومصادر الحقيقة (${matrix.dataOwnershipRecords.length} كائنًا)`
            : `Data Ownership & Source-of-Truth Explorer (${matrix.dataOwnershipRecords.length} Objects)`
        }
        subtitle={
          isAr
            ? 'مستخلص مباشرةً من القسم 8 في MODULE_DEPENDENCY_MATRIX.md — ملكية البيانات مستقلة تمامًا عن أنواع الاعتماديات (Data Ownership ≠ Dependency Type).'
            : 'Extracted from MODULE_DEPENDENCY_MATRIX.md Section 8 — strictly independent of Dependency Types (Data Ownership ≠ Dependency Type).'
        }
        actions={
          <Link
            href={`/knowledge/${matrix.documentSlug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? 'القسم 8 في المصدر' : 'Section 8 in Source'}</span>
          </Link>
        }
      />

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
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
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
                <td className="px-3 py-2.5 font-semibold text-text-primary bidi-ltr text-start">
                  {rec.businessObject}
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
    </div>
  );
}

export interface CrossModuleScenariosViewProps {
  matrix: ExtractedDependencyArchitecture['matrix'];
}

export function CrossModuleScenariosView({
  matrix,
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
            ? 'شرح بصري منظم لكيفية تعاون الأنظمة المستقلة عبر عقود التكامل المشروط دون نقل ملكية البيانات أو إنشاء اعتماديات صلبة.'
            : 'Structured educational visualization of how independent modules collaborate through CICs without transferring ownership or creating HBMDs.'
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

      <div className="space-y-4">
        {matrix.coreCics.map((cic, idx) => (
          <article
            key={cic.contractId}
            className="rounded-lg border border-border bg-surface p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-primary/30 bg-primary-subtle px-2 py-0.5 font-mono text-xs font-bold text-primary bidi-ltr">
                  0{idx + 1} · {cic.contractId}
                </span>
                <span className="rounded-sm border border-info-border bg-info-bg px-2 py-0.5 text-[11px] font-medium text-info">
                  {isAr ? 'مفاهيمي · Phase 2 (التحقق في Phase 6.5)' : 'Conceptual · Phase 2 (Phase 6.5 Validation)'}
                </span>
              </div>
              <Link
                href={`/dependencies?tab=matrix&cic=${encodeURIComponent(cic.contractId)}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                {isAr ? 'فحص حقول العقد الـ 16' : 'Inspect 16 Contract Fields'}
              </Link>
            </div>

            {/* 3-Step Visual Conceptual Lane */}
            <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-11">
              <div className="rounded-md border border-border bg-surface-secondary/50 p-3.5 md:col-span-3 space-y-1">
                <p className="font-mono text-[10px] font-semibold uppercase text-text-muted">
                  {isAr ? 'المبادر / مالك المصدر' : 'Source / Initiator'}
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

              <div className="rounded-md border border-primary/30 bg-primary-subtle/30 p-3.5 md:col-span-3 space-y-1">
                <p className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase text-primary">
                  <GitBranch className="h-3 w-3" aria-hidden="true" />
                  <span>{isAr ? 'عقد التكامل (CIC)' : 'Integration Contract'}</span>
                </p>
                <p className="text-xs font-semibold text-text-primary">
                  {cic.metadata.businessScenario}
                </p>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  <strong className="text-text-primary">{isAr ? 'المُحفّز: ' : 'Trigger: '}</strong>
                  {cic.metadata.triggerInitiator}
                </p>
              </div>

              <div className="flex items-center justify-center md:col-span-1">
                <FlowArrow className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>

              <div className="rounded-md border border-border bg-surface-secondary/50 p-3.5 md:col-span-3 space-y-1">
                <p className="font-mono text-[10px] font-semibold uppercase text-text-muted">
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

            {/* Outcome, Failure & Audit guardrails */}
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 text-xs">
              <div className="rounded-md border border-border bg-surface-secondary/30 p-3">
                <p className="font-semibold text-text-primary mb-0.5">
                  {isAr ? 'النتيجة المتوقعة وحفظ الملكية' : 'Expected Outcome & Ownership'}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {cic.metadata.expectedOutcome}
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/30 p-3">
                <p className="font-semibold text-text-primary mb-0.5">
                  {isAr ? 'سلوك الفشل (منع Silent Success)' : 'Failure / Unavailable Behavior'}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {cic.metadata.failureBehavior}
                </p>
              </div>
              <div className="rounded-md border border-border bg-surface-secondary/30 p-3">
                <p className="flex items-center gap-1 font-semibold text-text-primary mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span>{isAr ? 'التدقيق ومنع التكرار' : 'Audit & Idempotency'}</span>
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {cic.metadata.auditRequirement} — {cic.metadata.idempotencyPrinciple}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
