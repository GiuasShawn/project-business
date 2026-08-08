/**
 * Schema barrel export.
 *
 * All domain schemas will be re-exported from here as they are created.
 * Phase 2A provides the base table and common utilities.
 * Phase 3A adds user and session schemas for authentication.
 * Phase 3B adds role to user schema for authorization.
 * Phase 3C adds store and store_membership schemas for multi-tenancy.
 */

export { baseTable, createBaseColumns } from './base.js'
export type { BaseTableType } from './base.js'

export { user, userRoleEnum } from './user.js'
export type { User, NewUser } from './user.js'

export { session } from './session.js'
export type { Session, NewSession } from './session.js'

export { store, storeStatusEnum } from './store.js'
export type { Store, NewStore, StoreSettings, StoreBranding, StoreSeo } from './store.js'

export { storeMembership, storeRoleEnum } from './store-membership.js'
export type { StoreMembership, NewStoreMembership } from './store-membership.js'
