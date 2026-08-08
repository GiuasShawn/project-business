# Permission Matrix

**Project:** Project Loom
**Document ID:** PERM-001
**Version:** 1.0.0
**Status:** Active

---

## Overview

This document defines the authorization model for Project Loom.

Authorization operates independently from authentication.

- Authentication answers: "Who is this user?"
- Authorization answers: "What is this user allowed to do?"

---

## Roles

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

- Admin inherits all seller and customer permissions
- Seller inherits all customer permissions
- Customer has base permissions only

---

## Permissions

Permissions follow the format: `resource:action`

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

## Permission Matrix

### Admin Permissions

| Resource | Read | Write | Manage |
|----------|------|-------|--------|
| Users | ✅ | ✅ | ✅ |
| Profile | ✅ | ✅ | — |
| Products | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ |
| Stores | ✅ | ✅ | ✅ |
| Inventory | ✅ | ✅ | ✅ |
| Analytics | ✅ | — | ✅ |
| Payments | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ✅ |
| System | — | — | ✅ |

### Seller Permissions

| Resource | Read | Write | Manage |
|----------|------|-------|--------|
| Users | ❌ | ❌ | ❌ |
| Profile | ✅ | ✅ | — |
| Products | ✅ | ✅ | ❌ |
| Orders | ✅ | ✅ | ❌ |
| Stores | ✅ | ✅ | ❌ |
| Inventory | ✅ | ✅ | ❌ |
| Analytics | ✅ | — | ❌ |
| Payments | ❌ | ❌ | ❌ |
| Settings | ❌ | ❌ | ❌ |
| System | ❌ | ❌ | ❌ |

### Customer Permissions

| Resource | Read | Write | Manage |
|----------|------|-------|--------|
| Users | ❌ | ❌ | ❌ |
| Profile | ✅ | ✅ | — |
| Products | ✅ | ❌ | ❌ |
| Orders | ✅ | ❌ | ❌ |
| Stores | ❌ | ❌ | ❌ |
| Inventory | ❌ | ❌ | ❌ |
| Analytics | ❌ | — | ❌ |
| Payments | ❌ | ❌ | ❌ |
| Settings | ❌ | ❌ | ❌ |
| System | ❌ | ❌ | ❌ |

---

## Resource Ownership

### Tenant-Scoped Resources

Seller access to the following resources is scoped to their own store:

- Products (seller_products)
- Orders
- Inventory
- Analytics
- Store settings

Cross-tenant access is prohibited.

### User-Scoped Resources

Customer access to the following resources is scoped to their own data:

- Profile
- Orders (own orders)
- Addresses

---

## Authorization Flow

Every protected request performs:

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

## Implementation

### Decorators

```typescript
// Role-based protection
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)

// Permission-based protection
@RequirePermissions(Permission.PRODUCTS_WRITE)
@UseGuards(AuthGuard, PermissionsGuard)
```

### Guard Priority

1. `AuthGuard` — Validates authentication token
2. `RolesGuard` — Checks user has required role
3. `PermissionsGuard` — Checks user has required permission

---

## Error Responses

### Unauthorized (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No authentication token provided"
  }
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

---

## Security Rules

1. Authentication is required before authorization
2. Missing authentication returns 401 UNAUTHORIZED
3. Authenticated users without permission receive 403 FORBIDDEN
4. Users cannot grant themselves permissions
5. Users cannot change their own role unless explicitly permitted
6. Permission checks cannot be bypassed by manipulating request data
7. Authorization logic is centralized in guards and decorators
8. Sensitive authorization information is not leaked in error responses

---

## Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-08 | Initial permission matrix |
