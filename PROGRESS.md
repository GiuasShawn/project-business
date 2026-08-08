# PROGRESS.md

> **Purpose**
>
> This document tracks **completed milestones** and **project progress**.
>
> Updated after each phase completion.

---

# Project Overview

**Project:** Project Loom
**Type:** Multi-tenant Fashion Commerce Platform
**Architecture:** Modular Monolith (19 Bounded Domains)
**Start Date:** 2026-08-07

---

# Completed Milestones

## Phase 03D — Account Lifecycle & Registration ✅

**Completion Date:** 2026-08-09
**Status:** Complete
**Duration:** 1 session

### Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| User registration endpoint | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Seller registration with store creation | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Email verification flow | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Password reset flow | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Password change endpoint | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Better Auth configuration | `packages/auth/src/auth-config.ts` | ✅ |
| Email provider abstraction | `packages/auth/src/auth-config.ts` | ✅ |
| Validation schemas | `packages/validation/src/schemas.ts` | ✅ |
| Focused lifecycle tests | `apps/api/test/account-lifecycle.test.js` | ✅ |
| Completion report | `docs/reports/PHASE_03D_REPORT.md` | ✅ |

### Account Lifecycle API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `POST /api/v1/auth/register` | POST | Register new user account | ✅ |
| `POST /api/v1/auth/register/seller` | POST | Register seller with store | ✅ |
| `POST /api/v1/auth/login` | POST | Email/password sign-in | ✅ |
| `POST /api/v1/auth/logout` | POST | Sign out current user | ✅ |
| `GET /api/v1/auth/me` | GET | Get current authenticated user | ✅ |
| `POST /api/v1/auth/verify-email` | POST | Verify email with token | ✅ |
| `POST /api/v1/auth/verify-email/request` | POST | Request verification email resend | ✅ |
| `POST /api/v1/auth/password/reset/request` | POST | Request password reset email | ✅ |
| `POST /api/v1/auth/password/reset` | POST | Reset password with token | ✅ |
| `POST /api/v1/auth/password/change` | POST | Change password (authenticated) | ✅ |

### Account States (Documented)

| State | Description |
|-------|-------------|
| `Registered` | Account created, email not verified |
| `Email Verified` | Email verified, account active |
| `Active` | Fully active user |
| `Suspended` | Account suspended (admin action) |
| `Deleted` | Account deleted (soft delete, retains history) |

### Seller Onboarding Flow

```
Register (with store info)
    ↓
Store Created (status: created)
    ↓
Email Verification Sent
    ↓
User Verifies Email
    ↓
Store Status → Configured
    ↓
Seller Active
```

### Security Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| Password minimum 12 chars | Validation + Better Auth config | ✅ |
| Password hashing (Scrypt) | Better Auth internal | ✅ |
| Enumeration protection | Always return success for reset/verify requests | ✅ |
| Invalid token handling | Generic error messages | ✅ |
| Expired token handling | Generic error messages | ✅ |
| Session revocation on password reset | Better Auth config | ✅ |
| Session revocation on password change | Better Auth config | ✅ |
| Passwords never in logs | Validated by tests | ✅ |
| Passwords never in API responses | Validated by tests | ✅ |

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (17/17 tasks) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (26/26 tasks) |
| Tenant isolation tests | ✅ 17/17 pass |
| Lifecycle tests | ✅ 21/21 pass |

### Files Created (2 new files)

| File | Purpose |
|------|---------|
| `apps/api/test/account-lifecycle.test.js` | Focused lifecycle tests |
| `docs/reports/PHASE_03D_REPORT.md` | Completion report |

### Files Modified (7 files)

| File | Changes |
|------|---------|
| `packages/auth/src/auth-config.ts` | Email verification, password reset, email provider abstraction |
| `packages/validation/src/schemas.ts` | Registration, verification, reset, change password schemas |
| `packages/validation/src/index.ts` | New schema exports |
| `packages/types/src/auth.ts` | New DTO types for lifecycle operations |
| `apps/api/src/common/modules/auth/auth.service.ts` | All lifecycle service methods |
| `apps/api/src/common/modules/auth/auth.controller.ts` | All lifecycle endpoints |
| `apps/api/package.json` | Added @loom/validation dependency |

### Issues Encountered

