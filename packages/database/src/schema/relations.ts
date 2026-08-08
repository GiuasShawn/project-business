import { relations } from 'drizzle-orm'
import { account } from './primitives/account.js'
import { address } from './primitives/addresses.js'
import { auditLog } from './primitives/audit-logs.js'
import { currency } from './primitives/currencies.js'
import { fileAsset } from './primitives/file-assets.js'
import { verification } from './primitives/verification.js'
import { session } from './session.js'
import { storeMembership } from './store-membership.js'
import { store } from './store.js'
import { user } from './user.js'

/**
 * Drizzle relational-query declarations.
 *
 * Mirrors the FK topology of the schema. Always present in the same file as
 * the table definitions per Drizzle docs (separating them into a relations.ts
 * is supported and used here to keep `index.ts` tidy and to avoid circular
 * import issues between primitive tables that reference each other).
 *
 * `addresses.owner_user_id` and `file_assets.owner_id` are polymorphic-by-
 * convention; relations are intentionally omitted for them (they reference
 * many domains). Use direct queries in service code.
 */

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  stores: many(store, { relationName: 'store_owner' }),
  memberships: many(storeMembership),
  accounts: many(account),
  auditLogs: many(auditLog),
  addresses: many(address),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const storeRelations = relations(store, ({ one, many }) => ({
  owner: one(user, { fields: [store.ownerId], references: [user.id], relationName: 'store_owner' }),
  memberships: many(storeMembership),
}))

export const storeMembershipRelations = relations(storeMembership, ({ one }) => ({
  user: one(user, { fields: [storeMembership.userId], references: [user.id] }),
  store: one(store, { fields: [storeMembership.storeId], references: [store.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const verificationRelations = relations(verification, () => ({}))

// address and file_asset intentionally have no relations() entries here —
// their owner columns are polymorphic-by-convention.

export const currencyRelations = relations(currency, () => ({}))

export const fileAssetRelations = relations(fileAsset, () => ({}))

export const auditLogRelations = relations(auditLog, () => ({}))
