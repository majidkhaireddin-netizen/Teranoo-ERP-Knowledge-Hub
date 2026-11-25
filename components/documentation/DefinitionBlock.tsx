import React from 'react';
import { cn } from '@/lib/utils';

export interface DefinitionBlockProps {
  term: string;
  englishTerm?: string;
  definition: string;
  className?: string;
}

export function DefinitionBlock({
  term,
  englishTerm,
  definition,
  className,
}: DefinitionBlockProps) {
  return (
    <dl
      className={cn(
        'rounded-md border border-border bg-surface px-4 py-3.5 space-y-1.5',
        className
      )}
    >
      <dt className="flex flex-wrap items-baseline gap-2 text-sm font-semibold text-text-primary">
        <span>{term}</span>
        {englishTerm ? (
          <span className="font-mono text-xs font-normal text-text-secondary bidi-ltr">
            {englishTerm}
          </span>
        ) : null}
      </dt>
      <dd className="text-sm leading-relaxed text-text-secondary">
        {definition}
      </dd>
    </dl>
  );
}
