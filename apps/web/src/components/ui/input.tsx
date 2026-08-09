'use client'

import type React from 'react'
import { forwardRef, useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Underline-only variant used by the editor controls pane. */
  underline?: boolean
}

/**
 * Loom input. Boxed variant (Stitch auth/catalog): 1px outline-variant border,
 * 4px radius, tertiary focus ring. Underline variant (Stitch editor):
 * border-bottom only, tertiary focus border.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, underline = false, className = '', id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={`flex flex-col gap-1.5 ${underline ? '' : 'gap-2'}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={
          underline
            ? `w-full border-b border-outline-variant bg-transparent py-2 text-body-sm text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-tertiary-container ${className}`
            : `w-full rounded border border-outline-variant bg-surface px-4 py-3 font-body-lg text-body-lg text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container ${className}`
        }
        {...props}
      />
    </div>
  )
})
