'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { type CatalogProduct, formatINR } from '../../lib/catalog-data'
import { EASE_OUT } from '../../lib/motion'
import { Badge } from '../ui/badge'
import { Icon } from '../ui/icon'

/**
 * Product card variants.
 *
 * Desktop (Stitch catalog): borderless until hover, image muted until hover,
 * overlay reveals the "Add to Store" action. Compact (mobile): 3/4 image,
 * wishlist button, price + commission chip.
 *
 * Commission is a CORE Loom concept — it is always visible inline on the
 * card, never hidden behind an interaction.
 */
export function ProductCard({
  product,
  compact = false,
  layout = false,
}: {
  product: CatalogProduct
  compact?: boolean
  layout?: boolean
}): React.JSX.Element {
  const [wishlisted, setWishlisted] = useState(false)
  const reduceMotion = useReducedMotion()

  if (compact) {
    return (
      <motion.article layout={layout && !reduceMotion} className="group relative">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface-container-low">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <button
            type="button"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => setWishlisted((v) => !v)}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-background/60 text-on-surface backdrop-blur-sm transition-colors hover:bg-background/80"
          >
            <motion.span
              key={wishlisted ? 'on' : 'off'}
              initial={reduceMotion ? false : { scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="flex"
            >
              <Icon
                name={wishlisted ? 'favorite' : 'favorite_border'}
                size={16}
                filled={wishlisted}
                className={wishlisted ? 'text-tertiary' : ''}
              />
            </motion.span>
          </button>
        </div>
        <div className="mt-2.5">
          <h3 className="truncate font-body-lg text-body-lg font-medium text-on-surface">
            {product.name}
          </h3>
          <p className="mt-0.5 truncate text-body-sm text-on-surface-variant">{product.brand}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-data-mono text-data-mono text-on-surface">
              {formatINR(product.price)}
            </span>
            <span className="rounded-sm bg-tertiary-container/40 px-1.5 py-0.5 font-data-mono text-[11px] tracking-tight text-tertiary">
              {product.commissionRate}% COMMISSION
            </span>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      layout={layout && !reduceMotion}
      className="group relative rounded-lg border border-transparent bg-surface-container-lowest p-2 transition-colors duration-300 hover:border-outline-variant"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover opacity-80 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
        {product.badge ? (
          <div className="absolute top-3 left-3">
            <Badge tone={product.badge === 'Best Seller' ? 'surface' : 'accent'}>
              {product.badge}
            </Badge>
          </div>
        ) : null}
        {/* Hover overlay: reveal the primary action without obscuring the image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded bg-on-surface py-2.5 font-label-caps text-label-caps uppercase tracking-widest text-surface transition-colors hover:bg-tertiary">
            Add to Store
          </span>
        </div>
      </div>
      <div className="px-1 pt-3 pb-1">
        <h3 className="truncate font-body-lg text-body-lg font-semibold text-on-surface transition-colors duration-300 group-hover:text-tertiary">
          {product.name}
        </h3>
        <p className="mt-0.5 truncate text-body-sm text-on-surface-variant">{product.brand}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-data-mono text-data-mono text-on-surface">
            {formatINR(product.price)}
          </span>
          <span className="font-data-mono text-data-mono text-tertiary">
            {product.commissionRate}% <span className="text-on-surface-variant/70">COMMISSION</span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              product.inStock ? 'bg-tertiary/80' : 'bg-error/80'
            }`}
          />
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
            {product.inStock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
