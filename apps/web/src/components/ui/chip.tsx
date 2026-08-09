import type React from 'react'

export interface ChipProps {
  active?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

/**
 * Category/status chip. Pill (rounded-full) on mobile category rails;
 * rectangular (rounded-sm) when used inline for filters.
 */
export function Chip({
  active = false,
  className = '',
  onClick,
  children,
}: ChipProps): React.JSX.Element {
  const base = active
    ? 'bg-on-surface text-surface'
    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-200 ${base} ${className}`}
    >
      {children}
    </button>
  )
}
