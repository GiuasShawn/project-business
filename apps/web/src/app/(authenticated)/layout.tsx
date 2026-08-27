import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type React from 'react'
import { AuthenticatedShell } from './authenticated-shell'

/**
 * Force all pages under this layout to be dynamically rendered.
 * This prevents Next.js from prerendering them at build time,
 * which would fail because session validation requires runtime env vars.
 */
export const dynamic = 'force-dynamic'

/**
 * Server-side authenticated layout.
 *
 * Validates the Better Auth session on every navigation to protected routes.
 * If the session is null/invalid/expired, redirects to /sign-in.
 * If valid, renders the interactive shell (client component).
 *
 * Uses dynamic import to defer @loom/auth initialization to runtime,
 * preventing @loom/config's environment validation from running at
 * Next.js build time (where env vars are unavailable).
 *
 * This is the canonical Better Auth session validation — no custom JWT logic,
 * no manual session table queries, no cookie-presence trust.
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  // Dynamic import to defer env validation to runtime
  const { authInstance } = await import('@loom/auth')

  // Read request headers to extract the session cookie
  const requestHeaders = await headers()

  // Validate session via Better Auth server-side API
  const session = await authInstance.api.getSession({
    headers: requestHeaders,
  })

  // No valid session → redirect to sign-in
  if (!session || !session.session) {
    redirect('/sign-in')
  }

  // Valid session → render the interactive shell
  return <AuthenticatedShell>{children}</AuthenticatedShell>
}
