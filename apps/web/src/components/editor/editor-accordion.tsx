'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type React from 'react'
import { useState } from 'react'
import { EASE_OUT } from '../../lib/motion'
import { Icon } from '../ui/icon'

interface AccordionSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

/**
 * Editor accordion section.
 *
 * Expandable/collapsible section for the editor sidebar. Uses Motion for
 * smooth height animation that respects reduced-motion preferences.
 * Design tokens: outline-variant (borders), on-surface (text),
 * surface-container-high (hover), tertiary (accent).
 */
export function EditorAccordion({
  title,
  defaultOpen = false,
  children,
}: AccordionSectionProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const reduceMotion = useReducedMotion()

  return (
    <div className="border-b border-outline-variant">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-body-lg text-body-lg font-medium text-on-surface transition-colors group-hover:text-primary">
          {title}
        </span>
        <motion.span
          animate={reduceMotion ? {} : { rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="text-on-surface-variant"
        >
          <Icon name="expand_more" size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={reduceMotion ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
