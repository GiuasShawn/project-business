/**
 * Centralized role definitions for Project Loom.
 *
 * V1 application roles are exactly three (per ADR-014):
 *   - ADMIN
 *   - SELLER
 *   - CUSTOMER
 *
 * `SUPER_ADMIN` exists in the database `user_role` enum (per DB-004) but is
 * NOT activated in V1 RBAC. It is intentionally omitted from this enum.
 *
 * Canonical UPPERCASE values per ADR-013.
 *
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 * @see docs/adr/ADR-014-V1-User-Roles.md
 */

export const Role = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  CUSTOMER: 'CUSTOMER',
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
