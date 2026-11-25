'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import {
  deriveRuntimeCapabilitiesSummary,
  getCoreBusinessModules,
  getProjectIdentity,
  getRuntimePlatformCapabilities,
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
  const runtimeCapabilities = useMemo(() => getRuntimePlatformCapabilities(), []);
  const runtimeSummary = useMemo(
    () => deriveRuntimeCapabilitiesSummary(runtimeCapabilities),
    [runtimeCapabilities]
  );

  const approvedCapabilities = runtimeCapabilities.filter(
    (c) => c.status === 'approved'
  );
  const pendingCapabilities = runtimeCapabilities.filter(
    (c) => c.status === 'pending'
  );

  const isAr = locale === 'ar';

  return (
    <DiagramContainer
      title={t('dashboard.architectureOverview.diagramTitle')}
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
          <span>{t('dashboard.architectureOverview.sharedContractsLabel')}</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Layer 2: Shared Platform Runtime Capabilities (12 capabilities; excludes Phase 5 planning gate #13) */}
        <ArchitectureGroup
          tone="platform"
          title={t('dashboard.architectureOverview.platformLayerTitle')}
          meta={t('dashboard.architectureOverview.platformLayerMeta', {
            approved: runtimeSummary.approvedCount,
            pending: runtimeSummary.pendingCount,
            total: runtimeSummary.totalCount,
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
