import type { Role } from '@loom/auth'
import type { AuthUser } from '@loom/types'
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './auth.decorators.js'
import type { RbacService } from './rbac.service.js'

/**
 * Guard that checks if the authenticated user has the required role(s).
 *
 * Must be used after AuthGuard to ensure the user is authenticated.
 *
 * @example
 * ```typescript
 * @Roles(Role.ADMIN)
 * @UseGuards(AuthGuard, RolesGuard)
 * @Get('users')
 * findAll() { ... }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.authUser as AuthUser | undefined

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    const hasRole = this.rbacService.hasAnyRole(user, requiredRoles)

    if (!hasRole) {
      this.rbacService.logAuthorizationDecision(user.id, 'role', requiredRoles.join(','), false)
      throw new ForbiddenException('Insufficient role permissions')
    }

    this.rbacService.logAuthorizationDecision(user.id, 'role', requiredRoles.join(','), true)
    return true
  }
}
