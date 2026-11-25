'use client';

import React, { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? tooltipId : undefined}
    >
      {children}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full start-1/2 z-50 mb-1.5 -translate-x-1/2 rtl:translate-x-1/2 rounded-sm border border-border-strong bg-surface px-2 py-1 text-xs font-medium text-text-primary shadow-sm whitespace-nowrap"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
