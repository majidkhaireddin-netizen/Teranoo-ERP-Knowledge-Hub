import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg border border-danger-border bg-danger-bg p-6',
        className
      )}
    >
      <div className="flex items-center gap-2 text-danger">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-text-primary">
        {description}
      </p>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
