'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  GitBranch,
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
  DEFAULT_PLATFORM_PREREQUISITES,
  simulateModuleActivation,
  type PlatformPrerequisiteState,
} from '@/content/simulators/moduleActivationSimulator';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { cn } from '@/lib/utils';

const MODULE_META: readonly {
  id: CoreModuleId;
  code: string;
  ar: string;
  en: string;
}[] = [
  { id: 'finance', code: 'MOD-FIN', ar: 'المالية والمحاسبة', en: 'Finance & Accounting' },
  { id: 'inventory-warehouse', code: 'MOD-INV', ar: 'المخزون والمستودعات', en: 'Inventory & Warehouse' },
  { id: 'procurement', code: 'MOD-PROC', ar: 'المشتريات', en: 'Procurement' },
  { id: 'sales-order-management', code: 'MOD-SALES', ar: 'المبيعات وإدارة الطلبات', en: 'Sales & Order Management' },
];

const PLATFORM_TOGGLES: readonly {
  key: keyof PlatformPrerequisiteState;
  ar: string;
  en: string;
  affects: string;
}[] = [
  {
    key: 'mandatoryPlatformCore',
    ar: 'النواة الإلزامية للمنصة (Tenant / Company / Auth / Audit / Config / Integration)',
    en: 'Mandatory Platform Core (Tenant / Company / Auth / Audit / Config / Integration)',
    affects: 'All 4 Modules & all 6 CICs',
  },
  {
    key: 'sharedPartyIdentity',
    ar: 'هوية الأطراف المشتركة (Shared Supplier / Customer Party Identity)',
    en: 'Shared Party Identity (Supplier / Customer)',
    affects: 'Required: Procurement & Sales',
  },
  {
    key: 'sharedProductAndUom',
    ar: 'هوية المنتج والخدمة ووحدات القياس (Shared Product / Service + UOM)',
    en: 'Shared Product / Service Identity + UOM Foundation',
    affects: 'Required: Inventory & Sales',
  },
  {
    key: 'inventoryStorageContext',
    ar: 'سياق التخزين والمستودعات (Inventory Storage / Fulfillment Context)',
    en: 'Inventory Storage / Fulfillment Context',
    affects: 'Required: Inventory',
  },
  {
    key: 'fiscalCalendar',
    ar: 'التقويم المالي والفترات المحاسبية (Fiscal Calendar)',
    en: 'Fiscal Calendar / Accounting Period',
    affects: 'Required: Finance',
  },
  {
    key: 'currencyFoundation',
    ar: 'أساس العملات (Currency Foundation)',
    en: 'Currency Foundation',
    affects: 'Required: Finance, Procurement, Sales',
  },
];

const PRESETS: readonly {
  id: string;
  label: { ar: string; en: string };
  modules: Readonly<Record<CoreModuleId, boolean>>;
}[] = [
  {
    id: 'sales-only',
    label: { ar: 'مبيعات منفردة (خدمات)', en: 'Standalone Sales (Services)' },
    modules: {
      finance: false,
      'inventory-warehouse': false,
      procurement: false,
      'sales-order-management': true,
    },
  },
  {
    id: 'sales-inventory',
    label: { ar: 'مبيعات + مخزون', en: 'Sales + Inventory' },
    modules: {
      finance: false,
      'inventory-warehouse': true,
      procurement: false,
      'sales-order-management': true,
    },
  },
  {
    id: 'proc-inv-fin',
    label: { ar: 'شراء حتى السداد (P2P)', en: 'Procure-to-Pay (3 Modules)' },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': false,
    },
  },
  {
    id: 'all-four',
    label: { ar: 'الأنظمة الأساسية الأربعة', en: 'All 4 Core Modules' },
    modules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
  },
];

