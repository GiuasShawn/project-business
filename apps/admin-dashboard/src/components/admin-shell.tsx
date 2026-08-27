'use client'

import { Icon, NavGroup, type NavItemData, Shell, ShellProvider, Sidebar, TopBar } from '@loom/ui'
import type React from 'react'

/**
 * Admin dashboard navigation items.
 *
 * Organized by admin domain groups.
 * All items beyond Overview are marked unavailable — they belong to
 * future domain phases (Products, Orders, Inventory, etc.).
 */
const operationsNav: NavItemData[] = [
  { label: 'Overview', href: '/', icon: 'dashboard', active: true },
  { label: 'Sellers', href: '/sellers', icon: 'people', unavailable: true },
  { label: 'Products', href: '/products', icon: 'category', unavailable: true },
  { label: 'Orders', href: '/orders', icon: 'receipt_long', unavailable: true },
  { label: 'Inventory', href: '/inventory', icon: 'inventory_2', unavailable: true },
]

const financeNav: NavItemData[] = [
  { label: 'Payments', href: '/payments', icon: 'payments', unavailable: true },
  { label: 'Payouts', href: '/payouts', icon: 'account_balance', unavailable: true },
  { label: 'Returns', href: '/returns', icon: 'local_shipping', unavailable: true },
]

const platformNav: NavItemData[] = [
  { label: 'Analytics', href: '/analytics', icon: 'bar_chart', unavailable: true },
  { label: 'Notifications', href: '/notifications', icon: 'notifications', unavailable: true },
  { label: 'Settings', href: '/settings', icon: 'settings', unavailable: true },
]

/**
 * Top bar actions for the admin dashboard.
 */
function AdminTopBarActions(): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        aria-label="Notifications"
      >
        <Icon name="notifications" size={20} />
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error-container text-error">
        <span className="font-label-caps text-xs">A</span>
      </div>
    </>
  )
}

/**
 * Admin dashboard shell layout.
 *
 * Wraps the page content with:
 * - ShellProvider (sidebar state)
 * - Sidebar with admin-specific navigation
 * - TopBar with admin branding
 * - Content area
 *
 * All navigation items beyond Overview are marked as `unavailable`
 * and visibly show "Soon" badges. They belong to future domain phases.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <ShellProvider defaultExpanded>
      <Shell
        topBar={<TopBar title="Admin Dashboard" actions={<AdminTopBarActions />} />}
        sidebar={
          <Sidebar>
            <div className="flex flex-1 flex-col gap-4">
              <NavGroup label="Operations" items={operationsNav} />
              <NavGroup label="Finance" items={financeNav} />
              <NavGroup label="Platform" items={platformNav} />
            </div>
          </Sidebar>
        }
      >
        {children}
      </Shell>
    </ShellProvider>
  )
}
