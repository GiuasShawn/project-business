import type React from 'react'

/**
 * Material Symbols Outlined icon name union.
 *
 * Covers the full set needed across all three frontend applications:
 * - Customer storefront (navigation, product actions)
 * - Seller dashboard (products, orders, analytics, settings)
 * - Admin dashboard (platform management, sellers, reports)
 *
 * @see https://fonts.google.com/icons
 */
export type IconName =
  // Navigation & UI
  | 'menu'
  | 'close'
  | 'arrow_forward'
  | 'arrow_back'
  | 'expand_more'
  | 'expand_less'
  | 'chevron_right'
  | 'chevron_left'
  | 'search'
  | 'filter_list'
  | 'tune'
  | 'sort'
  | 'check'
  | 'add'
  | 'edit'
  | 'delete'
  | 'visibility'
  | 'visibility_off'
  | 'inbox'
  | 'notifications'
  | 'settings'
  | 'help_outline'
  | 'logout'
  | 'person'
  | 'people'
  | 'manage_accounts'
  // Commerce & storefront
  | 'storefront'
  | 'store'
  | 'shopping_cart'
  | 'favorite'
  | 'favorite_border'
  | 'bookmark'
  | 'bookmark_border'
  | 'inventory_2'
  | 'category'
  | 'palette'
  | 'image'
  | 'cloud_upload'
  | 'publish'
  // Dashboard & analytics
  | 'dashboard'
  | 'analytics'
  | 'bar_chart'
  | 'pie_chart'
  | 'trending_up'
  | 'trending_down'
  | 'payments'
  | 'attach_money'
  | 'receipt_long'
  | 'account_balance'
  | 'monetization_on'
  // Status & feedback
  | 'check_circle'
  | 'error'
  | 'warning'
  | 'info'
  | 'refresh'
  | 'sync'
  // Communication
  | 'mail'
  | 'chat'
  | 'send'
  | 'phone'
  // Shipping & logistics
  | 'local_shipping'
  | 'assignment'
  | 'log_in'
  // Misc
  | 'clock'
  | 'calendar_today'
  | 'download'
  | 'upload'
  | 'share'
  | 'link'
  | 'lock'
  | 'lock_open'
  | 'home'
  | 'view_cozy'
  | 'desktop_windows'
  | 'smartphone'
  | 'more_vert'
  | 'more_horiz'
  | 'drag_indicator'
  | 'bolt'
  | 'star'
  | 'star_border'

export interface IconProps {
  name: IconName
  size?: number
  filled?: boolean
  className?: string
}

/**
 * Material Symbols Outlined icon component.
 *
 * Requires the Material Symbols Outlined font to be loaded in the HTML head:
 * ```html
 * <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
 * ```
 */
export function Icon({
  name,
  size = 20,
  filled = false,
  className = '',
}: IconProps): React.JSX.Element {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
      }}
    >
      {name}
    </span>
  )
}
