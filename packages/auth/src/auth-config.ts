import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { env } from '@loom/config'
import { db } from '@loom/database'
import { betterAuth } from 'better-auth'

export const authInstance = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [env.API_URL],
  advanced: {
    cookiePrefix: 'loom',
    secureCookies: env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
})

export type AuthInstance = typeof authInstance
