'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { EASE_OUT } from '../../lib/motion'
import { Icon } from './icon'

export interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  /** Dialog title for aria-label. Required for accessibility. */
  title?: string
  /** Show close button in header. Default: true */
  showClose?: boolean
  /** Optional className for the content container */
  className?: string
  /** Optional header content. If not provided, a default header with title and close button is rendered. */
  header?: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
}

/**
 * Loom dialog component.
 *
 * Provides accessible dialog semantics with backdrop, Escape-to-close,
 * and focus management. Uses Motion for subtle enter/exit animation
 * that respects reduced-motion preferences.
 *
 * Design tokens: surface-container-lowest (background), outline-variant (borders),
 * on-surface (text), tertiary (accent).
 */
export function Dialog({
  open,
  onClose,
  children,
  title,
  showClose = true,
  className = '',
  header,
  footer,
}: DialogProps): React.JSX.Element {
  const reduceMotion = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Store the element that had focus before the dialog opened
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [open])

  // Focus trap and Escape key handling
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && contentRef.current) {
        const focusableElements = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus the first focusable element or the content container
    requestAnimationFrame(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstFocusable?.focus() ?? contentRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the element that had it before the dialog opened
      previousFocusRef.current?.focus()
    }
  }, [open, onClose])

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
    return undefined
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog panel */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose()
            }}
          >
            <div
              ref={contentRef}
              // biome-ignore lint/a11y/useSemanticElements: Using div with role="dialog" for motion animation control
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className={`flex max-h-[85vh] w-full max-w-lg flex-col rounded border border-outline-variant bg-surface-container-lowest shadow-2xl ${className}`}
            >
              {/* Header */}
              {header !== undefined ? (
                header
              ) : title ? (
                <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
                  <h2 className="font-display text-lg font-bold tracking-tight text-on-surface">
                    {title}
                  </h2>
                  {showClose ? (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close dialog"
                      className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                    >
                      <Icon name="close" size={20} />
                    </button>
                  ) : null}
                </div>
              ) : null}

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

              {/* Footer */}
              {footer ? (
                <div className="border-t border-outline-variant px-6 py-4">{footer}</div>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
