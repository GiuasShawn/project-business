'use client'

import { MobileNav, Shell, ShellProvider, Sidebar, TopBar } from '@loom/ui'
import { usePathname } from 'next/navigation'
import type React from 'react'

/**
 * Navigation items for the authenticated shell.
 * Matches the approved Stitch reference: LOOM sidebar with icon-based nav.
 */
const NAV_ITEMS = [
  { label: 'Catalog', icon: 'grid_view' as const, href: '/catalog' },
  { label: 'Editor', icon: 'edit' as const, href: '/editor' },
  { label: 'Inventory', icon: 'inventory_2' as const, href: '#', unavailable: true },
  { label: 'Earnings', icon: 'payments' as const, href: '#', unavailable: true },
  { label: 'Settings', icon: 'settings' as const, href: '#', unavailable: true },
]

/**
 * Inner authenticated shell — must be rendered inside ShellProvider
 * so that useShell() has access to the context.
 */
function AuthenticatedShellInner({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const pathname = usePathname()

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    active: pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href)),
  }))

  return (
    <Shell
      topBar={<TopBar title="Loom" />}
      sidebar={
        <Sidebar>
          <NavGroup label="Main" items={navItems} />
        </Sidebar>
      }
    >
      {children}
      <MobileNav
        items={[
          {
            label: 'Catalog',
            href: '/catalog',
            icon: 'storefront',
            active: pathname === '/catalog',
          },
          { label: 'Editor', href: '/editor', icon: 'edit', active: pathname === '/editor' },
          { label: 'Earnings', href: '#', icon: 'payments' },
          { label: 'Settings', href: '#', icon: 'settings' },
        ]}
      />
    </Shell>
  )
}

/**
 * Interactive authenticated shell (client component).
 *
 * Provides the approved Stitch reference layout:
 * - Fixed 260px sidebar on desktop (LOOM branding + nav)
 * - Mobile drawer sidebar
 * - Mobile bottom nav
 * - Main content area offset by sidebar width
 *
 * NO TopBar — the catalog page owns its own minimal toolbar.
 */
export function AuthenticatedShell({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <ShellProvider>
      <AuthenticatedShellInner>{children}</AuthenticatedShellInner>
    </ShellProvider>
  )
}

function NavGroup({
  label,
  items,
}: {
  label: string
  items: { label: string; icon: string; href: string; active?: boolean; unavailable?: boolean }[]
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="mb-1 px-3 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/50">
        {label}
      </span>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.unavailable ? '#' : item.href}
          aria-disabled={item.unavailable}
          aria-current={item.active ? 'page' : undefined}
          onClick={(e) => {
            if (item.unavailable) {
              e.preventDefault()
            }
          }}
          className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
            item.active
              ? 'bg-tertiary-container text-tertiary'
              : item.unavailable
                ? 'text-on-surface-variant/40 cursor-not-allowed'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          {item.label}
          {item.unavailable ? (
            <span className="ml-auto rounded bg-surface-container-highest px-1.5 py-0.5 font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Soon
            </span>
          ) : null}
        </a>
      ))}
    </div>
  )
}
