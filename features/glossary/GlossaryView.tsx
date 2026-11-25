'use client';

import React from 'react';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';

export function GlossaryView() {
  return (
    <PlannedSectionView
      sectionCode="SEC-GLOSSARY"
      classification="official"
      title={{ ar: 'قاموس المصطلحات', en: 'Architecture & Domain Glossary' }}
      description={{
        ar: 'التعريفات الموحدة للمصطلحات المعمارية والوظيفية والتقنية المعتمدة في وثائق مشروع Teranoo ERP.',
        en: 'Standardized definitions of architectural, functional, and technical terminology used across Teranoo ERP documentation.',
      }}
    />
  );
}
