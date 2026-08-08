/**
 * Centralized role definitions for Project Loom.
 *
 * Roles are defined once and used across the entire application.
 * Do not add roles here without documented architecture approval.
 */

export const Role = {
  ADMIN: 'admin',
  SELLER: 'seller',
  CUSTOMER: 'customer',
} as const

export type Role = (typeof Role)[keyof typeof Role]

/**
 * Role hierarchy for inheritance-based permission checking.
 * Higher roles inherit permissions from lower roles.
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.ADMIN]: [Role.SELLER, Role.CUSTOMER],
  [Role.SELLER]: [Role.CUSTOMER],
  [Role.CUSTOMER]: [],
}

/**
 * Check if a role has a higher or equal privilege level than another role.
 */
export function hasRoleHierarchy(userRole: Role, requiredRole: Role): boolean {
  if (userRole === requiredRole) return true
  return ROLE_HIERARCHY[userRole].includes(requiredRole)
}
