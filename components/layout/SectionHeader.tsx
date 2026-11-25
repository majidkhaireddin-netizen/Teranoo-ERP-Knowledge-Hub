import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="space-y-0.5 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs sm:text-sm text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
