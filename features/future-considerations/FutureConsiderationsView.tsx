'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function FutureConsiderationsView() {
  const t = useTranslations();
  const counts = useMemo(() => getReferenceCounts(), []);

  return (
    <PlannedSectionView
      sectionCode="SEC-FUTURE"
      classification="future"
      title={{ ar: 'الاعتبارات المعمارية المستقبلية', en: 'Future Architecture Considerations' }}
      description={{
        ar: 'الموضوعات والأفكار المعمارية المستقبلية التي لم تتحول بالضرورة إلى قرارات معتمدة بعد.',
        en: 'Forward-looking architectural topics and considerations that have not necessarily become approved decisions.',
      }}
      verifiedAnchor={
        <div className="rounded-lg border border-border bg-surface">
          <MetricCard
            label={t('sections.future.metricLabel')}
            value={counts.futureArchitectureConsiderations}
            note={t('sections.future.metricNote')}
          />
        </div>
      }
    />
  );
}