1. **Better Auth API Signatures:** Required trial-and-error to determine correct parameter formats for verifyEmail (query), resetPassword (newPassword), changePassword (currentPassword/newPassword)

2. **TypeScript Strict Mode:** Implicit any types in auth-config.ts callbacks required explicit typing

3. **Import Ordering:** Biome enforced strict import ordering across modified files

4. **Validation Module Dependency:** @loom/validation needed to be added to apps/api package.json

### Lessons Learned

1. Better Auth's email/password features (verification, reset) are built-in, not separate plugins

2. Better Auth API uses `better-call` which has specific parameter structures (body, query, headers)

3. Email delivery is properly abstracted for future provider integration (Phase 14)

4. Seller onboarding flow: register → create store (status: created) → verify email → store status: configured

5. Password policy: minimum 12 characters enforced at validation and Better Auth config level

---

## Phase 03C — Multi-Tenancy & Tenant Context ✅

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

### Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Store (tenant) schema | `packages/database/src/schema/store.ts` | ✅ |
| Store membership schema | `packages/database/src/schema/store-membership.ts` | ✅ |
| Store types | `packages/types/src/store.ts` | ✅ |
| Tenant context (AsyncLocalStorage) | `apps/api/src/common/modules/tenant/tenant-context.ts` | ✅ |
| Tenant resolution middleware | `apps/api/src/common/modules/tenant/tenant-resolution.middleware.ts` | ✅ |
| Tenant guard | `apps/api/src/common/modules/tenant/tenant.guard.ts` | ✅ |
| Tenant service | `apps/api/src/common/modules/tenant/tenant.service.ts` | ✅ |
| Tenant controller | `apps/api/src/common/modules/tenant/tenant.controller.ts` | ✅ |
| Tenant module | `apps/api/src/common/modules/tenant/tenant.module.ts` | ✅ |
| Completion report | `docs/reports/PHASE_03C_REPORT.md` | ✅ |

### Tenant API Endpoints

| Endpoint | Method | Permission | Purpose | Status |
|----------|--------|------------|---------|--------|
| `POST /api/v1/stores` | POST | `stores:write` | Create a new store | ✅ |
| `GET /api/v1/stores/me` | GET | — | Get current user's stores | ✅ |
| `GET /api/v1/stores/:storeId` | GET | `stores:read` | Get store by ID | ✅ |
| `PATCH /api/v1/stores/:storeId` | PATCH | `stores:write` | Update store (owner only) | ✅ |

### Store Status Lifecycle

| Status | Description |
|--------|-------------|
| `created` | Store created, not yet configured |
| `configured` | Store configured with branding |
| `published` | Store published, visible publicly |
| `active` | Store actively operating |
| `suspended` | Store suspended (admin action) |
| `archived` | Store archived, no longer active |

### Store Membership Role (V1 Architecture)

| Role | Description |
|------|-------------|
| `owner` | Store creator, full access |

### Security Verification Results (2026-08-08)

| Test | Result |
|------|--------|
| User A can access Store A (owner) | ✅ Pass |
| User A CANNOT access Store B (cross-tenant) | ✅ Pass |
| User B can access Store B (owner) | ✅ Pass |
| User B CANNOT access Store A (cross-tenant) | ✅ Pass |
| Changing X-Store-ID cannot bypass membership | ✅ Pass |
| Missing tenant context fails safely | ✅ Pass |
| Tenant context immutable after resolution | ✅ Pass |
| Unauthenticated requests with X-Store-ID rejected | ✅ Pass |
| **Total** | **17/17 Pass** |

**Test File:** `apps/api/test/tenant-isolation.test.js` (Node.js built-in test runner, no external dependencies)

### Architecture Discrepancy Resolved (2026-08-08)

- **Previous Issue:** Store membership roles (owner, admin, member) and `TenantGuard.withRoles(['owner','admin'])` were NOT documented in ADR-004 or Product-Data-Model
- **Architecture Specifies:** "One primary store per seller (Version 1)" — single owner per store
- **Resolution Applied:** Simplified to V1 architecture — single owner per store
- Removed undocumented `admin` and `member` store roles
- Removed `TenantGuard.withRoles()` method
- Store membership role is now only `owner`
- All 17 tenant isolation tests pass with V1 model

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (17/17 tasks) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (25/25 tasks) |
| Security verification | ✅ 17/17 tests pass |

### Files Created (12 new files)

