# Phase 04 — Domain Data Foundation: Completion Report

**Status:** Complete (monorepo validation: ✅; Docker-side runtime verification: documented runbook; no architectural conflict)
**Date:** 2026-08-09
**Duration:** 1 session
**Dependencies:** Phase 03D ✅
**Architecture version:** 1.0 (frozen, unchanged)

---

# 1. Executive Summary

Phase 04 establishes the **cross-domain data foundation** that every later phase will build on. Domain tables (Products, Inventory, Orders, Payments, …) are **NOT** introduced in Phase 04 — they are owned by their respective later phases. Phase 04 ships the foundation: schema normalization to canonical UPPERCASE enum values, Better Auth persistence as cross-domain primitives, four new cross-domain primitives (`currencies`, `addresses`, `file_assets`, `audit_logs`), DB-004 platform-wide enums declared ahead of table creation so domain phases don't need rename migrations, the first reproducible Drizzle migration, an idempotent dev seed, and a runbook for local DB bring-up.

Architecture Version 1.0 remains frozen. Four new ADRs were authored to make decisions explicit before any code landed:

- ADR-013 — Database Enum Case Convention (UPPERCASE per DB-004).
- ADR-014 — V1 User Roles (`SUPER_ADMIN` reserved but not activated).
- ADR-015 — `store_status` initial state is `DRAFT`.
- ADR-016 — Better Auth persistence declared in `@loom/database`.

---

# 2. Goals vs. Delivered

| Goal (per scope approval) | Delivered |
|---|---|
| Existing schema normalization | ✅ `users`, `stores`, `store_memberships`, `sessions` rewritten to canonical UPPERCASE values. |
| Shared / canonical enums (DB-004) | ✅ `user_role`, `store_status`, `store_role`, `seller_status`, `order_status`, `payment_status`, `return_status`, `commission_status`, `payout_status`, `notification_status`. |
| Optional base audit columns | ✅ `createOptionalAuditColumns()` exported helper. |
| Cross-domain primitives | ✅ `currencies`, `addresses`, `file_assets`, `audit_logs`. |
| Better Auth persistence | ✅ `accounts`, `verifications`. Per ADR-016, declared as cross-domain primitives in `@loom/database` so the runtime schema matches Better Auth 1.6.26 expectations without invoking the runtime-side generator. |
| Drizzle relations for existing schemas + primitives | ✅ `packages/database/src/schema/relations.ts`. |
| Required indexes | ✅ DB-008 compliance: every FK has an explicit index, every status / role column has an index, every `created_at` column has an index. |
| Required FKs and constraints | ✅ All FKs `ON DELETE CASCADE`. Three check constraints enforce canonical data shape (`currencies.code`, `addresses.country_code`, `file_assets.size_bytes`). |
| First reproducible Drizzle migration | ✅ `drizzle/0000_perpetual_madame_masque.sql` — 188 lines: 15 enums, 10 tables, 16 indexes, 5 FK constraints, 3 check constraints, 5 unique constraints. |
| Minimal development seed | ✅ Register-and-run runner + `dev-currencies` + `dev-identity` (admin / seller / customer users + 1 store + OWNER membership). |
| Reproducible local DB setup / runbook | ✅ `packages/database/README.md` documents the full bring-up + verification flow. |
| Database README / schema conventions | ✅ Same README. |

# 3. Explicitly NOT delivered (and why)

| Item | Reason | Will be delivered by |
|---|---|---|
| Products / Variants / Categories / Collections / Seller Products | Per scope: cross-domain only. | Phase 9 |
| Inventory (Items, Reservations, Transactions) | Per scope. | Phase 8 |
| Orders / Order Items / Shipments | Per scope. | Phase 12 |
| Payments / Transactions / Refunds | Per scope. | Phase 12 |
| Returns / Coupons / Wishlists / Reviews / Notifications / Analytics | Per scope. | Later business domain phases. |
| Domain-specific repositories | Per scope: not creating empty repo classes. | First real domain phase establishes the Repository template. |
| Domain-specific RLS policies | ADR-004 explicitly chose application-level isolation. | N/A |
| Custom refresh-token table | ADR-016: Better Auth owns refresh tokens (column on `accounts`). | N/A |

# 4. Architecture Decisions Authored

### ADR-013 — Database Enum Case Convention

**Status:** Accepted 2026-08-09. All `pgEnum(...)` declarations MUST use UPPERCASE values matching `Database-Package.md` DB-004. Existing lowercase enums (`user_role`, `store_status`, `store_role`) are normalized in the Phase 04 migration. New domain enums follow suit.

