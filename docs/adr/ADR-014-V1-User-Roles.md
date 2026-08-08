# ADR-014 — V1 User Roles (admin / seller / customer) and SUPER_ADMIN Deferral

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-014

**Owners:** Engineering

**Supersedes:** Partial — clarifies Application Role scope of ADR-005 §`# Authorization Model`.

---

# Context

Project Loom's frozen v1.0 architecture documents two sources of truth for who can do what:

1. **`Database-Package.md`** §`DB-004 — Global Enums` defines the canonical database role values: `CUSTOMER`, `SELLER`, `ADMIN`, `SUPER_ADMIN`.

2. **`Product-Data-Model.md`** §`4. Entity — User` lists four user types: `Customer`, `Seller`, `Admin`, `Super Admin`, but stresses "A single account may hold multiple roles."

3. **`ADR-005 — Better Auth`** §`# OAuth Providers` and §`# Authorization Model` employ a session-based model where authorization (RBAC + business permissions) is the responsibility of the application, not Better Auth.

4. **Phase 03B — Authorization & User Management** implemented a V1 RBAC with three roles: `admin`, `seller`, `customer` — enforced via `RolesGuard`, `PermissionsGuard`, and a permission matrix of 27 permissions across 10 categories.

The inconsistency: **DB-004 declares 4 role values, but Phase 03B implements only 3.** Phase 04 must decide whether to:

- A) Add `SUPER_ADMIN` to the V1 RBAC system now, alongside `admin`, granting it additional permissions.
- B) Add `SUPER_ADMIN` to the database enum without activating it in the RBAC system, deferring authorization until the Admin phase.
- C) Drop `SUPER_ADMIN` from the database enum, contradicting DB-004.

Beyond the V1 question, the looser statement "A single account may hold multiple roles" in `Product-Data-Model.md` is also unchecked against Phase 03A's `user.role` column, which is a single `user_role` enum value.

---

# Decision

Project Loom's **V1 application role set remains exactly three roles**:

- `admin`
- `seller`
- `customer`

These three roles are the **canonical application-level RBAC roles** for V1. They are the only roles `RolesGuard`, `PermissionsGuard`, the permission matrix in `docs/spec/permissions/PERMISSION_MATRIX.md`, and any `@Roles(...)` or `@RequirePermissions(...)` decorators will recognize in V1.

The database `user_role` enum **does include `SUPER_ADMIN`**, mirroring DB-004. `SUPER_ADMIN` exists as a canonical database enum value to:

- Keep DB-004 enum-family complete.
- Allow Storage / Migration tooling to operate without future schema changes when SUPER_ADMIN is activated.

`SUPER_ADMIN` is **NOT activated** in V1 RBAC:

- No role entry exists for `SUPER_ADMIN` in `packages/auth/src/roles.ts`.
- No permission entry exists for `SUPER_ADMIN` in `packages/auth/src/permissions.ts` or the permission matrix.
- `RolesGuard` does not include `SUPER_ADMIN` in its recognized role set.
- The `UserRole` TypeScript union in `packages/types/src/auth.ts` is `'ADMIN' | 'SELLER' | 'CUSTOMER'`. (`SUPER_ADMIN` is intentionally excluded at the type level — see Schema Cast Strategy below.)
- Attempting to authenticate as `SUPER_ADMIN` results in either an enum validation error at insert time (if attempted via Better Auth) or a `ForbiddenException` at guard time (if attempted via direct DB manipulation). Neither path grants access.

Activation of `SUPER_ADMIN`, including its permission set, lifecycle (e.g., rotation, audit), and integration with admin tooling, is **deferred** to the appropriate future **Admin Module phase** that introduces platform administration. That phase will revise this ADR (or issue a new one) before flipping the switch.

`Product-Data-Model.md` §4's "A single account may hold multiple roles" is also **deferred**: V1 treats `User.role` as a single value. Multi-role users will be supported by migrating to a user↔role join table in a future "Roles & Permissions" phase. Until then:

