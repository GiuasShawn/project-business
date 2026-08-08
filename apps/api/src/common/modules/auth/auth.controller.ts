import type { AuthUser } from '@loom/types'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { AuthGuard } from './auth.guard.js'
import type { AuthService } from './auth.service.js'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Body(ValidationPipe) body: { email: string; password: string; name: string }) {
    const result = await this.authService.register(body.email, body.password, body.name)

    return {
      success: true,
      data: result,
    }
  }

  @Post('register/seller')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new seller account with store' })
  async registerSeller(
    @Body(ValidationPipe) body: {
      email: string
      password: string
      name: string
      storeName: string
      storeSlug: string
    },
  ) {
    const result = await this.authService.registerSeller(
      body.email,
      body.password,
      body.name,
      body.storeName,
      body.storeSlug,
    )

    return {
      success: true,
      data: result,
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  async login(
    @Body(ValidationPipe) body: { email: string; password: string },
    @Req() req: Request,
  ) {
    const result = await this.authService.signIn(
      body.email,
      body.password,
      req.ip,
      req.headers['user-agent'],
    )

    return {
      success: true,
      data: result,
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out current user' })
  async logout(@Req() req: Request) {
    const token = this.extractToken(req)
    await this.authService.signOut(token ?? '')

    return {
      success: true,
      data: { message: 'Signed out successfully' },
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async getMe(@Req() req: Request): Promise<{ success: true; data: { user: AuthUser | null } }> {
    const token = this.extractToken(req)
    const user = await this.authService.getCurrentUser(token ?? '')

    return {
      success: true,
      data: { user: user ?? (null as unknown as AuthUser) },
    }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address with token' })
  async verifyEmail(@Body(ValidationPipe) body: { token: string }) {
    const result = await this.authService.verifyEmail(body.token)

    return {
      success: true,
      data: result,
    }
  }

  @Post('verify-email/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request email verification to be sent again' })
  async requestEmailVerification(@Body(ValidationPipe) body: { email: string }) {
    const result = await this.authService.requestEmailVerification(body.email)

    return {
      success: true,
      data: result,
    }
  }

  @Post('password/reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  async requestPasswordReset(@Body(ValidationPipe) body: { email: string }) {
    const result = await this.authService.requestPasswordReset(body.email)

    return {
      success: true,
      data: result,
    }
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body(ValidationPipe) body: { token: string; password: string }) {
    const result = await this.authService.resetPassword(body.token, body.password)

    return {
      success: true,
      data: result,
    }
  }

  @Post('password/change')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (authenticated user)' })
  async changePassword(
    @Req() req: Request,
    @Body(ValidationPipe) body: { currentPassword: string; newPassword: string },
  ) {
    const token = this.extractToken(req)
    const result = await this.authService.changePassword(
      token ?? '',
      body.currentPassword,
      body.newPassword,
    )

    return {
      success: true,
      data: result,
    }
  }

  private extractToken(request: Request): string | null {
    // Check Authorization header first
    const authHeader = request.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Fallback to cookie
    return this.authService.extractTokenFromCookies(request.headers.cookie)
  }
}
