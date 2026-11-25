import React from 'react';
import { CheckCircle2, Clock, CircleDot, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusKind = 'approved' | 'completed' | 'in_progress' | 'pending' | 'planned';

export interface StatusIndicatorProps {
  status: StatusKind;
  label: string;
  className?: string;
}

const STATUS_STYLE: Record<
  StatusKind,
  { textClass: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  approved: { textClass: 'text-success', Icon: CheckCircle2 },
  completed: { textClass: 'text-success', Icon: CheckCircle2 },
  in_progress: { textClass: 'text-info', Icon: CircleDot },
  pending: { textClass: 'text-warning', Icon: Clock },
  planned: { textClass: 'text-text-secondary', Icon: CalendarClock },
};

export function StatusIndicator({
  status,
  label,
  className,
}: StatusIndicatorProps) {
  const { textClass, Icon } = STATUS_STYLE[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap',
        textClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
