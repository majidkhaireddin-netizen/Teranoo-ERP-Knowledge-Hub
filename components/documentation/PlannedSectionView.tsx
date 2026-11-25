'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderClock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ContentClassificationType, LocalizedText } from '@/content/models/types';
import { resolveLocalizedText } from '@/content/models/types';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Button } from '@/components/ui/Button';

export interface PlannedSectionViewProps {
  sectionCode: string;
  title: LocalizedText;
  description: LocalizedText;
  classification: ContentClassificationType;
  verifiedAnchor?: React.ReactNode;
}

export function PlannedSectionView({
  sectionCode,
  title,
  description,
  classification,
  verifiedAnchor,
}: PlannedSectionViewProps) {
  const t = useTranslations();
  const { locale, direction } = useAppLocale();
  const BackArrow = direction === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <PageContainer>
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification={classification}
              label={t(`classification.${classification}.label`)}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <StatusIndicator status="planned" label={t('status.planned')} />
          </>
        }
        title={resolveLocalizedText(title, locale)}
        subtitle={resolveLocalizedText(description, locale)}
        meta={
          <>
            <code className="font-mono bidi-ltr text-text-secondary">
              {sectionCode}
            </code>
            <span aria-hidden="true">·</span>
            <span>{t('documentation.plannedNextTaskNote')}</span>
          </>
        }
      />

      <ContentClassification
        variant="banner"
        classification={classification}
        label={t(`classification.${classification}.label`)}
        description={t(`classification.${classification}.description`)}
      />

      {verifiedAnchor ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">
            {t('documentation.plannedAnchorTitle')}
          </h2>
          {verifiedAnchor}
        </section>
      ) : null}

      <EmptyState
        title={t('documentation.plannedBannerTitle')}
        description={t('documentation.plannedBannerDescription')}
        icon={<FolderClock className="h-4 w-4" aria-hidden="true" />}
        action={
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<BackArrow className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              {t('controls.backToDashboard')}
            </Button>
          </Link>
        }
      />
    </PageContainer>
  );
}
