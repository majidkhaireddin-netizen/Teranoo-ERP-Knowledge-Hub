import React from 'react';
import { BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RequirementReferenceProps {
  requirementId: string;
  summary?: string;
  className?: string;
}

export function RequirementReference({
  requirementId,
  summary,
  className,
}: RequirementReferenceProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-secondary px-2 py-0.5 text-xs',
        className
      )}
    >
      <BookmarkCheck
        className="h-3.5 w-3.5 shrink-0 text-text-secondary"
        aria-hidden="true"
      />
      <code className="font-mono font-semibold text-text-primary bidi-ltr">
        {requirementId}
      </code>
      {summary ? <span className="text-text-secondary">{summary}</span> : null}
    </span>
  );
}
