import { pgEnum } from 'drizzle-orm/pg-core'

/**
 * Canonical database enum definitions for Project Loom.
 *
 * Re-exports the schema-defined user-facing enums (`user_role`, `store_status`,
 * `store_role`) for ergonomic imports, and declares the platform-wide enums
 * defined in `docs/database/Database-Package.md` DB-004. The declared enums
 * here are DDL-only if the corresponding schema tables are not yet created —
 * e.g., `order_status` is not used by any current table (Phase 12 will
 * introduce Orders), but the enum can be introduced so subsequent migrations
 * do not need to do enum rename.
 *
 * Canonical values are UPPERCASE per ADR-013.
 *
 * @see docs/database/Database-Package.md DB-004
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 */

// Cross-domain enum: user roles. Re-exported for convenience from user.ts.
export { userRoleEnum } from './user.js'

// Cross-domain enum: store status. Re-exported for convenience from store.ts.
export { storeStatusEnum } from './store.js'

// Cross-domain enum: store membership role (V1 single-owner). Re-exported.
export { storeRoleEnum } from './store-membership.js'

/**
 * Seller status lifecycle.
 *
 * DB-004 enum family. Owned by Identity Domain.
 * No table consumes this enum in Phase 04 — users are created with role=ADMIN
 * or role=SELLER and their lifecycle state is governed by membership / store
 * status. The enum remains declared here so the Admin Module phase (which
 * will introduce a sellers table) can add a column referencing it without
 * needing a new migration on the enum family.
 */
export const sellerStatusEnum = pgEnum('seller_status', [
  'PENDING',
  'VERIFIED',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
])

/**
 * Order status lifecycle. Owned by Order Domain — table added in Phase 12.
 *
 * Declared here so future domain enums are part of the initial DDL.
 */
export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'RETURNED',
])

/**
 * Payment status lifecycle. Owned by Payment Domain — table added in Phase 12.
 */
export const paymentStatusEnum = pgEnum('payment_status', [
  'INITIATED',
  'AUTHORIZED',
  'CAPTURED',
  'SETTLED',
  'FAILED',
  'REFUNDED',
])

/**
 * Return status lifecycle. Owned by Returns Domain.
 */
export const returnStatusEnum = pgEnum('return_status', [
  'REQUESTED',
  'APPROVED',
  'COLLECTED',
  'RECEIVED',
  'REFUNDED',
  'REJECTED',
  'CLOSED',
])

/**
 * Commission status lifecycle. Owned by Seller Domain / Commissions.
 */
export const commissionStatusEnum = pgEnum('commission_status', [
  'PENDING',
  'ELIGIBLE',
  'PAID',
  'REVERSED',
])

/**
 * Payout status lifecycle. Owned by Seller Domain / Payouts.
 */
export const payoutStatusEnum = pgEnum('payout_status', [
  'PENDING',
  'SCHEDULED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
])

/**
 * Notification status lifecycle. Owned by Notification Domain — table added
 * in Phase 14. The enum is declared now so notifications can be added
 * without an enum rename migration.
 */
export const notificationStatusEnum = pgEnum('notification_status', [
  'QUEUED',
  'SENDING',
  'DELIVERED',
  'FAILED',
])
