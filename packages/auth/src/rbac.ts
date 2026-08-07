import type { UserRole } from '@loom/types'

export interface RBACConfig {
  permissions: Record<UserRole, string[]>
}

const defaultPermissions: RBACConfig = {
  permissions: {
    admin: ['*'],
    seller: ['products:read', 'products:write', 'orders:read', 'analytics:read'],
    customer: ['orders:read', 'profile:read', 'profile:write'],
  },
}

export function createRBAC(config: Partial<RBACConfig> = {}): RBACConfig {
  return {
    ...defaultPermissions,
    ...config,
  }
}
