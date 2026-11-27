'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  GitBranch,
  Layers,
  Milestone,
  Repeat,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { resolveLocalizedText } from '@/content/models/types';
import type { SourceManifestEntry } from '@/content/models/knowledge';
import type {
  ExtractedRoadmap,
  RoadmapPhaseDetail,
  RoadmapPhaseStatus,
} from '@/content/extractors/roadmapExtractor';
import {
  derivePhase5Progress,
  getSnapshotProvenance,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { SourceReference } from '@/components/documentation/SourceReference';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { PhaseProgress } from '@/components/visualization/PhaseProgress';
import { QueryParamSync } from '@/components/navigation/QueryParamSync';
import { cn } from '@/lib/utils';

export interface RoadmapViewProps {
  workPlanSourceEntry?: SourceManifestEntry;
  workingRulesSourceEntry?: SourceManifestEntry;
  extractedRoadmap: ExtractedRoadmap;
}

const STAGE_STATUS_STYLES: Record<RoadmapPhaseStatus, string> = {
  completed: 'border-success-border bg-success-bg text-success',
  conditionally_approved: 'border-warning-border bg-warning-bg text-warning',
  awaiting_authorization: 'border-info-border bg-info-bg text-info',
  pending: 'border-border bg-surface-secondary text-text-muted',
  deferred: 'border-border bg-surface-secondary text-text-muted',
  ongoing_track:
    'border-class-educational-border bg-class-educational-bg text-class-educational',
};

export function RoadmapView({
  workPlanSourceEntry,
  workingRulesSourceEntry,
  extractedRoadmap,
}: RoadmapViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';
  const isRtl = isAr;
  const phase5 = useMemo(() => derivePhase5Progress(), []);
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const [selectedStageId, setSelectedStageId] = useState<string>('phase-5');

  const handlePhaseQueryParam = useCallback(
    (paramValue: string | null) => {
      if (!paramValue) return;
      const normalized = paramValue.trim().toLowerCase();
      const matched = extractedRoadmap.phases.find(
        (p) =>
          p.id.toLowerCase() === normalized ||
          p.code.toLowerCase() === normalized
      );
      if (matched) {
        setSelectedStageId(matched.id);
      }
    },
    [extractedRoadmap.phases]
  );

  const selectedStage: RoadmapPhaseDetail = useMemo(() => {
    return (
      extractedRoadmap.phases.find((p) => p.id === selectedStageId) ??
      extractedRoadmap.phases[4] ??
      extractedRoadmap.phases[0]!
    );
  }, [extractedRoadmap.phases, selectedStageId]);

  const progressTracks = [
    {
      key: 'erpPlanning',
      label: t('foundations.roadmap.tracks.erpPlanning'),
      value: t('foundations.roadmap.tracks.erpPlanningValue'),
      note: t('foundations.roadmap.tracks.erpPlanningNote'),
    },
    {
      key: 'erpEngineering',
      label: t('foundations.roadmap.tracks.erpEngineering'),
      value: t('foundations.roadmap.tracks.erpEngineeringValue'),
      note: t('foundations.roadmap.tracks.erpEngineeringNote'),
    },
    {
      key: 'hubDevelopment',
      label: t('foundations.roadmap.tracks.hubDevelopment'),
      value: t('foundations.roadmap.tracks.hubDevelopmentValue'),
      note: t('foundations.roadmap.tracks.hubDevelopmentNote'),
    },
    {
      key: 'operationalReadiness',
      label: t('foundations.roadmap.tracks.operationalReadiness'),
      value: t('foundations.roadmap.tracks.operationalReadinessValue'),
      note: t('foundations.roadmap.tracks.operationalReadinessNote'),
    },
  ] as const;

  const planningCycleSteps = isAr
    ? [
        {
          step: '01',
          title: 'البحث والتحليل المرجعي',
          detail: 'دراسة الفجوات والبدائل والمقارنات المرجعية قبل اقتراح أي قرار.',
        },
        {
          step: '02',
          title: 'اتخاذ القرار المعماري',
          detail: 'صياغة قرار واضح ومحدد النطاق مرتبط بحاجة حالية فعلية.',
        },
        {
          step: '03',
          title: 'التوثيق الرسمي',
          detail: 'تثبيت القرار في الوثيقة المالكة وتحديث سجل القرارات والمؤجلات.',
        },
        {
          step: '04',
          title: 'المراجعة والاعتماد المستقل',
          detail: 'التحقق من الاتساق والتوافق الرجعي بصفر تعارضات مادية.',
        },
        {
          step: '05',
          title: 'الانتقال المنضبط للمرحلة التالية',
          detail: 'لا انتقال دون إغلاق رسمي وتكليف واضح للمرحلة اللاحقة.',
        },
      ]
    : [
        {
          step: '01',
          title: 'Research & Comparative Analysis',
          detail: 'Investigate domain patterns, trade-offs, and benchmarks before proposing decisions.',
        },
        {
          step: '02',
          title: 'Focused Architectural Decision',
          detail: 'Formulate bounded decisions strictly justified by present-phase needs.',
        },
        {
          step: '03',
          title: 'Official Documentation',
          detail: 'Record the decision in its owning document and update DECISION_REGISTER / FAC.',
        },
        {
          step: '04',
          title: 'Independent Review & Approval',
          detail: 'Verify cross-phase consistency and backward compatibility with zero conflicts.',
        },
        {
          step: '05',
          title: 'Gated Transition to Next Stage',
          detail: 'Advance only after formal phase closure and explicit authorization.',
        },
      ];

  const needToDecideQuestions = isAr
    ? [
        'هل يؤثر هذا الموضوع على قرارات المرحلة الحالية أو يبني عليها؟',
        'هل تأجيله سيسبب إعادة تصميم مكلفة أو تعارضًا في العقود البينية لاحقًا؟',
        'هل نملك اليوم مدخلات كافية لحسمه بدقة دون افتراضات غير مثبتة؟',
        'هل حسمه الآن يحمي حدود المنتج أو العزل أو قابلية الترقية؟',
      ]
    : [
        'Does this topic directly constrain or unblock decisions in the current phase?',
        'Would deferring it cause costly rework or broken cross-module contracts later?',
        'Do we have sufficient verified inputs today to decide without speculative assumptions?',
        'Does deciding now protect product boundaries, isolation, or upgradeability?',
      ];

  const triageMatrix = isAr
    ? [
        {
          tier: 'A',
          name: 'يجب حسمه الآن (Must Decide Now)',
          action: 'يُدرس ويُعتمد ويُوثّق ضمن مخرجات المرحلة الحالية قبل إغلاقها.',
        },
        {
          tier: 'B',
          name: 'توجيه عالي المستوى فقط (High-Level Direction)',
          action: 'يُثبّت كمبدأ أو ضابط عابر للمراحل وتُؤجّل تفاصيله التشغيلية للمرحلة المالكة.',
        },
        {
          tier: 'C',
          name: 'اعتبار معماري مستقبلي (FAC)',
          action: 'يُسجّل في FUTURE_ARCHITECTURE_CONSIDERATIONS.md للمراقبة أو البحث لاحقًا دون اعتباره قرارًا معتمدًا.',
        },
        {
          tier: 'D',
          name: 'تفصيل تنفيذي مؤجل (Deferred Implementation Detail)',
          action: 'يُمنع حسمه مبكرًا (مثل تفاصيل البنية السحابية أو الجداول الفيزيائية) ويُرحّل لمرحلة التنفيذ أو Phase 10.',
        },
      ]
    : [
        {
          tier: 'A',
          name: 'Must Decide Now',
          action: 'Research, approve, and document inside the current phase deliverables before closure.',
        },
        {
          tier: 'B',
          name: 'High-Level Direction Only',
          action: 'Capture as a cross-phase guardrail or boundary while deferring deep mechanics to the owning phase.',
        },
        {
          tier: 'C',
          name: 'Future Architectural Consideration (FAC)',
          action: 'Log in FUTURE_ARCHITECTURE_CONSIDERATIONS.md for research/watch — strictly non-approved.',
        },
        {
          tier: 'D',
          name: 'Deferred Execution Detail',
          action: 'Explicitly prohibited from early lock-in (e.g., cloud topology, physical schemas); routed to Phase 10 or build.',
        },
      ];

  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <PageContainer>
      <QueryParamSync paramName="phase" onValue={handlePhaseQueryParam} />

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
              label={t('app.currentPhaseBadge')}
            />
          </>
        }
        title={t('foundations.roadmap.title')}
        subtitle={t('foundations.roadmap.subtitle')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/knowledge/project-work-plan"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{t('foundations.roadmap.readWorkPlan')}</span>
            </Link>
            <Link
              href="/knowledge/working-rules"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <Scale className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{t('foundations.roadmap.readWorkingRules')}</span>
            </Link>
          </div>
        }
        meta={
          workPlanSourceEntry ? (
            <>
              <code className="font-mono text-xs bidi-ltr text-text-secondary">
                {workPlanSourceEntry.sourcePath}
              </code>
              {workingRulesSourceEntry ? (
                <>
                  <span aria-hidden="true">+</span>
                  <code className="font-mono text-xs bidi-ltr text-text-secondary">
                    {workingRulesSourceEntry.sourcePath}
                  </code>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>
                {t(
                  `foundations.sourceManifest.importStatuses.${workPlanSourceEntry.importStatus}`
                )}
              </span>
            </>
          ) : undefined
        }
      />

      {/* Four Independent Progress Dimensions (Never Combined Into One Percentage) */}
      <section
        aria-label={t('foundations.roadmap.tracksTitle')}
        className="space-y-3"
      >
        <SectionHeader
          title={t('foundations.roadmap.tracksTitle')}
          subtitle={t('foundations.roadmap.tracksSubtitle')}
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {progressTracks.map((track) => (
            <div key={track.key} className="bg-surface p-4 space-y-1.5">
              <p className="text-xs font-semibold text-text-muted">
                {track.label}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                {track.value}
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                {track.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* KH-025 / KH-037 Curated Projection Provenance, 4 Knowledge States & Historical Baseline */}
      <InformationCallout
        className={
          extractedRoadmap.projectionMetadata.mappingFreshnessStatus ===
          'verified-current'
            ? 'border-info-border bg-info-bg/50'
            : 'border-danger-border bg-danger-bg'
        }
        title={
          isAr
            ? `إسقاط منظم مُراجع (Curated Projection · ${
                extractedRoadmap.projectionMetadata.mappingFreshnessStatus ===
                'verified-current'
                  ? 'مُراجع ومطابق للمصدر المثبت'
                  : 'يتطلب مراجعة — لا يُعتمد كمعرفة حالية'
              })`
            : `Curated Roadmap Projection (${
                extractedRoadmap.projectionMetadata.mappingFreshnessStatus ===
                'verified-current'
                  ? 'Reviewed Against Pinned Source'
                  : 'Review Required — Do Not Treat as Current Verified Knowledge'
              })`
        }
      >
        <div className="space-y-2 text-xs">
          <p>
            {resolveLocalizedText(
              extractedRoadmap.projectionMetadata.projectionDisclosure,
              locale
            )}
          </p>
          <p className="text-text-secondary">
            {t('foundations.historicalBaseline.body')}
          </p>
          {extractedRoadmap.projectionMetadata.reviewWarning ? (
            <div className="rounded-md border border-danger-border bg-surface px-3 py-2 space-y-1">
              <p className="font-semibold text-danger">
                {resolveLocalizedText(
                  extractedRoadmap.projectionMetadata.reviewWarning,
                  locale
                )}
              </p>
              <Link
                href="/knowledge/project-work-plan"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                <span>{t('foundations.roadmap.readWorkPlan')}</span>
              </Link>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-surface px-2.5 py-1.5 text-[11px] text-text-secondary">
            <span className="font-semibold text-text-primary">
              {t('foundations.knowledgeStates.heading')}:
            </span>
            <span>{isAr ? '1. مصدر رسمي حرفي' : '1. Verbatim Official Source'}</span>
            <span>·</span>
            <span
              className={
                extractedRoadmap.projectionMetadata.mappingFreshnessStatus ===
                'verified-current'
                  ? 'font-semibold text-success'
                  : 'text-text-muted line-through'
              }
            >
              {isAr ? '2. إسقاط تعليمي مُراجع' : '2. Reviewed Educational Projection'}
            </span>
            <span>·</span>
            <span
              className={
                extractedRoadmap.projectionMetadata.mappingFreshnessStatus !==
                'verified-current'
                  ? 'font-semibold text-danger'
                  : 'text-text-muted'
              }
            >
              {isAr ? '3. إسقاط يتطلب مراجعة' : '3. Projection Requiring Review'}
            </span>
            <span>·</span>
            <span>{isAr ? '4. خط أساس تاريخي (397a94e0d82f)' : '4. Historical Baseline (397a94e0d82f)'}</span>
          </div>
          <p className="font-mono text-[11px] text-text-muted bidi-ltr text-start">
            pinned-revision:{' '}
            {extractedRoadmap.projectionMetadata.mappedSourceRevision.slice(0, 12)}{' '}
            · body-sha256:{' '}
            {extractedRoadmap.projectionMetadata.actualSourceBodySha256.slice(0, 16)}
          </p>
        </div>
      </InformationCallout>

      {/* Verbatim Source Discrepancy Notice */}
      {extractedRoadmap.hasStalePhase5CurrentLine ? (
        <InformationCallout
          className="border-warning-border bg-warning-bg"
          title={t('foundations.roadmap.futureSupportTitle')}
        >
          {resolveLocalizedText(extractedRoadmap.sourceDiscrepancyNote, locale)}
        </InformationCallout>
      ) : null}

      {/* Phase 5 Completion Progress Bar (13/13) */}
      <section
        aria-label={t('foundations.roadmap.verifiedPhasesTitle')}
        className="space-y-5"
      >
        <SectionHeader
          title={t('foundations.roadmap.verifiedPhasesTitle')}
          subtitle={
            isAr
              ? `مكتمل: ${extractedRoadmap.completedPhasesCount} من ${extractedRoadmap.totalOfficialPhasesCount} مرحلة تخطيط رسمية + بوابة القرار A (معتمدة مشروطًا) — اختر أي مرحلة لاستعراض نطاقها ومخرجاتها وشروط إغلاقها.`
              : `Completed: ${extractedRoadmap.completedPhasesCount} of ${extractedRoadmap.totalOfficialPhasesCount} official planning phases + Decision Gate A (Approved Conditional) — select any stage to inspect scope, deliverables, and closure criteria.`
          }
        />

        <PhaseProgress
          title={t('dashboard.currentPhase.progressLabel')}
          completed={phase5.completedCount}
          total={phase5.totalCount}
          percentage={phase5.completionPercentage}
          progressLabel={t('dashboard.currentPhase.progressLabel')}
          summaryText={t('app.planningProgressNotice')}
        />

        {/* Complete 14-Stage Interactive Selector Grid */}
        <div
          role="tablist"
          aria-label={t('foundations.roadmap.verifiedPhasesTitle')}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
        >
          {extractedRoadmap.phases.map((stage) => {
            const isSelected = stage.id === selectedStage.id;
            const isGate =
              stage.kind === 'decision_gate' || stage.id === 'phase-6.5';
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedStageId(stage.id)}
                className={cn(
                  'group flex flex-col items-start gap-1.5 rounded-lg border p-3 text-start transition-all',
                  isSelected
                    ? 'border-primary bg-primary-subtle/50 ring-1 ring-primary'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover'
                )}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span
                    className={cn(
                      'font-mono text-[11px] font-semibold bidi-ltr',
                      isSelected ? 'text-primary' : 'text-text-muted'
                    )}
                  >
                    {stage.code}
                  </span>
                  {stage.status === 'completed' ? (
                    <CheckCircle2
                      className="h-3.5 w-3.5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  ) : stage.status === 'conditionally_approved' ? (
                    <AlertTriangle
                      className="h-3.5 w-3.5 shrink-0 text-warning"
                      aria-hidden="true"
                    />
                  ) : stage.status === 'awaiting_authorization' ? (
                    <Compass
                      className="h-3.5 w-3.5 shrink-0 text-info"
                      aria-hidden="true"
                    />
                  ) : (
                    <Clock
                      className="h-3.5 w-3.5 shrink-0 text-text-muted"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className="line-clamp-2 text-xs font-medium leading-snug text-text-primary">
                  {resolveLocalizedText(stage.title, locale)}
                </span>
                <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                  <span
                    className={cn(
                      'rounded-sm border px-1.5 py-0.5 text-[10px] font-medium',
                      STAGE_STATUS_STYLES[stage.status]
                    )}
                  >
                    {t(`foundations.roadmap.stageStatuses.${stage.status}`)}
                  </span>
                  {isGate ? (
                    <span className="rounded-sm border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-muted">
                      {stage.kind === 'decision_gate'
                        ? isAr
                          ? 'بوابة قرار'
                          : 'Gate'
                        : isAr
                          ? 'بوابة خروج'
                          : 'Exit Gate'}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detailed Inspector */}
        <article
          aria-live="polite"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6 space-y-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-border bg-surface-secondary px-2 py-0.5 font-mono text-xs font-semibold text-text-primary bidi-ltr">
                  {selectedStage.code}
                </span>
                <span
                  className={cn(
                    'rounded-sm border px-2 py-0.5 text-xs font-medium',
                    STAGE_STATUS_STYLES[selectedStage.status]
                  )}
                >
                  {t(`foundations.roadmap.stageStatuses.${selectedStage.status}`)}
                </span>
                {selectedStage.completedDate ? (
                  <span className="font-mono text-xs text-text-muted bidi-ltr">
                    {selectedStage.completedDate}
                  </span>
                ) : null}
                {selectedStage.decisionRange ? (
                  <span className="rounded-sm border border-class-decision-border bg-class-decision-bg px-2 py-0.5 font-mono text-xs text-class-decision bidi-ltr">
                    {selectedStage.decisionRange}
                    {selectedStage.decisionCount !== null
                      ? ` (${selectedStage.decisionCount})`
                      : ''}
                  </span>
                ) : null}
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {resolveLocalizedText(selectedStage.title, locale)}
              </h3>
              {isAr ? (
                <p className="font-mono text-xs text-text-muted bidi-ltr text-start">
                  {selectedStage.originalTitle}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedStage.decisionCount !== null ||
              selectedStage.id === 'decision-gate-a' ? (
                <Link
                  href={
                    selectedStage.id === 'decision-gate-a'
                      ? '/decisions?decision=D-MKT-01'
                      : '/decisions'
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40"
                >
                  <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>
                    {isAr ? 'استعراض سجل القرارات' : 'Inspect Decision Register'}
                  </span>
                </Link>
              ) : null}
              <Link
                href={`/knowledge/${selectedStage.sourceDocumentSlug}#${selectedStage.sourceSectionAnchor}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {isAr ? 'قراءة القسم في المصدر الرسمي' : 'Read Section in Official Source'}
                </span>
              </Link>
            </div>
          </div>

          {/* Purpose & Scope */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border bg-surface-secondary/50 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-text-muted">
                {isAr ? 'الهدف الرسمي للمرحلة' : 'Official Stage Purpose'}
              </p>
              <p className="text-sm leading-relaxed text-text-primary">
                {resolveLocalizedText(selectedStage.purpose, locale)}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface-secondary/50 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-text-muted">
                {isAr ? 'النطاق والحدود' : 'Scope & Boundaries'}
              </p>
              <p className="text-sm leading-relaxed text-text-primary">
                {resolveLocalizedText(selectedStage.scope, locale)}
              </p>
            </div>
          </div>

          {/* Work Items & Deliverables */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <Milestone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>{isAr ? 'بنود العمل الرئيسية' : 'Key Work Items'}</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedStage.workItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-text-secondary"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                  <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>{isAr ? 'المخرجات والوثائق' : 'Deliverables & Artifacts'}</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedStage.deliverables.map((del) => (
                    <li
                      key={del}
                      className="rounded-md border border-border bg-surface-secondary/40 px-3 py-2 font-mono text-xs text-text-primary bidi-ltr text-start"
                    >
                      {del}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-border bg-surface-secondary/40 p-3.5 space-y-2.5 text-xs">
                <div>
                  <span className="font-semibold text-text-primary">
                    {isAr ? 'الاعتماديات: ' : 'Dependencies: '}
                  </span>
                  <span className="text-text-secondary">
                    {resolveLocalizedText(selectedStage.dependencies, locale)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">
                    {isAr ? 'شرط الإغلاق: ' : 'Completion Condition: '}
                  </span>
                  <span className="text-text-secondary">
                    {resolveLocalizedText(selectedStage.completionCondition, locale)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">
                    {isAr ? 'حالة الاعتماد: ' : 'Approval Outcome: '}
                  </span>
                  <span className="text-text-secondary">
                    {resolveLocalizedText(selectedStage.approvalOutcome, locale)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary">
                    {isAr ? 'الأعمال المؤجلة: ' : 'Deferred Work: '}
                  </span>
                  <span className="text-text-secondary">
                    {resolveLocalizedText(selectedStage.deferredWork, locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Published Evidence Links (e.g., BATCH-002 Phase 2 Evidence) */}
          {selectedStage.relatedEvidenceLinks &&
          selectedStage.relatedEvidenceLinks.length > 0 ? (
            <div className="border-t border-border pt-4 space-y-2.5">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-success"
                  aria-hidden="true"
                />
                <span>
                  {isAr
                    ? 'الأدلة والوثائق الرسمية المنشورة محليًا لهذه المرحلة'
                    : 'Published Official Evidence & Explorers for This Stage'}
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStage.relatedEvidenceLinks.map((ev) => (
                  <Link
                    key={ev.href}
                    href={ev.href}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                      ev.kind === 'explorer'
                        ? 'border-primary/30 bg-primary-subtle/60 text-primary hover:bg-primary/15'
                        : ev.kind === 'review-gate'
                          ? 'border-success-border bg-success-bg/60 text-success hover:bg-success-bg'
                          : 'border-border bg-surface-secondary/60 text-text-primary hover:border-primary/40 hover:bg-surface-hover'
                    )}
                  >
                    <span>{resolveLocalizedText(ev.label, locale)}</span>
                    <DirectionArrow className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        {/* Continuous Market Evidence Collection — Explicitly NOT an Independent Planning Phase */}
        <div className="rounded-lg border border-class-educational-border bg-class-educational-bg/40 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Repeat
                className="h-4 w-4 text-class-educational"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-text-primary">
                {resolveLocalizedText(extractedRoadmap.continuousTrack.title, locale)}
              </h3>
              <span className="rounded-sm border border-class-educational-border bg-surface px-2 py-0.5 text-[11px] font-medium text-class-educational">
                {t('foundations.roadmap.stageStatuses.ongoing_track')}
              </span>
            </div>
            <Link
              href={`/knowledge/${extractedRoadmap.sourceDocumentSlug}#${extractedRoadmap.continuousTrack.sourceSectionAnchor}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {isAr ? 'فتح القسم في خطة العمل' : 'View in PROJECT_WORK_PLAN.md'}
            </Link>
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            {resolveLocalizedText(extractedRoadmap.continuousTrack.purpose, locale)}
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {extractedRoadmap.continuousTrack.guardrails.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 rounded-md border border-border bg-surface/90 px-3 py-2 text-xs text-text-secondary"
              >
                <ShieldCheck
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-class-educational"
                  aria-hidden="true"
                />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Planning Methodology & Working Rules (WORKING_RULES.md) */}
      <section
        aria-label={isAr ? 'قواعد العمل ومنهجية التخطيط' : 'Planning Methodology & Working Rules'}
        className="space-y-5 pt-2"
      >
        <SectionHeader
          title={
            isAr
              ? 'منهجية التخطيط وقواعد العمل الرسمية (WORKING_RULES.md)'
              : 'Official Planning Methodology & Working Rules (WORKING_RULES.md)'
          }
          subtitle={
            isAr
              ? 'كيف يُدار تخطيط Teranoo ERP بصورة منضبطة لمنع التشتت والتعقيد المبكر وتضخم التخطيط.'
              : 'How Teranoo ERP planning stays disciplined — preventing scope sprawl, premature tech lock-in, and planning inflation.'
          }
          actions={
            <Link
              href="/knowledge/working-rules"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <span>{t('foundations.roadmap.readWorkingRules')}</span>
              <DirectionArrow className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        />

        {/* Supreme Rule Callout */}
        <InformationCallout
          title={
            isAr
              ? 'القاعدة العليا — فهم المنتج والهندسة المعمارية أولاً (Supreme Rule)'
              : 'Supreme Rule — Product & Architectural Clarity First'
          }
        >
          {isAr
            ? 'لا يُسمح بالبدء في كتابة الشيفرة البرمجية أو تصميم جداول قواعد البيانات الفيزيائية أو تجميد التقنيات قبل إغلاق التخطيط المعماري والوظيفي المعتمد لكل مرحلة؛ كل قرار يجب أن يستند إلى حاجة مثبتة وليس إلى افتراضات مسبقة.'
            : 'No production coding, physical database schema design, or premature technology stack lock-in is permitted before closing the governing architectural and functional planning phases; every decision must be evidence-driven.'}
        </InformationCallout>

        {/* Visual Planning Cycle Flow */}
        <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <GitBranch className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                {isAr
                  ? 'دورة التخطيط والاعتماد الرسمية (5 خطوات)'
                  : 'Official 5-Step Planning & Approval Cycle'}
              </span>
            </h3>
            <ContentClassification
              classification="official"
              label={t('classification.official.shortLabel')}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {planningCycleSteps.map((item) => (
              <div
                key={item.step}
                className="flex flex-col gap-1.5 rounded-md border border-border bg-surface-secondary/50 p-3.5"
              >
                <span className="font-mono text-xs font-bold text-primary bidi-ltr">
                  {item.step}
                </span>
                <p className="text-xs font-semibold text-text-primary">
                  {item.title}
                </p>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Question Filter & Priority Triage Matrix (A/B/C/D) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3 lg:col-span-5">
            <h3 className="text-sm font-semibold text-text-primary">
              {isAr
                ? 'اختبار الأسئلة الأربعة: هل يجب الحسم الآن؟'
                : '4-Question Need-to-Decide-Now Filter'}
            </h3>
            <p className="text-xs text-text-secondary">
              {isAr
                ? 'قبل إدراج أي موضوع في المرحلة الحالية، يُفحص عبر الأسئلة الأربعة لمنع «تضخم التخطيط» (Planning Inflation):'
                : 'Before pulling any topic into the active phase, it must pass four discipline questions to prevent Planning Inflation:'}
            </p>
            <ol className="space-y-2">
              {needToDecideQuestions.map((q, idx) => (
                <li
                  key={q}
                  className="flex items-start gap-2.5 rounded-md border border-border bg-surface-secondary/40 px-3 py-2 text-xs text-text-primary"
                >
                  <span className="font-mono text-xs font-semibold text-primary">
                    {idx + 1}.
                  </span>
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 space-y-3 lg:col-span-7">
            <h3 className="text-sm font-semibold text-text-primary">
              {isAr
                ? 'مصفوفة فرز الأولويات الرسمية (A / B / C / D)'
                : 'Official Priority Triage Matrix (A / B / C / D)'}
            </h3>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-text-primary">
                    <th className="px-3 py-2 text-start font-semibold w-14">
                      {isAr ? 'الفئة' : 'Tier'}
                    </th>
                    <th className="px-3 py-2 text-start font-semibold">
                      {isAr ? 'التصنيف' : 'Classification'}
                    </th>
                    <th className="px-3 py-2 text-start font-semibold">
                      {isAr ? 'الإجراء المعتمد' : 'Governed Action'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {triageMatrix.map((row) => (
                    <tr key={row.tier} className="bg-surface">
                      <td className="px-3 py-2.5 font-mono font-bold text-primary">
                        {row.tier}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-text-primary">
                        {row.name}
                      </td>
                      <td className="px-3 py-2.5 leading-relaxed text-text-secondary">
                        {row.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`PROJECT_WORK_PLAN.md + WORKING_RULES.md (${provenance.reviewedCommitSha ? provenance.reviewedCommitSha.slice(0, 12) : provenance.reviewedTreeSha.slice(0, 12)})`}
        identifier="src-pf-02-project-work-plan · src-pf-03-working-rules"
      />
    </PageContainer>
  );
}
