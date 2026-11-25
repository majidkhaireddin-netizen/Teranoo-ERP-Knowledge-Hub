'use client';

import React from 'react';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { ArchitectureOverviewDiagram } from '@/features/architecture/ArchitectureOverviewDiagram';

export function ArchitectureOverviewView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-ARCH-OVERVIEW"
      classification="official"
      title={{ ar: 'المعمارية العامة', en: 'Architecture Overview' }}
      description={{
        ar: 'المنظور المعماري العام لمنتج Teranoo ERP وتموضع الأنظمة التجارية الأساسية فوق طبقة المنصة المشتركة.',
        en: 'High-level architectural view of Teranoo ERP positioning core business modules over the Shared Platform Foundation.',
      }}
      verifiedAnchor={<ArchitectureOverviewDiagram />}
    />
  );
}
