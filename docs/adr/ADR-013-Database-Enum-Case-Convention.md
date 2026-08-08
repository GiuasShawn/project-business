# ADR-013 — Database Enum Case Convention (UPPERCASE per DB-004)

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-013

**Owners:** Engineering

---

# Context

Project Loom's database architecture has two sources of truth for enum values:

1. **`Database-Package.md`** §`DB-004 — Global Enums` enumerates each canonical enum with UPPERCASE values:

   - `UserRole`: `CUSTOMER`, `SELLER`, `ADMIN`, `SUPER_ADMIN`
   - `SellerStatus`: `PENDING`, `VERIFIED`, `APPROVED`, `ACTIVE`, `SUSPENDED`, `CLOSED`
   - `StoreStatus`: `DRAFT`, `CONFIGURED`, `PUBLISHED`, `ACTIVE`, `SUSPENDED`, `ARCHIVED`
   - `OrderStatus`, `PaymentStatus`, `ReturnStatus`, `CommissionStatus`, `PayoutStatus`, `NotificationStatus`

2. **Phase 1–3 implementation** introduced Drizzle `pgEnum` constants in lowercase for the two enums shipped so far:

   - `userRoleEnum = pgEnum('user_role', ['admin', 'seller', 'customer'])`
   - `storeStatusEnum = pgEnum('store_status', ['created', 'configured', 'published', 'active', 'suspended', 'archived'])`
   - `storeRoleEnum = pgEnum('store_role', ['owner'])`

This is a live inconsistency between the frozen v1.0 architecture and the running implementation. Both must converge to a single convention before Phase 04 introduces additional enums, because divergence will:

- Force every future domain enum declaration to pick a side arbitrarily.
- Cross-contaminate application code, types, and database SQL.
- Make audit / migration scripts ambiguous (Case-sensitive vs Case-insensitive comparisons).

Candidate conventions:

| Option | Pros | Cons |
|--------|------|------|
| UPPERCASE | Matches `Database-Package.md` DB-004 verbatim; clearer cross-domain referential reading at the SQL level; matches Postgres convention for enum literals in state-machine docs. | All existing rows, services, types, tests must change in a coordinated normalization migration. |
| lowercase | Matches existing code; minimal diff for Phase 1–3 work; matches the JSON convention stored in API payloads. | Requires updating DB-004 and DB-003 spec docs (a divergence between architecture docs and code). |
| Both (per-enum) | Preserves partial state. | Indefinite ambiguity. Rejected. |

---

# Decision

Project Loom's **canonical database enum values** will be written in **`UPPERCASE`**, in agreement with `Database-Package.md` DB-004.

This applies to:

- All new `pgEnum(...)` declarations introduced from Phase 04 onwards.
- The two existing enum families (`user_role`, `store_status`, `store_role`) during the Phase 04 normalization migration.

Selection of values per enum (from DB-004):

