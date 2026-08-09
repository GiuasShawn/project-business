import type React from 'react'

export type IconName =
  | 'arrow_forward'
  | 'search'
  | 'filter_list'
  | 'tune'
  | 'storefront'
  | 'inventory_2'
  | 'payments'
  | 'settings'
  | 'help_outline'
  | 'notifications'
  | 'menu'
  | 'favorite'
  | 'favorite_border'
  | 'expand_more'
  | 'cloud_upload'
  | 'add'
  | 'desktop_windows'
  | 'smartphone'
  | 'view_cozy'
  | 'analytics'
  | 'close'
  | 'check'
  | 'arrow_back'
  | 'mail'
  | 'lock'
  | 'store'
  | 'publish'
  | 'visibility'
  | 'visibility_off'
  | 'edit'
  | 'inbox'
  | 'palette'
  | 'image'

export interface IconProps {
  name: IconName
  size?: number
  filled?: boolean
  className?: string
}

/**
 * Material Symbols Outlined icon. Falls back to an empty span when the font
 * is unavailable (offline), which is acceptable for decorative icons.
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
        fontVariationSettings: filled ? `'FILL' 1, 'wght' 500` : `'FILL' 0, 'wght' 400`,
      }}
    >
      {name}
    </span>
  )
}
