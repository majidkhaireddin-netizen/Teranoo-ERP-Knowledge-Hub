import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';

export interface PhaseProgressProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  progressLabel: string;
  summaryText: string;
  className?: string;
}

export function PhaseProgress({
  title,
  completed,
  total,
  percentage,
  progressLabel,
  summaryText,
  className,
}: PhaseProgressProps) {
  return (
    <div
      className={cn(
        'space-y-3 rounded-md border border-border bg-surface-secondary/40 p-4',
        className
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-mono font-semibold text-text-primary tabular-nums bidi-ltr">
            {completed} / {total}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono font-semibold text-primary tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
      <ProgressBar
        value={completed}
        max={total}
        label={progressLabel}
        tone="primary"
      />
      <p className="text-xs text-text-secondary">{summaryText}</p>
    </div>
  );
}
