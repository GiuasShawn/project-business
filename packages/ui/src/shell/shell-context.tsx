'use client'

import type React from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export interface ShellContextValue {
  /** Whether the sidebar is expanded (desktop) or open (mobile drawer). */
  sidebarExpanded: boolean
  /** Toggle sidebar expanded/collapsed on desktop; open/close drawer on mobile. */
  toggleSidebar: () => void
  /** Close the mobile sidebar drawer. */
  closeMobileSidebar: () => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error('useShell must be used within a ShellProvider')
  return ctx
}

export interface ShellProviderProps {
  children: React.ReactNode
  /** Default sidebar state. Defaults to `true` (expanded). */
  defaultExpanded?: boolean
}

/**
 * Provides shell layout state (sidebar toggle) to descendant components.
 *
 * Wrap your layout content with this provider, then use `useShell()`
 * in child components to read/toggle sidebar state.
 */
export function ShellProvider({
  children,
  defaultExpanded = true,
}: ShellProviderProps): React.JSX.Element {
  const [sidebarExpanded, setSidebarExpanded] = useState(defaultExpanded)

  const toggleSidebar = useCallback(() => setSidebarExpanded((prev) => !prev), [])
  const closeMobileSidebar = useCallback(() => setSidebarExpanded(false), [])

  const value = useMemo(
    () => ({ sidebarExpanded, toggleSidebar, closeMobileSidebar }),
    [sidebarExpanded, toggleSidebar, closeMobileSidebar],
  )

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}
