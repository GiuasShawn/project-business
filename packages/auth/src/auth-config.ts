import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { env } from '@loom/config'
import { account, db, session, user, verification } from '@loom/database'
import { betterAuth } from 'better-auth'

export const authInstance = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
      token,
    }: { user: { email: string }; url: string; token: string }) => {
      await sendVerificationEmail(user.email, url, token)
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    expiresIn: 60 * 60 * 24, // 24 hours
  },
  password: {
    reset: {
      sendResetPassword: async ({
        user,
        url,
        token,
      }: { user: { email: string }; url: string; token: string }) => {
        await sendResetPasswordEmail(user.email, url, token)
      },
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
      revokeSessionsOnPasswordReset: true,
    },
    change: {
      enabled: true,
      revokeSessionsOnPasswordChange: true,
    },
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

// Email provider abstraction - implemented in apps/api or workers
// This is a boundary that will be wired to actual email delivery in Phase 14
async function sendVerificationEmail(email: string, url: string, token: string): Promise<void> {
  // TODO: Wire to email delivery provider (Phase 14)
  // For now, log the verification URL for development
  console.log('[DEV] Email verification:', { email, url, token })
}

async function sendResetPasswordEmail(email: string, url: string, token: string): Promise<void> {
  // TODO: Wire to email delivery provider (Phase 14)
  // For now, log the reset URL for development
  console.log('[DEV] Password reset:', { email, url, token })
}
