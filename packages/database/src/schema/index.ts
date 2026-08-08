/**
 * Schema barrel export.
 *
 * All domain schemas and cross-domain primitives are re-exported from here.
 * The Phase 04 first migration derives its DDL entirely from this file's
 * exports.
 */

export { baseTable, createBaseColumns, createOptionalAuditColumns } from './base.js'
export type { BaseTableType } from './base.js'

export { user, userRoleEnum } from './user.js'
export type { User, NewUser } from './user.js'

export { session } from './session.js'
export type { Session, NewSession } from './session.js'

export { store, storeStatusEnum } from './store.js'
export type { Store, NewStore, StoreSettings, StoreBranding, StoreSeo } from './store.js'

export { storeMembership, storeRoleEnum } from './store-membership.js'
export type { StoreMembership, NewStoreMembership } from './store-membership.js'

// Cross-domain primitives (Phase 04).
export { account } from './primitives/account.js'
export type { Account, NewAccount } from './primitives/account.js'

export { verification } from './primitives/verification.js'
export type { Verification, NewVerification } from './primitives/verification.js'

export { currency, currencyStatusEnum } from './primitives/currencies.js'
export type { Currency, NewCurrency } from './primitives/currencies.js'

export { address, addressPurposeEnum } from './primitives/addresses.js'
export type { Address, NewAddress } from './primitives/addresses.js'

export { fileAsset, fileAssetStatusEnum } from './primitives/file-assets.js'
export type { FileAsset, NewFileAsset } from './primitives/file-assets.js'

export { auditLog, auditActionEnum, auditSeverityEnum } from './primitives/audit-logs.js'
export type { AuditLog, NewAuditLog } from './primitives/audit-logs.js'

// Platform-wide declared enums (DB-004).
export {
  sellerStatusEnum,
  orderStatusEnum,
  paymentStatusEnum,
  returnStatusEnum,
  commissionStatusEnum,
  payoutStatusEnum,
  notificationStatusEnum,
} from './enums.js'

// Drizzle relational-query relationships.
export {
  userRelations,
  sessionRelations,
  storeRelations,
  storeMembershipRelations,
  accountRelations,
  verificationRelations,
  currencyRelations,
  fileAssetRelations,
  auditLogRelations,
} from './relations.js'
