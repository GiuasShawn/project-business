'use client'

import {
  MobileNav,
  type MobileNavItem,
  type NavItemData,
  Shell,
  ShellProvider,
  Sidebar,
  TopBar,
} from '@loom/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'

/**
 * Navigation items for the authenticated shell.
 * Uses the same pattern as the existing catalog-sidebar.tsx.
 *
 * Items with `unavailable: true` are disabled placeholders for future features.
 */
const NAV_ITEMS: NavItemData[] = [
  { label: 'Catalog', icon: 'storefront', href: '/catalog' },
  { label: 'Editor', icon: 'edit', href: '/editor' },
  { label: 'Inventory', icon: 'inventory_2', unavailable: true, href: '#' },
  { label: 'Earnings', icon: 'payments', unavailable: true, href: '#' },
  { label: 'Settings', icon: 'settings', unavailable: true, href: '#' },
  { label: 'Support', icon: 'help_outline', unavailable: true, href: '#' },
]

const STORE_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACoAykqGsuxMFLR-w7ncnp93A_w-6LkxHRNnWo6g2oWUxiVl6UxcqnLRrdQpB8vq0S0mUq2eAAy384i49M7hrq-_kvnWEw6JuAHC0N5ArI2Y3DrtpMng8STWqmWj2MPTiqD1PYd7E4uN5dfjMhlaTCQFaMS_nERTZm6YKxraMQ5XdYUiMB5cXDqtKjju0QJtWhZoEvOduvFnMk2yGNE_4AbwlW6G2vMVXeuwZmiuWjFU3vazo462KN'

/**
 * Authenticated layout shell.
 *
 * Provides the standard dashboard layout structure with sidebar navigation,
 * top bar, and main content area. Preserves the existing catalog sidebar
 * pattern while using the shared @loom/ui shell components.
 *
 * Structure:
 * ┌──────────────────────────────────────┐
 * │ TopBar                                │
 * ├──────────┬───────────────────────────┤
 * │ Sidebar  │ Content                    │
 * │          │                            │
 * └──────────┴───────────────────────────┘
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const pathname = usePathname()

  const sidebarContent = (
    <>
      {/* Store identity */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-outline-variant bg-surface-container">
          <img src={STORE_LOGO} alt="" className="size-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-tight text-on-surface">
            Loom Curator
          </p>
          <p className="font-label-caps text-[10px] uppercase tracking-widest text-tertiary">
            Pro Workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.label}
              href={item.unavailable ? '#' : item.href}
              aria-disabled={item.unavailable}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-3 rounded px-3 py-2.5 font-label-caps text-label-caps uppercase tracking-widest transition-colors ${
                active
                  ? 'bg-secondary-container/40 text-on-secondary-container'
                  : item.unavailable
                    ? 'cursor-not-allowed text-on-surface-variant/40'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {active ? (
                <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-tertiary" />
              ) : null}
              <span className="material-symbols-outlined select-none" style={{ fontSize: 18 }}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.unavailable ? (
                <span className="text-[9px] text-on-surface-variant/40">Soon</span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-2 pb-4">
        <Link
          href="/editor"
          className="flex w-full items-center justify-center gap-2 rounded bg-tertiary-container px-4 py-3 font-label-caps text-label-caps uppercase tracking-widest text-tertiary transition-colors duration-200 hover:bg-tertiary hover:text-on-tertiary"
        >
          <span className="material-symbols-outlined select-none" style={{ fontSize: 16 }}>
            store
          </span>
          Launch Store
        </Link>
        <p className="mt-3 px-2 text-center font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          © 2026 Loom Commerce Pvt. Ltd.
        </p>
      </div>
    </>
  )

  const topBarActions = (
    <>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined select-none" style={{ fontSize: 18 }}>
          notifications
        </span>
      </button>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        aria-label="User menu"
      >
        <span className="material-symbols-outlined select-none" style={{ fontSize: 20 }}>
          account_circle
        </span>
      </button>
    </>
  )

  const mobileNavItems: MobileNavItem[] = [
    { label: 'Catalog', href: '/catalog', icon: 'storefront', active: pathname === '/catalog' },
    { label: 'Editor', href: '/editor', icon: 'edit', active: pathname === '/editor' },
    { label: 'Earnings', href: '#', icon: 'payments' },
    { label: 'Settings', href: '#', icon: 'settings' },
  ]

  return (
    <ShellProvider>
      <Shell
        sidebar={<Sidebar>{sidebarContent}</Sidebar>}
        topBar={<TopBar actions={topBarActions} />}
      >
        {children}
      </Shell>
      <MobileNav items={mobileNavItems} />
    </ShellProvider>
  )
}
