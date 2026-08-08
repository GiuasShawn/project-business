import { index, jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createBaseColumns } from './base.js'
import { user } from './user.js'

/**
 * Store status enum.
 *
 * Lifecycle: created → configured → published → active → suspended → archived
 */
export const storeStatusEnum = pgEnum('store_status', [
  'created',
  'configured',
  'published',
  'active',
  'suspended',
  'archived',
])

/**
 * Store table — tenant boundary.
 *
 * Represents a seller's storefront and serves as the tenant boundary
 * for row-level multi-tenancy. Every tenant-owned record includes a
 * store_id foreign key.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 * @see docs/product/Product-Data-Model.md
 */
export const store = pgTable(
  'stores',
  {
    ...createBaseColumns(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    logo: text('logo'),
    banner: text('banner'),
    status: storeStatusEnum('status').notNull().default('created'),
    settings: jsonb('settings').$type<StoreSettings>().default({}),
    branding: jsonb('branding').$type<StoreBranding>().default({}),
    seo: jsonb('seo').$type<StoreSeo>().default({}),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('stores_owner_id_idx').on(table.ownerId),
    index('stores_status_idx').on(table.status),
    index('stores_slug_idx').on(table.slug),
  ],
)

/**
 * Store settings — flexible JSON configuration.
 */
export interface StoreSettings {
  readonly currency?: string
  readonly timezone?: string
  readonly locale?: string
  readonly taxRate?: number
  readonly commissionRate?: number
}

/**
 * Store branding — visual identity.
 */
export interface StoreBranding {
  readonly primaryColor?: string
  readonly secondaryColor?: string
  readonly fontFamily?: string
  readonly favicon?: string
}

/**
 * Store SEO — search engine optimization.
 */
export interface StoreSeo {
  readonly title?: string
  readonly description?: string
  readonly keywords?: string[]
  readonly ogImage?: string
}

export type Store = typeof store.$inferSelect
export type NewStore = typeof store.$inferInsert
