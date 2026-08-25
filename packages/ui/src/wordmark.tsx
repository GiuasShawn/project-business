import type React from 'react'

export interface WordmarkProps {
  className?: string
  as?: 'h1' | 'span' | 'div'
}

/**
 * LOOM brand wordmark.
 *
 * Uses Public Sans (display font) with tight tracking.
 * Requires Public Sans to be loaded via Google Fonts or local font files.
 */
export function Wordmark({ className = '', as = 'span' }: WordmarkProps): React.JSX.Element {
  const Tag = as
  const classes = `font-display font-bold tracking-tighter text-on-surface ${className}`
  return <Tag className={classes}>LOOM</Tag>
}
