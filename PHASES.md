# PHASES.md

> Master implementation roadmap.
>
> AI MUST complete phases sequentially.
>
> AI MUST NOT skip phases.
>
> AI MUST NOT implement future phases.
>
> AI MUST stop after completing the requested phase.
>
> Every phase must compile successfully before continuing.
>
> Every phase ends with validation.
>
> The implementation is the source of truth for completed work.
>
> Phases must reflect what actually exists in the codebase.

---

# Phase 0 — Project Audit ✅

**Status:** Complete

**Goal:** Understand the project.

**Read:**
- AI_CONTEXT.md
- docs/README.md
- docs/architecture/*
- docs/product/*

**Tasks**
- [x] Understand architecture
- [x] Verify documentation
- [x] Identify missing dependencies
- [x] Produce implementation plan

**Validation**
- [x] AI summarizes architecture
- [x] No code written

**Deliverables**
- [x] Architecture summary
- [x] AUDIT_REPORT.md

---

# Phase 1 — Project Bootstrap ✅

**Status:** Complete

**Goal:** Create the repository and foundational packages.

**Tasks**
- [x] pnpm workspace
- [x] Root package.json
- [x] tsconfig.base.json (strict mode)
- [x] Biome (linting + formatting)
- [x] Husky + Commitlint
- [x] Turborepo
- [x] Environment validation (packages/config)
- [x] Shared types (packages/types)
- [x] Zod schemas (packages/validation)
- [x] Utility functions (packages/utils)
- [x] Structured logging (packages/logger — Pino)
- [x] Domain event types (packages/events)
- [x] Database client (packages/database — Drizzle ORM)
- [x] Auth config + RBAC (packages/auth)
- [x] Shared UI components (packages/ui — Button)
- [x] Analytics tracking (packages/analytics)
- [x] API client (packages/api-client)
- [x] Test factories (packages/testing)
- [x] NestJS app shell (apps/api — health endpoint)
- [x] Next.js app shells (apps/web, apps/seller-dashboard, apps/admin-dashboard)
- [x] Workers shell (apps/workers)
- [x] Docker Compose (PostgreSQL, Redis, Meilisearch, MailHog)
- [x] .vscode settings

**Validation**
- [x] Fresh install works
- [x] Build succeeds
- [x] Lint succeeds
- [x] Typecheck succeeds

**Deliverables**
- [x] Repository structure
- [x] 12 shared packages
- [x] 5 application shells
- [x] Docker Compose
- [x] Developer tooling

**Note:** Phase 1 delivered implementation beyond basic scaffolding. The database client, auth config, RBAC, logger, event types, analytics, API client, and Button component are functional code, not stubs. Future phases build on this foundation.

---

# Phase 2 — Infrastructure

**Status:** Ready

**Goal:** Complete infrastructure setup. Build on existing packages.

**Note:** packages/database (client), packages/logger, and packages/config (env validation) already exist. Phase 2 connects them to live services and adds missing infrastructure.

**Tasks**

Database
- [ ] Drizzle schema definitions (tables, relations, enums)
- [ ] Database migrations
- [ ] Seed scripts
- [ ] Connect database client to live PostgreSQL

Redis
- [ ] Redis client setup (ioredis)
- [ ] Redis connection management
- [ ] Cache utilities

Logging
- [ ] Integrate logger with NestJS
- [ ] Request logging middleware
- [ ] Error logging

Configuration
- [ ] NestJS configuration module
- [ ] Environment validation at startup

Dependency Injection
- [ ] NestJS module wiring
- [ ] Database provider
- [ ] Redis provider

Error handling
- [ ] Global exception filter
- [ ] Standardized error responses
- [ ] Validation pipes

**Validation**
- [ ] Project starts
- [ ] Database connects
- [ ] Redis connects
- [ ] Logging works
- [ ] Environment validation works
- [ ] Error handling works

---

# Phase 3 — Core Backend

**Status:** In Progress

**Goal:** Authentication, authorization, users, tenants. Build on existing packages/auth.

**Note:** packages/auth (config + RBAC) already exists. Phase 3 integrates Better Auth, adds user/tenant models, and wires middleware.

**Sub-Phases:**

- Phase 03A — Authentication Foundation ✅
- Phase 03B — Authorization & User Management ✅
- Phase 03C — Multi-Tenancy & Tenant Context (Next)
- Phase 03D — Account Lifecycle & Registration

**Tasks**

Authentication
- [x] Better Auth integration
- [x] JWT token generation
- [x] Refresh token rotation
- [x] Session management

Authorization
- [x] RBAC guards (build on existing packages/auth)
- [x] Permission checking middleware
- [x] Role-based route protection

User system
- [ ] User registration
- [ ] User login
- [x] User profile management
- [ ] Password hashing

Tenant system
- [ ] Tenant creation
- [ ] Tenant context middleware
- [ ] Multi-tenant data isolation

Middleware
- [ ] Tenant resolution
- [x] Authentication guard
- [x] Authorization guard
- [ ] Request context

**Validation**
- [ ] Login works
- [ ] Registration works
- [ ] Protected routes work
- [ ] Tenant isolation works

---

# Phase 4 — Domain Data Foundation

**Status:** Complete

**Goal:** Establish the cross-domain data foundation: schema normalization, canonical enums, cross-domain primitives, Better Auth persistence, first reproducible migration, minimal dev seed.

**Note:** `packages/database` (client) already exists. Phase 04 is NOT the place for Product / Inventory / Order / Payment domain tables (those land in their respective domain phases). Phase 04 ships only the foundation that every later phase will build on.

**Decisions (ADRs)**
- ADR-013 — Database Enum Case Convention (UPPERCASE per DB-004).
- ADR-014 — V1 User Roles (admin/seller/customer). `SUPER_ADMIN` is reserved in the enum but NOT activated in V1 RBAC.
- ADR-015 — Store Status initial state `DRAFT`.
- ADR-016 — Better Auth Persistence as cross-domain primitives (`accounts`, `verifications`).

**Tasks**
- [x] Schema normalization — `user_role`, `store_status`, `store_role` rewritten to UPPERCASE.
- [x] Better Auth persistence — `accounts` and `verifications` tables added.
- [x] Cross-domain primitives — `currencies`, `addresses`, `file_assets`, `audit_logs`.
- [x] Canonical DB-004 enums declared ahead of table creation: `seller_status`, `order_status`, `payment_status`, `return_status`, `commission_status`, `payout_status`, `notification_status`.
- [x] Drizzle relations (`relations.ts`) for existing + primitives.
- [x] Optional audit columns helper (`createOptionalAuditColumns`).
- [x] FK indexes (`sessions_user_id_idx`, `sessions_expires_at_idx`, plus inline indexes on every FK column).
- [x] Check constraints on canonical texts (`currencies.code`, `addresses.country_code`, `file_assets.size_bytes`).
- [x] First reproducible Drizzle migration generated as `drizzle/0000_perpetual_madame_masque.sql`.
- [x] Seed runner restructured to register-and-run.
- [x] Minimal dev seed (admin/seller/customer + 1 store + OWNER membership).
- [x] Reproducible local database setup runbook committed in `packages/database/README.md`.
- [x] Database schema conventions documented in `packages/database/README.md`.
- [x] EXPLICITLY DEFERRED: domain tables (Products, Inventory, Orders, …) — implemented by their respective domain phases.

**Validation**
- [x] `pnpm typecheck` (26/26 tasks pass).
- [x] `pnpm lint` (no errors after excluding auto-generated drizzle/meta directory).
- [x] `pnpm build` (17/17 packages build).
- [x] Tenant-isolation tests pass (17/17, UPPERCASE values verified).
- [x] Account-lifecycle tests pass (21/21).
- [ ] Migration applied to a clean DB. (Requires Docker — see runbook. Reproducible from the committed SQL.)
- [ ] Seed execution verified against migrated DB. (Requires Docker.)
- [ ] Application startup verified against migrated DB. (Requires Docker.)

**Files added**
- `packages/database/src/schema/enums.ts`
- `packages/database/src/schema/relations.ts`
- `packages/database/src/schema/primitives/account.ts`
- `packages/database/src/schema/primitives/verification.ts`
- `packages/database/src/schema/primitives/currencies.ts`
- `packages/database/src/schema/primitives/addresses.ts`
- `packages/database/src/schema/primitives/file-assets.ts`
- `packages/database/src/schema/primitives/audit-logs.ts`
- `packages/database/src/seeds/runner.ts`
- `packages/database/src/seeds/dev-identity.ts`
- `packages/database/src/seeds/dev-currencies.ts`
- `packages/database/src/seeds/index.ts`
- `packages/database/drizzle/0000_perpetual_madame_masque.sql` (auto-generated by Drizzle Kit)
- `packages/database/drizzle/meta/*` (auto-generated by Drizzle Kit)
- `docs/adr/ADR-013-Database-Enum-Case-Convention.md`
- `docs/adr/ADR-014-V1-User-Roles.md`
- `docs/adr/ADR-015-Store-Status-Initial-State.md`
- `docs/adr/ADR-016-Better-Auth-Persistence.md`
- `docs/reports/PHASE_04_REPORT.md`

**Files modified (concurrent edits outside Phase 04 declared scope, required for schema consistency)**
- `packages/database/src/schema/{base,user,session,store,store-membership}.ts`
- `packages/database/src/schema/index.ts`
- `packages/database/src/client.ts`
- `packages/database/src/index.ts`
- `packages/database/src/seed.ts`
- `packages/database/package.json` (drizzle-kit `^0.31.4`)
- `packages/database/README.md`
- `packages/types/src/{auth,store,index}.ts`
- `packages/auth/src/{auth-config,roles,rbac}.ts`
- `packages/testing/src/factories.ts`
- `apps/api/src/common/modules/auth/auth.service.ts`
- `apps/api/src/common/modules/tenant/tenant.service.ts`
- `apps/api/test/tenant-isolation.test.js`
- `biome.json` (drizzle/meta excluded from lint/format)

---

# Phase 5 — Design System

**Status:** Pending

**Goal:** Complete design system. Build on existing packages/ui.

**Note:** packages/ui (Button) already exists. Phase 5 adds remaining components.

**Tasks**
- [ ] Typography
- [ ] Colors
- [ ] Spacing
- [ ] Theme
- [ ] Inputs
- [ ] Cards
- [ ] Dialogs
- [ ] Tables
- [ ] Icons

**Validation**
- [ ] Component playground renders

---

# Phase 6 — Application Shell

**Status:** Pending

**Goal:** Complete application shell with navigation.

**Tasks**
- [ ] Routing
- [ ] Sidebar
- [ ] Navbar
- [ ] Dashboard layout
- [ ] Dark mode
- [ ] Responsive navigation

**Validation**
- [ ] Navigation works

---

# Phase 7 — Shared Components

**Status:** Pending

**Goal:** Shared components beyond design system.

**Tasks**
- [ ] DataTable
- [ ] SearchBar
- [ ] Pagination
- [ ] Forms
- [ ] Dialogs
- [ ] Toasts
- [ ] Charts
- [ ] Upload

**Validation**
- [ ] Every shared component documented

---

# Phase 8 — Inventory Module

**Status:** Pending

**Goal:** Inventory management.

**Tasks**
- [ ] Inventory API
- [ ] Inventory UI
- [ ] CRUD
- [ ] Search
- [ ] Filters
- [ ] Sorting
- [ ] Import
- [ ] Export

**Validation**
- [ ] Inventory fully functional

---

# Phase 9 — Products Module

**Status:** Pending

**Goal:** Product management.

**Tasks**
- [ ] Products CRUD
- [ ] Categories
- [ ] Variants
- [ ] Images
- [ ] Stock linkage

**Validation**
- [ ] Products complete

---

# Phase 10 — Suppliers

**Status:** Pending

**Goal:** Supplier management.

**Tasks**
- [ ] CRUD
- [ ] Supplier dashboard
- [ ] Purchase history

**Validation**
- [ ] Suppliers complete

---

# Phase 11 — Purchase Orders

**Status:** Pending

**Goal:** Purchase order workflow.

**Tasks**
- [ ] PO creation
- [ ] Receiving
- [ ] Partial receiving
- [ ] Status tracking

**Validation**
- [ ] Purchase workflow works

---

# Phase 12 — Sales

**Status:** Pending

**Goal:** Sales and order management.

**Tasks**
- [ ] Orders
- [ ] Invoices
- [ ] Returns
- [ ] Payments

**Validation**
- [ ] Sales complete

---

# Phase 13 — Reports

**Status:** Pending

**Goal:** Analytics and reporting.

**Tasks**
- [ ] Analytics (build on existing packages/analytics)
- [ ] Inventory value
- [ ] Revenue
- [ ] Exports
- [ ] Charts

**Validation**
- [ ] Reports accurate

---

# Phase 14 — Notifications

**Status:** Pending

**Goal:** Background jobs and notifications.

**Tasks**
- [ ] Email
- [ ] SMS
- [ ] Push
- [ ] Background jobs (BullMQ)

**Validation**
- [ ] Queue works

---

# Phase 15 — Search

**Status:** Pending

**Goal:** Search integration.

**Tasks**
- [ ] Meilisearch
- [ ] Indexing
- [ ] Global search

**Validation**
- [ ] Search works

---

# Phase 16 — Storage

**Status:** Pending

**Goal:** File storage.

**Tasks**
- [ ] Cloudflare R2
- [ ] Image optimization
- [ ] Uploads

**Validation**
- [ ] Uploads work

---

# Phase 17 — Performance

**Status:** Pending

**Goal:** Performance optimization.

**Tasks**
- [ ] Caching
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Optimization

**Validation**
- [ ] Lighthouse targets achieved

---

# Phase 18 — Security

**Status:** Pending

**Goal:** Security hardening.

**Tasks**
- [ ] Rate limiting
- [ ] CSRF
- [ ] XSS
- [ ] CSP
- [ ] Security headers

**Validation**
- [ ] Security audit passes

---

# Phase 19 — Observability

**Status:** Pending

**Goal:** Monitoring and observability. Build on existing packages/logger.

**Note:** packages/logger (Pino) already exists. Phase 19 adds tracing, metrics, and health checks.

**Tasks**
- [ ] Tracing (OpenTelemetry)
- [ ] Metrics (Prometheus)
- [ ] Health checks (beyond basic endpoint)
- [ ] Sentry integration

**Validation**
- [ ] Monitoring operational

---

# Phase 20 — Testing

**Status:** Pending

**Goal:** Test coverage. Build on existing packages/testing.

**Note:** packages/testing (factories) already exists. Phase 20 adds comprehensive tests.

**Tasks**
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Accessibility tests

**Validation**
- [ ] Coverage target achieved

---

# Phase 21 — Deployment

**Status:** Pending

**Goal:** Production deployment.

**Note:** Docker Compose already exists. Phase 21 adds CI/CD and production config.

**Tasks**
- [ ] CI/CD pipeline
- [ ] Production configuration
- [ ] Monitoring
- [ ] Rollback

**Validation**
- [ ] Production deployment successful

---

# Phase 22 — Polish

**Status:** Pending

**Goal:** Final polish.

**Tasks**
- [ ] Animations
- [ ] UX improvements
- [ ] Loading states
- [ ] Error states
- [ ] Documentation updates

**Validation**
- [ ] Production-ready application

---

# AI Rules

- Never implement more than one phase.
- Never modify completed phases unless fixing a bug.
- Read only the documents relevant to the current phase.
- Stop after validation.
- Produce a completion report.
- Update TASKS.md after every phase.
- Ask for approval before beginning the next phase.
- The implementation is the source of truth for completed work.
- Phases must reflect what actually exists in the codebase.