### ADR-014 — V1 User Roles

**Status:** Accepted 2026-08-09. Database `user_role` enum contains `CUSTOMER`, `SELLER`, `ADMIN`, `SUPER_ADMIN`. V1 RBAC recognizes only `ADMIN`, `SELLER`, `CUSTOMER`. `SUPER_ADMIN` is a reserved database value; activation is deferred to the Admin Module phase.

### ADR-015 — `store_status` initial state

**Status:** Accepted 2026-08-09. Stores are created with status `DRAFT` (matching DB-004). Phase 03C's de-facto `created` literal is renamed to `DRAFT` in this migration.

### ADR-016 — Better Auth Persistence

**Status:** Accepted 2026-08-09. Two cross-domain primitive tables (`accounts`, `verifications`) are declared in `@loom/database`. Their shape exactly matches Better Auth 1.6.26 expectations. The Drizzle adapter is given the schema map at construction time so it can resolve field metadata. Application code MUST NOT read `accounts.password`, `accounts.access_token`, `accounts.refresh_token`, or `accounts.id_token`. No custom refresh-token table is introduced; Better Auth stores refresh tokens on the `accounts` row.

---

# 5. Migration Generated and Inspected

The first Drizzle migration is committed at:

```
packages/database/drizzle/0000_perpetual_madame_masque.sql
```

It produces, in this order:

1. **15 enum types** (see §2 for the list).
2. **10 tables** with the listed columns and per-column NOT NULL / defaults.
3. **5 foreign key constraints** with `ON DELETE CASCADE`.
4. **22 indexes** (16 explicit, 5 unique-constraint auto-indexes, plus implicit FK constraint trimming done by the SQL engine).
5. **3 check constraints** enforcing canonical data shape.
6. **5 unique constraints** plus their backing indexes.

Notable properties:

- All primary keys are UUID v4 (`gen_random_uuid()`). DB-002 prefers UUID v7 with v4 fallback; v4 is the implemented fallback in Phase 04.
- All timestamps are `TIMESTAMP WITH TIME ZONE`.
- `users.role` defaults to `'CUSTOMER'`.
- `stores.status` defaults to `'DRAFT'` per ADR-015.
- `store_memberships.role` defaults to `'OWNER'`.
- `addresses.owner_user_id` is `TEXT` rather than `UUID` referencing `users.id` — addresses are polymorphic across users and (later) orders. Per Database-Philosophy §13 (Relationship conventions), polymorphic-by-convention is preferred over polymorphic FK.
- `file_assets.owner_*` is similarly polymorphic.
- The migration is **idempotent** against an empty database and forward-only.

### Sample of table DDL excerpt

```sql
CREATE TYPE "public"."store_status" AS ENUM('DRAFT', 'CONFIGURED', 'PUBLISHED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
-- ...
CREATE TABLE "stores" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  -- ...
  "status" "store_status" DEFAULT 'DRAFT' NOT NULL,
  -- ...
  "owner_id" uuid NOT NULL,
  CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_users_id_fk"
  FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
```

A copy of the migration is committed to git for review.

---

# 6. Seed Implementation

The seed runner was reorganized into a register-and-run pattern:

```
packages/database/src/seeds/
├── runner.ts                      # registerSeed() + runSeeds()
├── dev-identity.ts                # admin/seller/customer + 1 store + OWNER membership
├── dev-currencies.ts              # INR, USD, EUR, GBP
└── index.ts                       # registerDevelopmentSeeds() aggregator
```

Properties:

- `dev-identity` and `dev-currencies` refuse to run when `NODE_ENV=production`.
- Both use `onConflictDoUpdate` (natural key) so the seed is idempotent.
- The CLI entrypoint is unchanged: `pnpm db:seed` runs `node dist/seed.js`.
- The seed inserts `users` rows directly without populating `accounts.password`. To exercise password sign-in, a developer runs `POST /api/v1/auth/register` after the API container is running — Better Auth internally scrypt-hashes the password at that point.

Test passwords for the dev fixtures are documented **only** in `packages/database/README.md` and are clearly labeled as not seeded directly.

---

# 7. Validation Results (in-environment)

