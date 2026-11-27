'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  HelpCircle,
  Info,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  XCircle,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';
import {
  DEFAULT_EDUCATIONAL_CONTROLS,
  DEFAULT_PLATFORM_PREREQUISITES,
  simulateModuleActivation,
  type CicConditionOverrides,
  type CicReadinessStatus,
  type ConditionEvalState,
  type DependencySimulationCatalog,
  type EducationalConditionControls,
  type FldEvaluationStatus,
  type PlatformPrerequisiteState,
} from '@/content/simulators/moduleActivationSimulator';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { cn } from '@/lib/utils';

interface ModuleActivationSimulatorViewProps {
  readonly matrix: DependencySimulationCatalog;
}

const MODULE_META: readonly {
  readonly id: CoreModuleId;
  readonly code: string;
  readonly ar: string;
  readonly en: string;
}[] = [
  { id: 'finance', code: 'MOD-FIN', ar: 'المالية والمحاسبة', en: 'Finance & Accounting' },
  { id: 'inventory-warehouse', code: 'MOD-INV', ar: 'المخزون والمستودعات', en: 'Inventory & Warehouse' },
  { id: 'procurement', code: 'MOD-PROC', ar: 'المشتريات', en: 'Procurement' },
  { id: 'sales-order-management', code: 'MOD-SALES', ar: 'المبيعات وإدارة الطلبات', en: 'Sales & Order Management' },
];

const PLATFORM_TOGGLES: readonly {
  readonly key: keyof PlatformPrerequisiteState;
  readonly ar: string;
  readonly en: string;
  readonly affects: string;
}[] = [
  {
    key: 'mandatoryPlatformCore',
    ar: 'النواة الإلزامية للمنصة (Tenant / Company / Auth / Audit / Config / Integration / Localization)',
    en: 'Mandatory Platform Core (Tenant / Company / Auth / Audit / Config / Integration / Localization)',
    affects: 'Required: All 4 Modules · Platform Integration Framework for all 6 CICs',
  },
  {
    key: 'sharedPartyIdentity',
    ar: 'هوية الأطراف المشتركة (Shared Party Identity)',
    en: 'Shared Party Identity (Supplier / Customer)',
    affects: 'Required: Procurement & Sales · Conditional: Finance & Inventory',
  },
  {
    key: 'sharedProductAndUom',
    ar: 'هوية المنتج والخدمة ووحدات القياس (Shared Product / Service + UOM)',
    en: 'Shared Product / Service Identity + UOM Foundation',
    affects: 'Required: Inventory & Sales · Conditional: Procurement (Stock Purchase)',
  },
  {
    key: 'inventoryStorageContext',
    ar: 'سياق التخزين والمستودعات (Inventory Storage / Fulfillment Context)',
    en: 'Inventory Storage / Fulfillment Context',
    affects: 'Required: Inventory · Conditional: Procurement & Sales FLDs/CICs',
  },
  {
    key: 'fiscalCalendar',
    ar: 'التقويم المالي والفترات المحاسبية (Fiscal Calendar / Accounting Period)',
    en: 'Fiscal Calendar / Accounting Period',
    affects: 'Required: Finance',
  },
  {
    key: 'currencyFoundation',
    ar: 'أساس العملات (Currency Foundation)',
    en: 'Currency Foundation',
    affects: 'Required: Finance, Procurement, Sales · Conditional: Inventory',
  },
];

interface SimulatorPreset {
  readonly id: string;
  readonly label: { readonly ar: string; readonly en: string };
  readonly modules: Readonly<Record<CoreModuleId, boolean>>;
  readonly platform: PlatformPrerequisiteState;
  readonly controls: EducationalConditionControls;
}

const PRESETS: readonly SimulatorPreset[] = [
  {
    id: 'sales-standalone',
    label: { ar: 'مبيعات منفردة (خدمات · 0 HBMD)', en: 'Standalone Sales (Services · 0 HBMD)' },
    modules: {
      finance: false,
      'inventory-warehouse': false,
      procurement: false,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: DEFAULT_EDUCATIONAL_CONTROLS,
  },
  {
    id: 'active-unknown',
    label: {
      ar: 'الكل مفعّل · شروط غير محددة (الافتراضي)',
      en: 'All 4 Active · Unspecified Conditions',
    },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: DEFAULT_EDUCATIONAL_CONTROLS,
  },
  {
    id: 'active-contract-disabled',
    label: {
      ar: 'الكل مفعّل · العقود معطّلة (CIC Disabled)',
      en: 'All 4 Active · Contracts Disabled',
    },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'unsatisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: true,
    },
  },
  {
    id: 'active-precondition-unmet',
    label: {
      ar: 'الكل مفعّل · شرط خاص غير مستوفٍ',
      en: 'All 4 Active · Contract Precondition Unmet',
    },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'unsatisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: true,
    },
  },
  {
    id: 'conceptual-scope-satisfied',
    label: {
      ar: 'استيفاء النطاق المفاهيمي (مع إقرار المؤجل)',
      en: 'Conceptual Scope Satisfied (Deferred Acknowledged)',
    },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  },
];

const TRI_STATE_OPTIONS: readonly {
  readonly value: ConditionEvalState;
  readonly ar: string;
  readonly en: string;
}[] = [
  { value: 'satisfied', ar: 'مستوفٍ', en: 'Satisfied' },
  { value: 'unsatisfied', ar: 'غير مستوفٍ', en: 'Unsatisfied' },
  { value: 'unknown', ar: 'غير محدد', en: 'Unknown' },
];

function getConditionStateLabel(state: ConditionEvalState, isAr: boolean): string {
  switch (state) {
    case 'satisfied':
      return isAr ? 'مستوفٍ / مفعّل' : 'Satisfied / Enabled';
    case 'unsatisfied':
      return isAr ? 'غير مستوفٍ / معطّل' : 'Unsatisfied / Disabled';
    case 'unknown':
      return isAr ? 'غير محدد (Unknown)' : 'Unknown / Unspecified';
  }
}

