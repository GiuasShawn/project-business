# ADR-015 — Store Status Initial State (`DRAFT`)

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-015

**Owners:** Engineering

**Supersedes:** Partial — clarifies DB-004 §`StoreStatus` initial value.

---

# Context

`Database-Package.md` §`DB-004 — Global Enums` declares:

```
StoreStatus
DRAFT
CONFIGURED
PUBLISHED
ACTIVE
SUSPENDED
ARCHIVED
```

The first state in any sane ordering is `DRAFT`.

`Product-Data-Model.md` §`5. Entity — Store` lifecycle narrative begins with "Created" (lowercase). No meaning distinct from `DRAFT` is implied.

Phase 03C implementation defined the `store_status` enum as:

```ts
pgEnum('store_status', [
  'created',
  'configured',
  'published',
  'active',
  'suspended',
  'archived',
])
```

and `tenant.service.createStore()` wrote `status: 'created'`. `tenant.guard.ts`, controllers, and tests have been keyed off `created`.

So we have:

- **DB-004 enum first value:** `DRAFT`
- **Impl first value:** `created` (also lowercase)
- **PDM narrative first value:** `Created` — interpretation equivalence either way

The store lifecycle is otherwise identical (`Configured → Published → Active → Suspended → Archived` words appear in both, lowercased in impl, UPPER-cased in DB-004). Forward transitions `DRAFT/Created → CONFIGURED/Configured → … → ARCHIVED/Archived` are semantically the same.

---

# Decision

Canonicalize `store_status` initial state as **`DRAFT`**, in agreement with DB-004.

Concretely:

1. `pgEnum('store_status', ['DRAFT','CONFIGURED','PUBLISHED','ACTIVE','SUSPENDED','ARCHIVED'])`.
2. On store creation, `status` defaults to `'DRAFT'`.
3. The `StoreStatus` TypeScript union in `packages/types/src/store.ts` is `'DRAFT' | 'CONFIGURED' | 'PUBLISHED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'`.
4. The Phase 03C `completeSellerOnboarding` flow — which transitions `'created' → 'configured'` after email verification — continues to be valid and now means `'DRAFT' → 'CONFIGURED'`.
5. The `StoreStatus` enumeration ordering in `Product-Data-Model.md` §5 is treated as referring to the states, not their literal names. The spec does not require a textual edit.
6. `stores_status_idx` is preserved. The index supports filtering by `DRAFT` and `ACTIVE` cubes (the two queried at the storefront boundary).

The decision is **semantics-preserving** — no business rule changes. The only observable difference is the literal value `DRAFT` instead of `created` in:

- Database rows.
- Application code typed against `StoreStatus`.
- Test fixtures / seeds.

Because Phase 04 is the first Drizzle migration generated, this normalization is folded into the initial migration like all other enum case changes.

---

# Why Normalize Now

- **DB-004 is the canonical source.** The implementation disagrees with the spec; the spec wins.
- **Future domain enums will be added with the same case convention** (ADR-013). Starting from a consistent baseline prevents the pattern of "every domain picks its own first enum value."
- **No prior migration means no in-place translation** of existing `created` rows. The Phase 04 migration creates the `stores` table with the new enum; whatever existing application code writes becomes the new value.
- **Public read APIs (`GET /api/v1/stores/:storeId`) will now return `status: 'DRAFT'`**. Consumers (e.g., seller dashboard) will see `DRAFT`. This is consistent with the DB-004 ladder they are intended to be tested against.

---

# Why Not Just Rename Later

- Once a migration exists and downstream consumers rely on `'active'` / `'created'` literals, renaming is a behavioral change.
- Pre-migration rename costs are bounded to one Phase (Phase 04) and one PR.

---

# Scope Boundaries

- The `active`/`suspended`/`configured`/`published`/`archived` cases are also being renamed **as part of the broader UPPERCASE normalization** (ADR-013). They are not separately renamed by this ADR. This ADR addresses only the **`DRAFT` vs `created`** distinction.
- The lifecycle ordering (state transitions) is unchanged. `DRAFT → CONFIGURED → PUBLISHED → ACTIVE → SUSPENDED → ARCHIVED` is the same as before.

---

# Migration Strategy

The change is folded into the Phase 04 first migration:

1. Enum definition updated in `packages/database/src/schema/store.ts`.
2. Default value for `status` updated to `'DRAFT'`.
3. Code that hard-coded `'created'` updated to `'DRAFT'`.
4. The generated SQL will contain `CREATE TYPE store_status AS ENUM ('DRAFT','CONFIGURED','PUBLISHED','ACTIVE','SUSPENDED','ARCHIVED')`. Verified by inspecting the SQL before applying it.

Since no migration has ever been generated or applied, this normalization happens at clean-create time, not as a rename of an existing value. There is no `ALTER TYPE … RENAME VALUE` step required.

---

# Consequences

Positive:

- `store_status` becomes uniformly UPPERCASE (ADR-013) with its first value matching DB-004.
- Better readability of storefront data emitted through the API.
- `store_status_idx` continues to serve `DRAFT` filter lookups.

Negative:

- Anyone scripting against a hypothesis of `created` (e.g., ad-hoc PG queries) must update.
- Coordinated change across services / controllers / tests.

---

# Success Criteria

This decision remains valid while:

- `pgEnum('store_status', ['DRAFT', ...])` is exact in the schema.
- `StoreStatus` TypeScript union has `'DRAFT'` as its first member.
- `tenant.service.createStore()` inserts `status: 'DRAFT'`.
- `tenant.service.completeSellerOnboarding()` transitions `'DRAFT' → 'CONFIGURED'` after email verification.

A future state-engineering phase may introduce composite states (e.g., a `DRAFT_PUBLISHED` mixed flag); if so, a separate ADR evaluates that.

---

# Related Documents

- `docs/database/Database-Package.md` — DB-004
- `docs/database/State-Machines.md`
- `docs/product/Product-Data-Model.md` — §5 Store
- `docs/adr/ADR-004-Multi-Tenancy.md` — tenant lifecycle
- `docs/adr/ADR-013-Database-Enum-Case-Convention.md`
- `packages/database/src/schema/store.ts`
- `apps/api/src/common/modules/tenant/tenant.service.ts`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Canonicalized store_status initial state to DRAFT. |
