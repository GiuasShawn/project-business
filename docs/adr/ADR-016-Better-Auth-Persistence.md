# ADR-016 — Better Auth Persistence as Cross-Domain Primitives

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-016

**Owners:** Engineering

**Related:** ADR-005 (Better Auth), ADR-003 (Drizzle ORM), ADR-013 (Enum Case Convention).

---

# Context

Project Loom uses Better Auth 1.6.26 for authentication, sessions, email verification, password reset, and password hashing (Scrypt). Session and user tables already exist in `@loom/database`. Better Auth is integrated via the `drizzleAdapter(db, { provider: 'pg' })` call with no `schema:` configuration supplied.

Inspected Better Auth source (`@better-auth/core/dist/db/get-tables.mjs`) at version 1.6.26 confirms: with the current `@loom/auth` configuration — `emailAndPassword.enabled=true`, `emailVerification.*` configured, no `secondaryStorage`, no `rateLimit.storage` — Better Auth expects **four** core tables to exist:

| Model | Purpose | Currently declared in our schema? |
|-------|---------|------------------------------------|
| `user` | Identity record (id, email, emailVerified, name, image). | ✅ Yes — `packages/database/src/schema/user.ts` |
| `session` | Active sessions (id, token, expiresAt, ipAddress, userAgent, userId). | ✅ Yes — `packages/database/src/schema/session.ts` |
| `account` | **Credential records including the password hash**, OAuth provider linkage (`accountId`, `providerId`, `userId`, `accessToken`, `refreshToken`, `idToken`, `password`, `scope`, etc.). | ❌ **No** |
| `verification` | **Token storage for email verification and password reset.** (identifier, value, expiresAt, createdAt, updatedAt). | ❌ **No** |

Without `account` and `verification`:

- `signUpEmail` cannot persist the password hash. Phase 03A reports stated email/password registration "validated"; we re-inspected the implementation and found that the password hash is missing from the database layer for any new signup.
- `verifyEmail` cannot persist verification tokens; reset/verify requests would have to round-trip Better Auth state.
- `requestPasswordReset` cannot persist reset tokens; same problem.
- `drizzleAdapter` silently relies on the developer to have provided tables matching the model names. The adapter does not auto-create them.

Inspected `drizzleAdapter` at version 1.6.26 (`@better-auth/drizzle-adapter/dist/index.mjs` line 90):

```js
const schema = config.schema || db._.fullSchema;
```

If neither `config.schema` nor `db._.fullSchema` is populated, the adapter throws `Drizzle adapter failed to initialize. Schema not found.` Our current `packages/database/src/client.ts` constructs `drizzle(client)` *without* a `schema` argument, so `db._.fullSchema` is undefined. **This means our current Better Auth runtime would throw on any operation that requires an adapter-side schema lookup** — and Phase 03A's "all tests pass" likely never exercised the code path that requires it (e.g., sign-up).

Two competing ways to fix this:

1. **Convention-over-configuration:** keep declaring tables in Better Auth's runtime expectations. The developer hand-builds Drizzle tables for `account` and `verification` that match Better Auth's column names and types. Pass `schema:` to the adapter so it can read field metadata.
2. **Use Better Auth's built-in generator:** run `npx @better-auth/cli generate` and let Better Auth emit the Drizzle schema. This still creates files in our repo; we just don't write them by hand.
3. **Use a separate database adapter (Kysely + Better Auth)**: out of scope for Phase 04; not consistent with ADR-003.

Both 1 and 2 produce identical Drizzle output. 2 is a black-box generator; 1 is hand-maintained. Per ADR-003 §"Repository Pattern", "every domain exposes repositories", and per ADR-003 §"Schema Strategy", "All schema definitions live in packages/database/schema/". The codebase convention is explicit on **where** schema lives: in our repo. We will use path 1.

---

# Decision

Phase 04 will declare **two additional cross-domain primitive tables** in `packages/database`:

1. **`accounts`** — Better Auth's credential / OAuth-account persistence.
2. **`verifications`** — Better Auth's token storage.

Each table is declared as a **cross-domain primitive** (Identity Domain — Authentication). The Drizzle schema files are owned by `@loom/database`, not by Better Auth's runtime — but their shape and field names will **exactly match** what Better Auth 1.6.26 expects (column names are `snake_case`, but every column Better Auth can read or write must be present with the same name).

Additionally:

- The `drizzle(client, { schema })` constructor in `packages/database/src/client.ts` will be updated to receive a schema object that includes `user`, `session`, `account`, and `verification` (and any other primitive tables added in Phase 04).
- The `drizzleAdapter(db, { provider: 'pg', schema: { user, session, account, verification } })` call in `packages/auth/src/auth-config.ts` will be updated to explicitly pass the same schema map. This makes the contract explicit.
- No custom refresh-token table is created. Better Auth owns refresh tokens; its `refreshToken` column on the `account` row serves that purpose (Better Auth stores refresh tokens per the JWT plugin / inline rotation logic). Adding a separate table would duplicate state and create write conflicts.
- The `account.password` column is owned by Better Auth. **Application code never reads it directly.** It exists for Better Auth runtime to compare against during `signInEmail`. Strict typing prevents this in our codebase.

`User`-extension columns (`role`) are NOT placed on the `accounts` table — they stay on `users`. The `users.role` column continues to be the application-owned role column.

---

# Schema Shape (Cross-Domain Primitive)

