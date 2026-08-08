import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>

/**
 * Authentication validation schemas
 */

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(12, 'Password must be at least 12 characters').max(128),
  name: z.string().min(1, 'Name is required').max(255),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

export const requestVerificationSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export type RequestVerificationInput = z.infer<typeof requestVerificationSchema>

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(12, 'Password must be at least 12 characters').max(128),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(12, 'Password must be at least 12 characters').max(128),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const sellerRegisterSchema = registerSchema.extend({
  storeName: z.string().min(1, 'Store name is required').max(255),
  storeSlug: z
    .string()
    .min(1, 'Store slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Store slug must contain only lowercase letters, numbers, and hyphens'),
})

export type SellerRegisterInput = z.infer<typeof sellerRegisterSchema>
