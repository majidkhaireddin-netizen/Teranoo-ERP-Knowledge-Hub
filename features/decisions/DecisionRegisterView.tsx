'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getPhase5Capabilities, getReferenceCounts } from '@/content/repositories/projectRepository';
import { resolveLocalizedText } from '@/content/models/types';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { MetricCard } from '@/components/visualization/MetricCard';
import { DecisionReference } from '@/components/documentation/DecisionReference';

export function DecisionRegisterView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const counts = useMemo(() => getReferenceCounts(), []);
  const approvedPhase5 = useMemo(
    () => getPhase5Capabilities().filter((c) => c.decisionId !== null),
    []
  );

  return (
    <PlannedSectionView
      sectionCode="SEC-DECISIONS"
      classification="official"
      title={{ ar: 'سجل القرارات المعمارية', en: 'Architectural Decision Register' }}
      description={{
        ar: 'المرجع الرسمي للقرارات المعمارية والوظيفية المعتمدة في مشروع Teranoo ERP. سيُدرج السجل الكامل المفصّل للقرارات مع البحث والتصفية في مهمة لاحقة.',
        en: 'Official register of approved architectural and functional decisions for Teranoo ERP. The full searchable decision catalog will be ingested in a subsequent task.',
      }}
      verifiedAnchor={
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface">
            <MetricCard
              label={t('sections.decisions.metricLabel')}
              value={counts.approvedArchitecturalDecisions}
              emphasis="primary"
              note={t('sections.decisions.metricNote')}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {approvedPhase5.map((cap) =>
              cap.decisionId ? (
                <DecisionReference
                  key={cap.id}
                  decisionId={cap.decisionId}
                  title={resolveLocalizedText(cap.name, locale)}
                />
              ) : null
            )}
          </div>
        </div>
      }
    />
  );
}
