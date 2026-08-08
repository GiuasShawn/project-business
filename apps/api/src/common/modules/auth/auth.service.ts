import { authInstance } from '@loom/auth'
import { store, storeMembership, user } from '@loom/database'
import type { AuthUser, UserRole } from '@loom/types'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { and, eq } from 'drizzle-orm'
import { DatabaseService } from '../database/database.service.js'

/**
 * Authentication service.
 *
 * Handles session validation, sign-in, sign-out, and user retrieval.
 * Works with Better Auth for session management.
 */
@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateSession(token: string): Promise<AuthUser | null> {
    try {
      const session = await authInstance.api.getSession({
        headers: new Headers({ cookie: `loom.session_token=${token}` }),
      })

      if (!session || !session.session) {
        return null
      }

      // Get role from user metadata or default to customer
      // Better Auth doesn't have a role field by default, so we use metadata
      const role = ((session.user as Record<string, unknown>).role as UserRole) ?? 'CUSTOMER'

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      }
    } catch {
      return null
    }
  }

  async signIn(email: string, password: string, _ipAddress?: string, _userAgent?: string) {
    try {
      const result = await authInstance.api.signInEmail({
        body: {
          email,
          password,
        },
      })

      return result
    } catch (_error) {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  async signOut(token: string) {
    try {
      await authInstance.api.signOut({
        headers: new Headers({ cookie: `loom.session_token=${token}` }),
      })
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  async getCurrentUser(token: string): Promise<AuthUser | null> {
    return this.validateSession(token)
  }

  /**
   * Register a new user.
   */
  async register(email: string, password: string, name: string, role: UserRole = 'CUSTOMER') {
    try {
      const result = await authInstance.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      })

      // Update user role in database after Better Auth creates the user
      if (result?.user?.id && role !== 'CUSTOMER') {
        const db = this.databaseService.getDb()
        await db.update(user).set({ role }).where(eq(user.id, result.user.id))
      }

      return result
    } catch (error) {
      // Check for duplicate email
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      if (
        errorMessage.includes('UNIQUE') ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate')
      ) {
        throw new BadRequestException('An account with this email already exists')
      }
      throw new BadRequestException('Registration failed')
    }
  }

  /**
   * Register a new seller with store creation.
   *
   * V1 Architecture: One primary store per seller.
   * Store is created with status 'created' and owner membership.
   * Email verification is mandatory before seller activation.
   */
  async registerSeller(
    email: string,
    password: string,
    name: string,
    storeName: string,
    storeSlug: string,
  ) {
    // First register the user
    const result = await this.register(email, password, name, 'SELLER')

    if (!result?.user?.id) {
      throw new BadRequestException('Registration failed')
    }

    const db = this.databaseService.getDb()

    // Check slug uniqueness
    const existingStore = await db.select().from(store).where(eq(store.slug, storeSlug)).limit(1)
    if (existingStore.length > 0) {
      throw new BadRequestException('Store slug already exists')
    }

    // Create store with status 'DRAFT' (ADR-015).
    const [newStore] = await db
      .insert(store)
      .values({
        name: storeName,
        slug: storeSlug,
        ownerId: result.user.id,
        status: 'DRAFT',
      })
      .returning()

    // Create owner membership
    await db.insert(storeMembership).values({
      userId: result.user.id,
      storeId: newStore.id,
      role: 'OWNER',
      acceptedAt: new Date(),
    })

    return {
      ...result,
      store: {
        id: newStore.id,
        name: newStore.name,
        slug: newStore.slug,
        status: newStore.status,
      },
    }
  }

  /**
   * Complete seller onboarding after email verification.
   * Updates store status from 'DRAFT' to 'CONFIGURED'.
   */
  async completeSellerOnboarding(userId: string): Promise<void> {
    const db = this.databaseService.getDb()

    // Find user's store
    const membership = await db
      .select()
      .from(storeMembership)
      .where(and(eq(storeMembership.userId, userId), eq(storeMembership.role, 'OWNER')))
      .limit(1)

    if (membership.length > 0) {
      await db
        .update(store)
        .set({ status: 'CONFIGURED', updatedAt: new Date() })
        .where(eq(store.id, membership[0].storeId))
    }
  }

  /**
   * Verify email with token.
   */
  async verifyEmail(token: string) {
    try {
      // Better Auth verifyEmail uses query parameter
      const result = await authInstance.api.verifyEmail({
        query: {
          token,
        },
      })

      // After successful verification, complete seller onboarding if applicable
      if (result && typeof result === 'object' && 'user' in result) {
        const userResult = result as { user?: { id: string } }
        if (userResult.user?.id) {
          await this.completeSellerOnboarding(userResult.user.id)
        }
      }

      return result
    } catch (_error) {
      throw new BadRequestException('Invalid or expired verification token')
    }
  }

  /**
   * Request email verification to be sent again.
   */
  async requestEmailVerification(email: string) {
    try {
      await authInstance.api.sendVerificationEmail({
        body: {
          email,
        },
      })
      return { success: true }
    } catch (_error) {
      // Don't reveal if email exists - always return success
      return { success: true }
    }
  }

  /**
   * Request password reset.
   */
  async requestPasswordReset(email: string) {
    try {
      await authInstance.api.requestPasswordReset({
        body: {
          email,
        },
      })
      return { success: true }
    } catch (_error) {
      // Don't reveal if email exists - always return success
      return { success: true }
    }
  }

  /**
   * Reset password with token.
   */
  async resetPassword(token: string, password: string) {
    try {
      const result = await authInstance.api.resetPassword({
        body: {
          token,
          newPassword: password,
        },
      })
      return result
    } catch (_error) {
      throw new BadRequestException('Invalid or expired reset token')
    }
  }

  /**
   * Change password (authenticated user).
   */
  async changePassword(token: string, currentPassword: string, newPassword: string) {
    try {
      const result = await authInstance.api.changePassword({
        body: {
          currentPassword,
          newPassword,
        },
        headers: new Headers({ cookie: `loom.session_token=${token}` }),
      })
      return result
    } catch (_error) {
      throw new UnauthorizedException('Current password is incorrect')
    }
  }

  extractTokenFromCookies(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null

    const cookies = cookieHeader.split(';').map((c) => c.trim())
    const sessionCookie = cookies.find((c) => c.startsWith('loom.session_token='))

    if (!sessionCookie) return null

    return sessionCookie.split('=')[1] || null
  }
}
