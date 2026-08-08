import type { AuthUser } from '@loom/types'
import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { getTenantContext } from './tenant-context.js'

interface AuthenticatedRequest extends Request {
  authUser?: AuthUser
  authSession?: { token: string }
}

/**
 * Tenant guard.
 *
 * Ensures that tenant context is available for tenant-scoped endpoints.
 * Must be used after AuthGuard and TenantResolutionMiddleware.
 *
 * V1 Architecture: Single owner per store.
 * The guard verifies:
 * 1. User is authenticated
 * 2. Tenant context exists (membership validated by middleware)
 *
 * @example
 * ```typescript
 * @UseGuards(AuthGuard, TenantGuard)
 * @Get('orders')
 * findAll() { ... }
 * ```
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    // Check that user is authenticated
    if (!request.authUser) {
      throw new UnauthorizedException('Authentication required')
    }

    // Check that tenant context exists (membership validated by middleware)
    const tenantContext = getTenantContext()
    if (!tenantContext) {
      throw new ForbiddenException('Tenant context not available')
    }

    return true
  }
}
