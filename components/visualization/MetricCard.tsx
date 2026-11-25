import React from 'react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  note?: string;
  emphasis?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function MetricCard({
  label,
  value,
  suffix,
  note,
  emphasis = 'default',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-2 p-4 sm:p-5',
        className
      )}
    >
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-mono text-2xl font-semibold tracking-tight tabular-nums',
            emphasis === 'primary'
              ? 'text-primary'
              : emphasis === 'accent'
              ? 'text-accent-strong'
              : 'text-text-primary'
          )}
        >
          {value}
        </span>
        {suffix ? (
          <span className="font-mono text-sm font-medium text-text-secondary tabular-nums">
            {suffix}
          </span>
        ) : null}
      </div>
      {note ? (
        <p className="text-xs text-text-muted leading-snug">{note}</p>
      ) : null}
    </div>
  );
}
