import type { AuthUser, StoreMembership } from '@loom/types'
import { Injectable, type NestMiddleware, NotFoundException } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import { runWithTenantContext } from './tenant-context.js'
import type { TenantService } from './tenant.service.js'

interface AuthenticatedRequest extends Request {
  authUser?: AuthUser
  authSession?: { token: string }
}

/**
 * Tenant resolution middleware.
 *
 * Resolves tenant context from the request and establishes it
 * for the duration of the request using AsyncLocalStorage.
 *
 * Resolution strategy (per ADR-004):
 * - Authenticated seller requests: User → Store → Tenant Context
 * - Public storefront requests: Subdomain → Store → Tenant Context
 *
 * The middleware:
 * 1. Identifies the authenticated user (if present)
 * 2. Resolves the requested tenant (from subdomain or store ID header)
 * 3. Verifies the user's membership/access (for authenticated requests)
 * 4. Establishes tenant context
 * 5. Rejects invalid tenant access
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
@Injectable()
export class TenantResolutionMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authReq = req as AuthenticatedRequest
    const user = authReq.authUser

    try {
      // Try to resolve tenant from X-Store-ID header (for API clients)
      const storeIdHeader = req.headers['x-store-id'] as string | undefined

      if (storeIdHeader) {
        // API client specifying store directly
        if (user) {
          // Authenticated request — verify membership
          const { store, membership } = await this.tenantService.resolveTenantContext(
            user.id,
            storeIdHeader,
          )

          runWithTenantContext({ storeId: store.id, store, membership }, () => {
            next()
          })
          return
        }
        // Unauthenticated request with store header — reject
        throw new NotFoundException('Store not found')
      }

      // Try to resolve from subdomain (for web clients)
      const host = req.headers.host
      if (host) {
        const slug = this.extractSubdomain(host)
        if (slug && user) {
          // Authenticated request — verify membership
          const { store, membership } = await this.tenantService.resolveTenantFromSubdomain(
            slug,
            user.id,
          )

          // membership is guaranteed to be defined when userId is provided
          runWithTenantContext(
            {
              storeId: store.id,
              store,
              membership: membership as StoreMembership,
            },
            () => {
              next()
            },
          )
          return
        }

        // Unauthenticated public storefront request — continue without tenant context
        // The tenant context will be established by other means if needed
      }

      // No tenant resolution possible — continue without tenant context
      // This is valid for global endpoints (health, auth, etc.)
      next()
    } catch (error) {
      // If tenant resolution fails, pass the error to the exception filter
      next(error)
    }
  }

  /**
   * Extract subdomain from host header.
   *
   * Examples:
   * - "my-store.loom.local" → "my-store"
   * - "my-store.localhost:3000" → "my-store"
   * - "api.loom.local" → null (api is not a store subdomain)
   *
   * @param host - The Host header value
   * @returns The store slug or null if not a store subdomain
   */
  private extractSubdomain(host: string): string | null {
    // Remove port if present
    const hostname = host.split(':')[0]
    if (!hostname) return null

    // Split by dots
    const parts = hostname.split('.')
    if (parts.length < 3) {
      // Not a subdomain (e.g., "localhost", "loom.local")
      return null
    }

    // First part is the subdomain
    const subdomain = parts[0]
    if (!subdomain) return null

    // Skip reserved subdomains
    const reservedSubdomains = ['api', 'www', 'admin', 'mail', 'smtp', 'imap']
    if (reservedSubdomains.includes(subdomain)) {
      return null
    }

    return subdomain
  }
}
