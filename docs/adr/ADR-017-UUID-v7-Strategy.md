# ADR-017 — Adopt UUID v7 as the Primary Key Generation Strategy

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-017

**Owners:** Engineering

**Supersedes:** Partially clarifies ADR-002 § `ID Strategy`.

---

# Context

Project Loom's database architecture specifies UUID primary keys. Two UUID versions are under consideration:

1. **UUID v4** (`gen_random_uuid()` in PostgreSQL) — random UUIDs. Currently implemented in every table (10 PK columns).
2. **UUID v7** — time-ordered UUIDs that embed a Unix timestamp in the high 48 bits, followed by random bits.

The Phase 04 audit identified that `Database-Package.md` DB-002 and `Database-Philosophy.md` §5 both state "UUID v7 (preferred), UUID v4 (fallback)", but the current implementation uses v4 exclusively. The preference clause was written at architecture freeze time but never activated.

The decision must be made NOW (Phase 04.5) because:
- No migration has been applied to any non-development database.
- Switching defaults before production data exists is a single `CREATE EXTENSION` + re-generated migration.
- Switching after production data exists requires either (a) adding a new column and dual-writing, or (b) rewriting PKs — both expensive at scale.
- Every new table added in Phase 5+ will inherit whichever PK strategy is canonical.

---

# UUID v7 vs v4 Tradeoffs

| Property | v4 (current) | v7 (proposed) |
|----------|-------------|---------------|
| **Insert performance** | Random inserts cause B-tree page splits under high concurrency | Monotonic inserts fill pages sequentially; ~20x better B-tree fill factor |
| **Vacuum pressure** | Higher (dead tuples from page splits) | Lower (fewer page splits) |
| **Uniqueness** | 122 random bits | 74 random bits + 48-bit timestamp — still collision-free at planetary scale |
| **Sort-order correlation** | None (no temporal ordering) | Correlation with `created_at` — enables time-range scans from PK alone |
| **PostgreSQL support** | `gen_random_uuid()` built-in | Requires `CREATE EXTENSION pg_uuidv7` |
| **Migration complexity** | Currently in use | `defaultRandom()` → `sql\`uuid_generate_v7()\`` in `createBaseColumns()` |
| **Privacy** | Cannot infer creation time from UUID | Timestamp reveals approximate row creation time |

---

# Decision

Project Loom will adopt **UUID v7** as the canonical primary key generation strategy, effective immediately.

1. All 10 existing tables will switch their PK default from `gen_random_uuid()` to `uuid_generate_v7()` (provided by the `pg_uuidv7` extension).
2. `packages/database/src/schema/base.ts` — `createBaseColumns()` will use `sql\`uuid_generate_v7()\`` instead of `.defaultRandom()`.
3. A new migration will be generated that includes `CREATE EXTENSION pg_uuidv7` and updates all PK defaults.
4. The `pg_uuidv7` extension will be added to the Docker Compose PostgreSQL service initialization.
5. FK columns (which are `uuid` typed but do not generate their own values) are unaffected.
6. The migration is backward-compatible at the type level: v7 UUIDs are valid UUIDs and can coexist with v4 UUIDs in FK relationships.
7. Existing v4 UUID rows (if any) will remain valid and do not need conversion.

---

# Why v7 Now

- **Cheapest possible moment.** No migration has been applied to any non-development database. The committed migration (`0000_perpetual_madame_masque.sql`) will be replaced with a v7-based migration. This is a `CREATE EXTENSION` + re-generation.
- **Index performance at scale.** The Phase 0 audit set targets of 500K users, 100K stores, and 50M orders. At these volumes, monotonic PK insertion is materially faster than random insertion. B-tree fill factors are higher, page splits are fewer, and vacuum pressure is lower.
- **Time-ordering.** UUID v7 embeds a millisecond-precision timestamp. This enables time-range scans directly from the PK without requiring a separate `created_at` index — though typical workloads will keep both for filtering.
- **The architecture says v7.** DB-002 and Database-Philosophy §5 list v7 as preferred. The implementation diverges from the spec. Resolving the divergence now is cheaper than updating the documentation to accept perpetual v4 use.

---

# Why Not v4

- The "fallback" status in DB-002 was written at architecture freeze. The freeze was intended to prevent architecture ADDITIONS, not to prevent switching to the explicitly preferred strategy.
- v4 is the devil we know — it works — but it is measurably inferior at scale for primary keys in a database that will grow to 50M+ rows in its largest tables.
- There is no real cost to switching now (see above).

---

# Extension Management

`pg_uuidv7` is a lightweight PostgreSQL extension.

**Docker:** The extension will be created lazily via the migration (`CREATE EXTENSION IF NOT EXISTS pg_uuidv7`). The Docker PostgreSQL 16 image does not include the extension by default; the migration will invoke `CREATE EXTENSION` as the first DDL step, and the Docker setup will be updated to pre-install the extension.

**Production:** The extension will be created in the PostgreSQL instance before the migration runs (either via superuser `CREATE EXTENSION` or bundled into the production deployment process).

**Drizzle Kit:** The `CREATE EXTENSION` statement is a raw SQL migration step that Drizzle Kit cannot auto-generate from schema definitions. It will be prefixed to the generated migration as a manual step.

---

# Migration Path

1. `CREATE EXTENSION IF NOT EXISTS pg_uuidv7`
2. Regenerate the migration: `pnpm --filter @loom/database db:generate`
3. Verify the generated SQL contains `uuid_generate_v7()` defaults
4. Manually prepend the `CREATE EXTENSION` statement to the migration
5. Apply the migration to a fresh Docker PostgreSQL
6. Verify all 10 PK columns use `uuid_generate_v7()`

---

# Consequences

Positive:

- Monotonic PK insertion across all tables from Day 1.
- Reduced page splits and vacuum pressure at scale.
- Architecture docs and implementation become consistent (v7 preferred).
- Time-range scans can leverage PK ordering.

Negative:

- Requires a PostgreSQL extension (`pg_uuidv7`).
- Docker Compose must include the extension in the PostgreSQL service setup.
- Each new environment (dev, staging, prod) must create the extension before the migration runs.
- v7 embeds a timestamp; row creation time is inferable from the PK.

---

# Success Criteria

This decision remains valid while:

- Every `id` column uses `uuid_generate_v7()` as its default.
- `CREATE EXTENSION pg_uuidv7` runs before the migration on every environment.
- No UUID v4 default exists in the schema.
- Index performance (B-tree fill factor, page split rate) is within targets at 10M+ rows.

If a future UUID standard (v8) provides compelling advantages, a new ADR may re-evaluate.

---

# Related Documents

- `docs/database/Database-Package.md` — DB-002
- `docs/database/Database-Philosophy.md` — §5 ID Strategy
- `docs/adr/ADR-002-PostgreSQL.md`
- `docs/adr/ADR-003-Drizzle.md`
- `packages/database/src/schema/base.ts`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Adopted UUID v7 as the canonical PK generation strategy. |
