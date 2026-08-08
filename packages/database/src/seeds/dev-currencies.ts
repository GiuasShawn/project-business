/**
 * Currency lookup seed.
 *
 * Inserts a small set of canonical ISO 4217 entries (Phase 04). Phase 04 does
 * NOT seed every currency (that is Phase 14's data-import phase). The intent
 * here is to give local development immediate access to the most common
 * transaction currencies so non-currency domains (Orders, Payouts) can
 * resolve a `currency_code` FK without crashing in dev.
 */

import { sql } from 'drizzle-orm'
import { currency } from '../schema/primitives/currencies.js'
import type { SeedFn } from './runner.js'

interface Iso4217Seed {
  readonly code: string
  readonly name: string
  readonly symbol: string
  readonly minorUnitFactor: string
}

const SEED_CURRENCIES: readonly Iso4217Seed[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', minorUnitFactor: '100' },
  { code: 'USD', name: 'United States Dollar', symbol: '$', minorUnitFactor: '100' },
  { code: 'EUR', name: 'Euro', symbol: '€', minorUnitFactor: '100' },
  { code: 'GBP', name: 'Pound Sterling', symbol: '£', minorUnitFactor: '100' },
]

export const seed_dev_currencies: SeedFn = async (db) => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('dev-currencies seed refused to run: NODE_ENV=production is not allowed.')
  }

  // Upsert on conflict (unique `code`): insert if missing, otherwise no-op.
  for (const c of SEED_CURRENCIES) {
    await db
      .insert(currency)
      .values({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        minorUnitFactor: c.minorUnitFactor,
        status: 'ACTIVE',
      })
      .onConflictDoUpdate({
        target: currency.code,
        set: {
          name: sql`EXCLUDED.name`,
          symbol: sql`EXCLUDED.symbol`,
          minorUnitFactor: sql`EXCLUDED.minor_unit_factor`,
        },
      })
  }

  console.log(`  → Currencies seeded: ${SEED_CURRENCIES.map((c) => c.code).join(', ')}`)
}
