import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'official'
  | 'research'
  | 'independent'
  | 'future';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  mono?: boolean;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-secondary text-text-secondary border-border',
  primary: 'bg-primary-subtle text-primary border-class-official-border',
  accent: 'bg-accent-subtle text-accent-strong border-class-independent-border',
  success: 'bg-success-bg text-success border-success-border',
  warning: 'bg-warning-bg text-warning border-warning-border',
  danger: 'bg-danger-bg text-danger border-danger-border',
  info: 'bg-info-bg text-info border-info-border',
  official: 'bg-class-official-bg text-class-official border-class-official-border',
  research: 'bg-class-research-bg text-class-research border-class-research-border',
  independent:
    'bg-class-independent-bg text-class-independent border-class-independent-border',
  future: 'bg-class-future-bg text-class-future border-class-future-border',
};

export function Badge({
  tone = 'neutral',
  mono = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium leading-5 whitespace-nowrap shrink-0',
        mono && 'font-mono bidi-ltr tabular-nums',
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
