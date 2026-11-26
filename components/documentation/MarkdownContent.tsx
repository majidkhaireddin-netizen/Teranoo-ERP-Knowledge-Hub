import React from 'react';
import type { DocumentLanguage } from '@/content/models/knowledge';
import { cn } from '@/lib/utils';

export interface MarkdownContentProps {
  /**
   * Trust invariant: `html` MUST come strictly from the server-side
   * `renderSafeMarkdown()` pipeline (`allowDangerousHtml: false`, strict
   * `rehype-sanitize` allowlist, and URL protocol validation).
   */
  html: string;
  language: DocumentLanguage;
  className?: string;
}

export function MarkdownContent({
  html,
  language,
  className,
}: MarkdownContentProps) {
  const dir = language === 'ar' ? 'rtl' : language === 'en' ? 'ltr' : 'auto';
  const langAttr = language === 'mixed' ? undefined : language;

  return (
    <div
      dir={dir}
      lang={langAttr}
      className={cn('kh-markdown', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
