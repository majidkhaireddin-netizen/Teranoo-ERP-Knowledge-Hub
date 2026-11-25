import React from 'react';
import { cn } from '@/lib/utils';

export interface ArchitectureGroupProps {
  title: string;
  meta?: string;
  tone?: 'business' | 'platform' | 'infrastructure';
  children: React.ReactNode;
  className?: string;
}

const GROUP_HEADER_CLASSES = {
  business: 'bg-primary-subtle/70 border-b border-class-official-border text-primary-deep',
  platform: 'bg-surface-secondary border-b border-border text-text-primary',
  infrastructure: 'bg-surface-secondary/50 border-b border-border text-text-primary',
};

export function ArchitectureGroup({
  title,
  meta,
  tone = 'platform',
  children,
  className,
}: ArchitectureGroupProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-app/50',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 px-4 py-2.5',
          GROUP_HEADER_CLASSES[tone]
        )}
      >
        <span className="text-xs font-semibold">{title}</span>
        {meta ? (
          <span className="text-xs text-text-secondary">{meta}</span>
        ) : null}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}
