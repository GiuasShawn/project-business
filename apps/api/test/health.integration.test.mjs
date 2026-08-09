/**
 * App-level integration test foundation (Phase 04.5).
 *
 * Boots the REAL NestJS application (AppModule from dist), bound to an
 * ephemeral port, and exercises HTTP endpoints through the full stack:
 * global prefix, CORS setup, Zod validation pipe, global exception filter,
 * and the common middleware chain.
 *
 * This is intentionally infra-lite: the endpoints asserted here
 * (`/health*`, validation failures) do not require a live PostgreSQL or
 * Redis. Postgres.js and ioredis connect lazily in this codebase, so the
 * app boots cleanly without local infrastructure. `/health/ready` is
 * deliberately NOT asserted because it depends on infra.
 *
 * Run with: pnpm --filter @loom/api test
 * (turbo `test` depends on `build`, so the dist output exists.)
 */

import assert from 'node:assert/strict'
import process from 'node:process'
import { after, before, test } from 'node:test'

// Required by @loom/config validation (these are never dialed here).
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/project_loom_test'
process.env.BETTER_AUTH_SECRET ??= 'integration-test-secret-000000000000000000'
process.env.JWT_SECRET ??= 'integration-test-jwt-secret-00000000000000'
process.env.NODE_ENV ??= 'test'
process.env.APP_VERSION ??= '0.0.0-test'

let app
let baseUrl

before(async () => {
  const { NestFactory } = await import('@nestjs/core')
  const { AppModule } = await import('../dist/app.module.js')
  const { GlobalExceptionFilter } = await import(
    '../dist/common/filters/global-exception.filter.js'
  )
  const { HealthService } = await import('../dist/common/modules/health/health.service.js')

  app = await NestFactory.create(AppModule, { logger: false })

  app.setGlobalPrefix('api/v1')
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000', credentials: true })
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.enableShutdownHooks()

  const healthService = app.get(HealthService)
  healthService.markStartupComplete()

  await app.listen(0)
  const address = app.getHttpServer().address()
  baseUrl = `http://127.0.0.1:${address.port}`
})

after(async () => {
  if (app) await app.close()
})

async function get(path, { expectStatus = 200 } = {}) {
  const res = await fetch(`${baseUrl}${path}`)
  assert.equal(
    res.status,
    expectStatus,
    `GET ${path} -> expected ${expectStatus}, got ${res.status}`,
  )
  const headers = Object.fromEntries(res.headers.entries())
  return { res, body: await res.json(), headers }
}

test('app boots with the api/v1 global prefix', async () => {
  // A 404 under the prefix proves the prefix is active (route not found,
  // but the request reached the app instead of a raw connection error).
  const res = await fetch(`${baseUrl}/api/v1/does-not-exist`)
  assert.equal(res.status, 404)
})

test('GET /api/v1/health/live returns ok', async () => {
  const { body } = await get('/api/v1/health/live')
  assert.equal(body.status, 'ok')
  assert.ok(body.timestamp)
})

test('GET /api/v1/health/startup reports ok after markStartupComplete', async () => {
  const { body } = await get('/api/v1/health/startup')
  assert.equal(body.status, 'ok')
  assert.ok(body.uptime >= 0)
})

test('GET /api/v1/health (alias) returns ok', async () => {
  const { body } = await get('/api/v1/health', { expectStatus: 200 })
  assert.equal(body.status, 'ok')
})

test('CORS preflight is enabled', async () => {
  const res = await fetch(`${baseUrl}/api/v1/health/live`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:3000',
      'Access-Control-Request-Method': 'GET',
    },
  })
  // Express CORS responds to preflight with 204 No Content.
  assert.equal(res.status, 204)
  const allowOrigin = res.headers.get('access-control-allow-origin')
  assert.ok(allowOrigin === 'http://localhost:3000' || allowOrigin === '*')
})

test('Zod validation rejects malformed login through the real pipe', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' }), // missing password + invalid email
  })
  assert.equal(res.status, 400)
  const payload = await res.json()
  assert.equal(payload.success, false)
  assert.equal(payload.error.code, 'VALIDATION_ERROR') // API error contract
  assert.ok(payload.error.timestamp) // filter always attaches a timestamp
  assert.ok(payload.error.message.length > 0)
})
