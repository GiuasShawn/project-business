import type { AuthUser } from '@loom/types'
import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service.js'

interface AuthenticatedRequest extends Request {
  authUser?: AuthUser
  authSession?: { token: string }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const token = this.extractToken(req)
    const authReq = req as AuthenticatedRequest

    if (token) {
      try {
        const user = await this.authService.validateSession(token)
        if (user) {
          authReq.authUser = user
          authReq.authSession = { token }
        }
      } catch {
        // Session invalid - continue without user context
      }
    }

    next()
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
