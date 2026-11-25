import React from 'react';
import { cn } from '@/lib/utils';

export interface ArchitectureNodeProps {
  code?: string;
  title: string;
  subtitle?: string;
  tone?: 'default' | 'primary' | 'approved' | 'pending' | 'infrastructure';
  className?: string;
}

const TONE_CLASSES = {
  default: 'border-border bg-surface text-text-primary',
  primary: 'border-class-official-border bg-surface text-text-primary',
  approved: 'border-success-border bg-success-bg/60 text-text-primary',
  pending: 'border-border bg-surface-secondary/70 text-text-secondary',
  infrastructure: 'border-border-strong bg-surface text-text-primary',
};

export function ArchitectureNode({
  code,
  title,
  subtitle,
  tone = 'default',
  className,
}: ArchitectureNodeProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-1.5 rounded-md border px-3.5 py-3',
        TONE_CLASSES[tone],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold leading-snug text-text-primary">
          {title}
        </span>
        {code ? (
          <code className="font-mono text-[11px] font-medium text-text-secondary bidi-ltr tabular-nums shrink-0">
            {code}
          </code>
        ) : null}
      </div>
      {subtitle ? (
        <span className="text-xs text-text-secondary leading-snug">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