function getConditionToneClass(state: ConditionEvalState): string {
  switch (state) {
    case 'satisfied':
      return 'border-primary/40 bg-primary-subtle/50 text-primary';
    case 'unsatisfied':
      return 'border-danger-border bg-danger-bg/60 text-danger';
    case 'unknown':
      return 'border-warning-border bg-warning-bg/60 text-warning';
  }
}

function getCicBadgeClass(status: CicReadinessStatus): string {
  switch (status) {
    case 'participating-modules-unavailable':
      return 'border-border bg-surface text-text-muted';
    case 'contract-or-scenario-not-enabled':
      return 'border-danger-border bg-danger-bg text-danger';
    case 'contract-prerequisites-not-satisfied':
      return 'border-danger-border bg-danger-bg text-danger';
    case 'readiness-not-established-insufficient-info':
      return 'border-warning-border bg-warning-bg text-warning';
    case 'evaluated-conceptual-prerequisites-satisfied':
      return 'border-primary/40 bg-primary-subtle text-primary';
  }
}

function getCicCardBorderClass(status: CicReadinessStatus): string {
  switch (status) {
    case 'participating-modules-unavailable':
      return 'border-border bg-surface-secondary/35';
    case 'contract-or-scenario-not-enabled':
    case 'contract-prerequisites-not-satisfied':
      return 'border-danger-border/70 bg-danger-bg/20';
    case 'readiness-not-established-insufficient-info':
      return 'border-warning-border/80 bg-warning-bg/20';
    case 'evaluated-conceptual-prerequisites-satisfied':
      return 'border-primary/40 bg-primary-subtle/20';
  }
}

function getFldBadgeClass(status: FldEvaluationStatus): string {
  switch (status) {
    case 'source-module-inactive':
      return 'border-border bg-surface text-text-muted';
    case 'required-modules-unavailable':
    case 'dependency-prerequisites-not-satisfied':
    case 'feature-not-configured-or-disabled':
      return 'border-danger-border bg-danger-bg text-danger';
    case 'readiness-not-established-insufficient-info':
      return 'border-warning-border bg-warning-bg text-warning';
    case 'evaluated-prerequisites-satisfied-functional-unspecified':
      return 'border-primary/40 bg-primary-subtle text-primary';
  }
}

function getFldCardBorderClass(status: FldEvaluationStatus): string {
  switch (status) {
    case 'source-module-inactive':
      return 'border-border bg-surface-secondary/35';
    case 'required-modules-unavailable':
    case 'dependency-prerequisites-not-satisfied':
    case 'feature-not-configured-or-disabled':
      return 'border-danger-border/70 bg-danger-bg/20';
    case 'readiness-not-established-insufficient-info':
      return 'border-warning-border/80 bg-warning-bg/20';
    case 'evaluated-prerequisites-satisfied-functional-unspecified':
      return 'border-primary/40 bg-primary-subtle/20';
  }
}

