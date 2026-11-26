'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentationArticle } from '@/components/documentation/DocumentationArticle';
import { DocumentationSection } from '@/components/documentation/DocumentationSection';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';

export function EngineeringJournalView() {
  const t = useTranslations();

  const anatomyKeys = [
    'objective',
    'actualDate',
    'workItem',
    'problemRootCause',
    'solution',
    'commits',
    'testing',
    'lessons',
  ] as const;

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <ContentClassification
            classification="engineering"
            label={t('classification.engineering.label')}
          />
        }
        title={t('engineeringJournal.title')}
        subtitle={t('engineeringJournal.subtitle')}
      />

      <DocumentationArticle>
        <InformationCallout title={t('engineeringJournal.emptyStatusTitle')}>
          {t('engineeringJournal.emptyStatusBody')}
        </InformationCallout>

        <DocumentationSection
          id="project-distinction"
          title={t('engineeringJournal.distinctionTitle')}
        >
          <p className="text-text-secondary">
            {t('engineeringJournal.distinctionBody')}
          </p>
          <ComparisonTable
            caption={t('engineeringJournal.distinctionTitle')}
            headers={[
              t('engineeringJournal.distinctionHeaders.dimension'),
              t('engineeringJournal.distinctionHeaders.erpProduct'),
              t('engineeringJournal.distinctionHeaders.knowledgeHub'),
            ]}
            rows={[
              [
                t('engineeringJournal.distinctionRows.r1Dim'),
                t('engineeringJournal.distinctionRows.r1Erp'),
                t('engineeringJournal.distinctionRows.r1Hub'),
              ],
              [
                t('engineeringJournal.distinctionRows.r2Dim'),
                t('engineeringJournal.distinctionRows.r2Erp'),
                t('engineeringJournal.distinctionRows.r2Hub'),
              ],
              [
                t('engineeringJournal.distinctionRows.r3Dim'),
                t('engineeringJournal.distinctionRows.r3Erp'),
                t('engineeringJournal.distinctionRows.r3Hub'),
              ],
            ]}
          />
        </DocumentationSection>

        <DocumentationSection
          id="entry-anatomy"
          title={t('engineeringJournal.anatomyTitle')}
        >
          <p className="text-text-secondary">
            {t('engineeringJournal.anatomyBody')}
          </p>
          <ol className="list-decimal ps-5 space-y-2 text-sm text-text-secondary">
            {anatomyKeys.map((key) => (
              <li key={key}>{t(`engineeringJournal.anatomyItems.${key}`)}</li>
            ))}
          </ol>
        </DocumentationSection>
      </DocumentationArticle>
    </PageContainer>
  );
}
