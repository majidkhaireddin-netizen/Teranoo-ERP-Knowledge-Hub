'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import { getProjectIdentity } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';

export function DeploymentDatabaseView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const identity = useMemo(() => getProjectIdentity(), []);

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
          headers={[
            t('sections.deployment.headers.dimension'),
            t('sections.deployment.headers.value'),
          ]}
          rows={[
            [
              t('dashboard.identityStrip.deployment'),
              <code key="d" className="font-mono text-xs bidi-ltr text-text-primary">
                {resolveLocalizedText(identity.deploymentStrategy, locale)}
              </code>,
            ],
            [
              t('dashboard.identityStrip.futureProfile'),
              <code key="f" className="font-mono text-xs bidi-ltr text-text-primary">
                {resolveLocalizedText(identity.futureDeploymentProfile, locale)}
              </code>,
            ],
            [
              t('dashboard.identityStrip.database'),
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
