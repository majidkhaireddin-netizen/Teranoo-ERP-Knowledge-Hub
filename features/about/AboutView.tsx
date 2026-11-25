'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { ContentClassificationType } from '@/content/models/types';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentationArticle } from '@/components/documentation/DocumentationArticle';
import { DocumentationSection } from '@/components/documentation/DocumentationSection';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { WarningCallout } from '@/components/documentation/WarningCallout';
import { ComparisonTable } from '@/components/documentation/ComparisonTable';
import { useAppLocale } from '@/providers/LocaleProvider';

const CLASSIFICATIONS: readonly ContentClassificationType[] = [
  'official',
  'research',
  'independent',
  'future',
];

export function AboutView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const isAr = locale === 'ar';

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
            headers={
              isAr
                ? ['ما تمثله المنصة', 'ما لا تمثله المنصة']
                : ['What This Platform Is', 'What This Platform Is Not']
            }
            rows={[
              [
                isAr
                  ? 'مرجع توثيقي ومعماري منظم لمشروع Teranoo ERP'
                  : 'Structured documentation and architecture hub for Teranoo ERP',
                isAr
                  ? 'ليس نظام ERP تشغيليًا'
                  : 'Not an operational ERP system',
              ],
              [
                isAr
                  ? 'بيئة تحليلية لمتابعة القرارات والأبحاث والمراجعات المستقلة'
                  : 'Analytical workspace for decisions, research, and independent reviews',
                isAr ? 'ليس موقعًا تسويقيًا' : 'Not a marketing website',
              ],
              [
                isAr
                  ? 'أساس برمجي معياري قابل للتوسع عبر مهام محكومة'
                  : 'Modular enterprise foundation built incrementally via governed tasks',
                isAr
                  ? 'ليس مجرد عارض لملفات Markdown أو نموذجًا مؤقتًا'
                  : 'Not a plain Markdown viewer or disposable prototype',
              ],
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

        <DocumentationSection id="security" title={t('about.securityTitle')}>
          <WarningCallout title={t('about.securityTitle')}>
            {t('about.securityBody')}
          </WarningCallout>
        </DocumentationSection>
      </DocumentationArticle>
    </PageContainer>
  );
}
