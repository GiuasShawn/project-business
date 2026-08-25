import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Auth middleware for apps/web.
 *
 * Protects authenticated routes (/catalog, /editor) by checking for
 * the Better Auth session cookie. Unauthenticated users are redirected
 * to /sign-in with a callback URL.
 *
 * Better Auth cookie name: loom_session (configured via cookiePrefix: 'loom'
 * in packages/auth/src/auth-config.ts).
 *
 * This middleware runs at the edge runtime and cannot import Node.js-only
 * modules. Session validation happens client-side or via API calls —
 * this middleware only checks for cookie presence as a first-pass gate.
 * Full session validation happens in the authenticated layout.
 */

const SESSION_COOKIE_NAME = 'loom_session'

/** Routes that require authentication. */
const protectedRoutes = ['/catalog', '/editor']

/** Routes that should redirect authenticated users away (e.g. sign-in page). */
const authRoutes = ['/sign-in', '/register', '/forgot-password', '/verify-email']

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)

  // Check if the current route is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  // Protected route: redirect to sign-in if no session
  if (isProtectedRoute && !sessionCookie) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Auth route: redirect to catalog if already authenticated
  if (isAuthRoute && sessionCookie) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
    const redirectUrl = callbackUrl || '/catalog'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
