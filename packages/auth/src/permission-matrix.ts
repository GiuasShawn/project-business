/**
 * Permission matrix for Project Loom.
 *
 * Maps roles to their allowed permissions.
 * This is the single source of truth for authorization decisions.
 *
 * @see docs/spec/permissions/ for the full permission matrix documentation
 */

import type { Permission } from './permissions.js'
import { Permission as P } from './permissions.js'
import type { Role } from './roles.js'
import { Role as R } from './roles.js'

export type PermissionMatrix = Record<Role, readonly Permission[]>

/**
 * Default permission matrix.
 *
 * Admin has full access (Wildcard wildcard).
 * Seller has limited access to their own store operations.
 * Customer has access to their own profile and orders.
 */
export const DEFAULT_PERMISSION_MATRIX: PermissionMatrix = {
  [R.ADMIN]: [
    // Full system access
    P.USERS_READ,
    P.USERS_WRITE,
    P.USERS_MANAGE,
    P.PROFILE_READ,
    P.PROFILE_WRITE,
    P.PRODUCTS_READ,
    P.PRODUCTS_WRITE,
    P.PRODUCTS_MANAGE,
    P.ORDERS_READ,
    P.ORDERS_WRITE,
    P.ORDERS_MANAGE,
    P.STORES_READ,
    P.STORES_WRITE,
    P.STORES_MANAGE,
    P.INVENTORY_READ,
    P.INVENTORY_WRITE,
    P.INVENTORY_MANAGE,
    P.ANALYTICS_READ,
    P.ANALYTICS_MANAGE,
    P.PAYMENTS_READ,
    P.PAYMENTS_WRITE,
    P.PAYMENTS_MANAGE,
    P.SETTINGS_READ,
    P.SETTINGS_WRITE,
    P.SETTINGS_MANAGE,
    P.SYSTEM_MANAGE,
  ],
  [R.SELLER]: [
    // Profile
    P.PROFILE_READ,
    P.PROFILE_WRITE,

    // Products (own store)
    P.PRODUCTS_READ,
    P.PRODUCTS_WRITE,

    // Orders (own store)
    P.ORDERS_READ,
    P.ORDERS_WRITE,

    // Store management (own store)
    P.STORES_READ,
    P.STORES_WRITE,

    // Inventory (own store)
    P.INVENTORY_READ,
    P.INVENTORY_WRITE,

    // Analytics (own store)
    P.ANALYTICS_READ,
  ],
  [R.CUSTOMER]: [
    // Profile
    P.PROFILE_READ,
    P.PROFILE_WRITE,

    // Orders (own orders)
    P.ORDERS_READ,

    // Products (read only - browsing)
    P.PRODUCTS_READ,
  ],
}

/**
 * Get permissions for a role.
 */
export function getPermissionsForRole(
  role: Role,
  matrix: PermissionMatrix = DEFAULT_PERMISSION_MATRIX,
): readonly Permission[] {
  return matrix[role] ?? []
}

/**
 * Check if a role has a specific permission.
 */
export function roleHasPermission(
  role: Role,
  permission: Permission,
  matrix: PermissionMatrix = DEFAULT_PERMISSION_MATRIX,
): boolean {
  const permissions = getPermissionsForRole(role, matrix)
  return permissions.includes(permission)
}
