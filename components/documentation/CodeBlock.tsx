'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  title,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable in restricted environment.
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-border bg-surface-secondary/50',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-secondary px-3 py-1.5 text-xs text-text-secondary">
        <span className="font-mono bidi-ltr">
          {title ?? language ?? 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              <span>{copiedLabel}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-6 text-text-primary bidi-ltr text-left">
        <code>{code}</code>
      </pre>
    </div>
  );
}
