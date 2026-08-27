'use client'

import type React from 'react'
import { Icon, type IconName } from '../icon.js'

export interface MobileNavItem {
  /** Display label. */
  label: string
  /** Route href. */
  href: string
  /** Material Symbol icon name. */
  icon: IconName
  /** Whether this item is currently active. */
  active?: boolean
}

export interface MobileNavProps {
  /** Navigation items to display in the bottom bar. */
  items: MobileNavItem[]
  /** Additional className. */
  className?: string
}

/**
 * Fixed bottom navigation bar for mobile viewports.
 *
 * Renders on screens < `lg` breakpoint (1024px).
 * Each item shows an icon + label. Active item uses tertiary color.
 */
export function MobileNav({ items, className = '' }: MobileNavProps): React.JSX.Element {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 flex border-t border-outline-variant bg-surface-container-low lg:hidden ${className}`}
      aria-label="Mobile navigation"
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors duration-150 ${
            item.active ? 'text-tertiary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-current={item.active ? 'page' : undefined}
        >
          <Icon name={item.icon} size={20} />
          <span className="font-label-caps text-[9px] uppercase tracking-wider">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
