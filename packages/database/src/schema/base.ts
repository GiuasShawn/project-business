import { timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Common columns applied to every table.
 *
 * Convention:
 *  - UUID primary key (gen_random_uuid default at DB level)
 *  - created_at / updated_at in UTC
 */

export function createBaseColumns() {
  return {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }
}

/**
 * Re-usable base table reference.
 *
 * Domain schemas extend this via pgTable('table_name', { ...baseTable, ...domainColumns }).
 */
export const baseTable = createBaseColumns()

export type BaseTableType = typeof baseTable
