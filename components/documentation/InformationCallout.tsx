import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InformationCalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InformationCallout({
  title,
  children,
  className,
}: InformationCalloutProps) {
  return (
    <aside
      className={cn(
        'flex items-start gap-3 rounded-md border border-info-border bg-info-bg px-4 py-3.5 text-sm',
        className
      )}
    >
      <Info
        className="mt-0.5 h-4 w-4 shrink-0 text-info"
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
