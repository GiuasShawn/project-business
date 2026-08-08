import type { AuthUser } from '@loom/types'
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { AuthService } from './auth.service.js'

interface AuthenticatedRequest extends Request {
  authUser?: AuthUser
  authSession?: { token: string }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('No authentication token provided')
    }

    const user = await this.authService.validateSession(token)

    if (!user) {
      throw new UnauthorizedException('Invalid or expired session')
    }

    // Attach user to request for downstream handlers
    request.authUser = user
    request.authSession = { token }

    return true
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
