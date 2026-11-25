'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations();

  return (
    <PageContainer>
      <EmptyState
        title={t('states.notFoundTitle')}
        description={t('states.notFoundDescription')}
        icon={<FileQuestion className="h-4 w-4" aria-hidden="true" />}
        action={
          <Link href="/">
            <Button variant="primary" size="sm">
              {t('controls.backToDashboard')}
            </Button>
          </Link>
        }
      />
    </PageContainer>
  );
}
