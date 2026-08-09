/**
 * Better Auth configuration verification (Phase 04.5).
 *
 * Verifies the compiled @loom/auth instance against the documented invariants:
 *   - a baseURL is configured (BETTER_AUTH_URL) — callbacks/redirects depend on it
 *   - the secret meets the minimum length (>= 32)
 *   - email/password auth is enabled
 *   - session lifetime is 7 days (matching the `sessions` table expiry)
 *   - the API origin is in trustedOrigins
 *
 * This is a read-only, compile-time-surface check. It does NOT exercise the
 * live database or send emails. It is intentionally separate from the runtime
 * wiring so it can run in CI without infrastructure.
 *
 * Usage:
 *   pnpm --filter @loom/auth verify
 */

import assert from 'node:assert/strict'
import process from 'node:process'

// Env required by @loom/config at import time (lazy connections, never dialed here).
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/project_loom'
process.env.BETTER_AUTH_SECRET ??= 'x'.repeat(32)
process.env.JWT_SECRET ??= 'x'.repeat(32)

const { authInstance } = await import('./dist/index.js')
const { env } = await import('@loom/config')

const options = authInstance.options

console.log('Verifying Better Auth configuration…')

// 1. baseURL must be set (ADR-011 callbacks, email verification links).
assert.ok(
  options.baseURL && typeof options.baseURL === 'string' && options.baseURL.length > 0,
  'baseURL is not configured. Set BETTER_AUTH_URL in the environment.',
)
assert.equal(
  options.baseURL,
  env.BETTER_AUTH_URL,
  `baseURL (${options.baseURL}) does not match BETTER_AUTH_URL (${env.BETTER_AUTH_URL})`,
)
console.log(`  ✔ baseURL set: ${options.baseURL}`)

// 2. Secret length.
// Better Auth masks `options.secret`, so the invariant is asserted against
// the env value that Better Auth derives its secret from.
assert.ok(
  typeof env.BETTER_AUTH_SECRET === 'string' && env.BETTER_AUTH_SECRET.length >= 32,
  'BETTER_AUTH_SECRET must be at least 32 characters.',
)
console.log(`  ✔ BETTER_AUTH_SECRET length >= 32 (${env.BETTER_AUTH_SECRET.length} chars)`)

// 3. Email/password enabled.
assert.equal(options.emailAndPassword?.enabled, true, 'emailAndPassword must be enabled.')
assert.ok(
  (options.emailAndPassword?.minPasswordLength ?? 0) >= 12,
  'minPasswordLength must be >= 12.',
)
console.log(
  `  ✔ email/password enabled (min length ${options.emailAndPassword?.minPasswordLength})`,
)

// 4. Session lifetime matches the sessions table expiry (7 days).
assert.equal(options.session?.expiresIn, 60 * 60 * 24 * 7, 'session expiresIn must be 7 days.')
console.log('  ✔ session expiresIn = 7 days')

// 5. Trusted origins include the API URL.
assert.ok(
  Array.isArray(options.trustedOrigins) && options.trustedOrigins.includes(env.API_URL),
  `trustedOrigins must include API_URL (${env.API_URL}).`,
)
console.log(`  ✔ trustedOrigins includes ${env.API_URL}`)

console.log('All Better Auth configuration checks passed.')
