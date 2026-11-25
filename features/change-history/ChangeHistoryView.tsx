'use client';

import React from 'react';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';

export function ChangeHistoryView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-CHANGELOG"
      classification="official"
      title={{ ar: 'سجل التحديثات وتطور المشروع', en: 'Change History & Project Evolution' }}
      description={{
        ar: 'السجل الزمني الموثّق لتطور قرارات ووثائق ومراحل مشروع Teranoo ERP. لن تُدرج أي تواريخ أو سجلات غير موثقة.',
        en: 'Verified chronological log of documentation and architectural evolution for Teranoo ERP. No unverified dates or records are fabricated.',
      }}
    />
  );
}
