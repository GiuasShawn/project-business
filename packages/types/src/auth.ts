export type UserRole = 'admin' | 'seller' | 'customer'

export interface TenantContext {
  readonly tenantId: string
  readonly userId: string
  readonly role: UserRole
}

export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
