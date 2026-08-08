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
  role: UserRole
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Extended authenticated request with authorization context.
 */
export interface AuthenticatedRequest {
  authUser: AuthUser
  authSession: { token: string }
}

/**
 * User profile for user management endpoints.
 */
export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Update user profile DTO.
 */
export interface UpdateUserProfileDto {
  name?: string
  image?: string | null
}
