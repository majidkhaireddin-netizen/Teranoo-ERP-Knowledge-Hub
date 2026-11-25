import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  showPercent?: boolean;
  tone?: 'primary' | 'success' | 'accent';
  className?: string;
}

const TONE_CLASSES = {
  primary: 'bg-primary',
  success: 'bg-success',
  accent: 'bg-accent',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  tone = 'primary',
  className,
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);

  return (
    <div className={cn('w-full', className)}>
      {showPercent ? (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-text-secondary">{label}</span>
          <span className="font-mono font-semibold text-text-primary tabular-nums">
            {percent}%
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        className="h-2 w-full overflow-hidden rounded-sm bg-surface-secondary"
      >
        <div
          className={cn(
            'h-full rounded-sm transition-[width] duration-300',
            TONE_CLASSES[tone]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
