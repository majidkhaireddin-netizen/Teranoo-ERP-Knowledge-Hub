import React from 'react';
import { cn } from '@/lib/utils';

export interface DocumentationArticleProps {
  children: React.ReactNode;
  className?: string;
}

export function DocumentationArticle({
  children,
  className,
}: DocumentationArticleProps) {
  return (
    <article
      className={cn(
        'max-w-[780px] space-y-8 text-[15px] leading-[1.75] text-text-primary',
        className
      )}
    >
      {children}
    </article>
  );
}
