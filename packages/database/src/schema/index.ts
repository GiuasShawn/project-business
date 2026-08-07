/**
 * Schema barrel export.
 *
 * All domain schemas will be re-exported from here as they are created.
 * Phase 2A provides only the base table and common utilities.
 */

export { baseTable, createBaseColumns } from './base.js'
export type { BaseTableType } from './base.js'
