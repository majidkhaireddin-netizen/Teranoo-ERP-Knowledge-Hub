import React from 'react';
import {
  ShieldCheck,
  FlaskConical,
  ClipboardCheck,
  Telescope,
} from 'lucide-react';
import type { ContentClassificationType } from '@/content/models/types';
import { cn } from '@/lib/utils';

export interface ContentClassificationProps {
  classification: ContentClassificationType;
  label: string;
  description?: string;
  variant?: 'inline' | 'banner';
  className?: string;
}

const CLASSIFICATION_META: Record<
  ContentClassificationType,
  {
    bgClass: string;
    borderClass: string;
    textClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  official: {
    bgClass: 'bg-class-official-bg',
    borderClass: 'border-class-official-border',
    textClass: 'text-class-official',
    Icon: ShieldCheck,
  },
  research: {
    bgClass: 'bg-class-research-bg',
    borderClass: 'border-class-research-border',
    textClass: 'text-class-research',
    Icon: FlaskConical,
  },
  independent: {
    bgClass: 'bg-class-independent-bg',
    borderClass: 'border-class-independent-border',
    textClass: 'text-class-independent',
    Icon: ClipboardCheck,
  },
  future: {
    bgClass: 'bg-class-future-bg',
    borderClass: 'border-class-future-border',
    textClass: 'text-class-future',
    Icon: Telescope,
  },
};

export function ContentClassification({
  classification,
  label,
  description,
  variant = 'inline',
  className,
}: ContentClassificationProps) {
  const { bgClass, borderClass, textClass, Icon } =
    CLASSIFICATION_META[classification];

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-md border px-4 py-3',
          bgClass,
          borderClass,
          className
        )}
      >
        <Icon
          className={cn('mt-0.5 h-4 w-4 shrink-0', textClass)}
          aria-hidden="true"
        />
        <div className="space-y-0.5 text-sm">
          <p className={cn('font-semibold', textClass)}>{label}</p>
          {description ? (
            <p className="text-xs leading-relaxed text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        bgClass,
        borderClass,
        textClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
