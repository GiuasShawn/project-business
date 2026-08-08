export { db, createDb } from './client.js'
export type { Database } from './client.js'

export {
  baseTable,
  createBaseColumns,
  createOptionalAuditColumns,
} from './schema/base.js'
export type { BaseTableType } from './schema/base.js'

export { user, userRoleEnum } from './schema/user.js'
export type { User, NewUser } from './schema/user.js'

export { session } from './schema/session.js'
export type { Session, NewSession } from './schema/session.js'

export { store, storeStatusEnum } from './schema/store.js'
export type {
  Store,
  NewStore,
  StoreSettings,
  StoreBranding,
  StoreSeo,
} from './schema/store.js'

export { storeMembership, storeRoleEnum } from './schema/store-membership.js'
export type { StoreMembership, NewStoreMembership } from './schema/store-membership.js'

// Cross-domain primitives (Phase 04).
export { account } from './schema/primitives/account.js'
export type { Account, NewAccount } from './schema/primitives/account.js'

export { verification } from './schema/primitives/verification.js'
export type { Verification, NewVerification } from './schema/primitives/verification.js'

export { currency, currencyStatusEnum } from './schema/primitives/currencies.js'
export type { Currency, NewCurrency } from './schema/primitives/currencies.js'

export { address, addressPurposeEnum } from './schema/primitives/addresses.js'
export type { Address, NewAddress } from './schema/primitives/addresses.js'

export { fileAsset, fileAssetStatusEnum } from './schema/primitives/file-assets.js'
export type { FileAsset, NewFileAsset } from './schema/primitives/file-assets.js'

export { auditLog, auditActionEnum, auditSeverityEnum } from './schema/primitives/audit-logs.js'
export type { AuditLog, NewAuditLog } from './schema/primitives/audit-logs.js'

// Platform-wide DB-004 enums (declared ahead of table-creation in later phases).
export {
  sellerStatusEnum,
  orderStatusEnum,
  paymentStatusEnum,
  returnStatusEnum,
  commissionStatusEnum,
  payoutStatusEnum,
  notificationStatusEnum,
} from './schema/enums.js'

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
} from './schema/relations.js'
