'use client';

import React, { useMemo } from 'react';
import { getReferenceCounts } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';

export function ResearchCenterView() {
  const { locale } = useAppLocale();
  const counts = useMemo(() => getReferenceCounts(), []);
  const isAr = locale === 'ar';

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
            label={
              isAr
                ? 'حزم الأبحاث المعمارية (اللقطة المرجعية)'
                : 'Architectural Research Packages (Reference Snapshot)'
            }
            value={counts.architecturalResearchPackages}
            note={
              isAr
                ? 'ستُضاف تفاصيل الحزم البحثية ومصادرها ونتائجها المعتمدة في مهمة لاحقة.'
                : 'Individual research packages, citations, and verified findings will be added in a subsequent task.'
            }
          />
        </div>
      }
    />
  );
}
