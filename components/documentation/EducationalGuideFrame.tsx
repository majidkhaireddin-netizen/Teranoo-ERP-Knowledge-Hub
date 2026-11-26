'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EducationalQuestionKey =
  | 'whatIsConcept'
  | 'whyItMatters'
  | 'businessProblem'
  | 'enterpriseApproaches'
  | 'alternativesConsidered'
  | 'teranooAdoption'
  | 'selectionRationale'
  | 'unresolvedQuestions'
  | 'implementationImpact'
  | 'practicalLessons';

export interface EducationalGuideItem {
  readonly key: EducationalQuestionKey;
  readonly prompt: string;
  readonly content: React.ReactNode;
}

export interface EducationalGuideFrameProps {
  readonly title: string;
  readonly intro?: string;
  readonly items: readonly EducationalGuideItem[];
  readonly className?: string;
}

/**
 * Reusable, opt-in educational presentation pattern (TASK-003 Section 14).
 * Lets educational articles answer structured ERP learning questions without
 * forcing every Knowledge Hub document into a rigid fixed template.
 */
export function EducationalGuideFrame({
  title,
  intro,
  items,
  className,
}: EducationalGuideFrameProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        'rounded-lg border border-border bg-surface p-5 space-y-4',
        className
      )}
    >
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
          <BookOpen className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <h3>{title}</h3>
        </div>
        {intro ? (
          <p className="text-xs leading-relaxed text-text-secondary">{intro}</p>
        ) : null}
      </div>

      <dl className="divide-y divide-border border-t border-border">
        {items.map((item) => (
          <div key={item.key} className="py-3 space-y-1">
            <dt className="text-xs font-semibold text-text-primary">
              {item.prompt}
            </dt>
            <dd className="text-xs leading-relaxed text-text-secondary">
              {item.content}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
