'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import {
  derivePhase5Progress,
  getPlanningPhases,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { Timeline } from '@/components/visualization/Timeline';
import { PhaseProgress } from '@/components/visualization/PhaseProgress';

export function RoadmapView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const phases = useMemo(() => getPlanningPhases(), []);
  const phase5 = useMemo(() => derivePhase5Progress(), []);

  return (
    <PlannedSectionView
      sectionCode="SEC-ROADMAP"
      classification="official"
      title={{ ar: 'خارطة الطريق ومراحل التخطيط', en: 'Project Roadmap & Planning Phases' }}
      description={{
        ar: 'تتبع مراحل التخطيط والتوثيق والاعتماد المعماري لمنتج Teranoo ERP. تعكس الحالة الموضحة تقدم التوثيق المعماري وليس التنفيذ البرمجي.',
        en: 'Tracking planning, documentation, and architectural approval phases for Teranoo ERP. Status reflects documentation approval progress, not software implementation.',
      }}
      verifiedAnchor={
        <div className="space-y-4">
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
        </div>
      }
    />
  );
}
