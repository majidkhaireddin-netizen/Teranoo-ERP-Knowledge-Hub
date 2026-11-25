import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WarningCalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function WarningCallout({
  title,
  children,
  className,
}: WarningCalloutProps) {
  return (
    <aside
      className={cn(
        'flex items-start gap-3 rounded-md border border-warning-border bg-warning-bg px-4 py-3.5 text-sm',
        className
      )}
    >
      <AlertTriangle
        className="mt-0.5 h-4 w-4 shrink-0 text-warning"
        aria-hidden="true"
      />
      <div className="space-y-1 min-w-0">
        <p className="font-semibold text-text-primary">{title}</p>
        <div className="text-sm leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </aside>
  );
}
