import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth Next.js route handler.
 *
 * Handles all authentication-related API routes under /api/auth/*.
 * This includes sign-in, sign-up, sign-out, session management,
 * email verification, password reset, and OAuth callbacks.
 *
 * Uses dynamic import to defer @loom/auth initialization to runtime,
 * preventing @loom/config's environment validation from running at
 * Next.js build time (where env vars are unavailable).
 *
 * @see packages/auth/src/auth-config.ts for Better Auth configuration.
 */

async function getHandler() {
  const { authInstance } = await import('@loom/auth')
  return toNextJsHandler(authInstance)
}

let cachedHandler: {
  GET: (req: Request) => Promise<Response>
  POST: (req: Request) => Promise<Response>
} | null = null

async function getOrCreateHandler() {
  if (!cachedHandler) {
    cachedHandler = await getHandler()
  }
  return cachedHandler
}

export async function GET(request: Request): Promise<Response> {
  const handler = await getOrCreateHandler()
  return handler.GET(request)
}

export async function POST(request: Request): Promise<Response> {
  const handler = await getOrCreateHandler()
  return handler.POST(request)
}
