'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import type { SourceManifestEntry } from '@/content/models/knowledge';
import {
  derivePhase5Progress,
  getPlanningPhases,
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
import { Timeline } from '@/components/visualization/Timeline';
import { PhaseProgress } from '@/components/visualization/PhaseProgress';

export interface RoadmapViewProps {
  workPlanSourceEntry?: SourceManifestEntry;
}

export function RoadmapView({ workPlanSourceEntry }: RoadmapViewProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const phases = useMemo(() => getPlanningPhases(), []);
  const phase5 = useMemo(() => derivePhase5Progress(), []);
  const provenance = useMemo(() => getSnapshotProvenance(), []);

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
              status="in_progress"
              label={t('app.currentPhaseBadge')}
            />
          </>
        }
        title={t('foundations.roadmap.title')}
        subtitle={t('foundations.roadmap.subtitle')}
        meta={
          workPlanSourceEntry ? (
            <>
              <code className="font-mono text-xs bidi-ltr text-text-secondary">
                {workPlanSourceEntry.sourcePath}
              </code>
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

      {/* Verified Planning Phases (Snapshot: Phases 1–5) */}
      <section
        aria-label={t('foundations.roadmap.verifiedPhasesTitle')}
        className="space-y-4"
      >
        <SectionHeader title={t('foundations.roadmap.verifiedPhasesTitle')} />

        <PhaseProgress
          title={t('dashboard.currentPhase.progressLabel')}
          completed={phase5.completedCount}
          total={phase5.totalCount}
          percentage={phase5.completionPercentage}
          progressLabel={t('dashboard.currentPhase.progressLabel')}
          summaryText={t('app.planningProgressNotice')}
        />

        <Timeline
          items={phases.map((phase) => ({
            id: phase.code,
            code: phase.code,
            title: resolveLocalizedText(phase.name, locale),
            status: phase.status,
            statusLabel: t(`status.${phase.status}`),
          }))}
        />
      </section>

      {/* Structural Support for Future Phases, Phase 6.5 & Decision Gates */}
      <InformationCallout title={t('foundations.roadmap.futureSupportTitle')}>
        {t('foundations.roadmap.futureSupportBody')}
      </InformationCallout>

      <SourceReference
        label={t('documentation.sourceRefPrefix')}
        source={`teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md (${provenance.reviewedTreeSha.slice(0, 12)})`}
        identifier="src-pf-02-project-work-plan"
      />
    </PageContainer>
  );
}
