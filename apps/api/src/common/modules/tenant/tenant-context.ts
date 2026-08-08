import { AsyncLocalStorage } from 'node:async_hooks'
import type { TenantContext } from '@loom/types'

/**
 * Tenant context store using AsyncLocalStorage.
 *
 * Provides request-scoped tenant context that is available to
 * downstream guards, services, repositories, and controllers.
 *
 * The context contains only authoritative tenant identity resolved
 * from trusted server-side sources (membership validation, subdomain).
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
export const tenantContextStore = new AsyncLocalStorage<TenantContext>()

/**
 * Get the current tenant context.
 *
 * Returns the tenant context for the current request, or undefined
 * if no tenant context has been established.
 *
 * @returns TenantContext | undefined
 */
export function getTenantContext(): TenantContext | undefined {
  return tenantContextStore.getStore()
}

/**
 * Get the current tenant context or throw.
 *
 * Returns the tenant context for the current request, or throws
 * if no tenant context has been established.
 *
 * @throws Error if no tenant context is available
 * @returns TenantContext
 */
export function getRequiredTenantContext(): TenantContext {
  const context = tenantContextStore.getStore()
  if (!context) {
    throw new Error('Tenant context not available. Ensure tenant resolution middleware is applied.')
  }
  return context
}

/**
 * Run a function within a tenant context.
 *
 * Used by middleware to establish tenant context for the duration
 * of a request.
 *
 * @param context - The tenant context to establish
 * @param fn - The function to run within the context
 * @returns The result of the function
 */
export function runWithTenantContext<T>(context: TenantContext, fn: () => T): T {
  return tenantContextStore.run(context, fn)
}
