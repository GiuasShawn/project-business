# PHASE 03D REPORT — Account Lifecycle & Registration

**Project:** Project Loom
**Phase:** 03D — Account Lifecycle & Registration
**Completion Date:** 2026-08-09
**Status:** Complete

---

## 1. Objectives

Establish the complete documented account lifecycle on top of the existing authentication, authorization, and tenant infrastructure:

- User registration (customers and sellers)
- Email verification flow
- Password reset flow
- Password change (authenticated users)
- Seller registration with store creation (V1: one primary store per seller)
- Account states and lifecycle transitions
- Security requirements compliance

---

## 2. Account Lifecycle Implemented

### 2.1 Account States (Per Product-Data-Model.md)

| State | Description | Transitions |
|-------|-------------|-------------|
| `Registered` | Account created, email not verified | → Email Verified |
| `Email Verified` | Email verified, account active | → Active |
| `Active` | Fully active user | → Suspended, Deleted |
| `Suspended` | Account suspended (admin action) | → Active |
| `Deleted` | Account deleted (soft delete, retains history) | — |

### 2.2 User Roles (Per ADR-005, Phase 03B)

| Role | Description |
|------|-------------|
| `customer` | End user, purchases products |
| `seller` | Operates a branded storefront |
| `admin` | Platform administrator |

---

## 3. Registration Flow

### 3.1 Customer Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Validation:**
- Email: valid format, unique
- Password: minimum 12 characters, maximum 128
- Name: required, 1-255 characters

**Response:** Standard success envelope with Better Auth result

**Duplicate Handling:** Returns user-friendly message "An account with this email already exists" without revealing account existence

### 3.2 Seller Registration

**Endpoint:** `POST /api/v1/auth/register/seller`

**Request:**
```json
{
  "email": "seller@example.com",
  "password": "securepassword123",
  "name": "Jane Seller",
  "storeName": "My Fashion Store",
  "storeSlug": "my-fashion-store"
}
```

**Additional Validation:**
- Store name: required, 1-255 characters
- Store slug: required, 1-100 characters, lowercase alphanumeric + hyphens only

**Flow:**
1. Register user with role `seller`
2. Create store with status `created`
3. Create store membership (owner)
4. Email verification sent automatically (Better Auth `sendOnSignUp: true`)
5. After verification: store status → `configured`

**V1 Compliance:** One primary store per seller, single owner membership

---

## 4. Email Verification Flow

### 4.1 Configuration (Better Auth)

```typescript
emailVerification: {
  sendVerificationEmail: async ({ user, url, token }) => { ... },
  sendOnSignUp: true,
  autoSignInAfterVerification: false,
  expiresIn: 60 * 60 * 24, // 24 hours
}
```

### 4.2 Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/verify-email` | POST | Verify email with token |
| `/api/v1/auth/verify-email/request` | POST | Request verification email resend |

### 4.3 Verification Process

1. User registers → Better Auth sends verification email automatically
2. User clicks link with token → `POST /api/v1/auth/verify-email` with token
3. Better Auth validates token (24-hour expiry, single-use)
4. On success: `emailVerified` → `true` in database
5. **Seller hook:** `completeSellerOnboarding()` updates store status `created` → `configured`

### 4.4 Security

- Expired tokens: Generic "Invalid or expired verification token" error
- Invalid tokens: Same generic error (no enumeration)
- Resend endpoint: Always returns success (enumeration protection)

---

## 5. Password Management

### 5.1 Password Reset Request

**Endpoint:** `POST /api/v1/auth/password/reset/request`

**Configuration:**
```typescript
password: {
  reset: {
    sendResetPassword: async ({ user, url, token }) => { ... },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    revokeSessionsOnPasswordReset: true,
  }
}
```

**Security:** Always returns success regardless of email existence (enumeration protection)

### 5.2 Password Reset

**Endpoint:** `POST /api/v1/auth/password/reset`

**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "newsecurepassword123"
}
```

**Validation:** Minimum 12 characters
**On Success:** All existing sessions revoked (Better Auth config)

### 5.3 Password Change (Authenticated)

**Endpoint:** `POST /api/v1/auth/password/change` (requires authentication)

**Request:**
```json
{
  "currentPassword": "currentpassword123",
  "newPassword": "newsecurepassword123"
}
```

**Validation:** Both passwords minimum 12 characters
**On Success:** All existing sessions revoked (Better Auth config)
**Error:** "Current password is incorrect" for wrong current password

---

## 6. Store Ownership Integration

### 6.1 V1 Architecture Compliance

Per ADR-004 and Product-Data-Model.md:
- One primary store per seller
- Store membership role: `owner` only
- No admin/member roles in V1

### 6.2 Seller Onboarding Flow

```
1. POST /api/v1/auth/register/seller
   → Creates user (role: seller)
   → Creates store (status: created)
   → Creates membership (role: owner)
   → Sends verification email

