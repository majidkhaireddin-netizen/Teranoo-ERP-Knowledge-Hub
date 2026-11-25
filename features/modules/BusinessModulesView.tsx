'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import { getCoreBusinessModules } from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PlannedSectionView } from '@/components/documentation/PlannedSectionView';
import { ArchitectureNode } from '@/components/visualization/ArchitectureNode';

export function BusinessModulesView() {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const modules = useMemo(() => getCoreBusinessModules(), []);

  return (
    <PlannedSectionView
      sectionCode="SEC-MODULES"
      classification="official"
      title={{ ar: 'الأنظمة الفرعية الأساسية', en: 'Business Core Modules' }}
      description={{
        ar: 'الأنظمة التجارية الأساسية الأربعة المعتمدة ضمن نطاق منتج Teranoo ERP. ستُضاف التوثيقات الوظيفية والمعمارية التفصيلية لكل نظام في مهام لاحقة.',
        en: 'The four core business modules defined in the Teranoo ERP product scope. Detailed functional and architectural specifications will be added in subsequent tasks.',
      }}
      verifiedAnchor={
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modules.map((mod) => (
            <ArchitectureNode
              key={mod.id}
              tone="primary"
              title={resolveLocalizedText(mod.name, locale)}
              subtitle={t('sections.modules.cardSubtitle', { order: mod.order })}
            />
          ))}
        </div>
      }
    />
  );
}
