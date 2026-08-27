'use client'

import { useShell } from '@loom/ui'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type CatalogCategory,
  type CatalogProduct,
  type SortOption,
  catalogCategories,
  catalogProducts,
  commissionBands,
  formatINR,
  sortOptions,
} from '../../lib/catalog-data'
import { EASE_OUT } from '../../lib/motion'
import { ProductCard } from './product-card'

interface Filters {
  category: CatalogCategory | 'all'
  commission: string
  minPrice: string
  maxPrice: string
  inStockOnly: boolean
}

const DEFAULT_FILTERS: Filters = {
  category: 'all',
  commission: 'all',
  minPrice: '',
  maxPrice: '',
  inStockOnly: false,
}

function matchesFilters(product: CatalogProduct, f: Filters): boolean {
  if (f.category !== 'all' && product.category !== f.category) return false
  if (f.inStockOnly && !product.inStock) return false
  const band = commissionBands.find((b) => b.id === f.commission)
  if (band?.min !== undefined && product.commissionRate < band.min) return false
  if (band?.max !== undefined && product.commissionRate >= band.max) return false
  if (f.minPrice !== '' && product.price < Number(f.minPrice)) return false
  if (f.maxPrice !== '' && product.price > Number(f.maxPrice)) return false
  return true
}

function sortProducts(products: CatalogProduct[], sort: SortOption): CatalogProduct[] {
  const sorted = [...products]
  switch (sort) {
    case 'commission-desc':
      sorted.sort((a, b) => b.commissionRate - a.commissionRate)
      break
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      sorted.reverse()
      break
    default:
      break
  }
  return sorted
}