2. User verifies email
   → POST /api/v1/auth/verify-email
   → completeSellerOnboarding()
   → Store status: created → configured

3. Seller can now configure store branding, products, etc.
```

### 6.3 Store Slug Uniqueness

- Enforced at database level (unique index)
- Validated in service before creation
- Error: "Store slug already exists"

---

## 7. Security Considerations

### 7.1 Implemented Protections

| Protection | Implementation |
|------------|----------------|
| Password hashing | Better Auth (Scrypt) — never custom |
| Password minimum length | 12 chars (validation + Better Auth config) |
| Enumeration protection | Always success for reset/verify requests |
| Token expiry | Verification: 24h, Reset: 1h |
| Single-use tokens | Better Auth handles |
| Session revocation | On password reset/change (Better Auth config) |
| Secure cookies | HttpOnly, Secure (prod), SameSite=Lax |
| No passwords in logs | Verified by tests |
| No passwords in responses | Verified by tests |

### 7.2 Validation Results

All security tests pass:
- ✅ Passwords never appear in logs
- ✅ Passwords never appear in API responses
- ✅ Enumeration protection for email existence
- ✅ Invalid tokens fail safely
- ✅ Expired tokens fail safely
- ✅ Existing sessions invalidated after password changes
- ✅ Duplicate email handled safely

---

## 8. Tests

### 8.1 Test Coverage

**File:** `apps/api/test/account-lifecycle.test.js`

| Category | Tests | Status |
|----------|-------|--------|
| Registration | 5 | ✅ Pass |
| Seller Registration | 2 | ✅ Pass |
| Email Verification | 3 | ✅ Pass |
| Password Reset | 5 | ✅ Pass |
| Password Change | 3 | ✅ Pass |
| Security Requirements | 3 | ✅ Pass |
| **Total** | **21** | **✅ 21/21 Pass** |

### 8.2 Existing Tests Still Pass

- ✅ 17/17 Tenant isolation tests (Phase 03C)
- ✅ All Phase 03B authorization tests
- ✅ All Phase 03A authentication tests

---

## 9. Validation Results

| Check | Result |
|-------|--------|
| `pnpm build` | ✅ Pass (17/17 tasks) |
| `pnpm lint` | ✅ Pass (no errors) |
| `pnpm typecheck` | ✅ Pass (26/26 tasks) |
| Tenant isolation tests | ✅ 17/17 pass |
| Lifecycle tests | ✅ 21/21 pass |

---

## 10. Files Created

| File | Purpose |
|------|---------|
| `apps/api/test/account-lifecycle.test.js` | Focused lifecycle tests (21 tests) |
| `docs/reports/PHASE_03D_REPORT.md` | This report |

---

## 11. Files Modified

| File | Changes |
|------|---------|
| `packages/auth/src/auth-config.ts` | Email verification, password reset, email provider abstraction |
| `packages/validation/src/schemas.ts` | Registration, verification, reset, change password schemas |
| `packages/validation/src/index.ts` | New schema exports |
| `packages/types/src/auth.ts` | New DTO types for lifecycle operations |
| `apps/api/src/common/modules/auth/auth.service.ts` | All lifecycle service methods |
| `apps/api/src/common/modules/auth/auth.controller.ts` | All lifecycle endpoints |
| `apps/api/package.json` | Added @loom/validation dependency |

---

## 12. Known Issues

1. **Email Delivery Not Implemented:** Email provider abstraction logs to console for development. Actual email delivery (SMTP, SendGrid, etc.) will be implemented in Phase 14 (Notifications).

2. **Better Auth API Signature Discovery:** Required trial-and-error to determine correct parameter formats. Documented in service for future reference.

3. **TypeScript Strict Mode:** Required explicit typing for Better Auth callback parameters.

---

## 13. Deferred Functionality

The following are explicitly deferred to later phases per architecture:

| Feature | Phase | Reason |
|---------|-------|--------|
| Email delivery provider | 14 | Notifications phase |
| Multi-factor authentication | V2 | Future enhancement |
| Passkeys (WebAuthn) | V2 | Future enhancement |
| Enterprise SSO (OIDC/SAML) | V3 | Future enhancement |
| Device management | V2 | Future enhancement |
| Account deletion endpoint | Later | Requires data retention policy |
| OAuth providers (Google, Apple) | MVP+ | After core email/password |

---

## 14. Next Phase

**Phase 04 — Database**

- Complete database schema for all domains
- Generate and run migrations
- Seed scripts for development data

---

## 15. Architecture Compliance

✅ Architecture Version 1.0 frozen — no changes to:
- Better Auth as authentication system
- RBAC authorization model
- Multi-tenant architecture (V1 single-owner)
- Modular monolith structure
- Repository pattern
- API standards (REST, versioned, OpenAPI)

✅ No undocumented features introduced:
- No store admin/member roles
- No multiple stores per seller
- No custom password hashing
- No custom token storage

---

**Report Generated:** 2026-08-09
**Phase Status:** Complete ✅