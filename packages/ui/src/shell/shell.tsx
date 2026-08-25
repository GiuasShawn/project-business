'use client'

import type React from 'react'
import { useEffect } from 'react'
import { useShell } from './shell-context.js'

export interface ShellProps {
  /** Main content area. */
  children: React.ReactNode
  /** Sidebar content — rendered inside the Sidebar component. */
  sidebar: React.ReactNode
  /** Top bar content — rendered inside the TopBar component. */
  topBar: React.ReactNode
  /** Additional className for the content area. */
  className?: string
}

/**
 * Root dashboard shell layout.
 *
 * Provides the standard dashboard layout structure:
 * ```
 * ┌──────────────────────────────────────┐
 * │ TopBar                                │
 * ├──────────┬───────────────────────────┤
 * │ Sidebar  │ Content                    │
 * │          │                            │
 * └──────────┴───────────────────────────┘
 * ```
 *
 * On mobile (< lg):
 * - Sidebar becomes an overlay drawer
 * - Bottom MobileNav replaces sidebar navigation
 *
 * This component must be used inside a `ShellProvider`.
 */
export function Shell({
  children,
  sidebar,
  topBar,
  className = '',
}: ShellProps): React.JSX.Element {
  const { sidebarExpanded } = useShell()

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    // Only lock on mobile viewports
    const mql = window.matchMedia('(max-width: 1023px)')
    if (!mql.matches) return
    if (sidebarExpanded) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
    return undefined
  }, [sidebarExpanded])

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — spans full width */}
      {topBar}

      {/* Sidebar — positioned fixed, content offsets via padding-left */}
      {sidebar}

      {/* Main content */}
      <main
        className={`min-h-screen pt-14 transition-[padding] duration-200 ease-in-out ${
          sidebarExpanded ? 'lg:pl-[260px]' : 'lg:pl-[64px]'
        } ${className}`}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
