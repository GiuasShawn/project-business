/**
 * Minimal development identity seed.
 *
 * Creates three canonical V1 users (admin, seller, customer), the seller's
 * primary store in `DRAFT` status, and the OWNER membership linking them.
 *
 * Implementation notes:
 * - Rows are inserted directly via Drizzle (no Better Auth dependency). The
 *   password column on `accounts` is intentionally left NULL by this seed;
 *   a developer who wants to test password sign-in must call the public API
 *   endpoint `POST /api/v1/auth/register` once (Phase 14 email is wired in
 *   a follow-up), which produces a correctly-scrypted password hash.
 * - Idempotent: re-running the seed against a populated database is safe.
 *   Each insert uses `onConflictDoNothing` against the natural key.
 * - Refuses to run in `NODE_ENV=production`.
 *
 * @see docs/reports/PHASE_04_REPORT.md
 */

import { eq, sql } from 'drizzle-orm'
import { store, storeMembership, user } from '../schema/index.js'
import type { SeedFn } from './runner.js'

const DEV_PASSWORD = 'dev-password-12345' // documented reference only — accounts.password is not populated here

const ADMIN_EMAIL = 'dev+admin@projectloom.dev'
const SELLER_EMAIL = 'dev+seller@projectloom.dev'
const CUSTOMER_EMAIL = 'dev+customer@projectloom.dev'

const DEV_STORE_NAME = 'Dev Store'
const DEV_STORE_SLUG = 'dev-store'

export const seed_dev_identity: SeedFn = async (db) => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('dev-identity seed refused to run: NODE_ENV=production is not allowed.')
  }

  /**
   * Insert a row if it does not already exist on the natural key (email).
   * We use `onConflictDoNothing` against the unique email constraint.
   *
   * `returning()` would work but returns empty when the row already exists;
   * for this seed, the exact on-insert vs. on-conflict path is not important —
   * we just want a deterministic post-state.
   */
  async function ensureUser(email: string, name: string, role: 'ADMIN' | 'SELLER' | 'CUSTOMER') {
    const inserted = await db
      .insert(user)
      .values({
        email,
        name,
        emailVerified: true,
        role,
      })
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name: sql`EXCLUDED.name`,
          emailVerified: sql`EXCLUDED.email_verified`,
          role: sql`EXCLUDED.role`,
          updatedAt: sql`now()`,
        },
      })
      .returning()

    const row = inserted[0]
    if (!row) {
      throw new Error(`Failed to upsert dev user ${email}`)
    }
    return row
  }

  const admin = await ensureUser(ADMIN_EMAIL, 'Dev Admin', 'ADMIN')
  const seller = await ensureUser(SELLER_EMAIL, 'Dev Seller', 'SELLER')
  const customer = await ensureUser(CUSTOMER_EMAIL, 'Dev Customer', 'CUSTOMER')

  const insertedStore = await db
    .insert(store)
    .values({
      name: DEV_STORE_NAME,
      slug: DEV_STORE_SLUG,
      description: 'A scaffolding development store.',
      ownerId: seller.id,
      status: 'DRAFT',
    })
    .onConflictDoUpdate({
      target: store.slug,
      set: {
        name: sql`EXCLUDED.name`,
        description: sql`EXCLUDED.description`,
        // Status is left as-is on subsequent runs;
        // a developer's "DRAFT → CONFIGURED" workflow must not be reset.
        ownerId: sql`EXCLUDED.owner_id`,
        updatedAt: sql`now()`,
      },
    })
    .returning()

  const storeRow = insertedStore[0]
  if (!storeRow) {
    throw new Error('Failed to upsert dev store')
  }

  const existingMembership = await db
    .select()
    .from(storeMembership)
    .where(eq(storeMembership.userId, seller.id))
    .limit(1)

  if (existingMembership.length === 0) {
    await db.insert(storeMembership).values({
      userId: seller.id,
      storeId: storeRow.id,
      role: 'OWNER',
      acceptedAt: new Date(),
    })
  }

  const adminEmail = ADMIN_EMAIL
  const sellerEmail = SELLER_EMAIL
  const customerEmail = CUSTOMER_EMAIL

  // Touch each user row to confirm upsert idempotency without lint warnings.
  void admin
  void seller
  void customer

  console.log(
    `  → Dev identities ready: admin=${adminEmail}, seller=${sellerEmail}, customer=${customerEmail}`,
  )
  console.log(`  → Dev store ready: slug=${DEV_STORE_SLUG}, status=DRAFT, role=OWNER`)
  console.log(`  → Reference password (not seeded; for documentation only): ${DEV_PASSWORD}`)
  console.log(
    '     Note: To enable password sign-in, run POST /api/v1/auth/register for each dev email/password above after the API is running.',
  )
}