| File | Purpose |
|------|---------|
| `packages/database/src/schema/store.ts` | Store table schema |
| `packages/database/src/schema/store-membership.ts` | Store membership schema |
| `packages/types/src/store.ts` | Store-related types |
| `apps/api/src/common/modules/tenant/tenant-context.ts` | Tenant context (AsyncLocalStorage) |
| `apps/api/src/common/modules/tenant/tenant-resolution.middleware.ts` | Tenant resolution middleware |
| `apps/api/src/common/modules/tenant/tenant.guard.ts` | Tenant guard |
| `apps/api/src/common/modules/tenant/tenant.service.ts` | Tenant service |
| `apps/api/src/common/modules/tenant/tenant.controller.ts` | Tenant controller |
| `apps/api/src/common/modules/tenant/tenant.module.ts` | Tenant module |
| `apps/api/src/common/modules/tenant/index.ts` | Barrel export |
| `apps/api/test/tenant-isolation.test.js` | Security verification tests |
| `docs/reports/PHASE_03C_REPORT.md` | Completion report |

### Files Modified (7 files)

| File | Changes |
|------|---------|
| `packages/database/src/schema/index.ts` | Added store/membership exports |
| `packages/database/src/index.ts` | Added store/membership exports |
| `packages/types/src/auth.ts` | Removed old TenantContext |
| `packages/types/src/index.ts` | Added new store type exports |
| `packages/testing/src/factories.ts` | Updated mock factories |
| `apps/api/src/app.module.ts` | Added TenantModule import |
| `apps/api/src/main.ts` | Added stores tag to Swagger |

### Issues Encountered

1. **Testing Package Types:** Testing package had old TenantContext type — updated to use new store/membership structure
2. **Store Schema:** Unused import and incorrect user reference — fixed
3. **Middleware Types:** Optional membership type issue in resolveTenantFromSubdomain — fixed with type assertion
4. **Controller Types:** Return type mismatches — fixed to use StoreProfile directly
5. **Biome Formatting:** Import reordering and formatting — auto-fixed

### Lessons Learned

1. AsyncLocalStorage provides clean request-scoped tenant context
2. Explicit membership model (store_memberships) is clearer than implicit tenant columns
3. Subdomain-based resolution works for public storefronts, header-based for API clients
4. Tenant guard integrates cleanly with existing AuthGuard + PermissionsGuard
5. Better Auth session.user doesn't include tenant info — resolved at middleware layer
6. Application-level isolation (ADR-004) requires discipline — tenant context must be used by all repositories
7. **Architecture explicitly defines V1 as single-owner; multi-role was implemented but removed for compliance**

---

## Phase 03B — Authorization & User Management ✅

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

### Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Role definitions | `packages/auth/src/roles.ts` | ✅ |
| Permission definitions | `packages/auth/src/permissions.ts` | ✅ |
| Permission matrix | `packages/auth/src/permission-matrix.ts` | ✅ |
| RBAC service | `apps/api/src/common/modules/auth/rbac.service.ts` | ✅ |
| Roles guard | `apps/api/src/common/modules/auth/roles.guard.ts` | ✅ |
| Permissions guard | `apps/api/src/common/modules/auth/permissions.guard.ts` | ✅ |
| Authorization decorators | `apps/api/src/common/modules/auth/auth.decorators.ts` | ✅ |
| User management service | `apps/api/src/common/modules/user/user.service.ts` | ✅ |
| User management controller | `apps/api/src/common/modules/user/user.controller.ts` | ✅ |
| User management module | `apps/api/src/common/modules/user/user.module.ts` | ✅ |
| Permission matrix documentation | `docs/spec/permissions/PERMISSION_MATRIX.md` | ✅ |

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (17/17 tasks) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (25/25 tasks) |

---

## Phase 03A — Authentication Foundation ✅

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

### Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| User schema | `packages/database/src/schema/user.ts` | ✅ |
| Session schema | `packages/database/src/schema/session.ts` | ✅ |
| Better Auth configuration | `packages/auth/src/auth-config.ts` | ✅ |
| Auth service | `apps/api/src/common/modules/auth/auth.service.ts` | ✅ |
| Auth guard | `apps/api/src/common/modules/auth/auth.guard.ts` | ✅ |
| Auth middleware | `apps/api/src/common/modules/auth/auth.middleware.ts` | ✅ |
| Auth controller | `apps/api/src/common/modules/auth/auth.controller.ts` | ✅ |
| Auth module | `apps/api/src/common/modules/auth/auth.module.ts` | ✅ |
| AuthUser type | `packages/types/src/auth.ts` | ✅ |

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (17/17 tasks) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (25/25 tasks) |

