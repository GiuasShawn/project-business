'use client'

import type React from 'react'
import { Wordmark } from '../wordmark.js'
import { useShell } from './shell-context.js'

export interface SidebarProps {
  /** Sidebar content (nav groups, footer, etc.). */
  children: React.ReactNode
  /** Additional className for the sidebar element. */
  className?: string
}

/**
 * Dashboard desktop sidebar.
 *
 * Behavior:
 * - Desktop (>=lg): Fixed left sidebar, 260px expanded / 64px collapsed
 * - Tablet/Mobile (<lg): Overlay drawer that slides in from the left
 *
 * Controlled via `ShellContext.sidebarExpanded`.
 */
export function Sidebar({ children, className = '' }: SidebarProps): React.JSX.Element {
  const { sidebarExpanded, closeMobileSidebar } = useShell()

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          sidebarExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileSidebar}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeMobileSidebar()
        }}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 flex flex-col border-r border-outline-variant bg-surface-container-low transition-all duration-200 ease-in-out ${
          sidebarExpanded
            ? 'w-[260px] translate-x-0'
            : '-translate-x-full lg:w-[64px] lg:translate-x-0'
        } ${className}`}
        aria-label="Sidebar navigation"
      >
        {/* Brand wordmark — visible when expanded, hidden when collapsed */}
        <div
          className={`flex h-12 items-center border-b border-outline-variant px-4 ${
            sidebarExpanded ? '' : 'lg:hidden'
          }`}
        >
          <Wordmark className="text-sm" />
        </div>

        {/* Collapsed brand icon */}
        <div
          className={`hidden h-12 items-center justify-center border-b border-outline-variant ${
            sidebarExpanded ? 'lg:hidden' : 'lg:flex'
          }`}
        >
          <span className="font-display text-sm font-bold text-on-surface">L</span>
        </div>

        {/* Nav content */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className={sidebarExpanded ? '' : 'lg:flex lg:flex-col lg:items-center lg:gap-1'}>
            {children}
          </div>
        </div>
      </aside>
    </>
  )
}

export interface SidebarWrapperProps {
  /** Additional content below the nav (e.g. user info, footer). */
  footer?: React.ReactNode
  /** Nav content. */
  children: React.ReactNode
}

/**
 * Convenience wrapper that combines Sidebar with the ShellProvider-aware layout.
 * Use this when you want a simple sidebar without the full Shell.
 */
export function SidebarWrapper({ children, footer }: SidebarWrapperProps): React.JSX.Element {
  return (
    <Sidebar>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        {footer ? <div className="border-t border-outline-variant px-2 py-3">{footer}</div> : null}
      </div>
    </Sidebar>
  )
}
