import { createAuthClient } from 'better-auth/client'

/**
 * Better Auth client for apps/web.
 *
 * Browser-safe client-side authentication utilities including:
 * - Session management
 * - Sign-in/sign-out
 * - OAuth callbacks
 *
 * IMPORTANT: This module must NOT import nextCookies() or any server-only
 * Better Auth modules. The nextCookies() plugin is server-only and causes
 * webpack crashes (__webpack_modules__[moduleId] is not a function) when
 * bundled into the client.
 *
 * @see packages/auth/src/auth-config.ts for server-side configuration.
 */

export const authClient = createAuthClient({
  // Use empty string for same-origin requests to /api/auth/*.
  // Better Auth client uses relative URLs by default when baseURL is empty.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
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
