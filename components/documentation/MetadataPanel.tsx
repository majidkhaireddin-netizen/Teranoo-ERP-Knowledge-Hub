import React from 'react';
import { cn } from '@/lib/utils';

export interface MetadataEntry {
  label: string;
  value: React.ReactNode;
}

export interface MetadataPanelProps {
  title: string;
  entries: readonly MetadataEntry[];
  className?: string;
}

export function MetadataPanel({
  title,
  entries,
  className,
}: MetadataPanelProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'rounded-lg border border-border bg-surface overflow-hidden',
        className
      )}
    >
      <div className="border-b border-border bg-surface-secondary/60 px-4 py-2.5">
        <h2 className="text-xs font-semibold text-text-secondary">{title}</h2>
      </div>
      <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-1 px-4 py-3 sm:border-b sm:border-border sm:odd:border-e sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <dt className="text-xs text-text-secondary">{entry.label}</dt>
            <dd className="text-sm font-medium text-text-primary">
              {entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
