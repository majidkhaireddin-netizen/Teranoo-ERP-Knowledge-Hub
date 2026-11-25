'use client';

import React from 'react';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';

export function DependenciesView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-DEPENDENCIES"
      classification="official"
      title={{ ar: 'الاعتماديات والتكامل', en: 'Dependencies & Integration' }}
      description={{
        ar: 'خريطة الاعتماديات البينية بين الأنظمة التجارية الأساسية وعقود التكامل مع قدرات المنصة المشتركة.',
        en: 'Cross-module dependency map and integration contracts across core business modules and shared platform capabilities.',
      }}
    />
  );
}

export function PlatformTenancyView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-TENANCY"
      classification="official"
      title={{ ar: 'الهيكل المؤسسي والعملاء', en: 'Platform & Tenancy' }}
      description={{
        ar: 'معمارية تعدد العملاء (Multi-Tenancy)، العزل المؤسسي، والكيانات التنظيمية داخل Teranoo ERP.',
        en: 'Multi-tenancy architecture, enterprise isolation boundaries, and organizational modeling in Teranoo ERP.',
      }}
    />
  );
}
