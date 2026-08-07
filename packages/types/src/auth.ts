export type UserRole = 'admin' | 'seller' | 'customer'

export interface TenantContext {
  readonly tenantId: string
  readonly userId: string
  readonly role: UserRole
}
