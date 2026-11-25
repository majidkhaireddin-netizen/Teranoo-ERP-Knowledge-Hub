export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Pure cyclic focus-index calculator for modal Tab / Shift+Tab trapping.
 * Returns -1 when there are no focusable elements inside the container.
 */
export function getNextFocusIndex(
  currentIndex: number,
  count: number,
  shiftKey: boolean
): number {
  if (count <= 0) {
    return -1;
  }

  if (currentIndex < 0 || currentIndex >= count) {
    return shiftKey ? count - 1 : 0;
  }

  if (shiftKey) {
    return currentIndex === 0 ? count - 1 : currentIndex - 1;
  }

  return currentIndex === count - 1 ? 0 : currentIndex + 1;
}

/**
 * Returns visible, interactive focusable elements inside a container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );

  return candidates.filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.closest('[inert]')) return false;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    return true;
  });
}
