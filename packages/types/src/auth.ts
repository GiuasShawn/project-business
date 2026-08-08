/**
 * V1 application role set (per ADR-014).
 *
 * The DB `user_role` enum also contains `SUPER_ADMIN` (per DB-004), but V1
 * application RBAC only recognizes the three application roles below.
 * `SUPER_ADMIN` is reserved as a database value and is not activatable in V1.
 *
 * @see docs/adr/ADR-014-V1-User-Roles.md
 */
export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN'

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

/**
 * Register user DTO.
 */
export interface RegisterUserDto {
  email: string
  password: string
  name: string
}

/**
 * Login DTO.
 */
export interface LoginDto {
  email: string
  password: string
}

/**
 * Verify email DTO.
 */
export interface VerifyEmailDto {
  token: string
}

/**
 * Request email verification DTO.
 */
export interface RequestEmailVerificationDto {
  email: string
}

/**
 * Request password reset DTO.
 */
export interface RequestPasswordResetDto {
  email: string
}

/**
 * Reset password DTO.
 */
export interface ResetPasswordDto {
  token: string
  password: string
}

/**
 * Change password DTO.
 */
export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

/**
 * Seller registration DTO (includes store info).
 */
export interface SellerRegisterDto extends RegisterUserDto {
  storeName: string
  storeSlug: string
}