export function ModuleActivationSimulatorView() {
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

  const result = useMemo(
    () => simulateModuleActivation({ selectedModules, platform }),
    [selectedModules, platform]
  );

  const toggleModule = (id: CoreModuleId) => {
    setSelectedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlatform = (key: keyof PlatformPrerequisiteState) => {
    setPlatform((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => {
    setSelectedModules({
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    });
    setPlatform(DEFAULT_PLATFORM_PREREQUISITES);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          isAr
            ? 'محاكي تفعيل الأنظمة والاعتماديات التفاعلي (16 تركيبة ممكنة)'
            : 'Interactive Module Activation & Dependency Simulator (All 16 Combinations)'
        }
        subtitle={
          isAr
            ? 'اختبر أي تركيبة من الأنظمة الأساسية الأربعة مع جاهزية قدرات المنصة (PCD) لمشاهدة أثر غياب HBMD، وتفعيل عقود CIC، وتوفر ميزات FLD.'
            : 'Toggle any combination of the 4 Core Modules and Platform PCDs to observe 0-HBMD standalone activation, CIC readiness, and FLD feature availability.'
        }
        actions={
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAr ? 'إعادة الضبط (الكل مفعّل)' : 'Reset (All Enabled)'}</span>
          </button>
        }
      />

      {/* Mandatory Educational Disclaimer */}
      <InformationCallout
        className="border-class-illustrative-border bg-class-illustrative-bg/60"
        title={
          isAr
            ? 'إخلاء مسؤولية تعليمي إلزامي (محاكاة معمارية فقط)'
            : 'Mandatory Educational Simulation Disclaimer'
        }
      >
        <span className="font-medium text-text-primary">
          {resolveLocalizedText(result.disclaimer, locale)}
        </span>
      </InformationCallout>

      {/* Preset Scenario Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
          <Play className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>{isAr ? 'سيناريوهات سريعة:' : 'Quick Presets:'}</span>
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setSelectedModules({ ...preset.modules });
              setPlatform(DEFAULT_PLATFORM_PREREQUISITES);
            }}
            className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
          >
            {resolveLocalizedText(preset.label, locale)}
          </button>
        ))}
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Core Module Toggles */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-5">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr ? '1. اختر الأنظمة الأساسية الأربعة' : '1. Toggle Core Business Modules'}
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
                      ? outcome?.status === 'blocked-by-pcd'
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
                    <div className="space-y-0.5">
                      <span className="block text-xs font-semibold text-text-primary">
                        {isAr ? mod.ar : mod.en}
                      </span>
                      <span className="block text-[11px] leading-snug text-text-secondary">
                        {outcome
                          ? resolveLocalizedText(outcome.explanation, locale)
                          : ''}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] font-semibold text-text-muted bidi-ltr">
                    {mod.code}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Platform PCD Prerequisite Toggles */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 lg:col-span-7">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <Sliders className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? '2. جاهزية قدرات المنصة المطلوبة (PCD Prerequisites — توضيحي)'
                : '2. Required Platform Capability Readiness (PCD Toggles — Illustrative)'}
            </span>
          </h3>
          <p className="text-xs text-text-secondary">
            {isAr
              ? 'عطّل أي قدرة منصة لترى كيف يمنع نقص PCD تفعيل الوحدة المعنية بينما يبقى HBMD = 0.'
              : 'Toggle off any platform prerequisite to see Required PCD enforcement gate base activation while HBMD remains 0.'}
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

      {/* Live Output Metrics */}
      <div
        aria-live="polite"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
      >
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'الأنظمة القابلة للتفعيل (Active)' : 'Activatable Core Modules'}
          </p>
          <p className="font-mono text-xl font-bold text-primary bidi-ltr">
            {result.activatableModulesCount} / {result.selectedCount}
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'عوائق HBMD بين الأنظمة' : 'Cross-Module HBMD Blockers'}
          </p>
          <p className="font-mono text-xl font-bold text-success bidi-ltr">
            {result.hbmdEdgeCount}
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'عقود CIC الجاهزة' : 'Ready Core CICs'}
          </p>
          <p className="font-mono text-xl font-bold text-text-primary bidi-ltr">
            {result.readyCics.length} / 6
          </p>
        </div>
        <div className="bg-surface p-3.5 space-y-0.5">
          <p className="text-xs text-text-muted">
            {isAr ? 'ميزات FLD المتاحة' : 'Available Core FLDs'}
          </p>
          <p className="font-mono text-xl font-bold text-text-primary bidi-ltr">
            {result.availableFlds.length} / 5
          </p>
        </div>
      </div>

      {/* Live Architectural Takeaways */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{isAr ? 'التفسير المعماري لهذا التكوين' : 'Architectural Analysis for Current Combination'}</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-text-secondary">
          {result.architecturalTakeaways.map((tk) => (
            <li key={tk.en} className="flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
              <span className="text-text-primary">{resolveLocalizedText(tk, locale)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Ready vs Unavailable CICs and FLDs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <GitBranch className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? `حالة عقود التكامل المشروط الـ 6 (${result.readyCics.length} جاهز · ${result.inactiveCics.length} غير نشط)`
                : `Status of All 6 Core CICs (${result.readyCics.length} Ready · ${result.inactiveCics.length} Inactive)`}
            </span>
          </h3>
          <div className="space-y-2">
            {[...result.readyCics, ...result.inactiveCics].map((cic) => (
              <div
                key={cic.contractId}
                className={cn(
                  'rounded-md border p-3 text-xs space-y-1',
                  cic.ready
                    ? 'border-success-border bg-success-bg/30'
                    : 'border-border bg-surface-secondary/40'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-text-primary bidi-ltr">
                    {cic.contractId}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold',
                      cic.ready
                        ? 'border-success-border bg-success-bg text-success'
                        : 'border-border bg-surface text-text-muted'
                    )}
                  >
                    {cic.ready ? (
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>
                      {cic.ready
                        ? isAr
                          ? 'جاهز مفاهيميًا'
                          : 'Conceptually Ready'
                        : isAr
                          ? 'غير جاهز'
                          : 'Inactive'}
                    </span>
                  </span>
                </div>
                <p className="font-medium text-text-primary">
                  {resolveLocalizedText(cic.scenario, locale)}
                </p>
                <p className="text-[11px] text-text-secondary">
                  {resolveLocalizedText(cic.reason, locale)}
                </p>
                {cic.deferredBoundaryNote ? (
                  <p className="flex items-center gap-1 text-[11px] text-warning">
                    <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{resolveLocalizedText(cic.deferredBoundaryNote, locale)}</span>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>
              {isAr
                ? `حالة اعتماديات مستوى الميزة الـ 5 (${result.availableFlds.length} متاحة · ${result.unavailableFlds.length} غير متاحة)`
                : `Status of All 5 Core FLDs (${result.availableFlds.length} Available · ${result.unavailableFlds.length} Unavailable)`}
            </span>
          </h3>
          <div className="space-y-2">
            {[...result.availableFlds, ...result.unavailableFlds].map((fld) => (
              <div
                key={fld.id}
                className={cn(
                  'rounded-md border p-3 text-xs space-y-1',
                  fld.available
                    ? 'border-success-border bg-success-bg/30'
                    : 'border-border bg-surface-secondary/40'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-text-primary">
                    {resolveLocalizedText(fld.featureLabel, locale)}
                  </span>
                  <span
                    className={cn(
                      'rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold',
                      fld.available
                        ? 'border-success-border bg-success-bg text-success'
                        : 'border-warning-border bg-warning-bg text-warning'
                    )}
                  >
                    {fld.available
                      ? isAr
                        ? 'متاحة'
                        : 'Available'
                      : isAr
                        ? 'مقيّدة (FLD)'
                        : 'Unavailable (FLD)'}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">
                  {resolveLocalizedText(fld.reason, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
