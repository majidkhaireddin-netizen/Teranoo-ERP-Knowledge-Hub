'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function IndependentReviewsView() {
  const t = useTranslations();
  const counts = useMemo(() => getReferenceCounts(), []);

  return (
    <PlannedSectionView
      sectionCode="SEC-REVIEWS"
      classification="independent"
      title={{ ar: 'المراجعات والتحليلات المستقلة', en: 'Independent Advisory Reviews' }}
      description={{
        ar: 'ملاحظات المراجعات الاستشارية المستقلة والتقييمات النقدية، مفصولة بوضوح عن القرارات الرسمية المعتمدة.',
        en: 'Independent advisory review notes and critical assessments, clearly distinguished from official approved decisions.',
      }}
      verifiedAnchor={
        <div className="rounded-lg border border-border bg-surface">
          <MetricCard
            label={t('sections.reviews.metricLabel')}
            value={counts.independentReviewNotes}
            emphasis="accent"
            note={t('sections.reviews.metricNote')}
          />
        </div>
      }
    />
  );
}
