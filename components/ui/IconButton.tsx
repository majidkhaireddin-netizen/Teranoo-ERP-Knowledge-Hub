import React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
}

const VARIANT_CLASSES = {
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:bg-surface-hover hover:text-text-primary',
  outline:
    'bg-surface text-text-secondary border border-border hover:bg-surface-hover hover:text-text-primary hover:border-border-strong',
  secondary:
    'bg-surface-secondary text-text-primary border border-border hover:bg-surface-hover',
};

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
};

export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md shrink-0 transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
