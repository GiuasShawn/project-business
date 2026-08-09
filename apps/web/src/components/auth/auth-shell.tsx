'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import type React from 'react'
import { EASE_OUT } from '../../lib/motion'
import { Wordmark } from '../ui/wordmark'

export interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}

/**
 * Shared auth layout: centered card with the LOOM wordmark, a restrained
 * entrance, and a quiet background. Preserves the Stitch sign-in direction
 * (simple, clean, focused, responsive).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Soft background rays (static, cheap) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-tertiary-container/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-surface-container-highest/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-container-max items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" aria-label="Loom home">
            <Wordmark className="text-lg tracking-tighter" />
          </Link>
          <Link
            href="/catalog"
            className="hidden font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface md:inline-flex"
          >
            View Catalog
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="w-full max-w-md"
          >
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 md:p-10">
              <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface">
                {title}
              </h1>
              <p className="mt-2 text-body-sm text-on-surface-variant">{subtitle}</p>
              <div className="mt-8">{children}</div>
              <div className="mt-8 border-t border-outline-variant pt-6 text-center text-body-sm text-on-surface-variant">
                {footer}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
