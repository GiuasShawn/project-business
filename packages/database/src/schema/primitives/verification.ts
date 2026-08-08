import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'

/**
 * Better Auth `verifications` table — token storage.
 *
 * Cross-domain primitive: Identity Domain — Authentication.
 * Stores tokens for `verifyEmail`, `requestPasswordReset`, and any other
 * token-bearing Better Auth flow. Better Auth inserts/reads rows here.
 *
 * Application code MUST NOT read `verifications.value` directly. Better Auth
 * reads it to validate the token during verifyEmail / resetPassword calls.
 *
 * @see docs/adr/ADR-005-Better-Auth.md
 * @see docs/adr/ADR-016-Better-Auth-Persistence.md
 */
export const verification = pgTable(
  'verifications',
  {
    ...createBaseColumns(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('verifications_identifier_idx').on(table.identifier)],
)

export type Verification = typeof verification.$inferSelect
export type NewVerification = typeof verification.$inferInsert
