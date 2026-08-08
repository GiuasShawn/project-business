# @loom/database

Drizzle ORM schema, migrations, and database client for Project Loom.

## Purpose

This package owns:

- The canonical Drizzle schema definitions (Phase 04 + every later phase).
- The generated SQL migrations under `drizzle/`.
- The Postgres connection client (postgres-js + Drizzle, configured with the
  full schema map so Better Auth's `drizzleAdapter` can find it).
- A register-and-run dev seed infrastructure.

## Tables Owned by Phase 04

### Existing (Phase 1–3)

| Table | Phase | Owner |
|-------|-------|-------|
| `users` | 03A (extended in 04) | Identity |
| `sessions` | 03A | Identity |
| `stores` | 03C (extended in 04) | Stores |
| `store_memberships` | 03C (extended in 04) | Stores |

### Cross-domain primitives (new in 04)

| Table | Owner |
|-------|-------|
| `accounts` | Identity — Better Auth persistence (per ADR-016) |
| `verifications` | Identity — Better Auth persistence (per ADR-016) |
| `currencies` | Platform — ISO 4217 lookup |
| `addresses` | Customer — addresses (used by Orders later) |
| `file_assets` | Platform — R2 metadata |
| `audit_logs` | Platform — append-only audit trail |

### Schema conventions

Per ADR-013, all enum literals are UPPERCASE (matching DB-004):

- `user_role` ∈ `{CUSTOMER, SELLER, ADMIN, SUPER_ADMIN}` — `SUPER_ADMIN` is
  reserved-not-activated in V1 (ADR-014).
- `store_status` ∈ `{DRAFT, CONFIGURED, PUBLISHED, ACTIVE, SUSPENDED, ARCHIVED}`
  — initial state is `DRAFT` (ADR-015).
- `store_role` ∈ `{OWNER}` — single-owner V1 (ADR-004).
- Domain enums (`order_status`, `payment_status`, …) declared ahead of table
  creation so later phases do NOT need an enum rename migration.

Per Database-Package.md and DB-002, all primary keys are UUID v4
(`gen_random_uuid()`). UUID v7 is the preferred UUID generation per DB-002
but is not implemented in Phase 04 — v4 is the documented fallback.

Indexes follow DB-008:

- Every FK has an explicit index (Drizzle emits an FK constraint; the FK column
  also gets an explicit index in `pgTable`'s second-arg callback).
- Each table has an index on the `created_at` column where the table is expected
  to grow over time and require temporal filtering.
- Status / role / provider columns have explicit indexes.

Check constraints enforce canonical formatting on rows that have free-text
codes:

- `currencies.code` must be UPPERCASE.
- `addresses.country_code` must be UPPERCASE.
- `file_assets.size_bytes` must be non-negative.

Per Database-Package.md DB-003, every domain table includes `id`,
`created_at`, `updated_at`. Optional audit columns (`deleted_at`,
`created_by`, `updated_by`, `deleted_by`, `version`) are exposed via
`createOptionalAuditColumns()` for domain tables that opt in (later phases).

## Reproducible local database setup

The exact sequence used to bring up a fresh Postgres + apply migrations +
seed dev identities. Run from the repository root.

```bash
# 1. Boot the local Postgres container from docker/docker-compose.yml.
docker compose -f docker/docker-compose.yml up -d postgres

# 2. Wait for readiness (the compose healthcheck does this already, but if you
#    refresh from scratch, you can poll with):
docker compose -f docker/docker-compose.yml ps

# 3. Generate migration (idempotent — no-op if no schema change since last run).
pnpm --filter @loom/database db:generate

# 4. Apply all generated migrations to the database.
pnpm --filter @loom/database db:migrate

# 5. Seed development identities (admin / seller / customer / store / membership).
pnpm --filter @loom/database db:seed

# 6. Verify with a query that all expected tables and enums exist.
psql "$DATABASE_URL" -c '\d+ users'
psql "$DATABASE_URL" -c "\dT+ user_role"
psql "$DATABASE_URL" -c '\d+ stores'
psql "$DATABASE_URL" -c '\d+ store_memberships'
```

After these steps, repeated runs of `pnpm db:migrate` and `pnpm db:seed`
must succeed without duplication errors. The seed is idempotent (`onConflict`
on natural keys).

## Scripts

| Script | Effect |
|--------|--------|
| `pnpm --filter @loom/database build` | Compile TypeScript to `dist/`. |
| `pnpm --filter @loom/database typecheck` | Run `tsc --noEmit`. |
| `pnpm --filter @loom/database db:generate` | Generate SQL migration files from the schema. |
| `pnpm --filter @loom/database db:migrate` | Apply pending migrations to the live database. |
| `pnpm --filter @loom/database db:seed` | Run all development seeds. |
| `pnpm --filter @loom/database db:studio` | Open Drizzle Studio (URL in console). |
| `pnpm --filter @loom/database db:push` | ⚠️ Not for production use. Pushes schema directly to the database without generating a migration file. Avoid; use `db:generate` then `db:migrate` instead. |

## Dev-only identities

After running `pnpm db:seed`:

| Email | Role | Password (NOT seeded) |
|-------|------|-----------------------|
| `dev+admin@projectloom.dev` | ADMIN | `dev-password-12345` |
| `dev+seller@projectloom.dev` | SELLER | `dev-password-12345` |
| `dev+customer@projectloom.dev` | CUSTOMER | `dev-password-12345` |

The seed inserts users into the `users` table directly without populating the
`accounts.password` column. To exercise password sign-in in development, run
`POST /api/v1/auth/register` for each dev email/password above after the API
container is running. The `/api/v1/auth/register` endpoint uses Better Auth
internally to scrypt-hash the password and writes the corresponding row in
`accounts`.

## Architectural refs

- ADR-002 — Adopt PostgreSQL
- ADR-003 — Adopt Drizzle ORM
- ADR-013 — Database Enum Case Convention
- ADR-014 — V1 User Roles
- ADR-015 — Store Status Initial State
- ADR-016 — Better Auth Persistence

## Conventions (do not violate)

- Forward-only migrations. Never delete or rename a migration file after it
  has been applied to any environment.
- Prefer adding new tables / new columns over mutating existing tables in
  breaking ways.
- Document any schema change with a corresponding ADR or ADR-revision before
  generating a migration.
- Better Auth reads / writes `users`, `sessions`, `accounts`, `verifications`.
  Application code MUST NOT write to those tables directly except via Better
  Auth's runtime API or the seed/migration paths in this package.
- Polymorphic ownership (e.g., `addresses.owner_user_id`, `file_assets.owner_*`)
  is implemented as text columns by convention; do not introduce database FK
  constraints across them.

## What is NOT in this package

- Domain tables (Products, Orders, Payments, …) — added by their respective
  domain phases.
- Repositories — added by domain phases that exercise them.
  (Repositories map to `packages/database` repositories once the first real
  domain lands. Phase 04 deliberately does NOT pre-create empty repository
  classes; see ADR-016.)
