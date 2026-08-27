'use client'

import { Icon, Input } from '@loom/ui'
import type React from 'react'
import { EditorAccordion } from './editor-accordion'

export interface StorefrontState {
  storeName: string
  accentColor: string
  layout: 'grid' | 'list'
  featuredCollections: string[]
}

interface EditorSidebarProps {
  state: StorefrontState
  onChange: (next: StorefrontState) => void
}

const ACCENT_COLORS = ['#e4e1e5', '#7d7b7c', '#1a1c1c', '#c3c0ff']

const COLLECTIONS = ['FW24 Avant-Garde Collection', 'Archival Footwear', 'Brutalist Accessories']

/**
 * Editor sidebar — left pane containing all customization controls.
 * Mirrors the Stitch storefront editor desktop layout: 380px fixed,
 * surface-container-low background, accordion sections for each
 * customization domain.
 */
export function EditorSidebar({ state, onChange }: EditorSidebarProps): React.JSX.Element {
  return (
    <nav className="flex h-screen w-[380px] flex-col overflow-y-auto border-r border-outline-variant bg-surface-container-low pb-stack-lg">
      {/* Header */}
      <div className="flex flex-col gap-stack-sm border-b border-outline-variant px-6 py-stack-lg">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface">
            <Icon name="store" size={24} className="text-on-surface-variant" />
          </div>
          <div>
            <h1 className="font-display text-headline-md tracking-tight text-primary">
              {state.storeName}
            </h1>
            <p className="mt-1 font-label-caps text-label-caps text-on-surface-variant">
              Premium Tier
            </p>
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded bg-primary py-3 font-label-caps text-label-caps uppercase tracking-widest text-on-primary transition-colors hover:bg-surface-tint"
        >
          Launch Store
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-outline-variant px-2 py-4">
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-on-secondary-container"
        >
          <Icon name="storefront" size={18} />
          <span className="font-label-caps text-label-caps">Storefront</span>
        </button>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <Icon name="inventory_2" size={18} />
          <span className="font-label-caps text-label-caps">Inventory</span>
        </button>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <Icon name="payments" size={18} />
          <span className="font-label-caps text-label-caps">Earnings</span>
        </button>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <Icon name="settings" size={18} />
          <span className="font-label-caps text-label-caps">Settings</span>
        </button>
      </div>

      {/* Accordion sections */}
      <div className="mt-4 flex-1 px-6">
        <h2 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          Customization Suite
        </h2>

        {/* Brand Identity */}
        <EditorAccordion title="Brand Identity" defaultOpen>
          <div className="flex flex-col gap-6">
            <Input
              label="Store Name"
              value={state.storeName}
              onChange={(e) => onChange({ ...state, storeName: e.target.value })}
              placeholder="Enter store name"
              underline
            />
            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Logo Asset
              </span>
              <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-outline-variant transition-colors hover:bg-surface-container-high group">
                <Icon
                  name="cloud_upload"
                  size={24}
                  className="text-on-surface-variant group-hover:text-primary"
                />
                <span className="font-body-sm text-on-surface-variant group-hover:text-primary text-xs">
                  Drop SVG or PNG
                </span>
              </div>
            </div>
          </div>
        </EditorAccordion>

        {/* Theme & Color */}
        <EditorAccordion title="Theme & Color">
          <div className="flex flex-col gap-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Accent Palette
            </span>
            <div className="flex gap-4">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange({ ...state, accentColor: color })}
                  className={`h-8 w-8 rounded-full transition-all ${
                    state.accentColor === color
                      ? 'border-2 border-primary ring-2 ring-offset-2 ring-offset-background ring-tertiary-container'
                      : 'border border-outline-variant hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select accent color ${color}`}
                />
              ))}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Add custom color"
              >
                <Icon name="add" size={16} />
              </button>
            </div>
          </div>
        </EditorAccordion>

        {/* Storefront Layout */}
        <EditorAccordion title="Storefront Layout">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ ...state, layout: 'grid' })}
              className={`relative rounded border p-3 ${
                state.layout === 'grid'
                  ? 'border-tertiary-container bg-surface-container-high'
                  : 'border-outline-variant bg-surface hover:border-on-surface-variant'
              }`}
            >
              {state.layout === 'grid' ? (
                <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-tertiary-container" />
              ) : null}
              <div className="mb-2 grid grid-cols-2 gap-1">
                <div className="h-10 rounded-sm bg-outline-variant" />
                <div className="h-10 rounded-sm bg-outline-variant" />
                <div className="h-10 rounded-sm bg-outline-variant" />
                <div className="h-10 rounded-sm bg-outline-variant" />
              </div>
              <p className="font-label-caps text-center text-[10px] uppercase tracking-wider text-on-surface">
                Editorial Grid
              </p>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...state, layout: 'list' })}
              className={`rounded border p-3 transition-colors ${
                state.layout === 'list'
                  ? 'border-tertiary-container bg-surface-container-high'
                  : 'border-outline-variant bg-surface hover:border-on-surface-variant'
              }`}
            >
              <div className="mb-2 flex flex-col gap-1">
                <div className="h-6 w-full rounded-sm bg-outline-variant" />
                <div className="h-6 w-full rounded-sm bg-outline-variant" />
                <div className="h-6 w-full rounded-sm bg-outline-variant" />
              </div>
              <p className="font-label-caps text-center text-[10px] uppercase tracking-wider text-on-surface-variant">
                Linear List
              </p>
            </button>
          </div>
        </EditorAccordion>

        {/* Featured Catalog */}
        <EditorAccordion title="Featured Catalog">
          <div className="flex flex-col gap-3">
            {COLLECTIONS.map((collection) => (
              <label
                key={collection}
                className={`flex cursor-pointer items-center gap-3 rounded p-2 transition-colors ${
                  state.featuredCollections.includes(collection)
                    ? 'bg-surface-container-highest'
                    : 'hover:bg-surface-container-high'
                }`}
              >
                <input
                  type="checkbox"
                  checked={state.featuredCollections.includes(collection)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({
                        ...state,
                        featuredCollections: [...state.featuredCollections, collection],
                      })
                    } else {
                      onChange({
                        ...state,
                        featuredCollections: state.featuredCollections.filter(
                          (c) => c !== collection,
                        ),
                      })
                    }
                  }}
                  className="rounded-sm border-outline-variant text-tertiary-container accent-tertiary-container focus:ring-tertiary-container focus:ring-offset-background"
                />
                <span
                  className={`font-body-sm text-body-sm ${
                    state.featuredCollections.includes(collection)
                      ? 'text-on-surface'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {collection}
                </span>
              </label>
            ))}
          </div>
        </EditorAccordion>
      </div>
    </nav>
  )
}
