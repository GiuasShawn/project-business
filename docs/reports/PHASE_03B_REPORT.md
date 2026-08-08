# Phase 03B — Authorization & User Management

**Completion Date:** 2026-08-08
**Status:** Complete
**Duration:** 1 session

---

## Objectives

Implement the authorization layer that operates on top of the existing authenticated identity.

- Authorization answers: "What is this user allowed to do?"
- Authentication answers: "Who is this user?"

---

## Roles Implemented

| Role | Description | Hierarchy |
|------|-------------|-----------|
| `admin` | Platform administrator with full system access | Highest |
| `seller` | Store owner with access to their own store operations | Medium |
| `customer` | End user with access to their own profile and orders | Lowest |

### Role Hierarchy

Higher roles inherit permissions from lower roles:

```text
admin → seller → customer
```

---

## Permissions Implemented

### Permission Categories

| Category | Read | Write | Manage |
|----------|------|-------|--------|
| Users | `users:read` | `users:write` | `users:manage` |
| Profile | `profile:read` | `profile:write` | — |
| Products | `products:read` | `products:write` | `products:manage` |
| Orders | `orders:read` | `orders:write` | `orders:manage` |
| Stores | `stores:read` | `stores:write` | `stores:manage` |
| Inventory | `inventory:read` | `inventory:write` | `inventory:manage` |
| Analytics | `analytics:read` | — | `analytics:manage` |
| Payments | `payments:read` | `payments:write` | `payments:manage` |
| Settings | `settings:read` | `settings:write` | `settings:manage` |
| System | — | — | `system:manage` |

---

## Authorization Architecture

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Roles | `packages/auth/src/roles.ts` | Central role definitions |
| Permissions | `packages/auth/src/permissions.ts` | Central permission definitions |
| Permission Matrix | `packages/auth/src/permission-matrix.ts` | Role-to-permission mapping |
| RBAC Service | `apps/api/src/common/modules/auth/rbac.service.ts` | Permission checking logic |
| Roles Guard | `apps/api/src/common/modules/auth/roles.guard.ts` | Role-based route protection |
| Permissions Guard | `apps/api/src/common/modules/auth/permissions.guard.ts` | Permission-based route protection |
| Decorators | `apps/api/src/common/modules/auth/auth.decorators.ts` | @Roles(), @RequirePermissions() |

### Authorization Flow

```text
1. Authentication (JWT validation)
   ↓
2. Role Check (does user have required role?)
   ↓
3. Permission Check (does role have required permission?)
   ↓
4. Resource Ownership Check (does user own this resource?)
   ↓
5. Business Rule Validation
```

---

## User Management Functionality

### Endpoints

| Endpoint | Method | Permission | Purpose |
|----------|--------|------------|---------|
| `GET /api/v1/users/me` | GET | `profile:read` | Get current user profile |
| `PATCH /api/v1/users/me` | PATCH | `profile:write` | Update current user profile |

### User Profile Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "image": null,
      "emailVerified": false,
      "createdAt": "2026-08-08T00:00:00.000Z",
      "updatedAt": "2026-08-08T00:00:00.000Z"
    }
  }
}
```

---

## Files Created

| File | Purpose |
|------|---------|
| `packages/auth/src/roles.ts` | Central role definitions |
| `packages/auth/src/permissions.ts` | Central permission definitions |
| `packages/auth/src/permission-matrix.ts` | Role-to-permission mapping |
| `apps/api/src/common/modules/auth/rbac.service.ts` | RBAC service |
| `apps/api/src/common/modules/auth/roles.guard.ts` | Roles guard |
| `apps/api/src/common/modules/auth/permissions.guard.ts` | Permissions guard |
| `apps/api/src/common/modules/auth/auth.decorators.ts` | Authorization decorators |
| `apps/api/src/common/modules/user/user.service.ts` | User management service |
| `apps/api/src/common/modules/user/user.controller.ts` | User management controller |
| `apps/api/src/common/modules/user/user.module.ts` | User management module |
| `apps/api/src/common/modules/user/index.ts` | Barrel export |
| `docs/spec/permissions/PERMISSION_MATRIX.md` | Permission matrix documentation |

---

## Files Modified

| File | Changes |
|------|---------|
| `packages/auth/src/index.ts` | Added role, permission, and permission matrix exports |
| `packages/types/src/auth.ts` | Added role to AuthUser, added UserProfile and UpdateUserProfileDto types |
| `packages/types/src/index.ts` | Added new type exports |
| `packages/database/src/schema/user.ts` | Added role column with enum |
| `packages/database/src/schema/index.ts` | Added userRoleEnum export |
| `packages/database/src/index.ts` | Added userRoleEnum export |
| `apps/api/src/common/modules/auth/auth.service.ts` | Updated to include role in user data |
| `apps/api/src/common/modules/auth/auth.module.ts` | Added RBAC service and guards |
| `apps/api/src/common/modules/auth/index.ts` | Added new exports |
| `apps/api/src/app.module.ts` | Added UserModule import |
| `apps/api/src/main.ts` | Added users tag to Swagger |

---

## Security Validation

| Check | Result |
|-------|--------|
| Authentication required before authorization | ✅ |
| Missing authentication returns 401 UNAUTHORIZED | ✅ |
| Authenticated users without permission receive 403 FORBIDDEN | ✅ |
| Users cannot grant themselves permissions | ✅ |
| Users cannot change their own role | ✅ |
| Permission checks cannot be bypassed | ✅ |
| Authorization logic is centralized | ✅ |
| Sensitive authorization information is not leaked | ✅ |

---

## Test Results

| Check | Result |
|-------|--------|
| pnpm build | ✅ Pass (17/17 tasks) |
| pnpm lint | ✅ Pass (no errors) |
| pnpm typecheck | ✅ Pass (25/25 tasks) |

---

## Known Issues

None.

---

## Deferred Functionality

The following functionality is deferred to later phases:

- User registration endpoint (Phase 3C)
- Password reset flow (Phase 3C)
- Email verification (Phase 3C)
- Tenant middleware (Phase 4)
- Store ownership validation (Phase 4)
- Seller/store permissions (Phase 4)
- Product permissions (Phase 5)
- Inventory permissions (Phase 6)

---

## Next Phase

Phase 3C — User Registration & Account Management
