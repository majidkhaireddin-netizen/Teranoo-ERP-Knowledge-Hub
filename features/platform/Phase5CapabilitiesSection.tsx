'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  resolveLocalizedText,
  type CapabilityStatus,
  type PlatformCapability,
} from '@/content/models/types';
import {
  derivePhase5Progress,
  filterPhase5Capabilities,
  getPhase5Capabilities,
} from '@/content/repositories/projectRepository';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { DecisionReference } from '@/components/documentation/DecisionReference';
import { PhaseProgress } from '@/components/visualization/PhaseProgress';

type CapabilityFilter = 'all' | CapabilityStatus;

export interface Phase5CapabilitiesSectionProps {
  showHeader?: boolean;
}

export function Phase5CapabilitiesSection({
  showHeader = true,
}: Phase5CapabilitiesSectionProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();
  const [filter, setFilter] = useState<CapabilityFilter>('all');

  const allCapabilities = useMemo(() => getPhase5Capabilities(), []);
  const progress = useMemo(
    () => derivePhase5Progress(allCapabilities),
    [allCapabilities]
  );
  const filteredCapabilities = useMemo(
    () => filterPhase5Capabilities(filter, allCapabilities),
    [filter, allCapabilities]
  );

  const columns: readonly DataTableColumn<PlatformCapability>[] = [
    {
      key: 'index',
      header: t('dashboard.currentPhase.columns.index'),
      widthClass: 'w-14',
      render: (row) => (
        <span className="font-mono text-xs text-text-muted tabular-nums">
          {String(row.itemNumber).padStart(2, '0')}
        </span>
      ),
    },
    {
      key: 'capability',
      header: t('dashboard.currentPhase.columns.capability'),
      render: (row) => (
        <div className="flex flex-col items-start gap-0.5">
          <span className="font-medium text-text-primary">
            {resolveLocalizedText(row.name, locale)}
          </span>
          {locale === 'ar' ? (
            <span className="text-xs text-text-muted bidi-ltr">
              {row.name.en}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('dashboard.currentPhase.columns.status'),
      widthClass: 'w-40',
      render: (row) => (
        <StatusIndicator
          status={row.status}
          label={t(`status.${row.status}`)}
        />
      ),
    },
    {
      key: 'decision',
      header: t('dashboard.currentPhase.columns.decision'),
      align: 'end',
      widthClass: 'w-36',
      render: (row) =>
        row.decisionId ? (
          <DecisionReference decisionId={row.decisionId} href="/decisions" />
        ) : (
          <span className="font-mono text-xs text-text-muted">
            {t('dashboard.currentPhase.noDecision')}
          </span>
        ),
    },
  ];

  return (
    <section className="space-y-4">
      {showHeader ? (
        <SectionHeader
          title={t('dashboard.currentPhase.sectionTitle')}
          subtitle={t('dashboard.currentPhase.sectionSubtitle')}
          actions={
            <Tabs<CapabilityFilter>
              ariaLabel={t('controls.filterByStatus')}
              value={filter}
              onChange={setFilter}
              options={[
                {
                  value: 'all',
                  label: t('dashboard.currentPhase.filterAll', {
                    count: progress.totalCount,
                  }),
                },
                {
                  value: 'approved',
                  label: t('dashboard.currentPhase.filterApproved', {
                    count: progress.completedCount,
                  }),
                },
                {
                  value: 'pending',
                  label: t('dashboard.currentPhase.filterPending', {
                    count: progress.pendingCount,
                  }),
                },
              ]}
            />
          }
        />
      ) : (
        <div className="flex justify-end">
          <Tabs<CapabilityFilter>
            ariaLabel={t('controls.filterByStatus')}
            value={filter}
            onChange={setFilter}
            options={[
              {
                value: 'all',
                label: t('dashboard.currentPhase.filterAll', {
                  count: progress.totalCount,
                }),
              },
              {
                value: 'approved',
                label: t('dashboard.currentPhase.filterApproved', {
                  count: progress.completedCount,
                }),
              },
              {
                value: 'pending',
                label: t('dashboard.currentPhase.filterPending', {
                  count: progress.pendingCount,
                }),
              },
            ]}
          />
        </div>
      )}

      <PhaseProgress
        title={t('dashboard.currentPhase.progressLabel')}
        completed={progress.completedCount}
        total={progress.totalCount}
        percentage={progress.completionPercentage}
        progressLabel={t('dashboard.currentPhase.progressLabel')}
        summaryText={t('app.planningProgressNotice')}
      />

      <DataTable
        columns={columns}
        rows={filteredCapabilities}
        getRowKey={(row) => row.id}
        caption={t('dashboard.currentPhase.sectionTitle')}
      />
    </section>
  );
}
