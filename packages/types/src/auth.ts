export type UserRole = 'admin' | 'seller' | 'customer'

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