function TriStateControl({
  label,
  value,
  onChange,
  isAr,
  compact = false,
}: {
  readonly label: string;
  readonly value: ConditionEvalState;
  readonly onChange: (next: ConditionEvalState) => void;
  readonly isAr: boolean;
  readonly compact?: boolean;
}) {
  return (
    <div className={cn('space-y-1', compact ? 'text-[11px]' : 'text-xs')}>
      <span className="block font-medium text-text-primary">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="inline-flex flex-wrap gap-1 rounded-md border border-border bg-surface-secondary/50 p-1"
      >
        {TRI_STATE_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded px-2 py-0.5 font-medium transition-colors',
                compact ? 'text-[10px]' : 'text-[11px]',
                active
                  ? opt.value === 'satisfied'
                    ? 'bg-primary text-primary-foreground'
                    : opt.value === 'unsatisfied'
                      ? 'bg-danger text-white'
                      : 'bg-warning text-white'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              {isAr ? opt.ar : opt.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ModuleActivationSimulatorView({
  matrix,
}: ModuleActivationSimulatorViewProps) {
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  const [selectedModules, setSelectedModules] = useState<
    Record<CoreModuleId, boolean>
  >({
    finance: true,
    'inventory-warehouse': true,
    procurement: false,
    'sales-order-management': true,
  });

  const [platform, setPlatform] = useState<PlatformPrerequisiteState>(
    DEFAULT_PLATFORM_PREREQUISITES
  );

  const [controls, setControls] = useState<EducationalConditionControls>(
    DEFAULT_EDUCATIONAL_CONTROLS
  );

  const result = useMemo(
    () =>
      simulateModuleActivation({
        catalog: matrix,
        selectedModules,
        platform,
        controls,
      }),
    [matrix, selectedModules, platform, controls]
  );

  const toggleModule = (id: CoreModuleId) => {
    setSelectedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlatform = (key: keyof PlatformPrerequisiteState) => {
    setPlatform((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateGlobalControl = <
    K extends keyof Pick<
      EducationalConditionControls,
      | 'defaultCicContractEnabled'
      | 'defaultCicScenarioEnabled'
      | 'defaultCicSpecificPreconditions'
      | 'defaultFldConfigured'
    >,
  >(
    key: K,
    value: ConditionEvalState
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  const updateCicOverride = (
    contractId: string,
    field: keyof CicConditionOverrides,
    value: ConditionEvalState
  ) => {
    setControls((prev) => ({
      ...prev,
      cicOverrides: {
        ...prev.cicOverrides,
        [contractId]: {
          ...prev.cicOverrides?.[contractId],
          [field]: value,
        },
      },
    }));
  };

  const clearCicOverride = (contractId: string) => {
    setControls((prev) => {
      if (!prev.cicOverrides?.[contractId]) return prev;
      const next = { ...prev.cicOverrides };
      delete next[contractId];
      return { ...prev, cicOverrides: next };
    });
  };

  const updateFldOverride = (fldId: string, value: ConditionEvalState) => {
    setControls((prev) => ({
      ...prev,
      fldOverrides: {
        ...prev.fldOverrides,
        [fldId]: value,
      },
    }));
  };

  const clearFldOverride = (fldId: string) => {
    setControls((prev) => {
      if (!prev.fldOverrides?.[fldId]) return prev;
      const next = { ...prev.fldOverrides };
      delete next[fldId];
      return { ...prev, fldOverrides: next };
    });
  };

  const resetAll = () => {
    setSelectedModules({
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    });
    setPlatform(DEFAULT_PLATFORM_PREREQUISITES);
    setControls(DEFAULT_EDUCATIONAL_CONTROLS);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'محاكي تفعيل الأنظمة والاعتماديات التفاعلي (مرتبط بسجل المرحلة 2 الرسمي)'
            : 'Interactive Module Activation & Dependency Simulator (Source-Backed Phase 2 Rules)'
        }
        subtitle={
          isAr
            ? 'يستهلك سجلات MODULE_DEPENDENCY_MATRIX.md وMODULE_LIFECYCLE_RULES.md المعتمدة مباشرةً — ويفصل صراحةً بين التفعيل الأساسي للوحدات (0 HBMD)، وشروط جاهزية عقود CIC (§6)، وأبعاد اعتماديات الميزات FLD (§5).'
            : 'Driven directly by validated records from MODULE_DEPENDENCY_MATRIX.md and MODULE_LIFECYCLE_RULES.md — strictly separating standalone base module activation (0 HBMD), CIC runtime readiness (§6), and 4-dimensional FLD feature prerequisites (§5).'
        }
        actions={
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden={true} />
            <span>
              {isAr
                ? 'إعادة الضبط (الوضع المحافظ الافتراضي)'
                : 'Reset (Conservative Defaults)'}
            </span>
          </button>
        }
      />

      {/* Mandatory Educational Disclaimer */}
      <InformationCallout
        className="border-class-illustrative-border bg-class-illustrative-bg/60"
        title={
          isAr
            ? 'إخلاء مسؤولية تعليمي إلزامي — محاكاة حدود معمارية فقط (ليست جاهزية تشغيلية)'
            : 'Mandatory Educational Simulation Disclaimer — Conceptual Boundaries Only'
        }
      >
        <div className="space-y-1">
          <p className="font-medium text-text-primary">
            {resolveLocalizedText(result.disclaimer, locale)}
          </p>
          <p className="text-[11px] text-text-secondary">
            {isAr
              ? `السجل المصدر المُتحقق منه: ${result.catalogValidation.cicCount} عقود CIC رسمية · ${result.catalogValidation.fldCount} سجلات FLD (بمراجع داخلية) · ${result.catalogValidation.pcdRowCount} صفًا في مصفوفة PCD · ${result.catalogValidation.hbmdEdgeCount} حواف HBMD.`
              : `Validated authoritative catalog: ${result.catalogValidation.cicCount} Official Core CICs · ${result.catalogValidation.fldCount} Core FLDs (KH internal refs) · ${result.catalogValidation.pcdRowCount} PCD matrix rows · ${result.catalogValidation.hbmdEdgeCount} Core HBMD edges.`}
          </p>
          <p className="font-mono text-[10px] text-text-muted bidi-ltr">
            Pinned Matrix Rev: {result.catalogValidation.sourceRevision.slice(0, 12)} · Body SHA-256:{' '}
            {result.catalogValidation.sourceBodySha256.slice(0, 12)} · Status:{' '}
            {result.catalogValidation.mappingFreshnessStatus}
          </p>
        </div>
      </InformationCallout>

      {/* Preset Scenario Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
          <Play className="h-3.5 w-3.5 text-primary" aria-hidden={true} />
          <span>{isAr ? 'سيناريوهات تعليمية سريعة:' : 'Educational Presets:'}</span>
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setSelectedModules({ ...preset.modules });
              setPlatform({ ...preset.platform });
              setControls({ ...preset.controls });
            }}
            className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
          >
            {resolveLocalizedText(preset.label, locale)}
          </button>
        ))}
      </div>

      {/* Controls Grid: Step 1 (Modules) + Step 2 (PCDs) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Step 1: Core Module Toggles */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-5">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <Layers className="h-4 w-4 text-primary" aria-hidden={true} />
            <span>
              {isAr
                ? '1. اختيار الأنظمة الأساسية الأربعة (Base Activation)'
                : '1. Select Core Business Modules (Base Activation)'}
            </span>
          </h3>
          <div className="space-y-2">
            {MODULE_META.map((mod) => {
              const checked = selectedModules[mod.id];
              const outcome = result.moduleOutcomes.find(
                (o) => o.moduleId === mod.id
              );
              return (
                <label
                  key={mod.id}
                  className={cn(
                    'flex cursor-pointer items-start justify-between gap-3 rounded-md border p-3 transition-colors',
                    checked
                      ? outcome?.status === 'blocked-by-required-pcd'
                        ? 'border-danger-border bg-danger-bg/40'
                        : 'border-primary/40 bg-primary-subtle/30'
                      : 'border-border bg-surface-secondary/30 hover:bg-surface-hover'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModule(mod.id)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-text-primary">
                          {isAr ? mod.ar : mod.en}
                        </span>
                        {outcome?.status ===
                        'base-activatable-within-evaluated-scope' ? (
                          <span className="rounded-sm border border-primary/30 bg-primary-subtle px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            {isAr
                              ? 'قابل للتفعيل الأساسي (ضمن النطاق المُقيَّم)'
                              : 'Base-Activatable (Evaluated Scope)'}
                          </span>
                        ) : outcome?.status === 'blocked-by-required-pcd' ? (
                          <span className="rounded-sm border border-danger-border bg-danger-bg px-1.5 py-0.5 text-[10px] font-medium text-danger">
                            {isAr ? 'محجوب بـ PCD Required' : 'Blocked by Required PCD'}
                          </span>
                        ) : null}
                      </div>
                      <span className="block text-[11px] leading-snug text-text-secondary">
                        {outcome
                          ? resolveLocalizedText(outcome.explanation, locale)
                          : ''}
                      </span>
                    </div>
                  </div>
                  <span
                    title={
                      isAr
                        ? 'معرّف عرض داخلي لمركز المعرفة (ليس معرّف ERP رسميًا)'
                        : 'Knowledge Hub internal display code (not an official ERP identifier)'
                    }
                    className="shrink-0 rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-muted bidi-ltr"
                  >
                    {mod.code} · {isAr ? 'داخلي' : 'KH'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 2: Platform PCD Prerequisite Toggles */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <Sliders className="h-4 w-4 text-primary" aria-hidden={true} />
              <span>
                {isAr
                  ? '2. قدرات المنصة المطلوبة والشرطية (PCD — مصفوفة §7.2)'
                  : '2. Required & Conditional Platform Capabilities (PCD Matrix §7.2)'}
              </span>
            </h3>
            <Link
              href="/knowledge/module-dependency-matrix"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <BookOpen className="h-3 w-3" aria-hidden={true} />
              <span className="bidi-ltr">MODULE_DEPENDENCY_MATRIX.md §7.2</span>
            </Link>
          </div>
          <p className="text-xs text-text-secondary">
            {isAr
              ? 'يُحسب منع التفعيل الأساسي مباشرةً من خلايا R في مصفوفة PCD الرسمية؛ تعطيل أي قدرة مطلوبة يمنع الوحدة المعنية بينما يبقى HBMD = 0.'
              : 'Base activation gating is computed directly from Required (R) cells in the official PCD Matrix; disabling a Required PCD blocks only the affected module(s) while Core HBMD remains 0.'}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PLATFORM_TOGGLES.map((item) => {
              const checked = platform[item.key];
              return (
                <label
                  key={item.key}
                  className={cn(
                    'flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 text-xs transition-colors',
                    checked
                      ? 'border-border bg-surface-secondary/40'
                      : 'border-warning-border bg-warning-bg/40'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlatform(item.key)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="block font-medium text-text-primary leading-snug">
                      {isAr ? item.ar : item.en}
                    </span>
                    <span className="block font-mono text-[10px] text-text-muted bidi-ltr">
                      {item.affects}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 3: CIC & FLD Educational Condition Controls (FIX-01-R03 & FIX-01-R04) */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <ShieldAlert className="h-4 w-4 text-primary" aria-hidden={true} />
              <span>
                {isAr
                  ? '3. شروط جاهزية عقود التكامل (CIC §6) وتهيئة الميزات (FLD §5) — ضوابط تعليمية'
                  : '3. CIC Contract/Scenario/Precondition & FLD Configuration Controls (§5–§6)'}
              </span>
            </h3>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'مجرد تفعيل الوحدتين المشاركتين لا يعني جاهزية العقد أو توفر الميزة. غيّر هذه الضوابط لرؤية الفارق الصارم بين المتطلب المعماري للوحدات وحالة الجاهزية الفعلية.'
                : 'Active participating modules alone never establish CIC readiness or full FLD availability. Adjust these controls to inspect each distinct architectural readiness state.'}
            </p>
          </div>
          <Link
            href="/knowledge/module-lifecycle-rules"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            <BookOpen className="h-3 w-3" aria-hidden={true} />
            <span className="bidi-ltr">MODULE_LIFECYCLE_RULES.md §5–§6</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TriStateControl
            label={
              isAr
                ? 'تفعيل عقد التكامل (CIC Enabled)'
                : 'CIC Contract Enabled'
            }
            value={controls.defaultCicContractEnabled}
            onChange={(val) =>
              updateGlobalControl('defaultCicContractEnabled', val)
            }
            isAr={isAr}
          />
          <TriStateControl
            label={
              isAr
                ? 'تفعيل السيناريو/الميزة المشتركة (Activation Condition)'
                : 'Shared Scenario / Activation Condition'
            }
            value={controls.defaultCicScenarioEnabled}
            onChange={(val) =>
              updateGlobalControl('defaultCicScenarioEnabled', val)
            }
            isAr={isAr}
          />
          <TriStateControl
            label={
              isAr
                ? 'استيفاء المتطلبات الخاصة بالعقد (Required Preconditions)'
                : 'Contract-Specific Preconditions'
            }
            value={controls.defaultCicSpecificPreconditions}
            onChange={(val) =>
              updateGlobalControl('defaultCicSpecificPreconditions', val)
            }
            isAr={isAr}
          />
          <TriStateControl
            label={
              isAr
                ? 'تهيئة/تفعيل الميزة (FLD Feature Configured)'
                : 'FLD Feature Configured / Enabled'
            }
            value={controls.defaultFldConfigured}
            onChange={(val) =>
              updateGlobalControl('defaultFldConfigured', val)
            }
            isAr={isAr}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-warning-border/70 bg-warning-bg/30 p-3 text-xs">
          <input
            type="checkbox"
            checked={controls.treatDeferredBoundariesAsUnresolved}
            onChange={(e) =>
              setControls((prev) => ({
                ...prev,
                treatDeferredBoundariesAsUnresolved: e.target.checked,
              }))
            }
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
          />
          <div className="space-y-0.5">
            <span className="block font-semibold text-text-primary">
              {isAr
                ? 'اعتبار الحدود المؤجلة ومالك العقد غير المحسوم (Phase 5/6) مانعًا لإثبات الجاهزية الكاملة (موصى به)'
                : 'Treat deferred Phase 5/6 boundaries & TBD Contract Owners as unresolved readiness blockers (Recommended)'}
            </span>
            <span className="block text-[11px] text-text-secondary">
              {isAr
                ? 'عند إلغاء التحديد، ينتقل التقييم فقط إلى "المتطلبات المفاهيمية المُقيَّمة مستوفاة (نطاق تعليمي)" مع بقاء الجاهزية التشغيلية والسلوك الوظيفي الكامل غير مُثبتين.'
                : 'When unchecked, satisfied inputs transition only to "Evaluated Conceptual Prerequisites Satisfied (Scope-Limited)" — never claiming full runtime readiness or implemented functional behavior.'}
            </span>
          </div>
        </label>
      </div>

      {/* Base Activation Scope Boundary (FIX-01-R02) */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <Info className="h-4 w-4 text-primary" aria-hidden={true} />
            <span>
              {isAr
                ? 'حدود نطاق التقييم لشروط التفعيل الأساسي (MODULE_LIFECYCLE_RULES.md §4)'
                : 'Base Activation Evaluation Scope Boundary (MODULE_LIFECYCLE_RULES.md §4)'}
            </span>
          </h3>
          <Link
            href="/knowledge/module-lifecycle-rules"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            <span className="bidi-ltr">MODULE_LIFECYCLE_RULES.md §4</span>
            <ExternalLink className="h-3 w-3" aria-hidden={true} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-md border border-border bg-surface-secondary/35 p-3 space-y-1.5">
            <p className="text-[11px] font-semibold text-primary">
              {isAr
                ? 'شروط يُقيّمها هذا المحاكي التعليمي'
                : 'Conditions Evaluated in This Educational Simulator'}
            </p>
            <ul className="space-y-1 text-[11px] text-text-secondary">
              {result.activationScopeBoundary.evaluatedConditions.map((item) => (
                <li key={item.en} className="flex items-start gap-1.5 leading-snug">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                    aria-hidden={true}
                  />
                  <span>{resolveLocalizedText(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-warning-border/60 bg-warning-bg/20 p-3 space-y-1.5">
            <p className="text-[11px] font-semibold text-warning">
              {isAr
                ? 'شروط تفعيل رسمية تبقى خارج نطاق هذا المحاكي'
                : 'Official Activation Conditions Outside Simulator Scope'}
            </p>
            <ul className="space-y-1 text-[11px] text-text-secondary">
              {result.activationScopeBoundary.outOfScopeConditions.map((item) => (
                <li key={item.en} className="flex items-start gap-1.5 leading-snug">
                  <HelpCircle
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning"
                    aria-hidden={true}
                  />
                  <span>{resolveLocalizedText(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Live Output Metrics — Zero Misleading Ready/Available Counters (FIX-01-R05) */}
      <div
        aria-live="polite"
        className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-surface p-3.5 space-y-1">
          <p className="text-xs text-text-muted">
            {isAr
              ? 'قابلة للتفعيل الأساسي (ضمن الشروط المُقيَّمة)'
              : 'Base-Activatable (Evaluated Scope)'}
          </p>
          <p className="font-mono text-xl font-bold text-primary bidi-ltr">
            {result.activatableModulesCount} / {result.selectedCount}
          </p>
          <p className="text-[11px] text-text-secondary">
            {isAr ? 'تقييم PCD + 0 HBMD فقط' : 'PCD + 0-HBMD scope only'}
          </p>
        </div>

        <div className="bg-surface p-3.5 space-y-1">
          <p className="text-xs text-text-muted">
            {isAr ? 'عوائق HBMD بين الأنظمة' : 'Cross-Module HBMD Blockers'}
          </p>
          <p className="font-mono text-xl font-bold text-success bidi-ltr">
            {result.hbmdEdgeCount}
          </p>
          <p className="text-[11px] text-text-secondary">
            {isAr
              ? 'CIC وFLD لا تصبح HBMD أبدًا'
              : 'CIC & FLD never become implicit HBMDs'}
          </p>
        </div>

        <div className="bg-surface p-3.5 space-y-1">
          <p className="text-xs text-text-muted">
            {isAr
              ? 'عقود CIC: المتطلب المعماري للوحدات مستوفٍ'
              : 'Core CICs: Module Prereqs Satisfied'}
          </p>
          <p className="font-mono text-xl font-bold text-text-primary bidi-ltr">
            {result.cicSummary.architecturalModulePrereqsSatisfied} /{' '}
            {result.cicSummary.total}
          </p>
          <p className="text-[11px] text-text-secondary">
            {isAr
              ? `مفاهيمي مُقيَّم: ${result.cicSummary.evaluatedConceptualPrereqsSatisfied} · غير مُثبت: ${result.cicSummary.readinessNotEstablished} · معطّل/ناقص: ${result.cicSummary.contractOrScenarioNotEnabled + result.cicSummary.contractPrereqsNotSatisfied}`
              : `Conceptual met: ${result.cicSummary.evaluatedConceptualPrereqsSatisfied} · Unresolved: ${result.cicSummary.readinessNotEstablished} · Disabled/Unmet: ${result.cicSummary.contractOrScenarioNotEnabled + result.cicSummary.contractPrereqsNotSatisfied}`}
          </p>
        </div>

        <div className="bg-surface p-3.5 space-y-1">
          <p className="text-xs text-text-muted">
            {isAr
              ? 'اعتماديات FLD: الأنظمة المطلوبة مفعّلة'
              : 'Core FLDs: Required Modules Active'}
          </p>
          <p className="font-mono text-xl font-bold text-text-primary bidi-ltr">
            {
              result.fldOutcomes.filter((f) => f.requiredModulesAvailable)
                .length
            }{' '}
            / {result.fldSummary.total}
          </p>
          <p className="text-[11px] text-text-secondary">
            {isAr
              ? `متطلبات مُقيَّمة مستوفاة (سلوك غير محدد): ${result.fldSummary.evaluatedPrereqsSatisfiedFunctionalUnspecified} · غير مُثبت: ${result.fldSummary.readinessNotEstablished}`
              : `Prereqs met (functional unspecified): ${result.fldSummary.evaluatedPrereqsSatisfiedFunctionalUnspecified} · Unresolved: ${result.fldSummary.readinessNotEstablished}`}
          </p>
        </div>
      </div>

      {/* Live Architectural Takeaways */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden={true} />
          <span>
            {isAr
              ? 'التفسير المعماري لهذا التكوين'
              : 'Architectural Analysis for Current Combination'}
          </span>
        </h3>
        <ul className="space-y-1.5 text-xs text-text-secondary">
          {result.architecturalTakeaways.map((tk) => (
            <li key={tk.en} className="flex items-start gap-2 leading-relaxed">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                aria-hidden={true}
              />
              <span className="text-text-primary">
                {resolveLocalizedText(tk, locale)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed 6 Core CICs and 5 Core FLDs */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Core CICs Column */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="space-y-0.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <GitBranch className="h-4 w-4 text-primary" aria-hidden={true} />
              <span>
                {isAr
                  ? `تقييم عقود التكامل المشروط الـ ${result.cicSummary.total} (CIC Runtime Readiness — §6)`
                  : `All ${result.cicSummary.total} Core CICs Evaluation (CIC Runtime Readiness — §6)`}
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              {isAr
                ? 'يفصل كل عقد صراحةً بين استيفاء الوحدتين المشاركتين وبين حالة الجاهزية التشغيلية والشروط المؤجلة.'
                : 'Each contract explicitly separates participating-module satisfaction from contract/scenario enablement, specific preconditions, and deferred governance.'}
            </p>
          </div>

          <div className="space-y-3">
            {result.cicOutcomes.map((cic) => {
              const hasOverride = Boolean(controls.cicOverrides?.[cic.contractId]);
              return (
                <article
                  key={cic.contractId}
                  className={cn(
                    'rounded-md border p-3.5 text-xs space-y-2.5',
                    getCicCardBorderClass(cic.readinessStatus)
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono font-semibold text-text-primary bidi-ltr">
                          {cic.contractId}
                        </span>
                        <span className="rounded-sm border border-success-border bg-success-bg px-1.5 py-0.5 text-[9px] font-medium text-success">
                          {isAr ? 'معرّف ERP رسمي' : 'Official ERP ID'}
                        </span>
                      </div>
                      <p className="font-medium text-text-primary">
                        {resolveLocalizedText(cic.scenario, locale)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold',
                        getCicBadgeClass(cic.readinessStatus)
                      )}
                    >
                      {cic.readinessStatus ===
                      'evaluated-conceptual-prerequisites-satisfied' ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden={true} />
                      ) : cic.readinessStatus ===
                        'readiness-not-established-insufficient-info' ? (
                        <HelpCircle className="h-3 w-3 shrink-0" aria-hidden={true} />
                      ) : (
                        <XCircle className="h-3 w-3 shrink-0" aria-hidden={true} />
                      )}
                      <span>{resolveLocalizedText(cic.statusLabel, locale)}</span>
                    </span>
                  </div>

                  {/* Multi-dimension status grid */}
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-[11px]">
                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr ? 'المتطلب المعماري للوحدات' : 'Module Prerequisites'}
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          cic.participatingModulesAvailable
                            ? 'text-primary'
                            : 'text-text-muted'
                        )}
                      >
                        {cic.participatingModulesAvailable
                          ? isAr
                            ? 'مستوفٍ (الطرفان Active ضمن النطاق)'
                            : 'Satisfied (Both Modules Active)'
                          : isAr
                            ? 'غير متاح (طرف واحد أو كلاهما غير مفعّل)'
                            : 'Unavailable (One or Both Inactive)'}
                      </span>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr ? 'العقد / السيناريو' : 'Contract / Scenario'}
                      </span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span
                          className={cn(
                            'rounded border px-1.5 py-0.5 text-[10px] font-medium',
                            getConditionToneClass(cic.contractEnabledState)
                          )}
                        >
                          {isAr ? 'CIC: ' : 'CIC: '}
                          {getConditionStateLabel(cic.contractEnabledState, isAr)}
                        </span>
                        <span
                          className={cn(
                            'rounded border px-1.5 py-0.5 text-[10px] font-medium',
                            getConditionToneClass(cic.scenarioEnabledState)
                          )}
                        >
                          {isAr ? 'السيناريو: ' : 'Scenario: '}
                          {getConditionStateLabel(cic.scenarioEnabledState, isAr)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr ? 'المتطلب الخاص بالعقد' : 'Contract-Specific Precondition'}
                      </span>
                      <span
                        className={cn(
                          'inline-block mt-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium',
                          getConditionToneClass(cic.specificPreconditionsState)
                        )}
                      >
                        {getConditionStateLabel(
                          cic.specificPreconditionsState,
                          isAr
                        )}
                      </span>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr
                          ? 'الجاهزية التشغيلية والتقنية الكاملة (Phase 5/6)'
                          : 'Full Runtime Readiness (Phase 5/6)'}
                      </span>
                      <span className="font-medium text-warning">
                        {isAr
                          ? 'غير مُثبتة في المرحلة 2'
                          : 'Not Established in Phase 2'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    {resolveLocalizedText(cic.reason, locale)}
                  </p>

                  {/* Official Verbatim Preconditions & Activation Condition */}
                  <div className="rounded border border-border/70 bg-surface/70 p-2.5 space-y-1 text-[11px]">
                    <p className="text-text-secondary">
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'المتطلبات الرسمية (Required Preconditions): ' : 'Official Required Preconditions: '}
                      </span>
                      <span>{cic.sourceRef.requiredPreconditionsVerbatim}</span>
                    </p>
                    <p className="text-text-secondary">
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'شرط التفعيل الرسمي (Activation Condition): ' : 'Official Activation Condition: '}
                      </span>
                      <span>{cic.sourceRef.activationConditionVerbatim}</span>
                    </p>
                    <p className="text-text-secondary">
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'مالك العقد: ' : 'Contract Owner: '}
                      </span>
                      <span className="font-mono text-[10px] bidi-ltr">
                        {cic.sourceRef.contractOwner}
                      </span>
                    </p>
                  </div>

                  {cic.deferredBoundaryNote ? (
                    <p className="flex items-start gap-1.5 text-[11px] text-warning">
                      <AlertTriangle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden={true}
                      />
                      <span>
                        {resolveLocalizedText(cic.deferredBoundaryNote, locale)}
                      </span>
                    </p>
                  ) : null}

                  {/* Per-CIC override controls */}
                  <details className="rounded border border-border/70 bg-surface/60 px-2.5 py-1.5">
                    <summary className="cursor-pointer select-none text-[11px] font-medium text-text-primary">
                      {isAr
                        ? `تخصيص شروط هذا العقد فقط${hasOverride ? ' (مُخصّص)' : ''}`
                        : `Override conditions for this CIC${hasOverride ? ' (Custom)' : ''}`}
                    </summary>
                    <div className="mt-2 space-y-2 border-t border-border/60 pt-2">
                      <TriStateControl
                        compact
                        label={isAr ? 'تفعيل العقد (CIC)' : 'CIC Contract Enabled'}
                        value={cic.contractEnabledState}
                        onChange={(v) =>
                          updateCicOverride(cic.contractId, 'contractEnabled', v)
                        }
                        isAr={isAr}
                      />
                      <TriStateControl
                        compact
                        label={isAr ? 'تفعيل السيناريو المشترك' : 'Shared Scenario Enabled'}
                        value={cic.scenarioEnabledState}
                        onChange={(v) =>
                          updateCicOverride(cic.contractId, 'scenarioEnabled', v)
                        }
                        isAr={isAr}
                      />
                      <TriStateControl
                        compact
                        label={resolveLocalizedText(
                          cic.specificPreconditionLabel,
                          locale
                        )}
                        value={cic.specificPreconditionsState}
                        onChange={(v) =>
                          updateCicOverride(
                            cic.contractId,
                            'specificPreconditions',
                            v
                          )
                        }
                        isAr={isAr}
                      />
                      {hasOverride ? (
                        <button
                          type="button"
                          onClick={() => clearCicOverride(cic.contractId)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          {isAr
                            ? 'إعادة هذا العقد إلى الضوابط العامة'
                            : 'Reset this CIC to global controls'}
                        </button>
                      ) : null}
                    </div>
                  </details>

                  {/* Source Traceability Strip (FIX-01-R05) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-2 text-[10px] text-text-muted">
                    <Link
                      href={`/knowledge/${cic.sourceRef.documentSlug}#${cic.sourceRef.sectionAnchor}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline bidi-ltr"
                    >
                      <BookOpen className="h-3 w-3" aria-hidden={true} />
                      <span>MODULE_DEPENDENCY_MATRIX.md</span>
                    </Link>
                    <Link
                      href={`/dependencies?tab=matrix&cic=${encodeURIComponent(cic.contractId)}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <span>{isAr ? 'تفاصيل العقد في المصفوفة' : 'Matrix Contract Detail'}</span>
                    </Link>
                    <Link
                      href="/knowledge/module-lifecycle-rules"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline bidi-ltr"
                    >
                      <span>{cic.sourceRef.lifecycleRuleRef}</span>
                    </Link>
                    <span className="inline-flex items-center gap-1">
                      <span>{isAr ? 'الأدلة:' : 'Evidence:'}</span>
                      <span className="font-mono bidi-ltr">
                        {cic.sourceRef.evidence}
                      </span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Core FLDs Column */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="space-y-0.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <ShieldAlert className="h-4 w-4 text-primary" aria-hidden={true} />
              <span>
                {isAr
                  ? `تقييم اعتماديات مستوى الميزة الـ ${result.fldSummary.total} (FLD 4-Dimensional Check — §5)`
                  : `All ${result.fldSummary.total} Core FLDs Evaluation (4-Dimensional Check — §5)`}
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              {isAr
                ? 'يفصل كل سجل FLD بين توفر الأنظمة المطلوبة، ومتطلبات الاعتمادية (PCD الشرطية + CIC المرتبط)، وتهيئة الميزة، وحقيقة أن السلوك الوظيفي الكامل غير محدد قبل المرحلة 6.'
                : 'Each FLD explicitly separates required modules, dependency prerequisites (conditional PCD + linked CIC), feature configuration, and the fact that full functional behavior is unspecified until Phase 6.'}
            </p>
          </div>

          <div className="space-y-3">
            {result.fldOutcomes.map((fld) => {
              const hasOverride = Boolean(controls.fldOverrides?.[fld.id]);
              return (
                <article
                  key={fld.id}
                  className={cn(
                    'rounded-md border p-3.5 text-xs space-y-2.5',
                    getFldCardBorderClass(fld.status)
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          title={
                            isAr
                              ? 'مرجع صف داخلي لمركز المعرفة (القسم 6 لا يعرّف رموز FLD رسمية)'
                              : 'Knowledge Hub internal reference ID (Matrix §6 defines no official FLD IDs)'
                          }
                          className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-muted bidi-ltr"
                        >
                          <span>{fld.id}</span>
                          <span className="text-[9px] font-normal">
                            · {isAr ? 'معرّف داخلي' : 'KH Ref'}
                          </span>
                        </span>
                        {fld.isOwnerDeferred ? (
                          <span className="rounded-sm border border-warning-border bg-warning-bg px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                            {isAr
                              ? 'مالك الميزة: مؤجل (Feature Owner: Deferred)'
                              : 'Feature Owner: Deferred'}
                          </span>
                        ) : (
                          <span className="rounded-sm border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-secondary bidi-ltr">
                            Owner: {fld.sourceRef.featureOwner}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-text-primary">
                        {resolveLocalizedText(fld.featureLabel, locale)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold',
                        getFldBadgeClass(fld.status)
                      )}
                    >
                      {fld.status ===
                      'evaluated-prerequisites-satisfied-functional-unspecified' ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden={true} />
                      ) : fld.status ===
                        'readiness-not-established-insufficient-info' ? (
                        <HelpCircle className="h-3 w-3 shrink-0" aria-hidden={true} />
                      ) : (
                        <XCircle className="h-3 w-3 shrink-0" aria-hidden={true} />
                      )}
                      <span>{resolveLocalizedText(fld.statusLabel, locale)}</span>
                    </span>
                  </div>

                  {/* Four Separated Dimensions (FIX-01-R04) */}
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-[11px]">
                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr ? '1. توفر الأنظمة المطلوبة' : '1. Required Modules Available'}
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          fld.requiredModulesAvailable
                            ? 'text-primary'
                            : 'text-danger'
                        )}
                      >
                        {fld.requiredModulesAvailable
                          ? isAr
                            ? 'نعم (المصدر + الأهداف المطلوبة مفعّلة)'
                            : 'Yes (Source + Required Targets Active)'
                          : isAr
                            ? 'لا (أنظمة مطلوبة غير مفعّلة)'
                            : 'No (Required Module(s) Inactive)'}
                      </span>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr
                          ? '2. متطلبات الاعتمادية (PCD الشرطية + CIC)'
                          : '2. Dependency Prerequisites (PCD + CIC)'}
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          fld.featureDependencyPrerequisitesSatisfied
                            ? 'text-primary'
                            : 'text-warning'
                        )}
                      >
                        {fld.featureDependencyPrerequisitesSatisfied
                          ? isAr
                            ? 'مستوفاة ضمن النطاق المفاهيمي المُقيَّم'
                            : 'Satisfied within Evaluated Conceptual Scope'
                          : isAr
                            ? 'غير مستوفاة أو غير مُثبتة بعد'
                            : 'Unsatisfied or Not Yet Established'}
                      </span>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr ? '3. تهيئة/تفعيل الميزة' : '3. Feature Configured / Enabled'}
                      </span>
                      <span
                        className={cn(
                          'inline-block mt-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium',
                          getConditionToneClass(fld.featureConfiguredState)
                        )}
                      >
                        {getConditionStateLabel(fld.featureConfiguredState, isAr)}
                      </span>
                    </div>

                    <div className="rounded border border-border/70 bg-surface/80 px-2 py-1.5">
                      <span className="block text-[10px] text-text-muted">
                        {isAr
                          ? '4. السلوك الوظيفي الكامل'
                          : '4. Full Functional Behavior'}
                      </span>
                      <span className="font-medium text-warning">
                        {isAr
                          ? 'غير محدد بعد (المرحلة 6 — Phase 2 لا يُنفّذ الميزة)'
                          : 'Not Yet Specified (Phase 6 Blueprint Scope)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    {resolveLocalizedText(fld.reason, locale)}
                  </p>

                  {/* Official Record Excerpt */}
                  <div className="rounded border border-border/70 bg-surface/70 p-2.5 space-y-1 text-[11px] text-text-secondary">
                    <p>
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'الهدف المعتمد (Target Capability): ' : 'Official Target Capability: '}
                      </span>
                      <span>{fld.targetModuleCapabilityVerbatim}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'عقود CIC المرتبطة: ' : 'Linked CIC(s): '}
                      </span>
                      <span className="font-mono text-[10px] bidi-ltr">
                        {fld.linkedCicIds.join(', ')}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">
                        {isAr ? 'الحالة الرسمية في المصفوفة: ' : 'Official Matrix Status: '}
                      </span>
                      <span>{fld.sourceRef.statusVerbatim}</span>
                    </p>
                  </div>

                  {fld.deferredNote ? (
                    <p className="flex items-start gap-1.5 text-[11px] text-warning">
                      <AlertTriangle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden={true}
                      />
                      <span>{resolveLocalizedText(fld.deferredNote, locale)}</span>
                    </p>
                  ) : null}

                  {/* Per-FLD override control */}
                  <details className="rounded border border-border/70 bg-surface/60 px-2.5 py-1.5">
                    <summary className="cursor-pointer select-none text-[11px] font-medium text-text-primary">
                      {isAr
                        ? `تخصيص تهيئة هذه الميزة فقط${hasOverride ? ' (مُخصّص)' : ''}`
                        : `Override configuration state for this FLD${hasOverride ? ' (Custom)' : ''}`}
                    </summary>
                    <div className="mt-2 space-y-2 border-t border-border/60 pt-2">
                      <TriStateControl
                        compact
                        label={
                          isAr
                            ? 'تهيئة/تفعيل الميزة (FLD Feature Configured)'
                            : 'Feature Configured / Enabled'
                        }
                        value={fld.featureConfiguredState}
                        onChange={(v) => updateFldOverride(fld.id, v)}
                        isAr={isAr}
                      />
                      {hasOverride ? (
                        <button
                          type="button"
                          onClick={() => clearFldOverride(fld.id)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          {isAr
                            ? 'إعادة هذه الميزة إلى الضابط العام'
                            : 'Reset this FLD to global control'}
                        </button>
                      ) : null}
                    </div>
                  </details>

                  {/* Source Traceability Strip (FIX-01-R05) */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/60 pt-2 text-[10px] text-text-muted">
                    <Link
                      href={`/knowledge/${fld.sourceRef.documentSlug}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline bidi-ltr"
                    >
                      <BookOpen className="h-3 w-3" aria-hidden={true} />
                      <span>MODULE_DEPENDENCY_MATRIX.md §6</span>
                    </Link>
                    <Link
                      href={`/dependencies?tab=matrix#${fld.sourceRef.sectionAnchor}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <span>{isAr ? 'سجل FLD في المصفوفة' : 'Matrix FLD Register'}</span>
                    </Link>
                    <Link
                      href="/knowledge/module-lifecycle-rules"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline bidi-ltr"
                    >
                      <span>{fld.sourceRef.lifecycleRuleRef}</span>
                    </Link>
                    <span className="inline-flex items-center gap-1">
                      <span>{isAr ? 'الأدلة:' : 'Evidence:'}</span>
                      <span className="font-mono bidi-ltr">
                        {fld.sourceRef.evidence}
                      </span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