- `users.role` is a single `user_role` enum column.
- Information loss when promoting a user across roles is handled by an UPDATE plus an audit-log entry.

---

# Schema Cast Strategy

The `UserRole` TypeScript type is:

```ts
export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER'
```

When a Better Auth row arrives with the value `'SUPER_ADMIN'` (impossible in V1 because Better Auth cannot write it without an open enum, but safe to type-guard), the application must:

- Coerce to `'ADMIN'` for V1 downgrading, OR
- Throw `BadRequestException('Invalid role')`.

`auth.service.ts` `validateSession` applies a defensive cast documented inline.

---

# Why Three Roles Not Four in V1 RBAC

- **Phase 03B is a frozen completed phase**. Adding 33% more permissions and a new top-tier role is a non-trivial change to a phase that was signed off.
- **Admin Module phase has been scoped but not started.** The entire admin tooling (operators UI, impersonation, support tooling, audit dashboards) lives in that later phase. Authorization for `SUPER_ADMIN` needs that infrastructure to be meaningful.
- **SUPER_ADMIN without tooling is a footgun.** It would be a role that bypasses app-level authorization with no operational surface to manage it. That's the worst kind of role.
- **`admin` already covers platform employees** for V1 needs (Phase 03B permission matrix is large enough).

---

# Why Still Include `SUPER_ADMIN` in the Database Enum

- **DB-004 is part of v1.0 frozen spec.** Removing `SUPER_ADMIN` would also require rewriting DB-004.
- **Compatibility with future tooling.** Some tools auto-generate from DB-004 (e.g., admin quick-pick lists). Having the value present (even if un-activatable) prevents need to re-add the value later in a more painful migration.
- **Type-level exclusion is enough.** Application code never reads `SUPER_ADMIN` out of the DB; the type union prevents accidental branches on it.

---

# Migration Approach

- The `user_role` enum is updated in the Phase 04 first migration to include `SUPER_ADMIN`.
- The Phase 03B Phase reports stay accurate (no `SUPER_ADMIN` introduced into RBAC).
- README / permission-matrix docs of record for V1 explicitly list three roles: `ADMIN`, `SELLER`, `CUSTOMER`.

---

# Consequences

Positive:

- V1 RBAC stays coherent; no authorization scope creep.
- No new permission set to maintain until something actually exercises `SUPER_ADMIN`.
- `SUPER_ADMIN` is "reserved" in the database; activating it later requires only a Phase 4+ Admin Module PR plus a guard update.

Negative:

- Operator/desktop notes referring to `SUPER_ADMIN` will read as "Admin scope = `admin` role" until the Admin Module phase flips the switch.
- A reader comparing Phase 03B code to DB-004 will see a 4-vs-3 mismatch and may flag it. This ADR resolves that: `SUPER_ADMIN` is reserved-but-inactive.

---

# Success Criteria

This decision remains valid while:

- No production path grants `SUPER_ADMIN` privileges.
- No V1 RBAC code includes `'SUPER_ADMIN'` in role / permission tables or decorators.
- Phase 04 migration emits `pgEnum('user_role', ['ADMIN', 'SELLER', 'CUSTOMER', 'SUPER_ADMIN'])`.

When the Admin Module phase activates `SUPER_ADMIN`, this ADR will be revisited, renamed, or superseded.

---

# Related Documents

- `docs/adr/ADR-005-Better-Auth.md` — Authorization Model
- `docs/database/Database-Package.md` — DB-004
- `docs/spec/permissions/PERMISSION_MATRIX.md` — V1 permission matrix
- `packages/auth/src/roles.ts`, `packages/auth/src/permission-matrix.ts`
- `packages/types/src/auth.ts` — `UserRole` union
- `docs/adr/ADR-013-Database-Enum-Case-Convention.md`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Three application roles confirmed; SUPER_ADMIN reserved in DB-004 only. |
