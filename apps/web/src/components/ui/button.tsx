'use client'

import { motion, useReducedMotion } from 'motion/react'
import type React from 'react'
import { forwardRef } from 'react'
import { EASE_OUT } from '../../lib/motion'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
  > {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  // Action Indigo — the Loom commerce CTA (Stitch: tertiary-container / tertiary)
  primary:
    'bg-tertiary-container text-tertiary hover:bg-tertiary hover:text-on-tertiary border border-tertiary/20',
  // High-contrast white (Stitch: on-surface / surface)
  secondary: 'bg-on-surface text-surface hover:bg-primary',
  // Ghost outline (Stitch landing secondary CTA)
  ghost:
    'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-high',
  danger: 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2.5',
  lg: 'px-8 py-4',
}

/**
 * Loom button. Rounded to 4px (architectural, not "rounded web"), label-caps
 * type, uppercase tracking. Press feedback is a subtle scale via Motion;
 * reduced-motion users get the press without the transform.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    children,
    disabled,
    ...props
  },
  ref,
) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      ref={ref}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: EASE_OUT }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent"
        />
      ) : (
        children
      )}
    </motion.button>
  )
})
