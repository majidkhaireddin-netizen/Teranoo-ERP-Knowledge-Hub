'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Boxes,
  Database,
  GitFork,
  Layers,
  Play,
  Puzzle,
  RefreshCw,
  Scale,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ExtractedDependencyArchitecture } from '@/content/extractors/dependencyArchitectureExtractor';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { MetricCard } from '@/components/visualization/MetricCard';
import { SourceReference } from '@/components/documentation/SourceReference';
import { QueryParamSync } from '@/components/navigation/QueryParamSync';
import {
  DependencyMatrixExplorer,
  DependencyModelSection,
} from '@/features/dependencies/DependencyMatrixExplorer';
import { ModuleActivationSimulatorView } from '@/features/dependencies/ModuleActivationSimulatorView';
import {
  CrossModuleScenariosView,
  DataOwnershipExplorer,
} from '@/features/dependencies/DataOwnershipAndScenariosView';
import {
  FutureExtensionGovernanceView,
  ModuleLifecycleExplorer,
  Phase2ReviewsSection,
} from '@/features/dependencies/LifecycleExtensionsReviewsView';
import { cn } from '@/lib/utils';

export type DependencyCenterTabId =
  | 'matrix'
  | 'model'
  | 'simulator'
  | 'ownership'
  | 'scenarios'
  | 'lifecycle'
  | 'extensions'
  | 'reviews';

const VALID_TABS: readonly DependencyCenterTabId[] = [
  'matrix',
  'model',
  'simulator',
  'ownership',
  'scenarios',
  'lifecycle',
  'extensions',
  'reviews',
];

export interface DependenciesArchitectureViewProps {
  architecture: ExtractedDependencyArchitecture;
}

