'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ALL_NAV_ITEMS } from '@/config/navigation';
import {
  resolveLocalizedText,
  type ContentClassificationType,
} from '@/content/models/types';
import {
  deriveDashboardMetrics,
  getProjectIdentity,
  getReferenceCounts,
  getSnapshotProvenance,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { MetadataPanel } from '@/components/documentation/MetadataPanel';
import { MetricCard } from '@/components/visualization/MetricCard';
import { Phase5CapabilitiesSection } from '@/features/platform/Phase5CapabilitiesSection';
import { ArchitectureOverviewDiagram } from '@/features/architecture/ArchitectureOverviewDiagram';

const QUICK_NAV_IDS = [
  'product-vision',
  'roadmap',
  'architecture-overview',
  'decision-register',
  'research-center',
  'independent-reviews',
] as const;

export function DashboardView() {
  const t = useTranslations();
  const { locale } = useAppLocale();

  const identity = useMemo(() => getProjectIdentity(), []);
  const metrics = useMemo(() => deriveDashboardMetrics(), []);
  const counts = useMemo(() => getReferenceCounts(), []);
  const provenance = useMemo(() => getSnapshotProvenance(), []);

  const quickNavItems = useMemo(
    () =>
      QUICK_NAV_IDS.map((id) =>
        ALL_NAV_ITEMS.find((item) => item.id === id)
      ).filter((item): item is NonNullable<typeof item> => Boolean(item)),
    []
  );

  const snapshotLedger: readonly {
    key: string;
    href: string;
    title: string;
    note: string;
    count: number;
    classification: ContentClassificationType;
  }[] = [
    {
      key: 'decisions',
      href: '/decisions',
      title: t('dashboard.snapshotLedger.items.decisions'),
      note: t('dashboard.snapshotLedger.notes.decisions'),
      count: counts.approvedArchitecturalDecisions,
      classification: 'official',
    },
    {
      key: 'research',
      href: '/research',
      title: t('dashboard.snapshotLedger.items.research'),
      note: t('dashboard.snapshotLedger.notes.research'),
      count: counts.architecturalResearchPackages,
      classification: 'research',
    },
    {
      key: 'reviews',
      href: '/independent-reviews',
      title: t('dashboard.snapshotLedger.items.reviews'),
      note: t('dashboard.snapshotLedger.notes.reviews'),
      count: counts.independentReviewNotes,
      classification: 'independent',
    },
    {
      key: 'future',
      href: '/future-considerations',
      title: t('dashboard.snapshotLedger.items.future'),
      note: t('dashboard.snapshotLedger.notes.future'),
      count: counts.futureArchitectureConsiderations,
      classification: 'future',
    },
  ];

  return (
    <PageContainer>
      {/* 1. Project Overview Band */}
      <PageHeader
        kicker={
          <>
            <ContentClassification
              classification="official"
              label={t('classification.official.shortLabel')}
            />
            <span aria-hidden="true" className="text-text-muted">·</span>
            <StatusIndicator
              status="in_progress"
              label={t('app.currentPhaseBadge')}
            />
          </>
        }
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        meta={
          <>
            <span className="font-medium text-text-primary">
              {identity.productName}
            </span>
            <span aria-hidden="true">·</span>
            <span>{resolveLocalizedText(identity.productType, locale)}</span>
            <span aria-hidden="true">·</span>
            <span className="bidi-ltr font-mono">
              {resolveLocalizedText(identity.deploymentStrategy, locale)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="bidi-ltr font-mono">{identity.databaseEngine}</span>
          </>
        }
      />

      {/* Explicit Planning vs Implementation Integrity Notice */}
      <InformationCallout title={t('dashboard.snapshotBanner')}>
        {t('app.planningProgressNotice')}
      </InformationCallout>

      {/* 2. Key Metrics Strip (Single Structural Container with Equal 1px Hairlines) */}
      <section aria-label={t('dashboard.title')}>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={t('dashboard.metrics.approvedDecisions')}
            value={metrics.approvedDecisionsCount}
            note={t('dashboard.metrics.approvedDecisionsNote')}
            emphasis="primary"
            className="bg-surface"
          />
          <MetricCard
            label={t('dashboard.metrics.completedPhases')}
            value={metrics.completedPhasesCount}
            suffix={`/ ${metrics.totalPhasesCount}`}
            note={t('dashboard.metrics.completedPhasesNote')}
            className="bg-surface"
          />
          <MetricCard
            label={t('dashboard.metrics.coreModules')}
            value={metrics.coreModulesCount}
            note={t('dashboard.metrics.coreModulesNote')}
            className="bg-surface"
          />
          <MetricCard
            label={t('dashboard.metrics.currentPhaseProgress')}
            value={`${metrics.phase5.completionPercentage}%`}
            suffix={`(${metrics.phase5.completedCount}/${metrics.phase5.totalCount})`}
            note={t('dashboard.metrics.currentPhaseProgressNote', {
              completed: metrics.phase5.completedCount,
              total: metrics.phase5.totalCount,
            })}
            emphasis="accent"
            className="bg-surface"
          />
        </div>
      </section>

      {/* 3. Current Phase (Phase 5 — Shared Platform Capabilities) */}
      <Phase5CapabilitiesSection showHeader />

      {/* 4. Layered Architecture Overview Diagram */}
      <section className="space-y-4">
        <SectionHeader
          title={t('dashboard.architectureOverview.sectionTitle')}
          subtitle={t('dashboard.architectureOverview.sectionSubtitle')}
        />
        <ArchitectureOverviewDiagram />
      </section>

      {/* 5. Knowledge Navigation + Reference Snapshot Ledger */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Knowledge Navigation */}
        <div className="lg:col-span-7 space-y-4">
          <SectionHeader
            title={t('dashboard.knowledgeNavigation.sectionTitle')}
            subtitle={t('dashboard.knowledgeNavigation.sectionSubtitle')}
          />
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {quickNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-start justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover/70"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {resolveLocalizedText(item.label, locale)}
                    </span>
                    <ContentClassification
                      classification={item.classification}
                      label={t(
                        `classification.${item.classification}.shortLabel`
                      )}
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {resolveLocalizedText(item.description, locale)}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Reference Snapshot Ledger by Content Classification */}
        <div className="lg:col-span-5 space-y-4">
          <SectionHeader
            title={t('dashboard.snapshotLedger.sectionTitle')}
            subtitle={t('dashboard.snapshotLedger.sectionSubtitle')}
          />
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {snapshotLedger.map((entry) => (
              <Link
                key={entry.key}
                href={entry.href}
                className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover/70"
              >
                <div className="space-y-1 min-w-0">
                  <ContentClassification
                    classification={entry.classification}
                    label={t(
                      `classification.${entry.classification}.shortLabel`
                    )}
                  />
                  <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                    {entry.title}
                  </p>
                  <p className="text-xs text-text-secondary">{entry.note}</p>
                </div>
                <span className="font-mono text-xl font-semibold text-text-primary tabular-nums shrink-0">
                  {entry.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* 6. Reference Snapshot Provenance */}
      <section aria-label={t('provenance.title')}>
        <MetadataPanel
          title={t('provenance.title')}
          entries={[
            {
              label: t('provenance.sourceRepository'),
              value: (
                <code className="font-mono text-xs bidi-ltr break-all">
                  {provenance.sourceRepository}
                </code>
              ),
            },
            {
              label: t('provenance.reviewedTreeSha'),
              value: (
                <code className="font-mono text-xs bidi-ltr break-all">
                  {provenance.reviewedTreeSha}
                </code>
              ),
            },
            {
              label: t('provenance.referenceReviewDate'),
              value: (
                <div className="space-y-0.5">
                  <code className="font-mono text-xs bidi-ltr">
                    {provenance.referenceReviewDate}
                  </code>
                  <p className="text-xs text-text-secondary">
                    {resolveLocalizedText(provenance.reviewDateNote, locale)}
                  </p>
                </div>
              ),
            },
            {
              label: t('provenance.snapshotMode'),
              value: (
                <div className="space-y-0.5">
                  <span>{t('provenance.staticSnapshotValue')}</span>
                  <p className="text-xs text-text-secondary">
                    {resolveLocalizedText(provenance.metricsOriginNote, locale)}
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>
    </PageContainer>
  );
}