---

## Phase 2B — Request Infrastructure & Documentation ✅

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

### Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Request correlation ID middleware | `apps/api/src/common/middleware/request-id.middleware.ts` | ✅ |
| Request logging middleware | `apps/api/src/common/middleware/request-logging.middleware.ts` | ✅ |
| Frozen error response contract | `apps/api/src/common/types/error-response.ts` | ✅ |
| Swagger/OpenAPI documentation | `http://localhost:4000/docs` | ✅ |
| /health/startup endpoint | `apps/api/src/common/modules/health/` | ✅ |
| Startup diagnostics logging | `apps/api/src/main.ts` | ✅ |

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass |
| pnpm lint | ✅ Pass |
| pnpm typecheck | ✅ Pass |

---

## Phase 2A — Core Infrastructure ✅

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

### Validation Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (all packages + apps) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (no TypeScript errors) |

---

## Phase 1 — Project Bootstrap ✅

**Completion Date:** 2026-08-07
**Status:** Complete
**Duration:** 1 session

### Validation Results

| Check | Result |
|-------|--------|
| pnpm install | ✅ Pass |
| pnpm build | ✅ Pass (all packages + apps) |
| pnpm lint | ✅ Pass |
| pnpm typecheck | ✅ Pass |

---

## Phase 0 — Project Audit ✅

**Completion Date:** 2026-08-07
**Status:** Complete

### Readiness Score

**92/100** ✅ Ready for Phase 1

---

## Architecture Review / Freeze ✅

**Completion Date:** 2026-08-07
**Status:** Complete

---

# Upcoming Milestones

## Phase 04 — Database

**Status:** Ready to Start
**Estimated Effort:** Medium
**Dependencies:** Phase 03D

---

# Progress Timeline

```
2026-08-07  Phase 0 — Project Audit ✅ (92/100)
            ↓
2026-08-07  Architecture Review / Freeze ✅ (v1.0)
            ↓
2026-08-07  Phase 1 — Project Bootstrap ✅
            ↓
2026-08-08  Phase 2A — Core Infrastructure ✅
            ↓
2026-08-08  Phase 2B — Request Infrastructure & Documentation ✅
            ↓
2026-08-08  Phase 03A — Authentication Foundation ✅
            ↓
2026-08-08  Phase 03B — Authorization & User Management ✅
            ↓
2026-08-08  Phase 03C — Multi-Tenancy & Tenant Context ✅
            ↓
2026-08-09  Phase 03D — Account Lifecycle & Registration ✅
            ↓
            ... (Phases 4-22)
            ↓
            Phase 22 — Polish ⏳ Pending
```

---

# Metrics

| Metric | Value |
|--------|-------|
| Total Phases | 22 |
| Completed | 8 (Phase 0, Phase 1, Phase 2A, Phase 2B, Phase 03A, Phase 03B, Phase 03C, Phase 03D) |
| Architecture Review | Complete (v1.0 Frozen) |
| In Progress | 0 |
| Pending | 14 |
| Overall Progress | 36% |
| Current Phase | Phase 04 — Database |
| Readiness Score | 92/100 |

---

# Change Log

| Date | Phase | Action | Notes |
|------|-------|--------|-------|
| 2026-08-07 | Phase 0 | Completed | Audit report created |
| 2026-08-07 | Architecture Review | Completed | Architecture frozen (v1.0) |
| 2026-08-07 | Phase 1 | Completed | Repository bootstrapped |
| 2026-08-08 | Phase 2A | Completed | Core infrastructure wired |
| 2026-08-08 | Phase 2B | Completed | Request infrastructure & documentation |
| 2026-08-08 | Phase 03A | Completed | Authentication foundation |
| 2026-08-08 | Phase 03B | Completed | Authorization & user management |
| 2026-08-08 | Phase 03C | Completed | Multi-tenancy & tenant context |
| 2026-08-09 | Phase 03D | Completed | Account lifecycle & registration |

---

*Last Updated: 2026-08-09*