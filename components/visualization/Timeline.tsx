import React from 'react';
import { StatusIndicator, type StatusKind } from '@/components/ui/StatusIndicator';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  code: string;
  title: string;
  status: StatusKind;
  statusLabel: string;
  description?: string;
}

export interface TimelineProps {
  items: readonly TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol
      className={cn(
        'divide-y divide-border rounded-lg border border-border bg-surface',
        className
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-baseline gap-3 min-w-0">
            <code className="font-mono text-xs font-semibold text-text-secondary bidi-ltr tabular-nums shrink-0">
              {item.code}
            </code>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {item.title}
              </p>
              {item.description ? (
                <p className="text-xs text-text-secondary">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
          <div className="shrink-0">
            <StatusIndicator status={item.status} label={item.statusLabel} />
          </div>
        </li>
      ))}
    </ol>
  );
}