Adopting Better Auth's expected model shape (from `get-tables.mjs`):

```ts
// accounts
id             UUID PRIMARY KEY
account_id     TEXT NOT NULL          // Provider-assigned identifier (or email for credential login)
provider_id    TEXT NOT NULL          // "credential" for email/password, "google", etc.
user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
access_token   TEXT                   (returned: false in BA schema — never read by app)
refresh_token  TEXT                   (returned: false)
id_token       TEXT                   (returned: false)
access_token_expires_at  TIMESTAMPTZ
refresh_token_expires_at TIMESTAMPTZ
scope          TEXT
password       TEXT                   (returned: false — Better Auth Scrypt hash)
created_at     TIMESTAMPTZ NOT NULL
updated_at     TIMESTAMPTZ NOT NULL
```

```ts
// verifications
id             UUID PRIMARY KEY
identifier     TEXT NOT NULL          (indexed)
value          TEXT NOT NULL
expires_at     TIMESTAMPTZ NOT NULL
created_at     TIMESTAMPTZ NOT NULL
updated_at     TIMESTAMPTZ NOT NULL
```

The unique constraint `accounts(provider_id, account_id)` is implicit; the `(user_id, provider_id, account_id)` set is unique per the BA model semantics. Phase 04 adds a composite index/unique constraint on `accounts(provider_id, account_id)`.

Indexes per Better Auth model + DB-008:

| Index | Rationale |
|-------|-----------|
| `accounts_user_id_idx` | FK lookup per Better Auth model field index. |
| `accounts_provider_account_idx UNIQUE` | Provider-key uniqueness. |
| `verifications_identifier_idx` | Per BA `identifier` index field. |

---

# Why Declare These in @loom/database, Not as a Sidecar Better Auth Package

- ARD-003 §"Schema Strategy" requires all schema definitions to live in `packages/database`.
- A separate `packages/better-auth-schema` package would force another `pnpm-workspace.yaml` dependency cycle.
- The Drizzle generator option (path 2) was considered; rejected because:
  - It introduces a build-time CLI dependency that may diverge from our installed version over time.
  - It reduces readability of the migration story for future developers.
  - It hides Better Auth's required schema from the rest of the codebase, which makes audit / GDPR data-mapping harder.

A future ADR may revisit (e.g., simplify if Better Auth switches to generating migration-friendly SQL on its own), but the strategy above is the freeze-time choice.

---

# Why Pass `schema:` to Both `drizzle()` and `drizzleAdapter`

- **`drizzle(client, { schema })`** populates `db._.fullSchema` and enables Drizzle's relational query API, which later phases will use.
- **`drizzleAdapter(db, { provider: 'pg', schema })`** makes Better Auth aware of the column names without having to introspect them. It matches the documented Better Auth usage pattern and removes a runtime ambiguity.

Without the dual configuration, Better Auth throws the "Schema not found" error on first auth operation that needs introspection.

---

# Constraints on Application Code

- The `account` and `verification` tables are exported from `@loom/database` like any other schema, but **no service outside `@loom/auth` is permitted to read `accounts.password`, `accounts.access_token`, `accounts.refresh_token`, `accounts.id_token`**.
- These forbidden reads will be enforced by convention and code review; we do not introduce an automated lint rule in Phase 04 (out of scope).
- `@loom/types` does NOT export `Account` / `Verification` types in V1, because application code does not need them. Phase 04 minor loosening may come later if e.g. an "admin view of all accounts" feature is added.

---

# Consequences

Positive:

- `email/password` sign-up now correctly persists the password hash via Better Auth's Scrypt algorithm.
- `verifyEmail` and password-reset tokens actually persist; previously these would silently fail or rely on a transient store we do not currently provide.
- The drizzle adapter initializes cleanly.
- Cross-domain primitive tables `accounts` and `verifications` are in scope of `Application Module Access` rules per ADR-001 (only the Better Auth layer writes to them, but Drizzle-level reads are still legal).

Negative:

- Larger initial migration than would otherwise be needed.
- Application developers must remember not to read `accounts.password`. Future lint rule pending.

---

# Migration Strategy

The `accounts` and `verifications` tables are folded into the Phase 04 first migration alongside the rest of the schema. No data migration because no prior migration exists.

---

# Success Criteria

This decision remains valid while:

- A `signUpEmail` call results in:
  1. A row in `users`.
  2. A row in `accounts` with `provider_id='credential'` and `account_id=<user email>` and a populated `password`.
- A `verifyEmail` call results in a row in `verifications` that becomes consumable by the verify endpoint.
- A `requestPasswordReset` call results in a row in `verifications` with `identifier=<email>`.

A future ADR may evaluate moving authentication persistence to a dedicated microservice; until then this ADR remains the binding contract.

---

# Related Documents

- `node_modules/@better-auth/core/dist/db/get-tables.mjs` (version 1.6.26)
- `node_modules/@better-auth/drizzle-adapter/dist/index.mjs` (version 1.6.26)
- `docs/adr/ADR-003-Drizzle.md` — Schema Strategy
- `docs/adr/ADR-005-Better-Auth.md`
- `docs/adr/ADR-013-Database-Enum-Case-Convention.md`
- `packages/auth/src/auth-config.ts`
- `packages/database/src/client.ts`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Declared `accounts` and `verifications` as cross-domain primitives owned by `@loom/database` but matching Better Auth 1.6.26 expectations. |
