'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { fadeUp, staggerContainer } from '../../lib/motion'
import { SiteNav } from '../site-nav'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { CatalogWall } from './catalog-wall'

/**
 * Loom landing page.
 *
 * Background: the continuous catalog wall (Anime.js) with a tonal overlay so
 * the hero stays readable. Foreground: restrained Motion entrance for the
 * logo, headline, copy, and CTAs — calm foreground, alive background.
 */
export function LandingPage(): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background — catalog wall + contrast overlay */}
      <div className="fixed inset-0 z-0">
        <CatalogWall />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-background/85 via-background/50 to-background/90" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(14,14,17,0.55)_75%,rgba(14,14,17,0.9)_100%)]" />
      </div>

      {/* Navigation */}
      <SiteNav />

      {/* Foreground hero */}
      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-grid-gutter pt-24 pb-stack-lg text-center sm:px-grid-margin">
        <motion.div
          variants={staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          className="flex max-w-3xl flex-col items-center gap-stack-lg rounded-xl border border-white/10 bg-surface/40 p-stack-lg backdrop-blur-xl md:p-12"
        >
          <motion.p
            variants={fadeUp}
            className="border-l-2 border-primary pl-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant"
          >
            Premium Distributed Commerce
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-display-lg-mobile font-bold tracking-tighter text-on-surface md:text-display-lg"
          >
            LOOM
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            className="max-w-2xl font-display text-headline-md font-semibold text-on-surface-variant"
          >
            The Future of Distributed Commerce.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-xl font-body text-body-lg leading-relaxed text-on-surface-variant opacity-90"
          >
            Discover products, curate your catalog, and launch your business with a single click.
            Loom connects sellers to a premium product network with transparent commission-driven
            growth.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex w-full flex-col justify-center gap-stack-md sm:w-auto sm:flex-row"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Mobile flavor from Stitch: compact feature tiles */}
          <motion.div
            variants={fadeUp}
            className="mt-stack-md grid w-full grid-cols-2 gap-stack-sm md:hidden"
          >
            <div className="flex flex-col items-start rounded-lg border border-outline-variant bg-surface-container-low p-4">
              <Icon name="view_cozy" size={20} filled className="mb-2 text-primary" />
              <span className="font-label-caps text-label-caps text-on-surface">Curated Grids</span>
            </div>
            <div className="flex flex-col items-start rounded-lg border border-outline-variant bg-surface-container-low p-4">
              <Icon name="analytics" size={20} filled className="mb-2 text-primary" />
              <span className="font-label-caps text-label-caps text-on-surface">
                Advanced Metrics
              </span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
