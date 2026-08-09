'use client'

import Link from 'next/link'
import { Icon, type IconName } from '../ui/icon'

const NAV_ITEMS: Array<{
  label: string
  icon: IconName
  count?: string
  href?: string
  disabled?: boolean
}> = [
  { label: 'Catalog', icon: 'storefront', count: '1,248', href: '/catalog' },
  { label: 'Inventory', icon: 'inventory_2', disabled: true },
  { label: 'Earnings', icon: 'payments', disabled: true },
  { label: 'Settings', icon: 'settings', disabled: true },
  { label: 'Support', icon: 'help_outline', disabled: true },
]

const STORE_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACoAykqGsuxMFLR-w7ncnp93A_w-6LkxHRNnWo6g2oWUxiVl6UxcqnLRrdQpB8vq0S0mUq2eAAy384i49M7hrq-_kvnWEw6JuAHC0N5ArI2Y3DrtpMng8STWqmWj2MPTiqD1PYd7E4uN5dfjMhlaTCQFaMS_nERTZm6YKxraMQ5XdYUiMB5cXDqtKjju0QJtWhZoEvOduvFnMk2yGNE_4AbwlW6G2vMVXeuwZmiuWjFU3vazo462KN'

/**
 * Catalog sidebar (desktop). Fixed 380px rail: store identity on top, main
 * nav, and the primary "Launch Store" CTA pinned at the bottom (Stitch).
 * The Workspace/editor destination lands with the storefront phase — these
 * links are placeholder routes until then.
 */
export function CatalogSidebar(): React.JSX.Element {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[380px] shrink-0 flex-col border-r border-outline-variant bg-surface-dim lg:flex">
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded border border-outline-variant bg-surface-container">
          <img src={STORE_LOGO} alt="" className="size-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold tracking-tight text-on-surface">
            Loom Curator
          </p>
          <p className="font-label-caps text-[10px] uppercase tracking-widest text-tertiary">
            Pro Workspace
          </p>
        </div>
        <span className="ml-auto text-on-surface-variant">
          <Icon name="notifications" size={18} />
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map((item) => {
          const active = item.label === 'Catalog'
          const href = item.href ?? '#'
          return (
            <Link
              key={item.label}
              href={href}
              aria-disabled={item.disabled}
              className={`relative flex items-center gap-3 rounded px-3 py-2.5 font-label-caps text-label-caps uppercase tracking-widest transition-colors ${
                active
                  ? 'bg-secondary-container/40 text-on-secondary-container'
                  : item.disabled
                    ? 'cursor-not-allowed text-on-surface-variant/40'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {active ? (
                <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-tertiary" />
              ) : null}
              <Icon name={item.icon} size={18} />
              <span className="flex-1">{item.label}</span>
              {item.count ? (
                <span className="font-data-mono text-[11px] text-on-surface-variant">
                  {item.count}
                </span>
              ) : null}
              {item.disabled ? (
                <span className="text-[9px] text-on-surface-variant/40">Soon</span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-6">
        <Link
          href="/editor"
          className="flex w-full items-center justify-center gap-2 rounded bg-tertiary-container px-4 py-3 font-label-caps text-label-caps uppercase tracking-widest text-tertiary transition-colors duration-200 hover:bg-tertiary hover:text-on-tertiary"
        >
          <Icon name="store" size={16} />
          Launch Store
        </Link>
        <p className="mt-3 px-2 text-center font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          © 2026 Loom Commerce Pvt. Ltd.
        </p>
      </div>
    </aside>
  )
}
