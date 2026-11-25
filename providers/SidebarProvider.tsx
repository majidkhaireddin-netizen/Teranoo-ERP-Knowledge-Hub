'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { SITE_CONFIG } from '@/config/site';

interface SidebarContextValue {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
}

const SIDEBAR_EVENT = 'teranoo-sidebar-change';

function subscribeSidebar(callback: () => void): () => void {
  window.addEventListener(SIDEBAR_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(SIDEBAR_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getCollapsedSnapshot(): boolean {
  try {
    return (
      window.localStorage.getItem(SITE_CONFIG.storageKeys.sidebarCollapsed) ===
      'true'
    );
  } catch {
    return false;
  }
}

function getCollapsedServerSnapshot(): boolean {
  return false;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    const next = !getCollapsedSnapshot();
    try {
      window.localStorage.setItem(
        SITE_CONFIG.storageKeys.sidebarCollapsed,
        String(next)
      );
    } catch {
      // Ignore storage errors.
    }
    window.dispatchEvent(new Event(SIDEBAR_EVENT));
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      collapsed,
      mobileOpen,
      toggleCollapsed,
      setMobileOpen,
      closeMobile,
    }),
    [collapsed, mobileOpen, toggleCollapsed, closeMobile]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}
