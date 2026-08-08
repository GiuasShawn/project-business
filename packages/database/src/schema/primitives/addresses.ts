import { sql } from 'drizzle-orm'
import { boolean, check, index, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'

/**
 * Address purpose enum.
 *
 * Distinguishes whether an address is a SHIPPING destination, a BILLING address,
 * or BOTH. The Customer and Order domains will reference addresses by id; this
 * enum captures the consumer interpretation.
 */
export const addressPurposeEnum = pgEnum('address_purpose', ['SHIPPING', 'BILLING', 'BOTH'])

/**
 * Addresses cross-domain primitive.
 *
 * Customer Domain — addresses used by both Customer (default shipping/billing
 * for the customer account) and Orders (shipping label). Per
 * `docs/product/Product-Data-Model.md` §2, the Customer Domain owns the
 * Address concept.
 *
 * V1 scope: a sufficient set of fields to render shipping forms and produce a
 * label. Country subdivision, company name, and notes are deliberately NOT
 * added in Phase 04 (they are domain-extension candidates).
 *
 * Soft-deletable: an address removed by a customer should remain available for
 * historical Orders. The `is_archived` flag is preferred over hard delete.
 */
export const address = pgTable(
  'addresses',
  {
    ...createBaseColumns(),
    ownerUserId: text('owner_user_id'),
    label: text('label'),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    region: text('region'),
    postalCode: text('postal_code').notNull(),
    countryCode: text('country_code').notNull(),
    phone: text('phone'),
    purpose: addressPurposeEnum('purpose').notNull().default('BOTH'),
    isDefault: boolean('is_default').notNull().default(false),
    isArchived: boolean('is_archived').notNull().default(false),
  },
  (table) => [
    index('addresses_owner_user_id_idx').on(table.ownerUserId),
    index('addresses_country_code_idx').on(table.countryCode),
    index('addresses_postal_code_idx').on(table.postalCode),
    check(
      'addresses_country_code_uppercase_chk',
      sql`${table.countryCode} = UPPER(${table.countryCode})`,
    ),
  ],
)

export type Address = typeof address.$inferSelect
export type NewAddress = typeof address.$inferInsert
