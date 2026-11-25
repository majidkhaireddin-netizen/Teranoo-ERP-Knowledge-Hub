import React from 'react';
import { cn } from '@/lib/utils';

export interface DocumentationSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocumentationSection({
  id,
  title,
  subtitle,
  children,
  className,
}: DocumentationSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn('scroll-mt-20 space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0', className)}
    >
      <div className="space-y-1">
        <h2
          id={`${id}-heading`}
          className="text-lg font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-4 text-text-primary">{children}</div>
    </section>
  );
}
