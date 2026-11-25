import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-6',
        className
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-secondary text-text-secondary">
        {icon ?? <FileText className="h-4 w-4" aria-hidden="true" />}
      </div>
      <div className="space-y-1 max-w-2xl">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
