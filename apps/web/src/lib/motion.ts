import type { Variants } from 'motion/react'

/**
 * Shared Motion variants for the Loom design language.
 *
 * Motion is the library for ordinary React UI interaction. These presets keep
 * entrances restrained and consistent: short distance, gentle easing, no
 * bouncing. Everything degrades to an instant/opacity-only state when the user
 * prefers reduced motion (handled by the components via `useReducedMotion`).
 */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}
