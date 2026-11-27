'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import type { ExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { cn } from '@/lib/utils';

export interface DependencyModelSectionProps {
  data: ExtractedDependencyArchitecture['dependencyModel'];
  highlightedType?: string | null;
}

export function DependencyModelSection({
  data,
  highlightedType,
}: DependencyModelSectionProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'نموذج الاعتماديات والحوكمة الرسمية (DEPENDENCY_MODEL.md)'
            : 'Official Dependency Model & Governance (DEPENDENCY_MODEL.md)'
        }
        subtitle={
          isAr
            ? 'أربعة أنواع اعتماديات رسمية فقط (PCD / HBMD / CIC / FLD) — مع منع صريح للأنواع الموازية أو الاعتماديات الصلبة الضمنية.'
            : 'Strictly four approved dependency types (PCD / HBMD / CIC / FLD) — explicitly prohibiting parallel ad-hoc labels or implicit HBMDs.'
        }
        actions={
          <Link
            href={`/knowledge/${data.documentSlug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? 'النص الرسمي الكامل' : 'Full Official Source'}</span>
          </Link>
        }
      />

      {/* Supreme Rule */}
      <InformationCallout
        title={isAr ? 'القاعدة العليا للاعتماديات' : 'Supreme Dependency Rule'}
      >
        <p className="font-medium text-text-primary">
          {isAr ? data.supremeRuleAr : data.supremeRuleEn}
        </p>
      </InformationCallout>

      {/* 4 Official Dependency Types */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.officialTypes.map((dt) => {
          const isHighlighted =
            highlightedType?.toUpperCase() === dt.code.toUpperCase();
          return (
            <article
              key={dt.code}
              id={`dep-type-${dt.code}`}
              className={cn(
                'rounded-lg border bg-surface p-4 space-y-2 transition-colors',
                isHighlighted
                  ? 'border-primary ring-1 ring-primary bg-primary-subtle/30'
                  : 'border-border'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-primary/30 bg-primary-subtle px-2 py-0.5 font-mono text-xs font-bold text-primary bidi-ltr">
                    {dt.code}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary bidi-ltr">
                    {dt.name}
                  </h3>
                </div>
                <Link
                  href={`/knowledge/${data.documentSlug}#${dt.sectionAnchor}`}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {isAr ? 'المصدر' : 'Source'}
                </Link>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {dt.purpose}
              </p>
              <p className="rounded-md border border-border bg-surface-secondary/50 px-2.5 py-1.5 text-xs text-text-primary">
                <span className="font-semibold">
                  {isAr ? 'هل يمنع تفعيل الـ Module؟ ' : 'Blocks Module Activation? '}
                </span>
                {dt.blocksModuleActivation}
              </p>
            </article>
          );
        })}
      </div>

      {/* Disallowed labels + FLD vs CIC Distinction */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr
              ? 'مصطلحات غير معتمدة كمستويات اعتمادية مستقلة'
              : 'Explicitly Disallowed Ad-Hoc Dependency Labels'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.disallowedLabels.map((lbl) => (
              <span
                key={lbl}
                className="rounded-sm border border-danger-border bg-danger-bg px-2.5 py-1 font-mono text-xs text-danger bidi-ltr"
              >
                ✕ {lbl}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isAr
              ? 'يُعبّر عن كل حالات الاختيارية أو التعاون من خلال دلالات الاستخدام ونطاق الإنفاذ للأنواع الأربعة الرسمية فقط (PCD / HBMD / CIC / FLD).'
              : 'Optionality and collaboration are expressed strictly via Usage and Enforcement semantics of the four official types (PCD / HBMD / CIC / FLD).'}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr ? 'الفصل الرسمي بين FLD و CIC' : 'Official Separation: FLD vs CIC'}
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
            <div className="rounded-md border border-border bg-surface-secondary/50 p-3 space-y-1">
              <p className="font-mono font-bold text-primary bidi-ltr">
                FLD = Availability Dependency
              </p>
              <p className="text-text-secondary leading-relaxed">
                {isAr
                  ? 'يجيب عن: ما الذي تحتاجه Feature لكي تصبح متاحة أو قابلة للتشغيل؟'
                  : 'Answers: What does a specific Feature need to become available or runnable?'}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface-secondary/50 p-3 space-y-1">
              <p className="font-mono font-bold text-primary bidi-ltr">
                CIC = Execution / Integration Contract
              </p>
              <p className="text-text-secondary leading-relaxed">
                {isAr
                  ? 'يجيب عن: كيف تتعاون Modules مستقلة لتنفيذ Business Scenario مشترك؟'
                  : 'Answers: How do independent modules collaborate to execute a shared Business Scenario?'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enforcement Scope Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-text-primary">
          {isAr ? 'جدول نطاقات الإنفاذ الرسمية (Enforcement Scope)' : 'Official Enforcement Scope Summary'}
        </h3>
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3 py-2 text-start font-semibold">
                  {isAr ? 'النوع' : 'Type'}
                </th>
                <th className="px-3 py-2 text-start font-semibold">
                  {isAr ? 'نطاق الإنفاذ الرئيسي' : 'Primary Enforcement Scope'}
                </th>
                <th className="px-3 py-2 text-start font-semibold">
                  {isAr ? 'ما الذي يُمنع عند عدم توفره؟' : 'Blocked When Unavailable'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.enforcementScopes.map((row) => (
                <tr key={row.kind} className="bg-surface">
                  <td className="px-3 py-2 font-mono font-semibold text-primary bidi-ltr">
                    {row.kind}
                  </td>
                  <td className="px-3 py-2 text-text-primary bidi-ltr text-start">
                    {row.primaryScope}
                  </td>
                  <td className="px-3 py-2 text-text-secondary">
                    {row.blockedWhenUnavailable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12 Governance Rules */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            {isAr
              ? `قواعد الحوكمة الـ ${data.governanceRules.length} المعتمدة`
              : `${data.governanceRules.length} Approved Dependency Governance Rules`}
          </span>
        </h3>
        <ol className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {data.governanceRules.map((rule, idx) => (
            <li
              key={rule}
              className="flex items-start gap-2 rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-xs text-text-primary"
            >
              <span className="font-mono font-bold text-primary bidi-ltr">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="leading-relaxed bidi-ltr text-start">{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export interface DependencyMatrixExplorerProps {
  matrix: ExtractedDependencyArchitecture['matrix'];
  initialCicId?: string | null;
}

const MATRIX_COLS: readonly { id: CoreModuleId; label: string }[] = [
  { id: 'finance', label: 'Finance' },
  { id: 'inventory-warehouse', label: 'Inventory' },
  { id: 'procurement', label: 'Procurement' },
  { id: 'sales-order-management', label: 'Sales' },
];

export function DependencyMatrixExplorer({
  matrix,
  initialCicId,
}: DependencyMatrixExplorerProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const [userSelection, setUserSelection] = useState<{
    forInitial: string | null | undefined;
    contractId: string;
  } | null>(null);
  const [showHbmdRows, setShowHbmdRows] = useState(false);

  const selectedCicId = useMemo(() => {
    if (userSelection && userSelection.forInitial === initialCicId) {
      return userSelection.contractId;
    }
    if (initialCicId) {
      const matched = matrix.coreCics.find(
        (c) => c.contractId.toLowerCase() === initialCicId.toLowerCase()
      );
      if (matched) return matched.contractId;
    }
    return matrix.coreCics[0]?.contractId ?? '';
  }, [initialCicId, matrix.coreCics, userSelection]);

  const activeCic = useMemo(
    () =>
      matrix.coreCics.find((c) => c.contractId === selectedCicId) ??
      matrix.coreCics[0]!,
    [matrix.coreCics, selectedCicId]
  );

  const cicFields = useMemo(
    () => [
      { label: 'Participating Modules', value: activeCic.metadata.participatingModules },
      { label: 'Business Scenario', value: activeCic.metadata.businessScenario },
      { label: 'Trigger / Initiator', value: activeCic.metadata.triggerInitiator },
      { label: 'Source Owner', value: activeCic.metadata.sourceOwner },
      { label: 'Target Owner', value: activeCic.metadata.targetOwner },
      { label: 'Business Object / Data References', value: activeCic.metadata.businessObjectRefs },
      { label: 'Required Preconditions', value: activeCic.metadata.requiredPreconditions },
      { label: 'Expected Outcome', value: activeCic.metadata.expectedOutcome },
      { label: 'Failure / Unavailable Behavior', value: activeCic.metadata.failureBehavior },
      { label: 'Idempotency Principle', value: activeCic.metadata.idempotencyPrinciple },
      { label: 'Audit Requirement', value: activeCic.metadata.auditRequirement },
      { label: 'Activation Condition', value: activeCic.metadata.activationCondition },
      { label: 'Version', value: activeCic.metadata.version },
      { label: 'Contract Owner', value: activeCic.metadata.contractOwner },
      { label: 'Status', value: activeCic.metadata.status },
    ],
    [activeCic]
  );

  return (
    <div className="space-y-8">
      {/* Mandatory Reading Rule */}
      <InformationCallout
        title={
          isAr
            ? 'قاعدة تفسير إلزامية: No HBMD ≠ No Relationship'
            : 'Mandatory Reading Rule: No HBMD ≠ No Relationship'
        }
      >
        {isAr
          ? 'عدم وجود Hard Business Module Dependency بين الأنظمة الأربعة لا يعني غياب العلاقات: المصفوفة تفصل صراحةً بين HBMD (صفر حواف)، و6 عقود تكامل مشروط (CIC)، و5 اعتماديات مستوى الميزة (FLD)، و21 قدرة منصة (PCD).'
          : 'Zero Hard Business Module Dependencies between the four Core Modules does not mean zero collaboration: the matrix explicitly separates HBMD (0 edges), 6 Core CICs, 5 FLDs, and 21 Platform PCDs.'}
      </InformationCallout>

      {/* 1. 4x4 Multi-Relationship Summary Matrix */}
      <section className="space-y-3">
        <SectionHeader
          title={
            isAr
              ? '1. مصفوفة العلاقات المتعددة 4×4 (Core Module Summary Matrix)'
              : '1. 4×4 Core Module Summary Matrix'
          }
          actions={
            <Link
              href={`/knowledge/${matrix.documentSlug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isAr ? 'فتح MODULE_DEPENDENCY_MATRIX.md' : 'Open MODULE_DEPENDENCY_MATRIX.md'}
            </Link>
          }
        />
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3 py-2.5 text-start font-semibold">
                  Source ↓ / Target →
                </th>
                {MATRIX_COLS.map((col) => (
                  <th key={col.id} className="px-3 py-2.5 text-start font-semibold bidi-ltr">
                    <Link
                      href={`/modules/${col.id}`}
                      className="text-primary hover:underline"
                    >
                      {col.label}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {matrix.summaryRows.map((row) => (
                <tr key={row.sourceModuleId} className="bg-surface">
                  <th
                    scope="row"
                    className="px-3 py-2.5 text-start font-semibold text-text-primary bg-surface-secondary/40"
                  >
                    <Link
                      href={`/modules/${row.sourceModuleId}`}
                      className="text-primary hover:underline bidi-ltr"
                    >
                      {row.sourceLabel}
                    </Link>
                  </th>
                  {MATRIX_COLS.map((col) => {
                    const cell = row.cells[col.id];
                    const isSelf = col.id === row.sourceModuleId;
                    return (
                      <td
                        key={col.id}
                        className={cn(
                          'px-3 py-2.5 leading-relaxed align-top',
                          isSelf
                            ? 'bg-surface-secondary/50 text-center font-mono text-text-muted'
                            : 'text-text-secondary'
                        )}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. HBMD Graph & Absence Register (0 Edges / 0 Cycles) */}
      <section className="rounded-lg border border-success-border bg-success-bg/30 p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              <span>
                {isAr
                  ? '2. مخطط وسجل غياب الاعتماديات الصلبة (HBMD Graph & Absence Register)'
                  : '2. HBMD Graph & Explicit Absence Register'}
              </span>
            </h3>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'تم التحقق رسميًا عبر جميع الأزواج الـ 12 المرتبة بين الأنظمة الأربعة: 0 حواف HBMD معتمدة · 0 دورات · Acyclic by construction (لا توجد أسهم HBMD مختلقة).'
                : 'Verified across all 12 ordered pairs of the four Core Modules: 0 approved HBMD edges · 0 cycles · Acyclic by construction (zero invented dependency arrows).'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm border border-success-border bg-surface px-2.5 py-1 font-mono text-xs font-bold text-success bidi-ltr">
              HBMD Edges: {matrix.hbmdEdgeCount}
            </span>
            <span className="rounded-sm border border-success-border bg-surface px-2.5 py-1 font-mono text-xs font-bold text-success bidi-ltr">
              Cycles: {matrix.hbmdCycleCount}
            </span>
          </div>
        </div>

        {/* Visual Acyclic 4-Node HBMD Graph showing 4 independent nodes and 0 HBMD edges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MATRIX_COLS.map((node) => (
            <Link
              key={node.id}
              href={`/modules/${node.id}`}
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-success-border bg-surface p-3 text-center transition-colors hover:border-primary"
            >
              <span className="font-semibold text-xs text-text-primary bidi-ltr">
                {node.label}
              </span>
              <span className="mt-1 font-mono text-[10px] text-success bidi-ltr">
                0 HBMD in · 0 HBMD out
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowHbmdRows((prev) => !prev)}
          aria-expanded={showHbmdRows}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
        >
          {showHbmdRows
            ? isAr
              ? 'إخفاء جدول الأزواج الـ 12'
              : 'Hide 12-Pair Absence Table'
            : isAr
              ? `عرض سجل غياب HBMD الكامل (${matrix.hbmdAbsenceRegister.length} زوجًا)`
              : `Inspect Full HBMD Absence Table (${matrix.hbmdAbsenceRegister.length} Pairs)`}
        </button>

        {showHbmdRows ? (
          <div className="overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary text-text-primary">
                  <th className="px-3 py-2 text-start font-semibold">Source</th>
                  <th className="px-3 py-2 text-start font-semibold">Target</th>
                  <th className="px-3 py-2 text-start font-semibold">Scope</th>
                  <th className="px-3 py-2 text-start font-semibold">Evidence</th>
                  <th className="px-3 py-2 text-start font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {matrix.hbmdAbsenceRegister.map((r) => (
                  <tr key={`${r.source}-${r.target}`}>
                    <td className="px-3 py-2 font-medium text-text-primary">{r.source}</td>
                    <td className="px-3 py-2 font-medium text-text-primary">{r.target}</td>
                    <td className="px-3 py-2 text-text-secondary">{r.enforcementScope}</td>
                    <td className="px-3 py-2 font-mono text-text-secondary bidi-ltr">{r.evidence}</td>
                    <td className="px-3 py-2 font-semibold text-success">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {/* 3. Core CIC Register + 16-Field Contract Inspector */}
      <section id="cic-register" className="space-y-4">
        <SectionHeader
          title={
            isAr
              ? `3. سجل عقود التكامل المشروط الأساسية (Core CIC Register · ${matrix.coreCics.length})`
              : `3. Core Conditional Integration Contract Register (${matrix.coreCics.length} CICs)`
          }
          subtitle={
            isAr
              ? 'اختر أي عقد لاستعراض كافة حقول البيانات الوصفية الـ 16 المعتمدة في المرحلة 2 (v0.1-conceptual — بدون تفاصيل API أو Payload).'
              : 'Select any Core CIC to inspect all Phase 2 contract metadata fields (v0.1-conceptual — API/payload/transport deferred to Phase 5+).'
          }
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Selector List */}
          <div
            role="tablist"
            aria-label={isAr ? 'عقود التكامل المشروط' : 'Core CIC Contracts'}
            className="space-y-2 lg:col-span-5"
          >
            {matrix.coreCics.map((cic) => {
              const selected = cic.contractId === activeCic.contractId;
              return (
                <button
                  key={cic.contractId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() =>
                    setUserSelection({
                      forInitial: initialCicId,
                      contractId: cic.contractId,
                    })
                  }
                  className={cn(
                    'w-full rounded-lg border p-3.5 text-start transition-colors space-y-1',
                    selected
                      ? 'border-primary bg-primary-subtle/50 ring-1 ring-primary'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary bidi-ltr">
                      {cic.contractId}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted bidi-ltr">
                      {cic.sourceInitiator} → {cic.target}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-text-primary">
                    {cic.businessScenario}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] text-text-secondary bidi-ltr">
                      {cic.evidence}
                    </span>
                    {cic.hasDeferredBoundary ? (
                      <span className="rounded-sm border border-warning-border bg-warning-bg px-1.5 py-0.5 text-[10px] font-medium text-warning">
                        {isAr ? 'يتضمن حدًا مؤجلاً' : 'Includes Deferred Boundary'}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 16-Field Metadata Inspector */}
          <article
            aria-live="polite"
            className="rounded-lg border border-border bg-surface p-5 space-y-4 lg:col-span-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-primary/30 bg-primary-subtle px-2 py-0.5 font-mono text-xs font-bold text-primary bidi-ltr">
                    {activeCic.contractId}
                  </span>
                  <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 text-[10px] font-medium text-success">
                    {isAr ? 'معرّف ERP رسمي' : 'Official ERP ID'}
                  </span>
                  <span className="rounded-sm border border-border bg-surface-secondary px-2 py-0.5 font-mono text-[11px] text-text-secondary bidi-ltr">
                    {activeCic.metadata.version}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {activeCic.sourceInitiator} → {activeCic.target}
                </h4>
              </div>
              <Link
                href={`/knowledge/${matrix.documentSlug}#${activeCic.sectionAnchor}`}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-secondary px-2.5 py-1 text-xs font-medium text-primary hover:border-primary/40"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isAr ? 'المصدر الأصلي' : 'Verbatim Anchor'}</span>
              </Link>
            </div>

            <dl className="divide-y divide-border text-xs">
              {cicFields.map((field) => (
                <div
                  key={field.label}
                  className="grid grid-cols-1 gap-1 py-2 sm:grid-cols-12 sm:gap-3"
                >
                  <dt className="font-semibold text-text-muted sm:col-span-4 bidi-ltr text-start">
                    {field.label}
                  </dt>
                  <dd className="leading-relaxed text-text-primary sm:col-span-8">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      {/* 4. Core FLD Register */}
      <section id="fld-register" className="space-y-3">
        <SectionHeader
          title={
            isAr
              ? `4. سجل اعتماديات مستوى الميزة (Core FLD Register · ${matrix.coreFlds.length})`
              : `4. Core Feature-Level Dependency Register (${matrix.coreFlds.length} FLDs)`
          }
          subtitle={
            isAr
              ? 'ضابط FLD الحاكم: أهمية الميزة تجاريًا لا تبرر أبدًا ترقيتها إلى HBMD على مستوى الـ Module. ملاحظة: رموز FLD-CORE-* هي مراجع داخلية لمركز المعرفة (KH Internal Ref) لأن القسم 6 من MODULE_DEPENDENCY_MATRIX.md لا يعرّف رموز FLD رسمية.'
              : 'FLD Guardrail: Commercial importance of a feature never justifies promoting an FLD to an HBMD. Note: FLD-CORE-* codes are Knowledge Hub internal row references (not official ERP identifiers), as MODULE_DEPENDENCY_MATRIX.md §6 assigns no formal FLD IDs.'
          }
        />
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3 py-2.5 text-start font-semibold">
                  {isAr ? 'مرجع داخلي (KH Ref)' : 'KH Internal Ref'}
                </th>
                <th className="px-3 py-2.5 text-start font-semibold">Source Module / Feature</th>
                <th className="px-3 py-2.5 text-start font-semibold">Target</th>
                <th className="px-3 py-2.5 text-start font-semibold">Scenario</th>
                <th className="px-3 py-2.5 text-start font-semibold">Feature Owner</th>
                <th className="px-3 py-2.5 text-start font-semibold">Evidence</th>
                <th className="px-3 py-2.5 text-start font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {matrix.coreFlds.map((fld) => (
                <tr key={fld.id} className="bg-surface">
                  <td className="px-3 py-2.5 align-top">
                    <span
                      title={
                        isAr
                          ? 'مرجع صف داخلي لمركز المعرفة (ليس معرّف ERP رسميًا)'
                          : 'Knowledge Hub internal row reference (not an official ERP identifier)'
                      }
                      className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-secondary bidi-ltr"
                    >
                      <span>{fld.id}</span>
                      <span className="text-[9px] text-text-muted">
                        {isAr ? 'داخلي' : 'KH'}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-text-primary bidi-ltr text-start">
                    {fld.sourceModuleFeature}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-primary bidi-ltr text-start">
                    {fld.targetModuleCapability}
                  </td>
                  <td className="px-3 py-2.5 text-text-secondary">{fld.featureScenario}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        'rounded-sm border px-1.5 py-0.5 text-[11px] font-medium',
                        fld.isOwnerDeferred
                          ? 'border-warning-border bg-warning-bg text-warning'
                          : 'border-border bg-surface-secondary text-text-primary'
                      )}
                    >
                      {fld.featureOwner}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-text-secondary bidi-ltr">
                    {fld.evidence}
                  </td>
                  <td className="px-3 py-2.5 text-text-secondary">{fld.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. 21-Row PCD Matrix (Strictly Separate from HBMD) */}
      <section id="pcd-matrix" className="space-y-3">
        <SectionHeader
          title={
            isAr
              ? `5. مصفوفة اعتماديات قدرات المنصة (PCD Matrix · ${matrix.pcdMatrix.length} قدرة)`
              : `5. Platform Capability Dependency Matrix (${matrix.pcdMatrix.length} Capabilities)`
          }
          subtitle={
            isAr
              ? 'منفصلة صراحةً عن مصفوفة Business Modules: R = مطلوبة · C = مشروطة · C* = مشروطة وموقع ملكيتها مؤجل · — = غير معتمدة في المرحلة 2.'
              : 'Strictly separate from Business Module dependencies: R = Required · C = Conditionally Required · C* = Conditional with deferred placement · — = None at Phase 2.'
          }
        />

        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-text-primary">
                <th className="px-3 py-2.5 text-start font-semibold">
                  Platform / Shared Capability
                </th>
                <th className="px-3 py-2.5 text-center font-semibold">Finance</th>
                <th className="px-3 py-2.5 text-center font-semibold">Inventory</th>
                <th className="px-3 py-2.5 text-center font-semibold">Procurement</th>
                <th className="px-3 py-2.5 text-center font-semibold">Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {matrix.pcdMatrix.map((row) => (
                <tr key={row.capability} className="bg-surface hover:bg-surface-hover/40">
                  <td className="px-3 py-2 font-medium text-text-primary bidi-ltr text-start">
                    {row.capability}
                  </td>
                  {[row.finance, row.inventory, row.procurement, row.sales].map(
                    (val, idx) => {
                      const isReq = val === 'R' || val.startsWith('R ');
                      const isDeferredC = val.includes('C*');
                      const isCond = val === 'C';
                      return (
                        <td key={idx} className="px-3 py-2 text-center">
                          <span
                            className={cn(
                              'inline-block rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold bidi-ltr',
                              isReq
                                ? 'border-primary/30 bg-primary-subtle text-primary'
                                : isDeferredC
                                  ? 'border-warning-border bg-warning-bg text-warning'
                                  : isCond
                                    ? 'border-info-border bg-info-bg text-info'
                                    : 'border-transparent text-text-muted'
                            )}
                          >
                            {val}
                          </span>
                        </td>
                      );
                    }
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PCD Notes & Consistency Checks */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              <span>{isAr ? 'ملاحظات PCD الحاكمة' : 'Authoritative PCD Notes'}</span>
            </h4>
            <ol className="space-y-1.5 text-xs text-text-secondary">
              {matrix.pcdNotes.map((note, idx) => (
                <li key={note} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono font-semibold text-primary">{idx + 1}.</span>
                  <span>{note}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              <span>
                {isAr
                  ? `فحوصات الاتساق الـ ${matrix.consistencyChecks.length} (${matrix.consistencyResult})`
                  : `${matrix.consistencyChecks.length} Consistency Checks (${matrix.consistencyResult})`}
              </span>
            </h4>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              {matrix.consistencyChecks.map((chk) => (
                <li
                  key={chk.check}
                  className="flex items-start justify-between gap-2 rounded-md border border-border bg-surface-secondary/40 px-2.5 py-1.5"
                >
                  <span className="text-text-primary">{chk.check}</span>
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-success">
                    {chk.result}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
