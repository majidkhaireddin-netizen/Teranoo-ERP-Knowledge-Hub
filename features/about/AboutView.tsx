'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  resolveLocalizedText,
  type ContentClassificationType,
} from '@/content/models/types';
import { getSnapshotProvenance } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentationArticle } from '@/components/documentation/DocumentationArticle';
import { DocumentationSection } from '@/components/documentation/DocumentationSection';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { MetadataPanel } from '@/components/documentation/MetadataPanel';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';

const CLASSIFICATIONS: readonly ContentClassificationType[] = [
  'official',
  'research',
  'independent',
  'future',
];

export function AboutView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <ContentClassification
            classification="official"
            label={t('classification.official.shortLabel')}
          />
        }
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        meta={
          <>
            <span className="font-mono bidi-ltr">TASK-001</span>
            <span aria-hidden="true">·</span>
            <span>{t('app.subtitleEn')}</span>
          </>
        }
      />

      <DocumentationArticle>
        <DocumentationSection id="purpose" title={t('about.purposeTitle')}>
          <p className="text-text-secondary">{t('about.purposeBody')}</p>
          <ComparisonTable
            caption={t('about.purposeTitle')}
            headers={[t('about.purposeHeaders.is'), t('about.purposeHeaders.isNot')]}
            rows={[
              [t('about.purposeRows.r1Is'), t('about.purposeRows.r1IsNot')],
              [t('about.purposeRows.r2Is'), t('about.purposeRows.r2IsNot')],
              [t('about.purposeRows.r3Is'), t('about.purposeRows.r3IsNot')],
            ]}
          />
        </DocumentationSection>

        <DocumentationSection
          id="classifications"
          title={t('about.classificationTitle')}
        >
          <p className="text-text-secondary">{t('about.classificationBody')}</p>
          <div className="space-y-3">
            {CLASSIFICATIONS.map((classification) => (
              <ContentClassification
                key={classification}
                variant="banner"
                classification={classification}
                label={t(`classification.${classification}.label`)}
                description={t(`classification.${classification}.description`)}
              />
            ))}
          </div>
        </DocumentationSection>

        <DocumentationSection
          id="public-knowledge-direction"
          title={t('about.publicAccessTitle')}
        >
          <InformationCallout title={t('about.publicAccessCalloutTitle')}>
            {t('about.publicAccessBody')}
          </InformationCallout>
          <ul className="list-disc ps-5 space-y-2 text-sm text-text-secondary">
            <li>{t('about.publicAccessGuardrails.authorization')}</li>
            <li>{t('about.publicAccessGuardrails.noSecrets')}</li>
            <li>{t('about.publicAccessGuardrails.attribution')}</li>
            <li>{t('about.publicAccessGuardrails.separation')}</li>
          </ul>
        </DocumentationSection>

        <DocumentationSection id="provenance" title={t('provenance.title')}>
          <MetadataPanel
            title={t('provenance.title')}
            entries={[
              {
                label: t('provenance.sourceRepository'),
                value: (
                  <code className="font-mono text-xs bidi-ltr break-all">
                    {provenance.sourceRepository}
                  </code>
                ),
              },
              {
                label: t('provenance.officialSources'),
                value: (
                  <div className="space-y-1">
                    {provenance.officialSources.map((src) => (
                      <code
                        key={src}
                        className="block font-mono text-xs bidi-ltr break-all"
                      >
                        {src}
                      </code>
                    ))}
                  </div>
                ),
              },
              {
                label: t('provenance.reviewedTreeSha'),
                value: (
                  <code className="font-mono text-xs bidi-ltr break-all">
                    {provenance.reviewedTreeSha}
                  </code>
                ),
              },
              {
                label: t('provenance.referenceReviewDate'),
                value: (
                  <div className="space-y-0.5">
                    <code className="font-mono text-xs bidi-ltr">
                      {provenance.referenceReviewDate}
                    </code>
                    <p className="text-xs text-text-secondary">
                      {resolveLocalizedText(provenance.reviewDateNote, locale)}
                    </p>
                  </div>
                ),
              },
              {
                label: t('provenance.snapshotMode'),
                value: resolveLocalizedText(
                  provenance.snapshotNatureNote,
                  locale
                ),
              },
              {
                label: t('provenance.metricsOrigin'),
                value: resolveLocalizedText(
                  provenance.metricsOriginNote,
                  locale
                ),
              },
            ]}
          />
        </DocumentationSection>
      </DocumentationArticle>
    </PageContainer>
  );
}
