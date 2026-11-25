import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ContentClassificationType } from '@/content/models/types';
import { ContentClassification } from '@/components/documentation/ContentClassification';
import { cn } from '@/lib/utils';

export interface RelatedContentItem {
  href: string;
  title: string;
  description: string;
  classification: ContentClassificationType;
  classificationLabel: string;
}

export interface RelatedContentProps {
  title: string;
  items: readonly RelatedContentItem[];
  className?: string;
}

export function RelatedContent({
  title,
  items,
  className,
}: RelatedContentProps) {
  return (
    <section className={cn('space-y-3 border-t border-border pt-6', className)}>
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col justify-between gap-2.5 rounded-md border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-hover/50"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
            <div>
              <ContentClassification
                classification={item.classification}
                label={item.classificationLabel}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
