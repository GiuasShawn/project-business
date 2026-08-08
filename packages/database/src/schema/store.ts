import { index, jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createBaseColumns } from './base.js'
import { user } from './user.js'

/**
 * Store status enum.
 *
 * Canonical UPPERCASE values per docs/database/Database-Package.md DB-004.
 *
 * Lifecycle: DRAFT → CONFIGURED → PUBLISHED → ACTIVE → SUSPENDED → ARCHIVED.
 *
 * The initial state of a brand-new store is `DRAFT` per ADR-015. Phase 03C's
 * de-facto `created` literal value is normalized to `DRAFT` in this Phase 04
 * first migration.
 *
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 * @see docs/adr/ADR-015-Store-Status-Initial-State.md
 */
export const storeStatusEnum = pgEnum('store_status', [
  'DRAFT',
  'CONFIGURED',
  'PUBLISHED',
  'ACTIVE',
  'SUSPENDED',
  'ARCHIVED',
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
    status: storeStatusEnum('status').notNull().default('DRAFT'),
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
    // `slug` already gets a unique index via the unique constraint above;
    // an extra plain index is redundant and intentionally omitted.
    index('stores_created_at_idx').on(table.createdAt),
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
