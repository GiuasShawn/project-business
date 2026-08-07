# Phase 2A — Core Infrastructure Report

**Project:** Project Loom
**Phase:** 2A — Core Infrastructure
**Date:** 2026-08-08
**Status:** Complete

---

## Objective

Implement the core infrastructure foundation for the NestJS API, including PostgreSQL connectivity, Drizzle ORM initialization, Redis connection, NestJS dependency injection providers, and health checks.

---

## Scope

### Included

- PostgreSQL connectivity via Drizzle ORM
- Base schema infrastructure (UUID PKs, audit timestamps)
- Drizzle Kit migration configuration
- Seed runner infrastructure
- Redis connection via ioredis
- NestJS ConfigModule (wraps @loom/config)
- NestJS DatabaseModule (wraps @loom/database)
- NestJS RedisModule (wraps ioredis)
- Health check endpoints (liveness + readiness)
- Global exception filter
- AppModule wiring

### Excluded

- Authentication / RBAC (Phase 3)
- Business entities / domain schemas (Phase 4)
- API endpoints beyond health (Phase 3+)
- Services / repositories (Phase 3+)
- Background jobs (Phase 14)
- Search integration (Phase 15)
- Storage integration (Phase 16)
- Request logging middleware (Phase 2B)
- Validation pipes (Phase 2B)
- Swagger/OpenAPI (Phase 2B)

---

## Architecture Decisions

### 1. NestJS Global Modules

All infrastructure modules (`ConfigModule`, `DatabaseModule`, `RedisModule`) are decorated with `@Global()`. This makes their providers available across all modules without explicit imports, reducing boilerplate in domain modules.

**Tradeoff:** Global modules create implicit dependencies. Mitigated by clear documentation and the convention that infrastructure modules are always imported in `AppModule`.

### 2. Service Wrappers Over Direct Package Usage

Instead of injecting the raw `db` object from `@loom/database`, the `DatabaseService` wraps it with lifecycle hooks (`OnModuleInit`, `OnModuleDestroy`) and health check methods.

**Benefit:** Consistent lifecycle management, health checks, and the ability to add cross-cutting concerns (logging, metrics) later.

### 3. Health Check Probes

Health endpoints follow the Kubernetes convention:
- `/health` and `/health/live` — liveness (is the process running?)
- `/health/ready` — readiness (are all dependencies reachable?)

Readiness checks probe PostgreSQL and Redis independently, reporting latency for each.

### 4. Global Exception Filter

The `GlobalExceptionFilter` catches all unhandled exceptions and returns a standardized JSON response. It never exposes internal error details to the client, following the security principle from AI_CONTEXT.md.

---

## Files Created

### packages/database

| File | Purpose |
|------|---------|
| `src/schema/base.ts` | Base table columns: UUID PK, created_at, updated_at |
| `src/schema/index.ts` | Schema barrel export |
| `drizzle.config.ts` | Drizzle Kit configuration for migrations |
| `drizzle/README.md` | Migrations directory documentation |
| `src/seed.ts` | Seed runner with registerSeed() and runSeeds() |

### apps/api/src/common

| File | Purpose |
|------|---------|
| `modules/config/config.module.ts` | NestJS ConfigModule |
| `modules/config/config.service.ts` | Typed config service wrapping @loom/config |
| `modules/config/index.ts` | Barrel export |
| `modules/database/database.module.ts` | NestJS DatabaseModule |
| `modules/database/database.service.ts` | Managed Drizzle connection with health check |
| `modules/database/index.ts` | Barrel export |
| `modules/redis/redis.module.ts` | NestJS RedisModule |
| `modules/redis/redis.service.ts` | Managed ioredis connection with health check |
| `modules/redis/index.ts` | Barrel export |
| `modules/health/health.module.ts` | NestJS HealthModule |
| `modules/health/health.controller.ts` | Health endpoints controller |
| `modules/health/health.service.ts` | Health check logic with component probes |
| `modules/health/index.ts` | Barrel export |
| `filters/global-exception.filter.ts` | Global exception filter |
| `filters/index.ts` | Barrel export |

---

## Files Modified

| File | Changes |
|------|---------|
| `apps/api/src/app.module.ts` | Wired ConfigModule, DatabaseModule, RedisModule, HealthModule |
| `apps/api/src/main.ts` | Added CORS, GlobalExceptionFilter, shutdown hooks, logger |
| `apps/api/package.json` | Added ioredis, drizzle-orm, @types/express |
| `packages/database/src/index.ts` | Added schema exports |
| `packages/database/package.json` | Added db:push, db:studio scripts |

---

## Health Check Endpoints

### GET /api/v1/health

```json
{
  "status": "ok",
  "timestamp": "2026-08-08T00:00:00.000Z"
}
```

### GET /api/v1/health/live

```json
{
  "status": "ok",
  "timestamp": "2026-08-08T00:00:00.000Z"
}
```

### GET /api/v1/health/ready

```json
{
  "status": "ok",
  "timestamp": "2026-08-08T00:00:00.000Z",
  "version": "0.1.0",
  "uptime": 123.456,
  "checks": {
    "database": {
      "status": "ok",
      "latencyMs": 5
    },
    "redis": {
      "status": "ok",
      "latencyMs": 2
    }
  }
}
```

---

## Validation Results

| Check | Result | Notes |
|-------|--------|-------|
| `pnpm build` | ✅ Pass | All 17 packages/apps compile |
| `pnpm lint` | ✅ Pass | No Biome errors |
| `pnpm typecheck` | ✅ Pass | No TypeScript errors |

---

## Dependencies Added

| Package | Location | Purpose |
|---------|----------|---------|
| `ioredis` | apps/api | Redis client |
| `drizzle-orm` | apps/api | SQL template tag for health check |
| `@types/express` | apps/api (dev) | Request/Response types for exception filter |

---

## Seed Infrastructure

The seed system uses a registration pattern:

```ts
import { registerSeed } from '@loom/database/seed'

registerSeed('users', async (db) => {
  await db.insert(users).values([...])
})
```

Run with: `pnpm db:seed`

---

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| Missing @types/express | Added as devDependency in apps/api |
| Unused `logger` in HealthService | Removed declaration |
| Biome import sorting | Sorted type imports alphabetically |

---

## Next Steps

Phase 2B — Remaining Infrastructure:
- Request logging middleware (Pino + NestJS)
- Validation pipes
- Rate limiting
- Swagger/OpenAPI documentation

---

*Report generated: 2026-08-08*
