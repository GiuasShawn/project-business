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

**Status:** Pending

**Goal:** Authentication, authorization, users, tenants. Build on existing packages/auth.

**Note:** packages/auth (config + RBAC) already exists. Phase 3 integrates Better Auth, adds user/tenant models, and wires middleware.

**Tasks**

Authentication
- [ ] Better Auth integration
- [ ] JWT token generation
- [ ] Refresh token rotation
- [ ] Session management

Authorization
- [ ] RBAC guards (build on existing packages/auth)
- [ ] Permission checking middleware
- [ ] Role-based route protection

User system
- [ ] User registration
- [ ] User login
- [ ] User profile management
- [ ] Password hashing

Tenant system
- [ ] Tenant creation
- [ ] Tenant context middleware
- [ ] Multi-tenant data isolation

Middleware
- [ ] Tenant resolution
- [ ] Authentication guard
- [ ] Authorization guard
- [ ] Request context

**Validation**
- [ ] Login works
- [ ] Registration works
- [ ] Protected routes work
- [ ] Tenant isolation works

---

# Phase 4 — Database

**Status:** Pending

**Goal:** Complete database schema and migrations.

**Note:** packages/database (client) already exists. Phase 4 defines schemas and creates migrations.

**Tasks**
- [ ] Generate schema (all domains)
- [ ] Relations
- [ ] Enums
- [ ] Indexes
- [ ] Migrations
- [ ] Seeds

**Validation**
- [ ] Migration succeeds
- [ ] Seed succeeds

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
