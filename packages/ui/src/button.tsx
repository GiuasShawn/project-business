import type React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

/**
 * Loom Button component using Material 3 dark scheme design tokens.
 *
 * Variants:
 * - primary: Filled button with tertiary container background (high-impact CTAs)
 * - secondary: Outlined button with outline-variant border (medium emphasis)
 * - ghost: Text-only button (low emphasis)
 * - danger: Error-colored button for destructive actions
 *
 * Sizes:
 * - sm: Compact for toolbars and inline actions
 * - md: Default size for most UI
 * - lg: Prominent CTAs and hero sections
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-label-caps text-label-caps uppercase tracking-widest transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50'

  const variantStyles = {
    primary: 'bg-tertiary-container text-tertiary hover:bg-tertiary hover:text-on-tertiary',
    secondary:
      'border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high',
    ghost:
      'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
    danger: 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error',
  }

  const sizeStyles = {
    sm: 'h-8 px-3 text-[11px]',
    md: 'h-10 px-4 text-[11px]',
    lg: 'h-12 px-6 text-[11px]',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
