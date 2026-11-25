'use client';

import React from 'react';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { Phase5CapabilitiesSection } from '@/features/platform/Phase5CapabilitiesSection';

export function PlatformFoundationView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-PLATFORM"
      classification="official"
      title={{ ar: 'المنصة المشتركة', en: 'Shared Platform Foundation' }}
      description={{
        ar: 'قدرات المنصة المشتركة ضمن المرحلة الخامسة (13 قدرة معمارية: 7 معتمدة و6 قيد الاستكمال).',
        en: 'Phase 5 Shared Platform Capabilities (13 foundational capabilities: 7 approved, 6 pending).',
      }}
      verifiedAnchor={<Phase5CapabilitiesSection showHeader={false} />}
    />
  );
}
