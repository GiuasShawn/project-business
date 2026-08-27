'use client'

import { Icon } from '@loom/ui'
import type React from 'react'
import { catalogProducts } from '../../lib/catalog-data'
import type { StorefrontState } from './editor-sidebar'

interface EditorPreviewProps {
  state: StorefrontState
}

/**
 * Editor preview — right pane showing live storefront preview.
 * Mirrors the Stitch storefront editor desktop layout: full-height canvas
 * with radial gradient background, centered preview container with
 * mockup nav, hero, and product grid.
 */
export function EditorPreview({ state }: EditorPreviewProps): React.JSX.Element {
  const featuredProducts = catalogProducts
    .filter((p) =>
      state.featuredCollections.some((c) => c.toLowerCase().includes(p.category.toLowerCase())),
    )
    .slice(0, 3)

  // Fallback if no featured products match
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : catalogProducts.slice(0, 3)

  return (
    <main className="ml-[380px] flex h-screen flex-1 flex-col bg-surface-container-lowest relative">
      {/* Preview toolbar */}
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
            Viewport Mode
          </span>
          <div className="flex rounded border border-outline-variant bg-surface-container-high p-1">
            <button
              type="button"
              className="rounded bg-secondary-container p-1 px-3 text-on-secondary-container transition-colors"
              aria-label="Desktop viewport"
            >
              <Icon name="desktop_windows" size={18} />
            </button>
            <button
              type="button"
              className="p-1 px-3 text-on-surface-variant transition-colors hover:text-on-surface"
              aria-label="Mobile viewport"
            >
              <Icon name="smartphone" size={18} />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="rounded bg-primary px-6 py-2 font-label-caps text-label-caps uppercase tracking-widest text-on-primary shadow-[0_0_15px_rgba(200,198,199,0.1)] transition-opacity hover:opacity-90"
        >
          Publish Changes
        </button>
      </header>

      {/* Canvas area */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto bg-[radial-gradient(circle_at_center,rgba(42,42,45,0.4)_0%,rgba(14,14,17,1)_100%)] p-grid-margin">
        {/* Storefront mockup container */}
        <div className="flex min-h-[900px] w-full max-w-[1200px] flex-col border border-outline-variant bg-background shadow-2xl">
          {/* Mockup top nav */}
          <nav className="flex w-full items-center justify-between border-b border-outline-variant bg-surface px-grid-margin py-6">
            <div className="font-display text-display-lg-mobile uppercase tracking-tighter text-on-surface">
              {state.storeName}
            </div>
            <div className="flex gap-6 font-label-caps text-label-caps uppercase tracking-widest">
              <span className="border-b-2 border-on-surface pb-1 text-on-surface">Shop</span>
              <span className="text-on-surface-variant">Editorial</span>
              <span className="text-on-surface-variant">Archive</span>
            </div>
            <div className="flex gap-4 text-on-surface">
              <Icon name="search" size={20} />
              <Icon name="inventory_2" size={20} />
            </div>
          </nav>

          {/* Mockup hero section */}
          <div className="group relative h-[500px] overflow-hidden border-b border-outline-variant bg-surface-container-high">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/80 to-transparent p-grid-margin">
              <h2 className="max-w-2xl font-display text-display-lg uppercase tracking-tighter text-on-surface">
                {state.featuredCollections[0] || 'FW24 Avant-Garde Collection'}
              </h2>
              <button
                type="button"
                className="mt-6 w-max border border-on-surface bg-transparent px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface transition-colors hover:bg-on-surface hover:text-background"
              >
                Explore Campaign
              </button>
            </div>
          </div>

          {/* Mockup product grid */}
          <div className="bg-background p-grid-margin">
            <div className="mb-8 flex items-end justify-between">
              <h3 className="font-display text-headline-md text-on-surface">Curated Arrivals</h3>
              <span className="cursor-pointer border-b border-outline-variant pb-1 font-label-caps uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface">
                View All
              </span>
            </div>
            <div
              className={`grid gap-grid-gutter ${
                state.layout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {displayProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="mb-4 aspect-[4/5] overflow-hidden bg-surface-container-low">
                    <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                      <Icon name="image" size={32} />
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-body-lg font-medium text-on-surface">
                        {product.name}
                      </p>
                      <p className="mt-1 font-body text-body-sm text-on-surface-variant">
                        {product.brand}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="border border-outline-variant px-2 py-1 font-data-mono text-data-mono text-on-surface">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded-sm bg-tertiary-container/10 px-2 py-1 font-data-mono text-[12px] text-tertiary-container">
                      {product.commissionRate}% Comm.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
