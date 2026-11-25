import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  kicker?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  kicker,
  meta,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="space-y-2 min-w-0 max-w-3xl">
        {kicker ? <div className="flex flex-wrap items-center gap-2">{kicker}</div> : null}
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-text-primary text-balance leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm sm:text-[15px] leading-relaxed text-text-secondary">
            {subtitle}
          </p>
        ) : null}
        {meta ? (
          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            {meta}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </header>
  );
}
