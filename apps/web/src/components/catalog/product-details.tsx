'use client'

import { useState } from 'react'
import { type CatalogProduct, formatINR } from '../../lib/catalog-data'

interface ProductDetailsProps {
  product: CatalogProduct
}

const sizes = ['XS', 'S', 'M', 'L', 'XL'] as const
type Size = (typeof sizes)[number]

/**
 * Product details page matching the Stitch reference.
 *
 * Split layout: left side has image gallery, right side has product details.
 * Premium dark editorial style with sticky details panel.
 */
export function ProductDetails({ product }: ProductDetailsProps): React.JSX.Element {
  const [selectedSize, setSelectedSize] = useState<Size>('S')
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <main className="flex-grow pt-24 pb-16 px-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Image Gallery */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Main Image */}
        <div className="w-full aspect-[3/4] bg-surface-container-high rounded-lg overflow-hidden relative group">
          <img
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
            src={product.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full aspect-square bg-surface-container-high rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover opacity-90"
              src={product.image}
              alt={`${product.name} detail`}
            />
          </div>
          <div className="w-full aspect-square bg-surface-container-high rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover opacity-90"
              src={product.image}
              alt={`${product.name} alternate view`}
            />
          </div>
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit flex flex-col gap-6 p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
        {/* Title + Bookmark */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h1 className="font-display text-headline-lg md:text-display-lg text-primary tracking-tight">
              {product.name}
            </h1>
            <button
              type="button"
              onClick={() => setIsBookmarked((v) => !v)}
              className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : undefined }}
              >
                bookmark_border
              </span>
            </button>
          </div>

          {/* Price + Commission */}
          <div className="flex items-center gap-4 mt-2">
            <p className="font-title-md text-title-md text-primary">{formatINR(product.price)}</p>
            <span className="font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-full border border-outline-variant/20 tracking-widest">
              {product.commissionRate}% COMMISSION
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-outline-variant/20" />

        {/* Size Selector */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Select Size
            </span>
            <button
              type="button"
              className="font-label-caps text-label-caps text-outline hover:text-primary underline underline-offset-4 transition-colors"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center border rounded-md font-label-caps text-label-caps transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-on-primary'
                    : size === 'XL'
                      ? 'border-surface-container-highest bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50 line-through'
                      : 'border-outline-variant/50 text-on-surface hover:border-primary hover:text-primary'
                }`}
                disabled={size === 'XL'}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="w-full py-4 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-[0.1em] rounded hover:bg-inverse-surface transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            add
          </span>
          CURATE TO CATALOG
        </button>

        {/* Details Section */}
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Details
          </h3>
          <p className="font-body text-body-lg text-on-surface-variant/80 leading-relaxed">
            Premium ribbed texture, 4-way stretch, ankle-length hem. Designed for a high-compression
            silhouette. Crafted from a dense, breathable modal blend that sculpts and defines while
            offering uncompromising comfort for all-day wear.
          </p>
          <ul className="mt-4 flex flex-col gap-2 font-body text-body-lg text-on-surface-variant/60">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              65% Modal, 30% Nylon, 5% Elastane
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              Machine wash cold, dry flat
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              Made in Italy
            </li>
          </ul>
        </div>

        {/* Accordion Sections */}
        <div className="mt-4 flex flex-col border-t border-outline-variant/20">
          <button type="button" className="flex justify-between items-center py-4 w-full group">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest group-hover:text-primary-container transition-colors">
              Shipping & Returns
            </span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
              expand_more
            </span>
          </button>
          <button
            type="button"
            className="flex justify-between items-center py-4 w-full border-t border-outline-variant/20 group"
          >
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest group-hover:text-primary-container transition-colors">
              Sustainability
            </span>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
              expand_more
            </span>
          </button>
        </div>
      </div>
    </main>
  )
}