| Enum name | Values |
|-----------|--------|
| `user_role` | `CUSTOMER`, `SELLER`, `ADMIN`, `SUPER_ADMIN` |
| `seller_status` | `PENDING`, `VERIFIED`, `APPROVED`, `ACTIVE`, `SUSPENDED`, `CLOSED` |
| `store_status` | `DRAFT`, `CONFIGURED`, `PUBLISHED`, `ACTIVE`, `SUSPENDED`, `ARCHIVED` |
| `store_role` (V1 single-owner) | `OWNER` |
| `order_status` | `PENDING`, `CONFIRMED`, `PACKED`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED` |
| `payment_status` | `INITIATED`, `AUTHORIZED`, `CAPTURED`, `SETTLED`, `FAILED`, `REFUNDED` |
| `return_status` | `REQUESTED`, `APPROVED`, `COLLECTED`, `RECEIVED`, `REFUNDED`, `REJECTED`, `CLOSED` |
| `commission_status` | `PENDING`, `ELIGIBLE`, `PAID`, `REVERSED` |
| `payout_status` | `PENDING`, `SCHEDULED`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `notification_status` | `QUEUED`, `SENDING`, `DELIVERED`, `FAILED` |

Application-layer TypeScript string-literal unions in `@loom/types/*` mirror the database enum values exactly (lowercase mapping is **not** introduced). Services, controllers, and DTOs use the UPPERCASE literals directly.

The database column name carrying the role/status remains `snake_case` (e.g. `role`, `status`, `store_status`).

---

# Why UPPERCASE

- **Frozen architecture alignment.** DB-004 is part of the v1.0 frozen spec. Multiple ADRs (ADR-002, ADR-003) and engineering documents cross-reference enum values. Diverging from DB-004 in code forces a doc rewrite. Aligning code to the frozen doc is preferred.
- **Readability in SQL.** Postgres pgEnum literals read as constants (`WHERE status = 'ACTIVE'`), and UPPERCASE makes them visually distinct from identifier columns.
- **Convention already established in v1.0 product documentation.** `Product-Data-Model.md` §4–§12 uses UPPERCASE labels in lifecycle narratives.

---

# Why Not Just Leave Existing lowercase Values

- **Cost of remaining lowercase grows linearly with each new domain.** Every future domain must decide which case convention to follow.
- **Two coexisting conventions create silent bugs** (e.g., `WHERE role = 'admin'` returning empty because DB stores `ADMIN`).
- **It contradicts DB-004** which is part of the frozen architecture the entire project is built on.

---

# Migration Strategy

Because Phase 04 is the first time a Drizzle migration is generated, the normalization is folded into the **initial migration**:

1. The Drizzle `pgEnum` definitions are rewritten using UPPERCASE literal arrays.
2. `pgEnum(name, [...])` declarations are stable on the second argument (the value strings). Drizzle Kit will emit `CREATE TYPE … AS ENUM (...)` with the new values.
3. All application-side usages of enum literals (services, types, tests) are updated in the same GoTree as the schema change.
4. `validateSession` / `completeSellerOnboarding` / `registerSeller` and the new test suite assert behavior against the new values.

The migration is **forward-only** and **irreversible** at the enum level. Drizzle Kit will produce the SQL; we will inspect the generated SQL before applying it (per Phase 04 runbook), then apply it once to a clean local PostgreSQL.

Because the existing Postgres instance has no rows yet (no prior migration), the conversion is a clean create — not a data migration. Existing puppeteer scripts (if any) need to be updated, but no Phase-locked data must be translated.

---

# Scope Boundaries

This ADR **does not** introduce UPPERCASE on column names (column names remain `snake_case`), nor on table names (table names remain plural `snake_case`). Identifier case is unchanged.

This ADR **does** mandate that all new domain enums introduced in any future phase MUST be UPPERCASE. Per-enum exceptions to lowercase are not permitted without a new ADR.

---

# Relationship to Other Decisions

- **ADR-014** — V1 User Roles. The `user_role` enum includes `SUPER_ADMIN` per DB-004, but `SUPER_ADMIN` permissions are explicitly deferred.
- **ADR-015** — `store_status` initial state. The first value of `store_status` is canonicalized as `DRAFT` (replacing the de-facto `created`).

---

# Consequences

Positive:

- Single convention enforced at every layer (DB, types, app).
- DB-004, DB-003, and DB-007 ordering all become mechanically consistent.
- Future domain enums (Order, Payment, etc.) added in their respective phases have a clear template.

Negative:

- One-time coordinated rewrite across `packages/database`, `packages/types`, `packages/auth`, `apps/api/src/common/modules/{auth,user,tenant}`.
- Conditional seeded data (if any) must be regenerated.

---

# Success Criteria

This decision remains valid while:

- Every `pgEnum(...)` declaration in the codebase uses UPPERCASE literal values.
- TypeScript string-union types in `@loom/types/*` use the same UPPERCASE values.
- Every read/write to an enum column uses those literals.

If a real production need appears for mixed-case (e.g., a legacy integration), a future ADR may evaluate in-database enum rename policies.

---

# Related Documents

- `docs/database/Database-Package.md` — DB-004, DB-003
- `docs/database/Database-Philosophy.md` — §8 Common Columns, §11 Unique Constraints
- `docs/product/Product-Data-Model.md`
- `docs/adr/ADR-002-PostgreSQL.md`
- `docs/adr/ADR-014-V1-User-Roles.md`
- `docs/adr/ADR-015-Store-Status-Initial-State.md`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Adopted UPPERCASE enum literals consistent with DB-004. |
