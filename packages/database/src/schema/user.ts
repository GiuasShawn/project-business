import { boolean, index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * User roles enum.
 *
 * Canonical UPPERCASE values per docs/database/Database-Package.md DB-004.
 *
 * V1 application RBAC uses only `CUSTOMER`, `SELLER`, `ADMIN`. `SUPER_ADMIN` is
 * reserved as a canonical database enum value but is NOT activated in V1
 * authorization. Activation of `SUPER_ADMIN` is deferred to the future
 * Admin Module phase.
 *
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 * @see docs/adr/ADR-014-V1-User-Roles.md
 */
export const userRoleEnum = pgEnum('user_role', ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'])

/**
 * User table — Project Loom identity + application-owned role.
 *
 * Notes:
 * - Better Auth manages password persistence; password hashes live on the
 *   `accounts` cross-domain primitive table (Phase 04).
 * - The `role` column below is the application-level role (V1: 3 roles).
 *   Better Auth does not read or write this column.
 * - The `id` column is a UUID v4 (PostgreSQL `gen_random_uuid()`). Phase 04
 *   does not implement UUID v7 generation; DB-002 prefers v7 with v4 fallback.
 *
 * @see docs/adr/ADR-005-Better-Auth.md
 * @see docs/adr/ADR-014-V1-User-Roles.md
 */
export const user = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    role: userRoleEnum('role').notNull().default('CUSTOMER'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Additional indexes per docs/database/Database-Package.md DB-008.
    index('users_role_idx').on(table.role),
    index('users_email_verified_idx').on(table.emailVerified),
    index('users_created_at_idx').on(table.createdAt),
  ],
)

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
