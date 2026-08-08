import { Permission } from '@loom/auth'
import type { AuthUser, UpdateUserProfileDto, UserProfile } from '@loom/types'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { RequirePermissions } from '../auth/auth.decorators.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { PermissionsGuard } from '../auth/permissions.guard.js'
import type { UserService } from './user.service.js'

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.PROFILE_READ)
  @UseGuards(AuthGuard, PermissionsGuard)
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.PROFILE_WRITE)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @Req() req: Request,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<{ success: true; data: { user: UserProfile } }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const profile = await this.userService.updateProfile(authUser, dto)

    return {
      success: true,
      data: { user: profile },
    }
  }
}
