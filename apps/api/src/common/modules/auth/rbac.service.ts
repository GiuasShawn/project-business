import { type Permission, type Role, getPermissionsForRole, roleHasPermission } from '@loom/auth'
import type { AuthUser } from '@loom/types'
import { Injectable, Logger } from '@nestjs/common'

/**
 * RBAC service for authorization decisions.
 *
 * Centralizes all permission checking logic.
 * Operates independently from authentication.
 *
 * @see docs/spec/permissions/PERMISSION_MATRIX.md
 */
@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name)

  /**
   * Check if a user has a specific permission.
   */
  hasPermission(user: AuthUser, permission: Permission): boolean {
    return roleHasPermission(user.role, permission)
  }

  /**
   * Check if a user has all of the specified permissions.
   */
  hasAllPermissions(user: AuthUser, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(user, permission))
  }

  /**
   * Check if a user has any of the specified permissions.
   */
  hasAnyPermission(user: AuthUser, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(user, permission))
  }

  /**
   * Get all permissions for a user's role.
   */
  getUserPermissions(user: AuthUser): Permission[] {
    return [...getPermissionsForRole(user.role)]
  }

  /**
   * Check if a user has a specific role.
   */
  hasRole(user: AuthUser, role: Role): boolean {
    return user.role === role
  }

  /**
   * Check if a user has any of the specified roles.
   */
  hasAnyRole(user: AuthUser, roles: Role[]): boolean {
    return roles.includes(user.role)
  }

  /**
   * Log authorization decisions for security auditing.
   */
  logAuthorizationDecision(
    userId: string,
    resource: string,
    action: string,
    granted: boolean,
  ): void {
    const message = `Authorization ${granted ? 'GRANTED' : 'DENIED'}: user=${userId} resource=${resource} action=${action}`
    if (granted) {
      this.logger.debug(message)
    } else {
      this.logger.warn(message)
    }
  }
}
