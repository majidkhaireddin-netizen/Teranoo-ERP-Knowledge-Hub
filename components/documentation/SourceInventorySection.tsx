'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { resolveLocalizedText } from '@/content/models/types';
import type {
  SourceManifestEntry,
  SourceManifestSummary,
} from '@/content/models/knowledge';
import { useAppLocale } from '@/providers/LocaleProvider';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { InformationCallout } from '@/components/documentation/InformationCallout';
import { ContentClassification } from '@/components/documentation/ContentClassification';

export interface SourceInventorySectionProps {
  readonly entries: readonly SourceManifestEntry[];
  readonly summary: SourceManifestSummary;
}

export function SourceInventorySection({
  entries,
  summary,
}: SourceInventorySectionProps) {
  const t = useTranslations();
  const { locale } = useAppLocale();

  return (
    <section
      aria-label={t('foundations.sourceManifest.sectionTitle')}
      className="space-y-4 pt-2"
    >
      <SectionHeader
        title={t('foundations.sourceManifest.sectionTitle')}
        subtitle={t('foundations.sourceManifest.sectionSubtitle')}
      />

      <InformationCallout
        title={t('foundations.sourceManifest.boundaryNoticeTitle')}
      >
        <p>{t('foundations.sourceManifest.boundaryNoticeBody')}</p>
        <p className="mt-1.5 font-mono text-[11px] text-text-muted">
          {t('foundations.sourceManifest.summaryStrip', {
            total: summary.totalSources,
            received: summary.sourceReceivedCount,
            imported: summary.importedCount,
            published: summary.publishedCount,
            awaiting: summary.awaitingSourceCount + summary.expectedCount,
          })}
        </p>
      </InformationCallout>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-text-primary">
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {t('foundations.sourceManifest.headers.document')}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold">
                {t('foundations.sourceManifest.headers.sourcePath')}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                {t('foundations.sourceManifest.headers.phase')}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                {t('foundations.sourceManifest.headers.importStatus')}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                {t('foundations.sourceManifest.headers.authorization')}
              </th>
              <th className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                {t('foundations.sourceManifest.headers.completeness')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => (
              <tr
                key={entry.sourceRefId}
                className="hover:bg-surface-hover/50 transition-colors align-top"
              >
                <td className="px-3.5 py-3 space-y-1 min-w-[220px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <ContentClassification
                      classification={entry.classification}
                      label={t(
                        `classification.${entry.classification}.shortLabel`
                      )}
                    />
                    <span className="font-semibold text-text-primary">
                      {resolveLocalizedText(entry.title, locale)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    {resolveLocalizedText(entry.purpose, locale)}
                  </p>
                  {entry.authorityNote ? (
                    <p className="text-[11px] text-text-muted italic">
                      {resolveLocalizedText(entry.authorityNote, locale)}
                    </p>
                  ) : null}
                </td>
                <td className="px-3.5 py-3 min-w-[220px]">
                  <code className="font-mono text-[11px] text-text-secondary bidi-ltr break-all">
                    {entry.sourcePath}
                  </code>
                </td>
                <td className="px-3.5 py-3 whitespace-nowrap">
                  <span className="font-mono rounded-sm bg-surface-subtle px-1.5 py-0.5 text-[11px] text-text-secondary bidi-ltr">
                    {entry.phaseRef}
                  </span>
                </td>
                <td className="px-3.5 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-sm border border-border bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-text-primary">
                    {t(
                      `foundations.sourceManifest.importStatuses.${entry.importStatus}`
                    )}
                  </span>
                </td>
                <td className="px-3.5 py-3 whitespace-nowrap text-text-secondary">
                  {t(
                    `foundations.sourceManifest.authStatuses.${entry.publicationAuthorizationStatus}`
                  )}
                </td>
                <td className="px-3.5 py-3 whitespace-nowrap text-text-secondary">
                  {t(
                    `foundations.sourceManifest.completenessStatuses.${entry.completeness}`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
