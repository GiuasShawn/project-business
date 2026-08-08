import { user } from '@loom/database'
import type { AuthUser, UpdateUserProfileDto, UserProfile } from '@loom/types'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import type { DatabaseService } from '../database/database.service.js'

/**
 * User management service.
 *
 * Handles user profile operations with appropriate authorization.
 * Operates independently from authentication.
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get user profile by user ID.
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const db = this.databaseService.getDb()
    const result = await db.select().from(user).where(eq(user.id, userId)).limit(1)

    if (result.length === 0) {
      return null
    }

    const foundUser = result[0]
    return {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role as UserProfile['role'],
      image: foundUser.image,
      emailVerified: foundUser.emailVerified,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    }
  }

  /**
   * Get current user's profile.
   */
  async getCurrentUserProfile(authUser: AuthUser): Promise<UserProfile | null> {
    return this.getProfile(authUser.id)
  }

  /**
   * Update user profile.
   * Users can only update their own profile.
   */
  async updateProfile(authUser: AuthUser, dto: UpdateUserProfileDto): Promise<UserProfile> {
    const db = this.databaseService.getDb()

    // Verify user exists
    const existingUser = await this.getProfile(authUser.id)
    if (!existingUser) {
      throw new NotFoundException('User not found')
    }

    // Update user profile
    await db
      .update(user)
      .set({
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.image !== undefined && { image: dto.image }),
        updatedAt: new Date(),
      })
      .where(eq(user.id, authUser.id))

    // Return updated profile
    const updatedProfile = await this.getProfile(authUser.id)
    if (!updatedProfile) {
      throw new NotFoundException('User not found after update')
    }

    this.logger.log(`User profile updated: ${authUser.id}`)
    return updatedProfile
  }
}
