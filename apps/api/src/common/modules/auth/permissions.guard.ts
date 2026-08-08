import type { Permission } from '@loom/auth'
import type { AuthUser } from '@loom/types'
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from './auth.decorators.js'
import type { RbacService } from './rbac.service.js'

/**
 * Guard that checks if the authenticated user has the required permission(s).
 *
 * Must be used after AuthGuard to ensure the user is authenticated.
 *
 * @example
 * ```typescript
 * @RequirePermissions(Permission.PRODUCTS_WRITE)
 * @UseGuards(AuthGuard, PermissionsGuard)
 * @Post('products')
 * create() { ... }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // If no permissions are specified, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.authUser as AuthUser | undefined

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    const hasPermission = this.rbacService.hasAllPermissions(user, requiredPermissions)

    if (!hasPermission) {
      this.rbacService.logAuthorizationDecision(
        user.id,
        'permission',
        requiredPermissions.join(','),
        false,
      )
      throw new ForbiddenException('Insufficient permissions')
    }

    this.rbacService.logAuthorizationDecision(
      user.id,
      'permission',
      requiredPermissions.join(','),
      true,
    )
    return true
  }
}
