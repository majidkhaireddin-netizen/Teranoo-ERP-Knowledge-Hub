'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';

export default function KnowledgeDocumentNotFound() {
  const t = useTranslations();

  return (
    <PageContainer>
      <EmptyState
        title={t('knowledge.reader.notFoundTitle')}
        description={t('knowledge.reader.notFoundDescription')}
        icon={<FileQuestion className="h-5 w-5" aria-hidden="true" />}
        action={
          <Link
            href="/knowledge"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-3.5 py-2 text-xs font-medium text-text-primary hover:bg-surface-hover transition-colors"
          >
            {t('knowledge.backToLibrary')}
          </Link>
        }
      />
    </PageContainer>
  );
}
