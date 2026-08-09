import type React from 'react'

export interface WordmarkProps {
  className?: string
  as?: 'h1' | 'span' | 'div'
}

/**
 * LOOM wordmark — display type, tight tracking (Stitch: display-lg-mobile on
 * desktop-sized contexts, scaled down where appropriate via className).
 */
export function Wordmark({ className = '', as = 'span' }: WordmarkProps): React.JSX.Element {
  const Tag = as
  const classes = `font-display font-bold tracking-tighter text-on-surface ${className}`
  return <Tag className={classes}>LOOM</Tag>
}
