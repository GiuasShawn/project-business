'use client'

import Link from 'next/link'
import { Icon, type IconName } from '../ui/icon'

const ITEMS: Array<{ label: string; icon: IconName; active?: boolean }> = [
  { label: 'Catalog', icon: 'storefront', active: true },
  { label: 'Search', icon: 'search' },
  { label: 'Inventory', icon: 'inventory_2' },
  { label: 'Earnings', icon: 'payments' },
]

/** Mobile bottom navigation (Stitch catalog mobile). */
export function MobileBottomNav(): React.JSX.Element {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur lg:hidden">
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.active ? '/catalog' : '#'}
          className={`flex flex-1 flex-col items-center gap-1 py-2.5 font-label-caps text-[10px] uppercase tracking-widest ${
            item.active ? 'text-tertiary' : 'text-on-surface-variant'
          }`}
        >
          <Icon name={item.icon} size={20} filled={item.active} />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
