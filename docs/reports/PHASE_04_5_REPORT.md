# Phase 04.5 — Security & Correctness Hardening: Completion Report

**Status:** Complete (monorepo validation: ✅; Docker-side runtime verification: documented runbook; no architectural conflict)
**Date:** 2026-08-09
**Duration:** 1 session (follow-up hardening pass after Phase 04)
**Dependencies:** Phase 04 ✅
**Architecture version:** 1.0 (frozen, unchanged)

---

# 1. Executive Summary

Phase 04.5 is a hardening pass that closes correctness and security gaps surfaced during the Phase 04 audit — it introduces **no new domain scope**. It lands: request-body validation via the existing Zod schemas, rate limiting on the authentication surface, removal of a dead Fastify dependency, N+1 query elimination in the tenant service and controller, a `BETTER_AUTH_URL` base URL for Better Auth, two new ADRs (UUID v7, Analytics partitioning), a DB backup/restore helper, a Better Auth configuration verifier, and an integration test foundation for the API.

Every change was validated against the frozen Architecture v1.0 invariants. The full monorepo `lint`, `typecheck`, `build`, and the new integration tests pass.

Two ADRs were authored to make decisions explicit before code landed:

- ADR-017 — UUID v7 Primary Key Generation Strategy (`pg_uuidv7` extension, v4 fallback).
- ADR-018 — Analytics Events Partitioning Strategy (design; no schema shipped).

---

# 2. Goals vs. Delivered

| Goal (per scope approval) | Delivered |
|---|---|
| Replace class-validator DTOs with the existing Zod schemas at the HTTP boundary | ✅ `ZodValidationPipe` + wired into `auth.controller.ts` (9 schemas), `tenant.controller.ts` (`createStoreSchema`, `updateStoreSchema`), `user.controller.ts` (`updateProfileSchema`). |
| Rate limit the authentication surface | ✅ `RateLimitGuard` (in-memory sliding window, per IP+path, Redis-ready for multi-instance). Applied to register (5/min), register/seller (5/min), login (10/min), verify-email (10/min), verify-email/request (3/min), password/reset/request (3/min), password/reset (5/min), password/change (10/min). |
| Remove dead Fastify dependency | ✅ `@nestjs/platform-fastify` removed from `apps/api/package.json`. Express remains the platform. |
| Eliminate N+1 queries in tenant reads | ✅ `getUserStores` uses a single batched `IN` query (service), and the controller maps the already-fetched rows via `toStoreProfile()` instead of a per-store query. |
| Configure Better Auth base URL | ✅ `BETTER_AUTH_URL` env var (default `http://localhost:4000`), consumed as `baseURL` in `auth-config.ts`; documented in `.env.example` and `Environment-Specification.md`. |
| Decide UUID v7 strategy now (before the first production rows exist) | ✅ ADR-017: adopt `pg_uuidv7` extension with `uuid_generate_v7()` default on `base.ts`; Docker image `loom-postgres:16-pg_uuidv7` builds the extension from source. |
| Analytics partitioning design ahead of the analytics domain | ✅ ADR-018 (design only — no schema shipped in this phase). |
| Backup/restore tooling for local/CI databases | ✅ `scripts/db-backup.mjs` (`backup` / `restore <file>` / `list`), container-aware (`docker exec` preferred, host `pg_dump`/`psql` fallback), wired as `db:backup` / `db:restore` / `db:backup:list`. |
| Verify Better Auth configuration invariants | ✅ `packages/auth/verify.mjs` (`pnpm --filter @loom/auth verify`): baseURL set, secret ≥ 32 chars, email/password enabled, session TTL 7 days, `trustedOrigins` includes API URL. |
| Integration test foundation | ✅ `apps/api/test/health.integration.test.mjs` — boots the real NestJS app on an ephemeral port; 6 passing tests (prefix, health live/startup/alias, CORS preflight, Zod validation through the real pipe). Zero new dependencies (Node `node:test`). |

# 3. Explicitly NOT delivered (and why)

| Item | Reason | Will be delivered by |
|---|---|---|
| Distributed rate limiting | The guard is per-process (in-memory). Correct for the single-instance dev/CI path today. | Phase 19 (Observability) / deployment hardening — move state to Redis. |
| Security headers / CSRF / CSP | Explicitly out of Phase 04.5 scope. | Phase 18 (Security). |
| Analytics table DDL | ADR-018 is a design ADR; the schema ships with the analytics domain. | Analytics domain phase. |
| Full e2e suite (register → login → store) | Requires a live PostgreSQL container; environment constraint (same as Phase 04). The foundation (`node:test` + boot + infra-lite assertions) is in place. | Phase 20 (Testing). |
| Live-DB verification of backup/restore | Requires Docker/PostgreSQL; documented, not executed in this runtime. | Developer with Docker access. |

# 4. Architecture Decisions Authored

### ADR-017 — UUID v7 Primary Key Generation Strategy

**Status:** Accepted 2026-08-09. All future primary keys use UUID v7 (`uuid_generate_v7()` via the `pg_uuidv7` extension), with UUID v4 (`gen_random_uuid()`) as the documented fallback when the extension is unavailable. The decision was made now because Phase 04's first migration is the last chance to change the PK default before real rows exist.

