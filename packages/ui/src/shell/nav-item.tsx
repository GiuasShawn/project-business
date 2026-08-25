'use client'

import type React from 'react'
import { Icon, type IconName } from '../icon.js'
import { useShell } from './shell-context.js'

export interface NavItemData {
  /** Display label. */
  label: string
  /** Route href. */
  href: string
  /** Material Symbol icon name. */
  icon: IconName
  /** Whether this item is currently active. */
  active?: boolean
  /** Whether this nav destination is unavailable (placeholder). */
  unavailable?: boolean
  /** Badge count (e.g. notification count). */
  badge?: number
}

export interface NavItemProps {
  item: NavItemData
  /** Render as compact (icon-only) when sidebar is collapsed. */
  compact?: boolean
  /** Click handler override (e.g. for unavailable items). */
  onClick?: () => void
}

/**
 * Single navigation item for dashboard sidebars.
 *
 * Renders as a link with icon + label. When `compact` is true (sidebar collapsed),
 * only the icon is shown with a tooltip.
 */
export function NavItem({ item, compact = false, onClick }: NavItemProps): React.JSX.Element {
  const { closeMobileSidebar } = useShell()

  const handleClick = (): void => {
    closeMobileSidebar()
    onClick?.()
  }

  if (compact) {
    return (
      <a
        href={item.href}
        onClick={(e) => {
          if (item.unavailable) {
            e.preventDefault()
            return
          }
          handleClick()
        }}
        title={item.label}
        aria-label={item.label}
        aria-current={item.active ? 'page' : undefined}
        className={`group relative flex h-10 w-10 items-center justify-center rounded transition-colors duration-150 ${
          item.active
            ? 'bg-tertiary-container text-tertiary'
            : item.unavailable
              ? 'text-on-surface-variant/40 cursor-not-allowed'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }`}
      >
        <Icon name={item.icon} size={20} />
        {item.badge !== undefined && item.badge > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 font-label-caps text-[9px] text-on-tertiary">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        ) : null}
      </a>
    )
  }

  return (
    <a
      href={item.href}
      onClick={(e) => {
        if (item.unavailable) {
          e.preventDefault()
          return
        }
        handleClick()
      }}
      aria-disabled={item.unavailable}
      aria-current={item.active ? 'page' : undefined}
      className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
        item.active
          ? 'bg-tertiary-container text-tertiary'
          : item.unavailable
            ? 'text-on-surface-variant/40 cursor-not-allowed'
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
      }`}
    >
      <Icon name={item.icon} size={20} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.unavailable ? (
        <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/60">
          Soon
        </span>
      ) : null}
      {item.badge !== undefined && item.badge > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1.5 font-label-caps text-[10px] text-on-tertiary">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      ) : null}
    </a>
  )
}

export interface NavGroupProps {
  /** Group heading label. */
  label: string
  /** Navigation items in this group. */
  items: NavItemData[]
  /** Render as compact (icon-only). */
  compact?: boolean
}

/**
 * A labelled group of navigation items.
 */
export function NavGroup({ label, items, compact = false }: NavGroupProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      {compact ? (
        <div className="mx-auto mb-1 h-px w-6 bg-outline-variant" />
      ) : (
        <span className="mb-1 px-3 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/50">
          {label}
        </span>
      )}
      {items.map((item) => (
        <NavItem key={item.href} item={item} compact={compact} />
      ))}
    </div>
  )
}
