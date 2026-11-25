'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import {
  derivePhase5Progress,
  getCoreBusinessModules,
  getPhase5Capabilities,
  getProjectIdentity,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { DiagramContainer } from '@/components/visualization/DiagramContainer';
import { ArchitectureGroup } from '@/components/visualization/ArchitectureGroup';
import { ArchitectureNode } from '@/components/visualization/ArchitectureNode';
import { ContentClassification } from '@/components/documentation/ContentClassification';

export function ArchitectureOverviewDiagram() {
  const t = useTranslations();
  const { locale } = useAppLocale();

  const identity = useMemo(() => getProjectIdentity(), []);
  const modules = useMemo(() => getCoreBusinessModules(), []);
  const capabilities = useMemo(() => getPhase5Capabilities(), []);
  const phase5Progress = useMemo(
    () => derivePhase5Progress(capabilities),
    [capabilities]
  );

  const approvedCapabilities = capabilities.filter(
    (c) => c.status === 'approved'
  );
  const pendingCapabilities = capabilities.filter(
    (c) => c.status === 'pending'
  );

  const isAr = locale === 'ar';

  return (
    <DiagramContainer
      title={
        isAr
          ? 'مخطط الطبقات المعمارية — Teranoo ERP'
          : 'Teranoo ERP — Layered Architecture Blueprint'
      }
      caption={t('dashboard.architectureOverview.diagramCaption')}
      classificationSlot={
        <ContentClassification
          classification="official"
          label={t('classification.official.shortLabel')}
        />
      }
    >
      <div className="space-y-4">
        {/* Layer 1: Four Business Core Modules */}
        <ArchitectureGroup
          tone="business"
          title={t('dashboard.architectureOverview.businessLayerTitle')}
          meta={t('dashboard.architectureOverview.businessLayerMeta')}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => (
              <ArchitectureNode
                key={mod.id}
                tone="primary"
                code={mod.code}
                title={resolveLocalizedText(mod.name, locale)}
                subtitle={isAr ? mod.name.en : undefined}
              />
            ))}
          </div>
        </ArchitectureGroup>

        {/* Structural Connector Indicator */}
        <div
          className="flex items-center justify-center gap-3 text-[11px] font-medium text-text-muted"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-border" />
          <span>
            {isAr
              ? 'العقود المشتركة وخدمات المنصة'
              : 'Shared Contracts & Platform Services'}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Layer 2: Shared Platform Foundation */}
        <ArchitectureGroup
          tone="platform"
          title={t('dashboard.architectureOverview.platformLayerTitle')}
          meta={t('dashboard.architectureOverview.platformLayerMeta', {
            completed: phase5Progress.completedCount,
            pending: phase5Progress.pendingCount,
          })}
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {approvedCapabilities.map((cap) => (
              <ArchitectureNode
                key={cap.id}
                tone="approved"
                code={cap.decisionId ?? undefined}
                title={resolveLocalizedText(cap.name, locale)}
                subtitle={
                  isAr
                    ? `${cap.name.en} · ${t('status.approved')}`
                    : t('status.approved')
                }
              />
            ))}
            {pendingCapabilities.map((cap) => (
              <ArchitectureNode
                key={cap.id}
                tone="pending"
                code={`P5-${String(cap.itemNumber).padStart(2, '0')}`}
                title={resolveLocalizedText(cap.name, locale)}
                subtitle={
                  isAr
                    ? `${cap.name.en} · ${t('status.pending')}`
                    : t('status.pending')
                }
              />
            ))}
          </div>
        </ArchitectureGroup>

        {/* Layer 3: Deployment & Database Foundation */}
        <ArchitectureGroup
          tone="infrastructure"
          title={t('dashboard.architectureOverview.infrastructureLayerTitle')}
          meta={t('dashboard.architectureOverview.infrastructureLayerMeta')}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ArchitectureNode
              tone="infrastructure"
              title={resolveLocalizedText(identity.deploymentStrategy, locale)}
              subtitle={t('dashboard.identityStrip.deployment')}
            />
            <ArchitectureNode
              tone="infrastructure"
              title={resolveLocalizedText(
                identity.futureDeploymentProfile,
                locale
              )}
              subtitle={t('dashboard.identityStrip.futureProfile')}
            />
            <ArchitectureNode
              tone="infrastructure"
              title={identity.databaseEngine}
              subtitle={t('dashboard.identityStrip.database')}
            />
          </div>
        </ArchitectureGroup>
      </div>
    </DiagramContainer>
  );
}
