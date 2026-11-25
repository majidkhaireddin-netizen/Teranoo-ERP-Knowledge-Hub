import React from 'react';
import { cn } from '@/lib/utils';

export interface DiagramContainerProps {
  title: string;
  caption: string;
  classificationSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DiagramContainer({
  title,
  caption,
  classificationSlot,
  children,
  className,
}: DiagramContainerProps) {
  return (
    <figure
      aria-label={title}
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-surface',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-text-primary">{title}</span>
        {classificationSlot ? <div>{classificationSlot}</div> : null}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      <figcaption className="border-t border-border bg-surface-secondary/40 px-4 py-2.5 text-xs text-text-secondary">
        {caption}
      </figcaption>
    </figure>
  );
}
