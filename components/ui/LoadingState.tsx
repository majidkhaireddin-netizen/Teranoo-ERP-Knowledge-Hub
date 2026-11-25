import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  rows?: number;
  className?: string;
}

export function LoadingState({
  title,
  description,
  rows = 4,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'space-y-4 rounded-lg border border-border bg-surface p-6',
        className
      )}
    >
      {title ? (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-primary">{title}</p>
          {description ? (
            <p className="text-xs text-text-secondary">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 animate-pulse rounded-sm bg-surface-secondary',
              index === 0 ? 'w-1/3' : index === rows - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  );
}
