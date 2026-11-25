import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingState } from '@/components/ui/LoadingState';

export default function Loading() {
  return (
    <PageContainer>
      <LoadingState rows={6} />
    </PageContainer>
  );
}
