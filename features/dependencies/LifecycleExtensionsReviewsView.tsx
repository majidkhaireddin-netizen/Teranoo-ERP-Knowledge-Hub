'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  Puzzle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
} from 'lucide-react';
import type { ExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { cn } from '@/lib/utils';

export interface ModuleLifecycleExplorerProps {
  lifecycle: ExtractedDependencyArchitecture['lifecycle'];
}

export function ModuleLifecycleExplorer({
  lifecycle,
}: ModuleLifecycleExplorerProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const [selectedScenario, setSelectedScenario] = useState<
    'deactivate-inventory' | 'deactivate-finance' | 'reactivate-frozen'
  >('deactivate-inventory');

  const scenarios = {
    'deactivate-inventory': {
      title: isAr
        ? 'سيناريو: تجميد Inventory بينما Sales وProcurement في حالة Active'
        : 'Scenario: Freezing Inventory while Sales & Procurement remain Active',
      steps: isAr
        ? [
            '1. فحص الأثر الإلزامي: التحقق من الحركات المفتوحة والأرصدة والميزات التابعة (FLD) وعقود CIC المرتبطة.',
            '2. تطبيق Freeze, not Delete: الانتقال إلى حالة Frozen لحفظ تاريخ الحركات وOn-hand دون حذف Shared Product Identity.',
            '3. أثر FLD: تتعطل ميزة Stock Sale في Sales وميزة Stock Purchase في Procurement فقط — بينما يبقى Sales وProcurement في حالة Active بالكامل (لغياب HBMD).',
            '4. أثر CIC: تدخل عقود CIC-CORE-SALES-INV-001 وCIC-CORE-PROC-INV-001 وCIC-CORE-INV-FIN-001 حالة غير جاهزة معلنة دون Silent Success.',
          ]
        : [
            '1. Mandatory Impact Analysis: Inspect open movements/balances, dependent FLDs, and active CICs.',
            '2. Apply Freeze, not Delete: Transition Inventory to Frozen — preserving movement history while never deleting Shared Product/Item Identity.',
            '3. FLD Impact: Sales Stock Sale and Procurement Stock Purchase become Unavailable, while Sales (service sales) and Procurement (service POs) stay Active (0 HBMD).',
            '4. CIC Impact: CIC-CORE-SALES-INV-001, CIC-CORE-PROC-INV-001, and CIC-CORE-INV-FIN-001 enter explicit unavailable state (zero Silent Success).',
          ],
    },
    'deactivate-finance': {
      title: isAr
        ? 'سيناريو: تجميد Finance بعد وجود قيود مالية تاريخية'
        : 'Scenario: Freezing Finance after Historical Postings Exist',
      steps: isAr
        ? [
            '1. الفصل عن Entitlement: انتهاء الترخيص أو إيقاف التفعيل الوظيفي لا يساوي حذف الأستاذ العام أو السجلات التدقيقية.',
            '2. الانتقال إلى Frozen: تُمنع القيود الجديدة بينما تبقى القيود التاريخية والارتباطات المرجعية محفوظة.',
            '3. أثر الأنظمة الأخرى: تبقى Inventory وProcurement وSales في حالة Active، بينما تتعطل ميزات Customer Billing وThree-Way Match (FLD) وتُعلّق عقود CIC المالية بحالة معلنة.',
            '4. حماية Shared Party: لا تُحذف هويات العملاء أو الموردين المشتركة التي تستهلكها المبيعات والمشتريات.',
          ]
        : [
            '1. Entitlement vs Functional Separation: Ending license or functional state never deletes GL history or audit trails.',
            '2. Frozen State: New postings are blocked while historical ledger entries and audit references remain intact.',
            '3. Cross-Module Impact: Inventory, Procurement, and Sales remain Active; Customer Billing & Three-Way Match FLDs disable and financial CICs enter explicit unavailable state.',
            '4. Shared Data Safety: Shared Customer/Supplier Party Identities remain intact for other modules.',
          ],
    },
    'reactivate-frozen': {
      title: isAr
        ? 'سيناريو: إعادة تفعيل نظام من حالة Frozen إلى Active'
        : 'Scenario: Reactivating a Module from Frozen back to Active',
      steps: isAr
        ? [
            '1. إعادة فحص Entitlement + جميع Required PCD + أي HBMD معتمدة مستقبلًا + توافق التهيئة.',
            '2. استمرارية الهوية والتاريخ: لا يُنشأ تاريخ منفصل بدل التاريخ المحفوظ وتستمر نفس المراجع السابقة.',
            '3. استعادة العقود والميزات: تعود عقود CIC وميزات FLD فقط بعد التحقق الصريح من جاهزيتها.',
          ]
        : [
            '1. Re-validate Entitlement, all Required PCDs, any future HBMD, and configuration compatibility.',
            '2. History & Identity Continuity: Reactivation preserves prior history and identity continuity without resetting records.',
            '3. Controlled Restoration: Dependent CICs and FLDs resume only after their readiness checks pass.',
          ],
    },
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'قواعد دورة حياة الأنظمة (MODULE_LIFECYCLE_RULES.md)'
            : 'Module Lifecycle Governance (MODULE_LIFECYCLE_RULES.md)'
        }
        subtitle={
          isAr
            ? 'الحالات الوظيفية الثلاث المعتمدة (Inactive / Active / Frozen) والفصل بين Entitlement والتشغيل الوظيفي وقاعدة التجميد لا الحذف.'
            : 'Approved conceptual states (Inactive / Active / Frozen), separation from Entitlement/Licensing, and Freeze, not Delete governance.'
        }
        actions={
          <Link
            href={`/knowledge/${lifecycle.documentSlug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? 'النص الرسمي الكامل' : 'Full Official Source'}</span>
          </Link>
        }
      />

      {/* Distinct from Tenant Lifecycle warning */}
      <InformationCallout
        className="border-info-border bg-info-bg/50"
        title={
          isAr
            ? 'تمييز معماري إلزامي: دورة حياة النظام ≠ دورة حياة المستأجر (Tenant Lifecycle)'
            : 'Mandatory Architectural Distinction: Module Lifecycle ≠ Tenant Lifecycle'
        }
      >
        {isAr
          ? 'تحكم هذه الوثيقة (المرحلة 2) حالات التفعيل الوظيفي للأنظمة التجارية داخل المستأجر (Inactive / Active / Frozen)، وهي منفصلة تمامًا عن دورة حياة المستأجر الكلية (Tenant Lifecycle — المرحلة 3 · D-LC-01..08). كما أن هذه الحالات مفاهيمية وليست Database Enums إلزامية.'
          : 'This Phase 2 specification governs tenant-level Business Module functional states (Inactive / Active / Frozen) and is strictly distinct from Phase 3 Tenant Lifecycle (D-LC-01..08). These are conceptual governance states, not mandatory DB enums.'}
      </InformationCallout>

      {/* 3 Conceptual States */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {lifecycle.functionalStates.map((st) => (
          <article
            key={st.state}
            className={cn(
              'rounded-lg border p-4 space-y-2',
              st.state === 'Active'
                ? 'border-success-border bg-success-bg/30'
                : st.state === 'Frozen'
                  ? 'border-info-border bg-info-bg/30'
                  : 'border-border bg-surface'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-text-primary bidi-ltr">
                {st.state}
              </span>
              {st.state === 'Frozen' ? (
                <Snowflake className="h-4 w-4 text-info" aria-hidden="true" />
              ) : st.state === 'Active' ? (
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              ) : (
                <Lock className="h-4 w-4 text-text-muted" aria-hidden="true" />
              )}
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              {st.meaning}
            </p>
          </article>
        ))}
      </div>

      {/* Interactive Lifecycle Scenario Explorer */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <RefreshCw className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? 'مستكشف سيناريوهات التجميد وإعادة التفعيل (Freeze, not Delete)'
                : 'Interactive Lifecycle & Freeze-not-Delete Scenarios'}
            </span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                {
                  id: 'deactivate-inventory',
                  label: isAr ? 'تجميد المخزون' : 'Freeze Inventory',
                },
                {
                  id: 'deactivate-finance',
                  label: isAr ? 'تجميد المالية' : 'Freeze Finance',
                },
                {
                  id: 'reactivate-frozen',
                  label: isAr ? 'إعادة التفعيل' : 'Reactivate Frozen',
                },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedScenario(btn.id)}
                aria-pressed={selectedScenario === btn.id}
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                  selectedScenario === btn.id
                    ? 'border-primary bg-primary-subtle text-primary'
                    : 'border-border bg-surface-secondary text-text-secondary hover:border-border-strong'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface-secondary/40 p-4 space-y-2">
          <p className="text-xs font-semibold text-text-primary">
            {scenarios[selectedScenario].title}
          </p>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {scenarios[selectedScenario].steps.map((s) => (
              <li key={s} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Activation vs Deactivation Preconditions + Freeze not Delete */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr
              ? `شروط التفعيل المسبقة (${lifecycle.activationPreconditions.length})`
              : `Module Activation Preconditions (${lifecycle.activationPreconditions.length})`}
          </h3>
          <ol className="space-y-1.5 text-xs text-text-secondary">
            {lifecycle.activationPreconditions.map((item, idx) => (
              <li key={item} className="flex items-start gap-2 leading-relaxed">
                <span className="font-mono font-bold text-primary">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr
              ? `فحص أثر الإيقاف وحماية البيانات المشتركة (${lifecycle.deactivationPreconditions.length})`
              : `Deactivation Impact Checklist & Shared Data Safety (${lifecycle.deactivationPreconditions.length})`}
          </h3>
          <ol className="space-y-1.5 text-xs text-text-secondary">
            {lifecycle.deactivationPreconditions.map((item, idx) => (
              <li key={item} className="flex items-start gap-2 leading-relaxed">
                <span className="font-mono font-bold text-warning">{idx + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="border-t border-border pt-2.5 space-y-1">
            <p className="text-xs font-semibold text-text-primary">
              {isAr ? 'أمثلة حماية البيانات المشتركة:' : 'Shared Data Safety Examples:'}
            </p>
            {lifecycle.sharedDataSafetyExamples.map((ex) => (
              <p key={ex} className="text-[11px] text-text-secondary">
                • {ex}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Core Module Consistency Matrix */}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-text-primary">
              <th className="px-3 py-2 text-start font-semibold">Module</th>
              <th className="px-3 py-2 text-center font-semibold">Standalone</th>
              <th className="px-3 py-2 text-center font-semibold">Freeze not Delete</th>
              <th className="px-3 py-2 text-center font-semibold">History Preserved</th>
              <th className="px-3 py-2 text-center font-semibold">CIC ≠ Base Block</th>
              <th className="px-3 py-2 text-center font-semibold">FLD ≠ Base Block</th>
              <th className="px-3 py-2 text-center font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lifecycle.consistencyRows.map((row) => (
              <tr key={row.module}>
                <td className="px-3 py-2 font-semibold text-text-primary">{row.module}</td>
                <td className="px-3 py-2 text-center">{row.standaloneActivation}</td>
                <td className="px-3 py-2 text-center">{row.freezeNotDelete}</td>
                <td className="px-3 py-2 text-center">{row.historyPreserved}</td>
                <td className="px-3 py-2 text-center">{row.cicDoesNotBlockBase}</td>
                <td className="px-3 py-2 text-center">{row.fldDoesNotBlockBase}</td>
                <td className="px-3 py-2 text-center font-mono font-bold text-success">
                  {row.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface FutureExtensionGovernanceViewProps {
  extensions: ExtractedDependencyArchitecture['futureExtensions'];
}

export function FutureExtensionGovernanceView({
  extensions,
}: FutureExtensionGovernanceViewProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'حوكمة امتداد الأنظمة المستقبلية وأثرها على النواة (FUTURE_MODULE_EXTENSION_RULES.md)'
            : 'Future Module Extension & Core Impact Governance (FUTURE_MODULE_EXTENSION_RULES.md)'
        }
        subtitle={
          isAr
            ? 'ضوابط حماية النواة الأربعة عند إضافة وحدات المؤسسة (Phase 7) أو الامتدادات القطاعية (Phase 8).'
            : 'Guardrails protecting the 4 Core Modules when introducing Enterprise Modules (Phase 7) or Industry Extensions (Phase 8).'
        }
        actions={
          <Link
            href={`/knowledge/${extensions.documentSlug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? 'النص الرسمي الكامل' : 'Full Official Source'}</span>
          </Link>
        }
      />

      <InformationCallout
        title={isAr ? 'القاعدة العليا للامتداد المستقبلي' : 'Supreme Extension Rule'}
      >
        <p className="font-medium text-text-primary">{extensions.supremeRule}</p>
      </InformationCallout>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Core Ownership Guardrails */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            <span>
              {isAr
                ? 'ضوابط حماية ملكية النواة (Core Ownership Guardrails)'
                : 'Core Ownership Guardrails'}
            </span>
          </h3>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {extensions.coreOwnershipGuardrails.map((item) => (
              <li
                key={item}
                className="rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* No Core Back-Dependency */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? 'منع الاعتماد العكسي للنواة (No Core Back-Dependency)'
                : 'No Core Back-Dependency by Accident'}
            </span>
          </h3>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {extensions.noBackDependencyExamples.map((item) => (
              <li
                key={item}
                className="rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 8-Point Core Compatibility Review & 10 New Module Requirements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr
              ? `قائمة مراجعة التوافق مع النواة (${extensions.compatibilityReviewChecklist.length} أسئلة إلزامية)`
              : `Core Compatibility Review (${extensions.compatibilityReviewChecklist.length} Mandatory Questions)`}
          </h3>
          <ol className="space-y-1.5 text-xs text-text-secondary">
            {extensions.compatibilityReviewChecklist.map((q, idx) => (
              <li key={q} className="flex items-start gap-2">
                <span className="font-mono font-bold text-primary">{idx + 1}.</span>
                <span className="text-text-primary">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
          <h3 className="text-xs font-semibold text-text-primary">
            {isAr
              ? `متطلبات اعتماد أي Business Module جديد (${extensions.newModuleRequirements.length})`
              : `Requirements for Any New Business Module (${extensions.newModuleRequirements.length})`}
          </h3>
          <ol className="space-y-1.5 text-xs text-text-secondary">
            {extensions.newModuleRequirements.map((req, idx) => (
              <li key={req} className="flex items-start gap-2">
                <span className="font-mono font-bold text-primary">{idx + 1}.</span>
                <span>{req}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Illustrative Directional Examples — Strictly Labeled Non-Approved Scope */}
      <div className="rounded-lg border border-class-illustrative-border bg-class-illustrative-bg/40 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Puzzle className="h-4 w-4 text-class-illustrative" aria-hidden="true" />
            <span>
              {isAr
                ? 'أمثلة اتجاهية للمستقبل (توضيحية للتصنيف فقط — ليست اعتماد نطاق)'
                : 'Directional Future Examples (Illustrative Classification Only — Not Scope Approval)'}
            </span>
          </h3>
          <span className="rounded-sm border border-class-illustrative-border bg-surface px-2 py-0.5 text-[11px] font-medium text-class-illustrative">
            {isAr ? 'توضيحي / غير معتمد كنطاق' : 'Illustrative / Non-Approved Scope'}
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 text-xs">
          {extensions.illustrativeDirectionalExamples.map((ex) => (
            <li
              key={ex}
              className="rounded-md border border-border bg-surface/90 px-3 py-2 text-text-primary bidi-ltr text-start"
            >
              {ex}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export interface Phase2ReviewsSectionProps {
  reviews: ExtractedDependencyArchitecture['phase2Reviews'];
}

export function Phase2ReviewsSection({ reviews }: Phase2ReviewsSectionProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'أدلة بوابات المراجعة الرسمية للمرحلة 2'
            : 'Official Phase 2 Project Review Gate Evidence'
        }
        subtitle={
          isAr
            ? 'مراجعة سلامة الافتراضات (PASS with Guardrails) ومراجعة إغلاق المرحلة 2 (PASS — Phase 2 Closed 2026-09-09).'
            : 'Phase 2 Assumption Safety Review (PASS with Guardrails) and Phase 2 Closure Review (PASS — Phase 2 Closed 2026-09-09).'
        }
      />

      {/* Explicit Authority Separation from External Advisory Reviews */}
      <InformationCallout
        className="border-info-border bg-info-bg/50"
        title={
          isAr
            ? 'فصل المرجعية: بوابات مراجعة معمارية رسمية للمشروع ≠ المراجعات الاستشارية المستقلة'
            : 'Authority Separation: Official Project Review Gates ≠ External Independent Advisory Reviews'
        }
      >
        {isAr
          ? 'تُعد هاتان الوثيقتان بوابتي مراجعة وإغلاق رسميتين ضمن مسار تخطيط Teranoo ERP الرسمي، وتختلفان تصنيفيًا عن المراجعات الاستشارية الخارجية المستقلة (Independent Analysis).'
          : 'Both documents are official internal project architecture gates closing Phase 2; they are strictly separated from external independent advisory analyses.'}
      </InformationCallout>

      {/* Two Gate Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-success-border bg-surface p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
            <div className="space-y-1">
              <span className="rounded-sm border border-warning-border bg-warning-bg px-2 py-0.5 font-mono text-xs font-bold text-warning bidi-ltr">
                {reviews.assumptionSafety.result}
              </span>
              <h3 className="text-sm font-semibold text-text-primary">
                {isAr
                  ? 'مراجعة سلامة الافتراضات (PHASE_2_ASSUMPTION_SAFETY_REVIEW.md)'
                  : 'Phase 2 Assumption Safety Review'}
              </h3>
              <p className="font-mono text-[11px] text-text-muted bidi-ltr">
                {reviews.assumptionSafety.reviewDate} · 0 Reopens · 0 Conflicts · 1 Doc Sync (D-SALES-06)
              </p>
            </div>
            <Link
              href={`/knowledge/${reviews.assumptionSafety.documentSlug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isAr ? 'النص الكامل' : 'Full Doc'}
            </Link>
          </div>

          {/* 4 Module Verdicts */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
            {reviews.assumptionSafety.moduleVerdicts.map((v) => (
              <div
                key={v.moduleLabel}
                className="rounded-md border border-border bg-surface-secondary/50 p-2.5 space-y-0.5"
              >
                <p className="font-semibold text-text-primary bidi-ltr text-start">
                  {v.moduleLabel}
                </p>
                <p className="font-mono text-[11px] text-success bidi-ltr text-start">
                  {v.verdict}
                </p>
                {v.syncNote ? (
                  <p className="text-[11px] text-text-secondary">{v.syncNote}</p>
                ) : null}
              </div>
            ))}
          </div>

          {/* 7 Binding Guardrails G-ASSUMP-01..07 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-text-primary">
              {isAr
                ? `الضوابط الملزمة للمرحلة 3 وما بعدها (${reviews.assumptionSafety.guardrails.length})`
                : `Binding Guardrails for Phase 3+ (${reviews.assumptionSafety.guardrails.length})`}
            </h4>
            <div className="space-y-1.5">
              {reviews.assumptionSafety.guardrails.map((g) => (
                <div
                  key={g.code}
                  className="rounded-md border border-border bg-surface-secondary/30 px-3 py-2 text-xs"
                >
                  <span className="font-mono font-bold text-primary bidi-ltr">
                    {g.code}
                  </span>
                  <span className="mx-1.5 text-text-muted">—</span>
                  <span className="font-medium text-text-primary bidi-ltr">
                    {g.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 12 Phase 3 Handoffs */}
          <div className="space-y-1.5 border-t border-border pt-3">
            <h4 className="text-xs font-semibold text-text-primary">
              {isAr
                ? `عناصر التسليم للمرحلة 3 (${reviews.assumptionSafety.phase3Handoffs.length})`
                : `Phase 3 Hand-Off Items (${reviews.assumptionSafety.phase3Handoffs.length})`}
            </h4>
            <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2 text-[11px] text-text-secondary">
              {reviews.assumptionSafety.phase3Handoffs.map((h, i) => (
                <li key={h} className="flex items-start gap-1.5">
                  <span className="font-mono font-semibold text-primary">{i + 1}.</span>
                  <span>{h}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        {/* Closure Review Card */}
        <article className="rounded-lg border border-success-border bg-surface p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3">
            <div className="space-y-1">
              <span className="rounded-sm border border-success-border bg-success-bg px-2 py-0.5 font-mono text-xs font-bold text-success bidi-ltr">
                {reviews.closureReview.exitGateResult}
              </span>
              <h3 className="text-sm font-semibold text-text-primary">
                {isAr
                  ? 'مراجعة إغلاق المرحلة 2 (PHASE_2_CLOSURE_REVIEW.md)'
                  : 'Phase 2 Closure Review'}
              </h3>
              <p className="font-mono text-[11px] text-text-muted bidi-ltr">
                Closed: {reviews.closureReview.closureDate} · {reviews.closureReview.exitCriteria.length} Exit Criteria Passed
              </p>
            </div>
            <Link
              href={`/knowledge/${reviews.closureReview.documentSlug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isAr ? 'النص الكامل' : 'Full Doc'}
            </Link>
          </div>

          {/* 13 Exit Criteria */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-text-primary">
              {isAr
                ? `معايير الخروج الـ ${reviews.closureReview.exitCriteria.length} (Exit Criteria)`
                : `${reviews.closureReview.exitCriteria.length} Exit Criteria`}
            </h4>
            <ul className="divide-y divide-border rounded-md border border-border">
              {reviews.closureReview.exitCriteria.map((ec) => (
                <li
                  key={ec.criterion}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
                >
                  <span className="text-text-primary bidi-ltr text-start">
                    {ec.criterion}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-success bidi-ltr">
                    {ec.result}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deferred Architecture Commitments */}
          <div className="space-y-2 border-t border-border pt-3">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              <span>
                {isAr
                  ? 'الالتزامات المعمارية المؤجلة عمدًا (ليست Blockers)'
                  : 'Intentionally Deferred Architecture Commitments (Non-Blocking)'}
              </span>
            </h4>
            <div className="space-y-2">
              {reviews.closureReview.deferredCommitmentGroups.map((grp) => (
                <div
                  key={grp.groupTitle}
                  className="rounded-md border border-border bg-surface-secondary/40 p-2.5 text-xs space-y-1"
                >
                  <p className="font-semibold text-text-primary bidi-ltr text-start">
                    {grp.groupTitle}
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-text-secondary">
                    {grp.items.map((it) => (
                      <li key={it}>• {it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