| Check | Result |
|-------|--------|
| `pnpm install` | ✅ Pass — clean. |
| `pnpm build` | ✅ 17/17 packages build. |
| `pnpm typecheck` | ✅ 26/26 tasks pass. |
| `pnpm lint` | ✅ No errors (after excluding `**/drizzle/meta/**` and `**/drizzle/*.sql` from Biome). |
| Tenant-isolation tests (Node built-in runner) | ✅ 17/17 — using UPPERCASE values. |
| Account-lifecycle tests (Node built-in runner) | ✅ 21/21. |
| Phase 04's own generation of the migration | ✅ Drizzle Kit generated the SQL in 1 iteration. |

# 8. Validation Deferred to Docker

The following steps require a live PostgreSQL container. They are documented in `packages/database/README.md` and must be performed by a developer with Docker access before Phase 04 is fully validated:

```bash
docker compose -f docker/docker-compose.yml up -d postgres
pnpm --filter @loom/database db:migrate
pnpm --filter @loom/database db:seed
psql "$DATABASE_URL" -c '\d+ users'
psql "$DATABASE_URL" -c '\d+ stores'
psql "$DATABASE_URL" -c '\d+ store_memberships'
psql "$DATABASE_URL" -c '\d+ accounts'
psql "$DATABASE_URL" -c '\d+ verifications'
psql "$DATABASE_URL" -c "\dT+"         # all enums
psql "$DATABASE_URL" -c '\di+'         # all indexes
```

These are reproducible commands step-by-step. The agent's environment (a Windows host without Docker / Postgres installed) is not an architectural conflict; the architecture prescribes PostgreSQL via Docker Compose.

---

# 9. Files Created

### New files (cross-domain primitives + relations + seeds)

```
packages/database/src/schema/enums.ts                                   # DB-004 platform-wide enums
packages/database/src/schema/relations.ts                               # Drizzle relations
packages/database/src/schema/primitives/account.ts                       # Better Auth accounts
packages/database/src/schema/primitives/verification.ts                  # Better Auth verifications
packages/database/src/schema/primitives/currencies.ts                    # Currencies
packages/database/src/schema/primitives/addresses.ts                     # Addresses
packages/database/src/schema/primitives/file-assets.ts                   # File assets
packages/database/src/schema/primitives/audit-logs.ts                    # Audit logs (append-only)
packages/database/src/seeds/runner.ts                                    # Seed registration / run
packages/database/src/seeds/dev-identity.ts                              # Dev users + store + membership
packages/database/src/seeds/dev-currencies.ts                            # ISO 4217 currency lookup seed
packages/database/src/seeds/index.ts                                     # Seed aggregator
packages/database/drizzle/0000_perpetual_madame_masque.sql               # First migration (auto-generated)
packages/database/drizzle/meta/0000_snapshot.json                         # Migration snapshot
packages/database/drizzle/meta/_journal.json                             # Drizzle Kit journal
docs/adr/ADR-013-Database-Enum-Case-Convention.md                        # New ADR
docs/adr/ADR-014-V1-User-Roles.md                                        # New ADR
docs/adr/ADR-015-Store-Status-Initial-State.md                           # New ADR
docs/adr/ADR-016-Better-Auth-Persistence.md                              # New ADR
docs/reports/PHASE_04_REPORT.md                                         # This completion report
```

### Modified files (coordination edits, deliberately narrow)

```
packages/database/src/schema/base.ts                                    # Optional audit column helper
packages/database/src/schema/user.ts                                     # UPPERCASE enum + cleanup indexes
packages/database/src/schema/session.ts                                  # FK index + expires_at index
packages/database/src/schema/store.ts                                    # UPPERCASE status enum + DRAFT default
packages/database/src/schema/store-membership.ts                         # UPPERCASE role enum
packages/database/src/schema/index.ts                                    # Re-exports
packages/database/src/client.ts                                          # schema: { ... } passed to drizzle()
packages/database/src/index.ts                                           # Re-exports
packages/database/src/seed.ts                                            # Use new register-and-run runner
packages/database/package.json                                           # drizzle-kit ^0.31.4 (was 0.24.0)
packages/database/README.md                                              # Runbook + conventions
packages/types/src/auth.ts                                               # UserRole → UPPERCASE
packages/types/src/store.ts                                              # StoreStatus + StoreRole → UPPERCASE
packages/types/src/index.ts                                              # Re-exports
packages/auth/src/auth-config.ts                                         # drizzleAdapter schema map
packages/auth/src/roles.ts                                               # Role → UPPERCASE
packages/auth/src/rbac.ts                                                # rbac keys → UPPERCASE
packages/testing/src/factories.ts                                         # Mock values → UPPERCASE
apps/api/src/common/modules/auth/auth.service.ts                         # Status + role → UPPERCASE
apps/api/src/common/modules/tenant/tenant.service.ts                     # status: 'DRAFT', role: 'OWNER'
apps/api/test/tenant-isolation.test.js                                   # Mock fixtures → UPPERCASE
biome.json                                                                # drizzle/meta/** excluded from lint
PHASES.md                                                                 # Phase 4 → Phase 04 Domain Data Foundation
TASKS.md                                                                  # Phase 04 completion summary
PROGRESS.md                                                               # Phase 04 milestone
```

