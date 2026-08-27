'use client'

import { MobileNav, type MobileNavItem, ShellProvider, useShell } from '@loom/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'

/**
 * Navigation items for the authenticated shell.
 * Matches the approved Stitch reference: LOOM sidebar with icon-based nav.
 */
interface NavItem {
  label: string
  icon: string
  href: string
  unavailable?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Catalog', icon: 'grid_view', href: '/catalog' },
  { label: 'Editor', icon: 'edit', href: '/editor' },
  { label: 'Inventory', icon: 'inventory_2', href: '#', unavailable: true },
  { label: 'Earnings', icon: 'payments', href: '#', unavailable: true },
  { label: 'Settings', icon: 'settings', href: '#', unavailable: true },
]

/**
 * Desktop sidebar — matches the approved Stitch reference exactly.
 * Fixed 260px rail: LOOM branding, nav items, SOON badges.
 */
function DesktopSidebar({ pathname }: { pathname: string }): React.JSX.Element {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-[260px] flex-col border-r border-outline-variant bg-surface-container py-10 px-6 lg:flex">
      {/* LOOM branding */}
      <div className="flex items-center gap-3 px-2">
        <span className="material-symbols-outlined text-primary text-3xl font-bold">
          water_drop
        </span>
        <span className="font-headline-lg text-headline-lg font-bold tracking-tighter text-on-surface">
          LOOM
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-col space-y-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.unavailable ? '#' : item.href}
              aria-disabled={item.unavailable}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-4 rounded-lg px-2 py-2 font-label-sm text-label-sm transition-all ${
                active
                  ? 'bg-white/5 font-bold text-primary opacity-100'
                  : item.unavailable
                    ? 'cursor-not-allowed font-medium text-on-surface-variant opacity-50'
                    : 'font-medium text-on-surface-variant opacity-50 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        {/* Support at bottom with separator */}
        <div className="mt-auto pt-8 border-t border-outline-variant/30">
          <div className="flex items-center justify-between px-2 py-2 font-medium text-on-surface-variant opacity-50">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined">help</span>
              <span className="font-label-sm text-label-sm">SUPPORT</span>
            </div>
            <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-sm text-[9px]">
              SOON
            </span>
          </div>
        </div>
      </nav>
    </aside>
  )
}

/**
 * Mobile sidebar drawer — slides in from the left on small screens.
 */
function MobileSidebarDrawer({
  pathname,
  open,
  onClose,
}: {
  pathname: string
  open: boolean
  onClose: () => void
}): React.JSX.Element {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-outline-variant bg-surface-container py-10 px-6 transition-transform duration-200 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* LOOM branding */}
        <div className="flex items-center gap-3 px-2">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">
            water_drop
          </span>
          <span className="font-headline-lg text-headline-lg font-bold tracking-tighter text-on-surface">
            LOOM
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col space-y-2">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.label}
                href={item.unavailable ? '#' : item.href}
                aria-disabled={item.unavailable}
                aria-current={active ? 'page' : undefined}
                onClick={onClose}
                className={`flex items-center gap-4 rounded-lg px-2 py-2 font-label-sm text-label-sm transition-all ${
                  active
                    ? 'bg-white/5 font-bold text-primary opacity-100'
                    : item.unavailable
                      ? 'cursor-not-allowed font-medium text-on-surface-variant opacity-50'
                      : 'font-medium text-on-surface-variant opacity-50 hover:opacity-100'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div className="mt-auto pt-8 border-t border-outline-variant/30">
            <div className="flex items-center justify-between px-2 py-2 font-medium text-on-surface-variant opacity-50">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">help</span>
                <span className="font-label-sm text-label-sm">SUPPORT</span>
              </div>
              <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-sm text-[9px]">
                SOON
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

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
  const { sidebarExpanded, closeMobileSidebar } = useShell()

  const mobileNavItems: MobileNavItem[] = [
    { label: 'Catalog', href: '/catalog', icon: 'storefront', active: pathname === '/catalog' },
    { label: 'Editor', href: '/editor', icon: 'edit', active: pathname === '/editor' },
    { label: 'Earnings', href: '#', icon: 'payments' },
    { label: 'Settings', href: '#', icon: 'settings' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar — always visible on lg+ */}
      <DesktopSidebar pathname={pathname} />

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer
        pathname={pathname}
        open={sidebarExpanded}
        onClose={closeMobileSidebar}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="min-h-screen lg:pl-[260px]">{children}</main>

      {/* Mobile bottom nav */}
      <MobileNav items={mobileNavItems} />
    </div>
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
