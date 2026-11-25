'use client';

import React, { useMemo } from 'react';
import { resolveLocalizedText } from '@/content/models/types';
import { getProjectIdentity } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';

export function DeploymentDatabaseView() {
  const { locale } = useAppLocale();
  const identity = useMemo(() => getProjectIdentity(), []);
  const isAr = locale === 'ar';

  return (
    <PlannedSectionView
      sectionCode="SEC-DEPLOYMENT"
      classification="official"
      title={{ ar: 'الاستضافة وقواعد البيانات', en: 'Deployment & Database' }}
      description={{
        ar: 'استراتيجية الاستضافة المعتمدة، الملف التشغيلي المستقبلي، ومحرك قاعدة البيانات لمنتج Teranoo ERP.',
        en: 'Authorized deployment strategy, future deployment profile, and database engine for Teranoo ERP.',
      }}
      verifiedAnchor={
        <ComparisonTable
          headers={
            isAr
              ? ['البُعد', 'القيمة المرجعية المعتمدة']
              : ['Dimension', 'Authorized Reference Value']
          }
          rows={[
            [
              isAr ? 'استراتيجية الاستضافة' : 'Deployment Strategy',
              <code key="d" className="font-mono text-xs bidi-ltr text-text-primary">
                {resolveLocalizedText(identity.deploymentStrategy, locale)}
              </code>,
            ],
            [
              isAr ? 'الملف المستقبلي للاستضافة' : 'Future Deployment Profile',
              <code key="f" className="font-mono text-xs bidi-ltr text-text-primary">
                {resolveLocalizedText(identity.futureDeploymentProfile, locale)}
              </code>,
            ],
            [
              isAr ? 'محرك قاعدة البيانات' : 'Database Engine',
              <code key="db" className="font-mono text-xs bidi-ltr text-text-primary">
                {identity.databaseEngine}
              </code>,
            ],
          ]}
        />
      }
    />
  );
}
