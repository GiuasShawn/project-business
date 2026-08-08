import { authInstance } from '@loom/auth'
import type { AuthUser } from '@loom/types'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AuthService {
  async validateSession(token: string): Promise<AuthUser | null> {
    try {
      const session = await authInstance.api.getSession({
        headers: new Headers({ cookie: `loom.session_token=${token}` }),
      })

      if (!session || !session.session) {
        return null
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
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

  extractTokenFromCookies(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null

    const cookies = cookieHeader.split(';').map((c) => c.trim())
    const sessionCookie = cookies.find((c) => c.startsWith('loom.session_token='))

    if (!sessionCookie) return null

    return sessionCookie.split('=')[1] || null
  }
}
