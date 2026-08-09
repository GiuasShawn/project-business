'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type CatalogCategory,
  type CatalogProduct,
  type SortOption,
  catalogCategories,
  catalogProducts,
  commissionBands,
  sortOptions,
} from '../../lib/catalog-data'
import { EASE_OUT } from '../../lib/motion'
import { Chip } from '../ui/chip'
import { Icon } from '../ui/icon'
import { Input } from '../ui/input'
import { CatalogSidebar } from './catalog-sidebar'
import { MobileBottomNav } from './mobile-bottom-nav'
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

/** Filter controls shared by the desktop filter pane and the mobile sheet. */
function FilterControls({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (next: Filters) => void
}): React.JSX.Element {
  return (
    <div className="space-y-7">
      <section>
        <h3 className="mb-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          Category
        </h3>
        <div className="space-y-1">
          {(['all', ...catalogCategories] as const).map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5 text-body-sm text-on-surface"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="h-3.5 w-3.5 accent-tertiary"
              />
              {cat === 'all' ? 'All Categories' : cat}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          Commission Rate
        </h3>
        <div className="space-y-1">
          {commissionBands.map((band) => (
            <label
              key={band.id}
              className="flex cursor-pointer items-center gap-2.5 text-body-sm text-on-surface"
            >
              <input
                type="radio"
                name="commission"
                checked={filters.commission === band.id}
                onChange={() => onChange({ ...filters, commission: band.id })}
                className="h-3.5 w-3.5 accent-tertiary"
              />
              {band.label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          Price Range (MRP)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            aria-label="Minimum price"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            aria-label="Maximum price"
          />
        </div>
      </section>

      <section>
        <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-on-surface">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="h-3.5 w-3.5 rounded-sm accent-tertiary"
          />
          In stock only
        </label>
      </section>
    </div>
  )
}

/**
 * Authenticated catalog (seller discovery experience). NOT a consumer
 * homepage: product cards lead with commission, availability, and the
 * storefront action. Filters/sort/search reflow the grid with Motion layout
 * animations; the mobile filter sheet is an animated drawer.
 */
export function CatalogPage(): React.JSX.Element {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('featured')
  const [query, setQuery] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Close popovers on outside click / escape.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent): void => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setSortOpen(false)
        setSheetOpen(false)
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

  return (
    <div className="flex min-h-dvh bg-background">
      <CatalogSidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        {/* Sticky toolbar */}
        <header className="sticky top-0 z-30 border-b border-outline-variant bg-background/90 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 pt-4 pb-3 lg:px-10">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-xl font-bold tracking-tight text-on-surface lg:text-2xl">
                Curated Catalog
              </h1>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                {filtered.length} products
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant">
                  <Icon name="search" size={18} />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="w-full rounded border border-outline-variant bg-surface-container-high py-2.5 pl-10 pr-3 text-body-sm text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container"
                />
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex items-center gap-2 rounded border border-outline-variant px-3.5 py-2.5 font-label-caps text-label-caps uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high xl:hidden"
              >
                <Icon name="tune" size={16} />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-tertiary px-1 text-[10px] text-on-tertiary">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  className="inline-flex items-center gap-2 rounded border border-outline-variant px-3.5 py-2.5 font-label-caps text-label-caps uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  {sortOptions.find((s) => s.id === sort)?.label}
                  <Icon name="expand_more" size={16} />
                </button>
                <AnimatePresence>
                  {sortOpen ? (
                    // biome-ignore lint/a11y/useSemanticElements: custom animated listbox; a native <select> cannot host Motion entrance/exit
                    <motion.ul
                      role="listbox"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE_OUT }}
                      className="absolute right-0 z-50 mt-2 w-56 rounded border border-outline-variant bg-surface-container-lowest p-1 shadow-xl"
                    >
                      {sortOptions.map((option) => (
                        <li key={option.id}>
                          <button
                            // biome-ignore lint/a11y/useSemanticElements: <option> cannot be a Motion-interactive child; buttons carry option semantics
                            type="button"
                            role="option"
                            aria-selected={sort === option.id}
                            onClick={() => {
                              setSort(option.id)
                              setSortOpen(false)
                            }}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-body-sm transition-colors ${
                              sort === option.id
                                ? 'bg-secondary-container/40 text-on-secondary-container'
                                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                            }`}
                          >
                            {option.label}
                            {sort === option.id ? (
                              <Icon name="check" size={15} className="text-tertiary" />
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop filter pane + content */}
        <div className="flex gap-6 px-4 pt-5 lg:gap-8 lg:px-10">
          <aside className="hidden w-[260px] shrink-0 xl:block">
            <div className="sticky top-32 rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
              <FilterControls filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Category chips (mobile / tablet) */}
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 xl:hidden">
              {(['all', ...catalogCategories] as const).map((cat) => (
                <Chip
                  key={cat}
                  active={filters.category === cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                >
                  {cat === 'all' ? 'All' : cat}
                </Chip>
              ))}
            </div>

            {/* Product grid — motion reflow on filter/sort/search changes */}
            <motion.div
              layout={!reduceMotion}
              className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                  >
                    <ProductCard product={product} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <Icon name="search" size={28} className="text-on-surface-variant" />
                <p className="font-body-lg text-body-lg text-on-surface">
                  No products match your filters
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Try adjusting the search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS)
                    setQuery('')
                  }}
                  className="mt-2 rounded border border-outline-variant px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest text-tertiary transition-colors hover:bg-surface-container-high"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <MobileBottomNav />

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheetOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: EASE_OUT }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-outline-variant bg-surface-container-lowest shadow-2xl xl:hidden"
              // biome-ignore lint/a11y/useSemanticElements: animated filter drawer needs Motion transform control a <div> provides; <dialog> cannot animate x translation
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
                <h2 className="font-display text-lg font-bold tracking-tight text-on-surface">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close filters"
                  className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterControls filters={filters} onChange={setFilters} />
              </div>
              <div className="border-t border-outline-variant p-4">
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="w-full rounded bg-on-surface py-3 font-label-caps text-label-caps uppercase tracking-widest text-surface"
                >
                  Show {filtered.length} Products
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