**Consequences:**
- `packages/database/src/schema/base.ts` — `id: uuid('id').primaryKey().default(sql`uuid_generate_v7()`)`.
- `docker/postgres/Dockerfile` + `docker-compose.yml` — the local image builds the extension from source (declarative; no manual `CREATE EXTENSION` step required at migrate time).
- New domain tables created from Phase 5 onward must use the v7 default; existing v4 defaults in Phase 04 tables are left as-is (migration cost outweighs benefit — documented in the ADR).

### ADR-018 — Analytics Events Partitioning Strategy (Design)

**Status:** Accepted 2026-08-09 (design ADR — no schema shipped). Analytics `events` tables partition by calendar month using PostgreSQL declarative partitioning, with a monthly partition-maintenance job (create next / drop older-than-retention). This decision de-risks the analytics domain: partitioning must be baked into the initial `CREATE TABLE`, not retrofitted.

# 5. Validation Results

| Check | Command | Result |
|---|---|---|
| Typecheck (all workspaces) | `pnpm typecheck` | ✅ 26/26 tasks |
| Lint (all workspaces) | `pnpm lint` | ✅ 153 files, 0 errors |
| Build (affected) | `pnpm --filter @loom/config build` → `@loom/auth` → `@loom/api` | ✅ |
| API integration tests | `pnpm --filter @loom/api test` | ✅ 6/6 pass |
| Better Auth verifier | `pnpm --filter @loom/auth verify` | ✅ all 5 checks pass |

### Integration test findings

The integration test caught and fixed a real bug before it shipped: the `GlobalExceptionFilter` collapsed the `ZodValidationPipe`'s structured `VALIDATION_ERROR` envelope into a generic `BAD_REQUEST` with a misleading message. The filter now detects an already-conformed `{ success, error: { code, message } }` response and preserves it verbatim (unit-tested through the real HTTP stack).

---

# 6. Files Changed / Added

| File | Change |
|---|---|
| `packages/config/src/env.ts` | + `BETTER_AUTH_URL` (URL, default `http://localhost:4000`). |
| `packages/auth/src/auth-config.ts` | + `baseURL: env.BETTER_AUTH_URL`. |
| `packages/auth/verify.mjs` + `package.json` `verify` script | New Better Auth configuration verifier. |
| `packages/database/src/schema/base.ts` | `id` default → `uuid_generate_v7()` (ADR-017). |
| `docker/postgres/Dockerfile` + `docker/docker-compose.yml` | Postgres image builds `pg_uuidv7` extension. |
| `apps/api/src/common/pipes/zod-validation.pipe.ts` (+ `index.ts`) | New Zod-backed validation pipe. |
| `apps/api/src/common/guards/rate-limit.guard.ts` | New rate limit guard (in-memory, unref'd cleanup). |
| `apps/api/src/common/modules/auth/auth.controller.ts` | Rate limits on 8 auth endpoints. |
| `apps/api/src/common/modules/user/user.controller.ts` | Zod validation + removed duplicate `@UseGuards(AuthGuard)`. |
| `apps/api/src/common/modules/tenant/tenant.controller.ts` | Zod validation; `getMyStores` N+1 removed. |
| `apps/api/src/common/modules/tenant/tenant.service.ts` | `getUserStores` batched IN query; `toStoreProfile()` helper. |
| `apps/api/src/common/filters/global-exception.filter.ts` | Preserve conformed error envelopes (bug fix found by test). |
| `apps/api/test/health.integration.test.mjs` + `test` script | Integration test foundation (6 tests). |
| `apps/api/package.json` | Removed `@nestjs/platform-fastify`; added `test` script. |
| `scripts/db-backup.mjs` + root `db:backup` / `db:restore` / `db:backup:list` | DB backup/restore helper. |
| `.env.example`, `docs/architecture/Environment-Specification.md` | `BETTER_AUTH_URL` documented. |
| `docs/adr/ADR-017-UUID-v7-Strategy.md`, `docs/adr/ADR-018-Analytics-Partitioning.md`, `docs/adr/README.md` | Two new ADRs (+ index). |

# 7. Risk Register (Out of Phase 04.5 Scope)

| Risk | Status | Mitigation / Owner |
|---|---|---|
| Rate limiter is per-process | Accepted for single-instance dev/CI; must become Redis-backed before multi-instance deployment. | Phase 19 / deployment hardening. |
| UUID v7 extension must exist in production Postgres | The Docker image builds it declaratively; managed providers (RDS etc.) need the extension enabled manually. | Documented in ADR-017; deployment checklist. |
| No live-DB verification in this runtime | Same environment constraint as Phase 04. | Developer with Docker: run `pnpm db:backup` then `pnpm db:restore <file>` per README. |
| `sessions`, `accounts` PKs still v4 (pre-04 tables) | Deliberate — migration cost outweighs benefit for Phase 04 tables. | ADR-017; future tables use v7. |

---

# 8. Conclusion

Phase 04.5 — Security & Correctness Hardening — is complete. The API now validates request bodies with the canonical Zod schemas, rate-limits its authentication surface, serves deterministic error envelopes end-to-end, reads tenant data without N+1 queries, and boots with a configured Better Auth base URL. Two forward-looking ADRs (UUID v7, Analytics partitioning) lock in decisions before rows exist. A DB backup helper, a Better Auth verifier, and an integration test foundation provide the tooling the later phases will build on. Monorepo `lint`, `typecheck`, `build`, and integration tests all pass.

**Ready for Phase 05 (Design System).**
