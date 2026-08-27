'use client'

import { Icon, NavGroup, type NavItemData, Shell, ShellProvider, Sidebar, TopBar } from '@loom/ui'
import type React from 'react'

/**
 * Seller dashboard navigation items.
 *
 * Active items correspond to implemented routes.
 * Unavailable items are explicitly marked and link to nowhere functional.
 */
const primaryNav: NavItemData[] = [
  { label: 'Overview', href: '/', icon: 'dashboard', active: true },
  { label: 'Products', href: '/products', icon: 'inventory_2', unavailable: true },
  { label: 'Orders', href: '/orders', icon: 'receipt_long', unavailable: true },
  { label: 'Earnings', href: '/earnings', icon: 'payments', unavailable: true },
]

const secondaryNav: NavItemData[] = [
  { label: 'Analytics', href: '/analytics', icon: 'analytics', unavailable: true },
  { label: 'Storefront', href: '/storefront', icon: 'storefront', unavailable: true },
]

const tertiaryNav: NavItemData[] = [
  { label: 'Settings', href: '/settings', icon: 'settings', unavailable: true },
  { label: 'Help', href: '/help', icon: 'help_outline', unavailable: true },
]

/**
 * Top bar actions for the seller dashboard.
 */
function SellerTopBarActions(): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        aria-label="Notifications"
      >
        <Icon name="notifications" size={20} />
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-container text-tertiary">
        <span className="font-label-caps text-xs">S</span>
      </div>
    </>
  )
}

/**
 * Seller dashboard shell layout.
 *
 * Wraps the page content with:
 * - ShellProvider (sidebar state)
 * - Sidebar with seller-specific navigation
 * - TopBar with seller branding
 * - Content area
 *
 * Navigation items that are not yet implemented are marked as `unavailable`
 * and visibly show "Soon" badges. They do not navigate anywhere.
 */
export default function SellerShell({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <ShellProvider defaultExpanded>
      <Shell
        topBar={<TopBar title="Seller Dashboard" actions={<SellerTopBarActions />} />}
        sidebar={
          <Sidebar>
            <div className="flex flex-1 flex-col gap-4">
              <NavGroup label="Main" items={primaryNav} />
              <NavGroup label="Growth" items={secondaryNav} />
              <NavGroup label="Account" items={tertiaryNav} />
            </div>
          </Sidebar>
        }
      >
        {children}
      </Shell>
    </ShellProvider>
  )
}
