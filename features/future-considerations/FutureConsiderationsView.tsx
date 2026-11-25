'use client';

import React, { useMemo } from 'react';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function FutureConsiderationsView() {
  const { locale } = useAppLocale();
  const counts = useMemo(() => getReferenceCounts(), []);
  const isAr = locale === 'ar';

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
            label={
              isAr
                ? 'الاعتبارات المعمارية المستقبلية (ضمن اللقطة المرجعية السابقة)'
                : 'Future Architecture Considerations (Prior Reference Snapshot)'
            }
            value={counts.futureArchitectureConsiderations}
            note={
              isAr
                ? 'لا تُعد هذه البنود قرارات معتمدة؛ ستُعرض قائمتها الموثقة في مهمة لاحقة.'
                : 'These items are not approved decisions; verified records will be populated in a later task.'
            }
          />
        </div>
      }
    />
  );
}
