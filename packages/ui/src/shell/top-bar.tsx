'use client'

import type React from 'react'
import { Icon } from '../icon.js'
import { Wordmark } from '../wordmark.js'
import { useShell } from './shell-context.js'

export interface TopBarProps {
  /** Page title displayed in the top bar. */
  title?: string
  /** Optional right-side actions (e.g. notification bell, user avatar). */
  actions?: React.ReactNode
  /** Additional className for the root element. */
  className?: string
}

/**
 * Dashboard top navigation bar.
 *
 * Contains:
 * - Hamburger menu toggle (mobile/tablet)
 * - Sidebar collapse toggle (desktop)
 * - Page title
 * - Right-side actions
 *
 * Fixed at the top of the viewport. Content area should account for this
 * via padding-top.
 */
export function TopBar({ title, actions, className = '' }: TopBarProps): React.JSX.Element {
  const { toggleSidebar } = useShell()

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex h-14 items-center border-b border-outline-variant bg-surface-container-low px-4 lg:px-6 ${className}`}
    >
      {/* Left: hamburger / collapse toggle + wordmark + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:flex"
          aria-label="Toggle sidebar"
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="hidden lg:block">
          <Wordmark className="text-sm" />
        </div>
        {title ? (
          <>
            <span className="hidden text-outline-variant lg:inline">/</span>
            <h1 className="font-body text-sm font-medium text-on-surface">{title}</h1>
          </>
        ) : null}
      </div>

      {/* Right: actions */}
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
