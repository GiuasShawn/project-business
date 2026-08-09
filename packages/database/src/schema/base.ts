import { sql } from 'drizzle-orm'
import { index, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Common columns applied to every table.
 *
 * Convention:
 *  - UUID v7 primary key (via pg_uuidv7 extension, monotonic, time-ordered)
 *  - created_at / updated_at in UTC
 *
 * UUID v7 is preferred per ADR-017. The pg_uuidv7 extension provides
 * uuid_generate_v7() which embeds a Unix timestamp for monotonic index
 * insertion, reducing page splits and vacuum pressure at scale.
 *
 * Optional audit columns are exposed as a separate spread helper so domain
 * tables opt-in case-by-case (see docs/database/Database-Package.md DB-003
 * "Where applicable"). They are NOT included in the baseline `createBaseColumns()`
 * because most tables do not need them in V1.
 *
 * @see docs/adr/ADR-017-UUID-v7-Strategy.md
 * @see docs/database/Database-Package.md DB-003
 */

export function createBaseColumns() {
  return {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v7()`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }
}

/**
 * Optional audit columns (DB-003 §"Where applicable").
 *
 * Apply via spread: `{ ...createBaseColumns(), ...createOptionalAuditColumns() }`.
 *
 * These columns support:
 *  - `deleted_at` — soft-delete marker (recorded as a structured time stamp).
 *  - `created_by` / `updated_by` / `deleted_by` — actor reference. Phase 04
 *    uses `text` to allow either a `users.id` UUID or a system marker
 *    (`'system'`, `'migration'`).
 *  - `version` — optimistic locking counter (Database-Philosophy §18).
 *
 * They are exposed as a helper so a domain table can opt-in (e.g., Products,
 * Orders, Reviews will need them in their respective phases; identities and
 * cross-domain primitives in Phase 04 do not).
 */
export function createOptionalAuditColumns() {
  return {
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdBy: text('created_by'),
    updatedBy: text('updated_by'),
    deletedBy: text('deleted_by'),
    version: integer('version').notNull().default(1),
  }
}

/**
 * Re-usable base table reference.
 *
 * Domain schemas extend this via pgTable('table_name', { ...baseTable, ...domainColumns }).
 */
export const baseTable = createBaseColumns()

export type BaseTableType = typeof baseTable

/**
 * Re-export of frequently used Drizzle helpers so consuming files can import
 * them from a single canonical entry point.
 */
export { index, sql, text, timestamp, uuid }
