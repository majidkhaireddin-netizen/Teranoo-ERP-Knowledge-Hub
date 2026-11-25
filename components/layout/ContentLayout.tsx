import React from 'react';
import { cn } from '@/lib/utils';

export interface ContentLayoutProps {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  children,
  aside,
  className,
}: ContentLayoutProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between',
        className
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {aside ? aside : null}
    </div>
  );
}
