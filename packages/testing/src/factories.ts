import type { Store, StoreMembership, StoreRole, TenantContext, UserRole } from '@loom/types'

export function createMockStore(overrides: Partial<Store> = {}): Store {
  return {
    id: 'test-store-id',
    name: 'Test Store',
    slug: 'test-store',
    status: 'active',
    ownerId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function createMockStoreMembership(
  overrides: Partial<StoreMembership> = {},
): StoreMembership {
  return {
    id: 'test-membership-id',
    userId: 'test-user-id',
    storeId: 'test-store-id',
    role: 'owner' as StoreRole,
    invitedAt: new Date(),
    acceptedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function createMockTenantContext(overrides: Partial<TenantContext> = {}): TenantContext {
  return {
    storeId: 'test-store-id',
    store: createMockStore(),
    membership: createMockStoreMembership(),
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
