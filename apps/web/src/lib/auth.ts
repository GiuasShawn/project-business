import { createAuthClient } from 'better-auth/client'
import { nextCookies } from 'better-auth/next-js'

/**
 * Better Auth client for apps/web.
 *
 * Provides client-side authentication utilities including:
 * - Session management
 * - Sign-in/sign-out
 * - OAuth callbacks
 *
 * The nextCookies() plugin enables cookie-based session management
 * in Next.js App Router, ensuring cookies are properly set and read
 * across server and client components.
 *
 * @see packages/auth/src/auth-config.ts for server-side configuration.
 */

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  plugins: [nextCookies()],
})

/**
 * Helper to get the current session on the server side.
 * Use this in server components and route handlers.
 */
export async function getSession() {
  try {
    const { data } = await authClient.getSession()
    return data
  } catch {
    return null
  }
}

/**
 * Helper to check if the user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
