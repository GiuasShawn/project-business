import { index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'
import { user } from '../user.js'

/**
 * Better Auth `accounts` table — credential / OAuth-account persistence.
 *
 * Cross-domain primitive: Identity Domain — Authentication.
 * The Drizzle schema is owned by `@loom/database`; the shape and field names
 * are dictated by Better Auth 1.6.26 expectations.
 *
 * Application code MUST NOT read `accounts.password`, `accounts.access_token`,
 * `accounts.refresh_token`, or `accounts.id_token`. Better Auth owns the
 * semantics of credential validation; the application layer only needs to know
 * that a `users` row exists.
 *
 * Column names match Better Auth's expected model so that
 * `drizzleAdapter(db, { provider: 'pg', schema })` correctly resolves them.
 *
 * @see docs/adr/ADR-005-Better-Auth.md
 * @see docs/adr/ADR-016-Better-Auth-Persistence.md
 */
export const account = pgTable(
  'accounts',
  {
    ...createBaseColumns(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
  },
  (table) => [
    index('accounts_user_id_idx').on(table.userId),
    // Per Better Auth model semantics: a provider can only have one account per
    // unique (providerId, accountId) pair. Enforced as a unique constraint.
    uniqueIndex('accounts_provider_account_idx').on(table.providerId, table.accountId),
  ],
)

export type Account = typeof account.$inferSelect
export type NewAccount = typeof account.$inferInsert