/** Filter controls — shared between popover and mobile sheet. */
function FilterControls({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}): React.JSX.Element {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
          Category
        </h3>
        <div className="space-y-1">
          {(['all', ...catalogCategories] as const).map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-on-surface"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="h-3.5 w-3.5 accent-primary"
              />
              {cat === 'all' ? 'All Categories' : cat}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
          Commission Rate
        </h3>
        <div className="space-y-1">
          {commissionBands.map((band) => (
            <label
              key={band.id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-on-surface"
            >
              <input
                type="radio"
                name="commission"
                checked={filters.commission === band.id}
                onChange={() => onChange({ ...filters, commission: band.id })}
                className="h-3.5 w-3.5 accent-primary"
              />
              {band.label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
          Price Range (MRP)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            aria-label="Minimum price"
            className="w-full rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            aria-label="Maximum price"
            className="w-full rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </section>

      <section>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-on-surface">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="h-3.5 w-3.5 rounded-sm accent-primary"
          />
          In stock only
        </label>
      </section>
    </div>
  )
}

/**
 * Featured product hero section — large editorial card matching the reference.
 * Full-width, 400px height, gradient overlay, product info overlaid.
 */
function FeaturedProduct({
  product,
}: {
  product: CatalogProduct
}): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="col-span-1 cursor-pointer overflow-hidden rounded-xl bg-surface-container relative group h-[400px] md:col-span-2 lg:col-span-3 flex flex-col mb-8"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${product.image})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

      {/* Content overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
        <div>
          <h2 className="font-display-lg text-display-lg text-primary mb-2">{product.name}</h2>
          <p className="font-title-md text-title-md text-on-surface-variant">{product.brand}</p>
        </div>
        <div className="flex justify-between items-end">
          <span className="font-headline-lg text-headline-lg text-primary">
            {formatINR(product.price)}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {product.commissionRate}% COMMISSION
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Authenticated catalog — premium dark editorial layout matching the
 * approved Stitch reference. Featured hero + 3-column secondary grid.
 *
 * Preserves all existing functionality: search, category/commission/price/stock
 * filters, sort, wishlist, responsive navigation.
 */
export function CatalogPage(): React.JSX.Element {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('featured')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const { toggleSidebar } = useShell()

  // Close popovers on outside click / escape
  useEffect(() => {
    const onPointerDown = (e: PointerEvent): void => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setFilterOpen(false)
        setSortOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const visible = catalogProducts.filter((p) => {
      if (q && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false
      return matchesFilters(p, filters)
    })
    return sortProducts(visible, sort)
  }, [filters, sort, query])

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.commission !== 'all' ? 1 : 0) +
    (filters.minPrice !== '' || filters.maxPrice !== '' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  // Featured product: deterministic — first product with "Best Seller" badge, or first product
  const featured = catalogProducts.find((p) => p.badge === 'Best Seller') ?? catalogProducts[0]

  // Remaining products (excluding featured)
  const secondaryProducts = filtered.filter((p) => p.id !== featured.id)

  return (
    <>
      {/* Sticky toolbar — minimal, matches reference */}
      <header className="sticky top-0 z-30 bg-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between w-full py-6 px-8 lg:px-12">
          {/* Left: hamburger (mobile) + search */}
          <div className="flex items-center w-full max-w-md gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface lg:hidden"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                menu
              </span>
            </button>

            {/* Search input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  search
                </span>
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${catalogProducts.length} products...`}
                aria-label="Search products"
                className="w-full rounded-lg border-none bg-surface-container-high pl-10 pr-4 py-2 text-on-surface placeholder-on-surface-variant focus:ring-1 focus:ring-primary font-body-lg text-sm"
              />
            </div>
          </div>

          {/* Right: filters + divider + count */}
          <div className="flex items-center gap-6">
            {/* Filters button */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  FILTERS
                </span>
                {activeFilterCount > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-surface font-bold">
                    {activeFilterCount}
                  </span>
                ) : null}
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  tune
                </span>
              </button>

              {/* Filter popover */}
              <AnimatePresence>
                {filterOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="absolute right-0 z-50 mt-3 w-[320px] rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-headline-lg text-lg font-bold text-on-surface">
                        Filters
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setFilters(DEFAULT_FILTERS)
                        }}
                        className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                    <FilterControls filters={filters} onChange={setFilters} />
                    <div className="mt-5 pt-4 border-t border-outline-variant">
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="w-full rounded-lg bg-on-surface py-2.5 font-label-sm text-label-sm uppercase tracking-wider text-surface font-bold hover:opacity-90 transition-opacity"
                      >
                        Show {filtered.length} Products
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors"
              >
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  {sortOptions.find((s) => s.id === sort)?.label}
                </span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  expand_more
                </span>
              </button>

              <AnimatePresence>
                {sortOpen ? (
                  // biome-ignore lint/a11y/useSemanticElements: animated custom dropdown — native <select> cannot animate
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-outline-variant bg-surface-container-lowest p-1 shadow-xl"
                  >
                    {sortOptions.map((option) => (
                      <li key={option.id}>
                        <button
                          // biome-ignore lint/a11y/useSemanticElements: animated custom dropdown — native <option> cannot animate
                          type="button"
                          role="option"
                          aria-selected={sort === option.id}
                          onClick={() => {
                            setSort(option.id)
                            setSortOpen(false)
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            sort === option.id
                              ? 'bg-white/5 text-primary font-bold'
                              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                          }`}
                        >
                          {option.label}
                          {sort === option.id ? (
                            <span
                              className="material-symbols-outlined text-primary"
                              style={{ fontSize: 16 }}
                            >
                              check
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-outline-variant hidden sm:block" />

            {/* Product count */}
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:block">
              {filtered.length} PRODUCTS
            </span>
          </div>
        </div>
      </header>

      {/* Canvas / Product Grid */}
      <div className="p-8 lg:p-12 max-w-[1600px] w-full mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {/* Featured product hero */}
          {sort === 'featured' &&
          filters.category === 'all' &&
          filters.commission === 'all' &&
          !query ? (
            <FeaturedProduct product={featured} />
          ) : null}

          {/* Secondary product grid */}
          <AnimatePresence mode="popLayout">
            {(sort === 'featured' &&
            filters.category === 'all' &&
            filters.commission === 'all' &&
            !query
              ? secondaryProducts
              : filtered
            ).map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ||
        (sort === 'featured' &&
          filters.category === 'all' &&
          filters.commission === 'all' &&
          !query &&
          secondaryProducts.length === 0 &&
          filtered.length > 0) ? null : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <span className="material-symbols-outlined text-[28px] text-on-surface-variant">
              search
            </span>
            <p className="font-body-lg text-body-lg text-on-surface">
              No products match your filters
            </p>
            <p className="text-sm text-on-surface-variant">
              Try adjusting the search or filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilters(DEFAULT_FILTERS)
                setQuery('')
              }}
              className="mt-2 rounded-lg border border-outline-variant px-4 py-2 font-label-sm text-xs uppercase tracking-wider text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {filterOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: EASE_OUT }}
              // biome-ignore lint/a11y/useSemanticElements: animated filter drawer — uses Motion transform, <dialog> cannot animate x translation
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-outline-variant bg-surface-container-lowest shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
                <h2 className="font-headline-lg text-lg font-bold text-on-surface">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                  className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    close
                  </span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterControls filters={filters} onChange={setFilters} />
              </div>
              <div className="border-t border-outline-variant p-4">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="w-full rounded-lg bg-on-surface py-3 font-label-sm text-label-sm uppercase tracking-wider text-surface font-bold"
                >
                  Show {filtered.length} Products
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
