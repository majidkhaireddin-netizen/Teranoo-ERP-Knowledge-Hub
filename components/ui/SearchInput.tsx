'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  clearLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  clearLabel,
  className,
  ...props
}: SearchInputProps) {
  const t = useTranslations();
  const resolvedClearLabel = clearLabel ?? t('controls.clearSearch');

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="pointer-events-none absolute start-3 h-4 w-4 text-text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-border bg-surface ps-9 pe-9 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={resolvedClearLabel}
          className="absolute end-2 inline-flex h-6 w-6 items-center justify-center rounded-sm text-text-muted hover:bg-surface-hover hover:text-text-primary cursor-pointer"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
