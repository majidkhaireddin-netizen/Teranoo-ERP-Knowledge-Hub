'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/layout/PageContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <PageContainer>
      <ErrorState
        title={t('states.errorTitle')}
        description={t('states.errorDescription')}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={reset}>
              {t('controls.retry')}
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                {t('controls.backToDashboard')}
              </Button>
            </Link>
          </div>
        }
      />
    </PageContainer>
  );
}
