'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  meta?: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItemData[];
  defaultOpenIds?: readonly string[];
  className?: string;
}

export function Accordion({
  items,
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([...defaultOpenIds]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={cn(
        'divide-y divide-border rounded-lg border border-border bg-surface',
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-start text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="truncate">{item.title}</span>
                {item.meta ? (
                  <span className="text-xs font-normal text-text-secondary shrink-0">
                    {item.meta}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-text-secondary transition-transform duration-150',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div className="border-t border-border bg-app/40 px-4 py-3.5 text-sm text-text-secondary">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
