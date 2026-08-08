import { index, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createBaseColumns } from './base.js'
import { store } from './store.js'
import { user } from './user.js'

/**
 * Store membership role enum (V1).
 *
 * V1 Architecture: One primary store per seller.
 * Store has a single owner. No admin/member roles in V1.
 *
 * Canonical UPPERCASE values per ADR-013.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 * @see docs/product/Product-Data-Model.md (Entity — Store)
 */
export const storeRoleEnum = pgEnum('store_role', ['OWNER'])

/**
 * Store membership table — User ↔ Store relationship.
 *
 * V1: Explicit ownership link between user and store.
 * A user can own at most one store (one primary store per seller).
 * A store has exactly one owner.
 *
 * `@loom/auth` and application services never read this table. Tenant
 * resolution in `apps/api/src/common/modules/tenant/tenant.service.ts` is the
 * sole reader.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
export const storeMembership = pgTable(
  'store_memberships',
  {
    ...createBaseColumns(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    storeId: uuid('store_id')
      .notNull()
      .references(() => store.id, { onDelete: 'cascade' }),
    role: storeRoleEnum('role').notNull().default('OWNER'),
    invitedAt: timestamp('invited_at', { withTimezone: true }),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  },
  (table) => [
    index('store_memberships_user_id_idx').on(table.userId),
    index('store_memberships_store_id_idx').on(table.storeId),
    index('store_memberships_user_store_idx').on(table.userId, table.storeId),
  ],
)

export type StoreMembership = typeof storeMembership.$inferSelect
export type NewStoreMembership = typeof storeMembership.$inferInsert
