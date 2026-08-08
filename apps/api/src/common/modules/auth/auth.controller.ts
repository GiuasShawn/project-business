import type { AuthUser } from '@loom/types'
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { AuthGuard } from './auth.guard.js'
import type { AuthService } from './auth.service.js'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
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
  async getMe(@Req() req: Request): Promise<{ success: true; data: { user: AuthUser } }> {
    const token = this.extractToken(req)
    const user = await this.authService.getCurrentUser(token ?? '')

    if (!user) {
      return {
        success: true,
        data: { user: null as unknown as AuthUser },
      }
    }

    return {
      success: true,
      data: { user },
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
