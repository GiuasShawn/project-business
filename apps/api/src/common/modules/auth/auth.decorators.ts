import type { Permission } from '@loom/auth'
import type { Role } from '@loom/auth'
import { SetMetadata } from '@nestjs/common'

/**
 * Metadata keys for authorization decorators.
 */
export const ROLES_KEY = 'roles'
export const PERMISSIONS_KEY = 'permissions'

/**
 * Decorator to specify required roles for a route.
 *
 * @example
 * ```typescript
 * @Roles(Role.ADMIN)
 * @UseGuards(AuthGuard, RolesGuard)
 * @Get('users')
 * findAll() { ... }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

/**
 * Decorator to specify required permissions for a route.
 *
 * @example
 * ```typescript
 * @RequirePermissions(Permission.PRODUCTS_WRITE)
 * @UseGuards(AuthGuard, PermissionsGuard)
 * @Post('products')
 * create() { ... }
 * ```
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
