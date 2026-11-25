import React from 'react';
import Link from 'next/link';
import { FileCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DecisionReferenceProps {
  decisionId: string;
  title?: string;
  href?: string;
  className?: string;
}

export function DecisionReference({
  decisionId,
  title,
  href,
  className,
}: DecisionReferenceProps) {
  const inner = (
    <>
      <FileCheck2
        className="h-3.5 w-3.5 shrink-0 text-primary"
        aria-hidden="true"
      />
      <code className="font-mono text-xs font-semibold text-primary bidi-ltr tabular-nums">
        {decisionId}
      </code>
      {title ? (
        <span className="text-xs text-text-secondary truncate">{title}</span>
      ) : null}
    </>
  );

  const baseClass = cn(
    'inline-flex items-center gap-1.5 rounded-sm border border-class-official-border bg-class-official-bg px-2 py-0.5 max-w-full',
    href && 'hover:border-primary transition-colors',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return <span className={baseClass}>{inner}</span>;
}
