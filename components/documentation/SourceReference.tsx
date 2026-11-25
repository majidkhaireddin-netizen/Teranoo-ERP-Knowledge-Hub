import React from 'react';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SourceReferenceProps {
  label: string;
  source: string;
  identifier?: string;
  className?: string;
}

export function SourceReference({
  label,
  source,
  identifier,
  className,
}: SourceReferenceProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-secondary/50 px-3 py-2 text-xs text-text-secondary',
        className
      )}
    >
      <BookMarked className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="font-medium text-text-primary">{label}:</span>
      <span>{source}</span>
      {identifier ? (
        <>
          <span aria-hidden="true">·</span>
          <code className="font-mono text-text-primary bidi-ltr">
            {identifier}
          </code>
        </>
      ) : null}
    </div>
  );
}