export function DependenciesArchitectureView({
  architecture,
}: DependenciesArchitectureViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<DependencyCenterTabId>('matrix');
  const [deepLinkCicId, setDeepLinkCicId] = useState<string | null>(null);
  const [highlightedType, setHighlightedType] = useState<string | null>(null);

  const handleTabParam = useCallback((value: string | null) => {
    if (!value) return;
    const normalized = value.trim().toLowerCase() as DependencyCenterTabId;
    if ((VALID_TABS as readonly string[]).includes(normalized)) {
      setActiveTab(normalized);
    }
  }, []);

  const handleCicParam = useCallback((value: string | null) => {
    if (!value) return;
    setDeepLinkCicId(value.trim());
    setActiveTab('matrix');
  }, []);

  const handleTypeParam = useCallback((value: string | null) => {
    if (!value) return;
    setHighlightedType(value.trim().toUpperCase());
    setActiveTab('model');
  }, []);

  const tabs: readonly {
    id: DependencyCenterTabId;
    label: string;
    badge?: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  }[] = [
    {
      id: 'matrix',
      label: isAr ? 'المصفوفة وعقود CIC / FLD / PCD' : 'Matrix & CIC / FLD / PCD',
      badge: '0 HBMD · 6 CIC',
      icon: GitFork,
    },
    {
      id: 'model',
      label: isAr ? 'نموذج الاعتماديات (4 أنواع)' : 'Dependency Model (4 Types)',
      badge: '12 Rules',
      icon: Scale,
    },
    {
      id: 'simulator',
      label: isAr ? 'محاكي التفعيل (16 تركيبة)' : 'Activation Simulator (16x)',
      badge: isAr ? 'توضيحي' : 'Interactive',
      icon: Play,
    },
    {
      id: 'ownership',
      label: isAr ? 'ملكية البيانات' : 'Data Ownership',
      badge: `${architecture.matrix.dataOwnershipRecords.length}`,
      icon: Database,
    },
    {
      id: 'scenarios',
      label: isAr ? 'السيناريوهات البينية' : 'Cross-Module Scenarios',
      badge: `${architecture.matrix.coreCics.length}`,
      icon: Workflow,
    },
    {
      id: 'lifecycle',
      label: isAr ? 'دورة حياة الأنظمة' : 'Module Lifecycle',
      badge: 'Freeze',
      icon: RefreshCw,
    },
    {
      id: 'extensions',
      label: isAr ? 'الامتدادات المستقبلية' : 'Future Extensions',
      badge: '8 Checks',
      icon: Puzzle,
    },
    {
      id: 'reviews',
      label: isAr ? 'بوابات مراجعة المرحلة 2' : 'Phase 2 Reviews',
      badge: 'PASS',
      icon: ShieldCheck,
    },
  ];

  return (
    <PageContainer>
      <QueryParamSync paramName="tab" onValue={handleTabParam} />
      <QueryParamSync paramName="cic" onValue={handleCicParam} />
      <QueryParamSync paramName="type" onValue={handleTypeParam} />

      <PageHeader
        kicker={
          <div className="flex flex-wrap items-center gap-2">
            <ContentClassification
              classification="official"
              label={t('classification.official.label')}
            />
            <span className="rounded-sm border border-success-border bg-success-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-success bidi-ltr">
              BATCH-002 · Phase 2 Closed (2026-09-09)
            </span>
          </div>
        }
        title={
          isAr
            ? 'مركز الاعتماديات، عقود التكامل، وحوكمة الأنظمة (Phase 2)'
            : 'Dependencies, Integration Contracts & Module Governance Center'
        }
        subtitle={
          isAr
            ? 'المرجع المعماري الكامل المستخرج من الوثائق الرسمية الست لحوكمة الأنظمة في BATCH-002: نموذج الاعتماديات، مصفوفة 4×4 (0 HBMD)، عقود CIC الستة، اعتماديات FLD الخمس، مصفوفة PCD الـ 21، ملكية البيانات، دورة الحياة، قواعد الامتداد، ومراجعات الإغلاق.'
            : 'Authoritative architectural explorer extracted from the six official Phase 2 governance documents in BATCH-002: Dependency Model, 4×4 Matrix (0 HBMD), 6 Core CICs, 5 Core FLDs, 21-Row PCD Matrix, Data Ownership, Lifecycle Rules, Future Extensions, and Phase 2 Review Gates.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/modules"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isAr ? 'الأنظمة الأساسية الـ 4' : '4 Core Modules'}</span>
            </Link>
            <Link
              href="/knowledge/module-dependency-matrix"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary/40"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {isAr ? 'فتح المصفوفة الرسمية' : 'Open Official Matrix'}
              </span>
            </Link>
          </div>
        }
      />

      {/* Authoritative Phase 2 Governance Metrics Strip */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-5">
        <MetricCard
          label={isAr ? 'اعتماديات HBMD الصلبة' : 'Core HBMD Edges'}
          value={architecture.matrix.hbmdEdgeCount}
          note={
            isAr
              ? `${architecture.matrix.hbmdCycleCount} دورات · Acyclic · 12 زوجًا مفحوصًا`
              : `${architecture.matrix.hbmdCycleCount} cycles · Acyclic · 12 pairs verified`
          }
          emphasis="primary"
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'عقود التكامل المشروط (CIC)' : 'Core CIC Contracts'}
          value={architecture.matrix.coreCics.length}
          note={
            isAr
              ? 'v0.1-conceptual · 16 حقل بيانات وصفية لكل عقد'
              : 'v0.1-conceptual · 16 metadata fields each'
          }
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'اعتماديات مستوى الميزة (FLD)' : 'Core FLD Records'}
          value={architecture.matrix.coreFlds.length}
          note={
            isAr
              ? 'مقيدة بالميزة فقط — لا تمنع تفعيل النظام'
              : 'Feature availability only — never blocks base activation'
          }
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'قدرات المنصة (PCD) / الملكية' : 'Platform PCDs / Ownership'}
          value={`${architecture.matrix.pcdMatrix.length} / ${architecture.matrix.dataOwnershipRecords.length}`}
          note={
            isAr
              ? `${architecture.matrix.deferredOwnershipCount} حدود ملكية مؤجلة موثقة صراحةً`
              : `${architecture.matrix.deferredOwnershipCount} deferred ownership boundaries explicitly tracked`
          }
          className="bg-surface"
        />
        <MetricCard
          label={isAr ? 'بوابات مراجعة المرحلة 2' : 'Phase 2 Review Gates'}
          value="PASS"
          emphasis="accent"
          note={
            isAr
              ? `${architecture.phase2Reviews.assumptionSafety.guardrails.length} ضوابط (G-ASSUMP) · ${architecture.phase2Reviews.closureReview.exitCriteria.length} معيار خروج`
              : `${architecture.phase2Reviews.assumptionSafety.guardrails.length} G-ASSUMP guardrails · ${architecture.phase2Reviews.closureReview.exitCriteria.length} exit criteria`
          }
          className="bg-surface col-span-2 lg:col-span-1"
        />
      </div>

      {/* Multi-View Navigation Tabs */}
      <nav
        aria-label={
          isAr
            ? 'أقسام مركز الاعتماديات والتكامل'
            : 'Dependencies and integration sections'
        }
        className="rounded-lg border border-border bg-surface p-2"
      >
        <div
          role="tablist"
          className="flex flex-wrap items-center gap-1.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`dep-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`dep-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'border-primary bg-primary-subtle text-primary shadow-2xs'
                    : 'border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary'
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span
                    className={cn(
                      'rounded-sm px-1.5 py-0.5 font-mono text-[10px] bidi-ltr',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'bg-surface-secondary text-text-muted'
                    )}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Active Tab Panel */}
      <section
        id={`dep-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`dep-tab-${activeTab}`}
      >
        {activeTab === 'matrix' ? (
          <DependencyMatrixExplorer
            matrix={architecture.matrix}
            initialCicId={deepLinkCicId}
          />
        ) : null}

        {activeTab === 'model' ? (
          <DependencyModelSection
            data={architecture.dependencyModel}
            highlightedType={highlightedType}
          />
        ) : null}

        {activeTab === 'simulator' ? (
          <ModuleActivationSimulatorView matrix={architecture.matrix} />
        ) : null}

        {activeTab === 'ownership' ? (
          <DataOwnershipExplorer matrix={architecture.matrix} />
        ) : null}

        {activeTab === 'scenarios' ? (
          <CrossModuleScenariosView matrix={architecture.matrix} />
        ) : null}

        {activeTab === 'lifecycle' ? (
          <ModuleLifecycleExplorer lifecycle={architecture.lifecycle} />
        ) : null}

        {activeTab === 'extensions' ? (
          <FutureExtensionGovernanceView
            extensions={architecture.futureExtensions}
          />
        ) : null}

        {activeTab === 'reviews' ? (
          <Phase2ReviewsSection reviews={architecture.phase2Reviews} />
        ) : null}
      </section>

      {/* Authoritative BATCH-002 Governance Sources Strip */}
      <section
        aria-label={isAr ? 'المصادر الرسمية لحوكمة المرحلة 2' : 'Official Phase 2 Governance Sources'}
        className="rounded-lg border border-border bg-surface p-4 space-y-2.5"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            {isAr
              ? 'الوثائق الرسمية الست لحوكمة الأنظمة والمراجعة (BATCH-002)'
              : 'Six Official Phase 2 Module Governance & Review Sources (BATCH-002)'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {[
            { slug: 'dependency-model', path: '03-modules/DEPENDENCY_MODEL.md' },
            { slug: 'module-dependency-matrix', path: '03-modules/MODULE_DEPENDENCY_MATRIX.md' },
            { slug: 'module-lifecycle-rules', path: '03-modules/MODULE_LIFECYCLE_RULES.md' },
            { slug: 'future-module-extension-rules', path: '03-modules/FUTURE_MODULE_EXTENSION_RULES.md' },
            { slug: 'phase-2-assumption-safety-review', path: '00-project-foundation/PHASE_2_ASSUMPTION_SAFETY_REVIEW.md' },
            { slug: 'phase-2-closure-review', path: '00-project-foundation/PHASE_2_CLOSURE_REVIEW.md' },
          ].map((doc) => (
            <Link
              key={doc.slug}
              href={`/knowledge/${doc.slug}`}
              className="rounded-md border border-border bg-surface-secondary/40 px-3 py-2 font-mono text-[11px] text-primary hover:border-primary/40 hover:underline bidi-ltr text-start truncate"
            >
              {doc.path}
            </Link>
          ))}
        </div>
      </section>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source="BATCH-002: DEPENDENCY_MODEL.md · MODULE_DEPENDENCY_MATRIX.md · MODULE_LIFECYCLE_RULES.md · FUTURE_MODULE_EXTENSION_RULES.md · PHASE_2_ASSUMPTION_SAFETY_REVIEW.md · PHASE_2_CLOSURE_REVIEW.md (397a94e0d82f)"
        identifier="BATCH-002-DEPENDENCY-GOVERNANCE"
      />
    </PageContainer>
  );
}
