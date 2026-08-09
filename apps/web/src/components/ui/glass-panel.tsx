import type React from 'react'

export interface GlassPanelProps {
  className?: string
  children: React.ReactNode
}

/**
 * Frosted panel (Stitch `.glass-panel`): translucent surface + backdrop blur.
 * Used on the landing hero so the catalog wall stays visible behind it.
 */
export function GlassPanel({ className = '', children }: GlassPanelProps): React.JSX.Element {
  return (
    <div className={`border border-white/10 bg-surface/40 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}
