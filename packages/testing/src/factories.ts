import type { TenantContext, UserRole } from '@loom/types'

export function createMockTenantContext(overrides: Partial<TenantContext> = {}): TenantContext {
  return {
    tenantId: 'test-tenant-id',
    userId: 'test-user-id',
    role: 'admin' as UserRole,
    ...overrides,
  }
}

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin' as UserRole,
    ...overrides,
  }
}
