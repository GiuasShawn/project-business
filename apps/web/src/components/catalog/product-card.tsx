'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { type CatalogProduct, formatINR } from '../../lib/catalog-data'
import { EASE_OUT } from '../../lib/motion'

/**
 * Product card matching the approved Stitch reference.
 *
 * Premium dark editorial style:
 * - Large image (280px height, rounded-xl)
 * - Product name (bold, white)
 * - Brand (muted)
 * - Price + commission in a bottom row with separator
 *
 * Commission is a first-class Loom concept — always visible inline.
 * Wishlist interaction preserved via heart button overlay.
 */
export function ProductCard({
  product,
  layout = false,
}: {
  product: CatalogProduct
  layout?: boolean
}): React.JSX.Element {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <motion.article layout={layout} className="group cursor-pointer flex flex-col">
      {/* Image container */}
      <div className="relative h-[280px] overflow-hidden rounded-xl bg-surface-container mb-4">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted((v) => !v)
          }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-background/60 text-on-surface backdrop-blur-sm transition-colors hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <motion.span
            key={wishlisted ? 'on' : 'off'}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="flex"
          >
            <span
              className={`material-symbols-outlined ${wishlisted ? 'text-tertiary' : ''}`}
              style={{ fontSize: 16, fontVariationSettings: wishlisted ? "'FILL' 1" : undefined }}
            >
              favorite
            </span>
          </motion.span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-headline-lg text-xl text-primary font-semibold mb-1">{product.name}</h3>
        <p className="font-title-md text-sm text-on-surface-variant mb-4">{product.brand}</p>

        {/* Price + Commission row */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant/30">
          <span className="font-headline-lg text-lg text-primary font-semibold">
            {formatINR(product.price)}
          </span>
          <span className="font-label-sm text-xs text-on-surface-variant">
            {product.commissionRate}% COMMISSION
          </span>
        </div>
      </div>
    </motion.article>
  )
}
