'use client';

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getFocusableElements, getNextFocusIndex } from '@/lib/focusTrap';
import { IconButton } from '@/components/ui/IconButton';

export const APP_SHELL_ROOT_ID = 'app-shell-root';

let activeModalCount = 0;
let savedBodyOverflow = '';

function lockBackground() {
  if (activeModalCount === 0) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const appRoot = document.getElementById(APP_SHELL_ROOT_ID);
    if (appRoot) {
      appRoot.setAttribute('inert', '');
      appRoot.setAttribute('aria-hidden', 'true');
    }
  }
  activeModalCount += 1;
}

function unlockBackground() {
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = savedBodyOverflow;

    const appRoot = document.getElementById(APP_SHELL_ROOT_ID);
    if (appRoot) {
      appRoot.removeAttribute('inert');
      appRoot.removeAttribute('aria-hidden');
    }
  }
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  variant?: 'dialog' | 'drawer';
  hideHeader?: boolean;
  overlayClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  variant = 'dialog',
  hideHeader = false,
  overlayClassName,
  className,
  children,
}: ModalProps) {
  const t = useTranslations();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    lockBackground();

    const dialogEl = dialogRef.current;
    if (dialogEl) {
      const autoFocusTarget = dialogEl.querySelector<HTMLElement>(
        '[data-autofocus]'
      );
      if (autoFocusTarget) {
        autoFocusTarget.focus();
      } else {
        const focusables = getFocusableElements(dialogEl);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          dialogEl.focus();
        }
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const activeEl = document.activeElement as HTMLElement | null;
        const currentIndex = activeEl ? focusables.indexOf(activeEl) : -1;
        const nextIndex = getNextFocusIndex(
          currentIndex,
          focusables.length,
          event.shiftKey
        );

        if (nextIndex >= 0 && focusables[nextIndex]) {
          event.preventDefault();
          focusables[nextIndex].focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockBackground();

      const previouslyFocused = previousFocusRef.current;
      previousFocusRef.current = null;
      if (previouslyFocused && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const resolvedCloseLabel = closeLabel ?? t('controls.close');

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        variant === 'dialog'
          ? 'flex items-start justify-center p-4 sm:pt-20'
          : 'flex',
        overlayClassName
      )}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'w-full border border-border bg-surface text-text-primary shadow-lg outline-none',
          variant === 'dialog'
            ? 'max-w-xl rounded-lg overflow-hidden'
            : 'fixed inset-y-0 start-0 max-w-xs h-full rounded-none border-e overflow-y-auto',
          className
        )}
      >
        {hideHeader ? (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        ) : (
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2
              id={titleId}
              className="text-sm font-semibold text-text-primary"
            >
              {title}
            </h2>
            <IconButton
              label={resolvedCloseLabel}
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
