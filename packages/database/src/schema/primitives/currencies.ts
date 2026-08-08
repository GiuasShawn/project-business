import { sql } from 'drizzle-orm'
import { check, index, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'

/**
 * Currencies cross-domain primitive.
 *
 * Identity / Platform Domain — Currency lookup.
 *
 * Holds ISO 4217 currency metadata used by the commerce and payments stacks.
 * Database-Package.md does not enumerate a `currency` table explicitly;
 * this is part of the Phase 04 foundation that supports monetary values across
 * multiple domains (orders, payouts, settlements). Each domain references a
 * `currency_code` (ISO 4217 alphabetic) without duplicating the metadata.
 *
 * @see docs/database/Database-Philosophy.md §14 (JSON Usage — replace with normalized table)
 * @see docs/product/Product-Data-Model.md (currency references throughout)
 */
export const currencyStatusEnum = pgEnum('currency_status', ['ACTIVE', 'DEPRECATED'])

export const currency = pgTable(
  'currencies',
  {
    ...createBaseColumns(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    symbol: text('symbol').notNull(),
    minorUnitFactor: text('minor_unit_factor').notNull().default('100'),
    status: currencyStatusEnum('status').notNull().default('ACTIVE'),
  },
  (table) => [
    index('currencies_status_idx').on(table.status),
    check('currencies_code_uppercase_chk', sql`${table.code} = UPPER(${table.code})`),
  ],
)

export type Currency = typeof currency.$inferSelect
export type NewCurrency = typeof currency.$inferInsert
