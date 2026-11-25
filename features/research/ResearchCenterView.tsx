'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function ResearchCenterView() {
  const t = useTranslations();
  const counts = useMemo(() => getReferenceCounts(), []);

  return (
    <PlannedSectionView
      sectionCode="SEC-RESEARCH"
      classification="research"
      title={{ ar: 'مركز الأبحاث والمقارنات المرجعية', en: 'Research Center & Benchmarks' }}
      description={{
        ar: 'حزم الأبحاث المعمارية والمقارنات المرجعية والأدلة الداعمة. تُعرض المواد البحثية منفصلة عن القرارات الرسمية المعتمدة.',
        en: 'Architectural research packages, benchmark comparisons, and supporting evidence. Research material is presented distinctly from approved decisions.',
      }}
      verifiedAnchor={
        <div className="rounded-lg border border-border bg-surface">
          <MetricCard
            label={t('sections.research.metricLabel')}
            value={counts.architecturalResearchPackages}
            note={t('sections.research.metricNote')}
          />
        </div>
      }
    />
  );
}
