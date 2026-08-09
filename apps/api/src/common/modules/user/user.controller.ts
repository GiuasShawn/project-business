import { Permission } from '@loom/auth'
import type { AuthUser, UserProfile } from '@loom/types'
import { updateProfileSchema } from '@loom/validation'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe.js'
import { RequirePermissions } from '../auth/auth.decorators.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { PermissionsGuard } from '../auth/permissions.guard.js'
import { UserService } from './user.service.js'

/**
 * User management controller.
 *
 * Provides endpoints for user profile operations.
 * All endpoints require authentication.
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get current user's profile.
   */
  @Get('me')
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.PROFILE_READ)
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Req() req: Request): Promise<{ success: true; data: { user: UserProfile } }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const profile = await this.userService.getCurrentUserProfile(authUser)

    return {
      success: true,
      data: { user: profile as UserProfile },
    }
  }

  /**
   * Update current user's profile.
   */
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.PROFILE_WRITE)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateProfileSchema))
    dto: { name?: string; image?: string | null },
  ): Promise<{ success: true; data: { user: UserProfile } }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const profile = await this.userService.updateProfile(authUser, dto)

    return {
      success: true,
      data: { user: profile },
    }
  }
}
