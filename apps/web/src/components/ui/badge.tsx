import type React from 'react'

export type BadgeTone = 'surface' | 'accent' | 'outline' | 'success' | 'danger'

const toneClasses: Record<BadgeTone, string> = {
  surface: 'bg-surface text-on-surface border border-outline-variant',
  accent: 'bg-tertiary text-on-tertiary',
  outline: 'border border-outline-variant text-on-surface-variant',
  success: 'bg-tertiary-container/40 text-tertiary border border-tertiary/20',
  danger: 'bg-error-container/40 text-error border border-error/20',
}

export interface BadgeProps {
  tone?: BadgeTone
  className?: string
  children: React.ReactNode
}

/**
 * Small uppercase status/label chip. Rectangular (rounded-sm), used for
 * product badges, stock status, and metadata labels.
 */
export function Badge({
  tone = 'surface',
  className = '',
  children,
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 font-label-caps text-[10px] uppercase tracking-widest ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