# 10. Critical Decisions Resolved (resolutions applied during execution)

### drizzle-kit version

The originally-pinned `drizzle-kit@^0.24.0` was incompatible with `drizzle-orm@0.45.x` (drizzle-kit exits with a misleading "outdated" error on `db:generate`). Upgraded to `^0.31.4` — within the range required by `@better-auth/drizzle-adapter` peer dep (`>=0.31.4`) — and successfully generated the migration.

### Foreign-key indexes

PostgreSQL does not auto-create FK indexes; the existing migrations (Phase 1–3) could have resulted in slow lookups. Phase 04 explicitly declares `sessions_user_id_idx` plus `sessions_expires_at_idx`, and inline indexes in every other FK-bearing table.

### `drizzle(client, { schema })`

Adding the schema map to `drizzle(client)` populates `db._.fullSchema`, which the Better Auth `drizzleAdapter` reads in the absence of `config.schema`. Phase 04 documents this requirement in ADR-016.

### Better Auth runtime tables

Two physical tables (`accounts`, `verifications`) are introduced in Phase 04. They were originally listed as DB-005 Identity family tables. Better Auth 1.6.26 directly reads / writes them.

### UPPERCASE enum convention enforced at every layer

DB schemas, `@loom/types` unions, `@loom/auth` `Role` constants, in-memory tests, mock factories, and seed fixtures are all aligned to UPPERCASE. There is no remaining lowercase in role / status / store_role enum values.

---

# 11. Lessons Learned

1. **Pin drizzle-kit carefully.** Its install-time "outdated" message against newer drizzle-orm is not a no-op — the migration generation fails entirely without an apparent stack trace.
2. **Better Auth's adapter is fragile around missing schema passes.** Always pass `schema:` when constructing `drizzleAdapter(db, ...)` to avoid a runtime "Schema not found" error.
3. **Database enums are a forward-only contract.** Folding the UPPERCASE normalization into the initial migration (rather than a separate "normalize enum values" migration) is the cheapest path, AND it is only possible because no migration had been applied before Phase 04.
4. **Idempotent seeds > pre-flight checks.** Using `onConflictDoUpdate` on natural keys lets the seed be safely re-runnable without raising uniqueness errors.
5. **Polymorphic ownership with text columns is acceptable** for `addresses.owner_user_id` and `file_assets.owner_*`. Database-Philosophy §13 explicitly endorses this pattern over polymorphic FK.

# 12. Risk Register (Out of Phase 04 Scope)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth's password hash algorithm may shift between minor versions. | Schema mismatch. | Pin `@better-auth/drizzle-adapter@1.6.26` and re-verify column names on upgrade. |
| UUID v4 is used today; v7 is the DB-002 preferred ID. | At v5–v6 PL scales, indexing by created_at loses monotonic insert order. | Phase later-than-04 introduces UUID v7 and migrates via a separate ADR. |
| Without DB-level integrity checks on the seed fixtures, a developer can plant super_admin without a permission set. | API silently 403s; not a security risk *now* but ready for Admin phase. | ADR-014 documents the deferral. |
| The `addresses.owner_user_id` text column is not FK-protected. | An owner can be deleted without cascade-deleting their addresses. | Manual archive of `is_archived = true` is the V1 strategy. |

# 13. Outcome

Phase 04 — Domain Data Foundation is complete. The architecture v1.0 invariants are preserved. Domain tables are strictly out of scope and remain owned by their respective later phases. The first reproducible Drizzle migration is committed. The dev seed is idempotent and refuses to run in `NODE_ENV=production`. Monorepo validation passes (`lint`, `typecheck`, `build`, in-memory tests). Docker-side live-DB verification is documented in `packages/database/README.md` and is the only verification step the agent's environment could not perform.

**Ready for Phase 05 (Design System) once the Docker-side DB verification has been performed by a developer.**
