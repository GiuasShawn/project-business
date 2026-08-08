/**
 * Schema barrel export.
 *
 * All domain schemas will be re-exported from here as they are created.
 * Phase 2A provides the base table and common utilities.
 * Phase 3A adds user and session schemas for authentication.
 */

export { baseTable, createBaseColumns } from './base.js'
export type { BaseTableType } from './base.js'

export { user } from './user.js'
export type { User, NewUser } from './user.js'

export { session } from './session.js'
export type { Session, NewSession } from './session.js'
