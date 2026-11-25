'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface TableOfContentsProps {
  title: string;
  items: readonly TableOfContentsItem[];
  className?: string;
}

export function TableOfContents({
  title,
  items,
  className,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-72px 0px -65% 0px',
        threshold: 0,
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside
      aria-label={title}
      className={cn(
        'hidden xl:block w-[224px] shrink-0',
        className
      )}
    >
      <div className="sticky top-20 space-y-3 border-s border-border ps-4">
        <p className="text-xs font-semibold text-text-secondary">{title}</p>
        <ul className="space-y-1.5 text-xs">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id} className={item.level === 3 ? 'ps-3' : ''}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'block py-0.5 leading-snug transition-colors',
                    isActive
                      ? 'font-semibold text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
