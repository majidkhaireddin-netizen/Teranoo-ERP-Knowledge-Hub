'use client';

import React, { useMemo } from 'react';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function IndependentReviewsView() {
  const { locale } = useAppLocale();
  const counts = useMemo(() => getReferenceCounts(), []);
  const isAr = locale === 'ar';

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
            label={
              isAr
                ? 'ملاحظات المراجعات المستقلة (ضمن المراجعات الاستشارية السابقة)'
                : 'Independent Review Notes (Prior Advisory Reviews)'
            }
            value={counts.independentReviewNotes}
            emphasis="accent"
            note={
              isAr
                ? 'التوصيات والملاحظات الاستشارية لا تمثل قرارات رسمية معتمدة ما لم تُعتمد في سجل القرارات.'
                : 'Advisory observations do not represent official decisions unless formally approved in the Decision Register.'
            }
          />
        </div>
      }
    />
  );
}
