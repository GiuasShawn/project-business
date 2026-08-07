# Document 13 — Permission Matrix & Authorization Specification

**Project:** Project Loom *(Working Name)*

**Document ID:** AUTHZ-013

**Version:** 1.0.0

**Status:** Living Specification

---

# 1. Purpose

This document defines every permission in Project Loom.

Every API endpoint, UI action, background job, and administrative function must enforce these permissions.

Authorization is role-based (RBAC) with resource ownership checks.

---

# 2. Roles

The platform defines four primary roles:

- Customer
- Seller
- Administrator
- Super Administrator

Future:

- Support Agent
- Warehouse Operator
- Finance Manager
- Marketing Manager
- Read-Only Analyst

---

# 3. Permission Naming Convention

Every permission follows:

```text
resource.action
```

Examples:

```text
products.read
products.create
orders.update
stores.publish
payouts.approve
```

---

# 4. Resource Ownership Rule

Unless explicitly stated otherwise:

Users may only access resources they own.

Examples:

Customer

✔ Own Orders

✖ Other Customers' Orders

Seller

✔ Own Store

✖ Another Seller's Store

---

# 5. Customer Permissions

## Account

| Permission | Access |
|------------|:------:|
| profile.read | ✓ |
| profile.update | ✓ |
| account.delete | ✓ |

---

## Addresses

| Permission | Access |
|------------|:------:|
| addresses.read | ✓ |
| addresses.create | ✓ |
| addresses.update | ✓ |
| addresses.delete | ✓ |

---

## Shopping

| Permission | Access |
|------------|:------:|
| products.read | ✓ |
| search.use | ✓ |
| cart.manage | ✓ |
| wishlist.manage | ✓ |
| checkout.start | ✓ |

---

## Orders

| Permission | Access |
|------------|:------:|
| orders.read.own | ✓ |
| orders.cancel | Policy Based |
| orders.return | Policy Based |

---

## Reviews

| Permission | Access |
|------------|:------:|
| reviews.create | ✓ |
| reviews.update.own | ✓ |
| reviews.delete.own | ✓ |

---

# 6. Seller Permissions

Everything a Customer can do, plus:

---

## Store

| Permission | Access |
|------------|:------:|
| store.read | ✓ |
| store.update | ✓ |
| store.publish | ✓ |
| store.theme.update | ✓ |
| store.branding.update | ✓ |

---

## Products

| Permission | Access |
|------------|:------:|
| seller_products.read | ✓ |
| seller_products.add | ✓ |
| seller_products.remove | ✓ |
| seller_products.price.update | ✓ |

Sellers **cannot**:

- Create master products
- Delete master products
- Edit master product details

---

## Orders

| Permission | Access |
|------------|:------:|
| seller_orders.read | ✓ |
| seller_orders.export | ✓ |

Sellers cannot edit order status.

---

## Analytics

| Permission | Access |
|------------|:------:|
| analytics.read | ✓ |
| reports.export | ✓ |

Only for their own store.

---

## Payouts

| Permission | Access |
|------------|:------:|
| payouts.read | ✓ |
| payouts.request | ✓ |

---

# 7. Administrator Permissions

Administrators may manage platform resources.

---

## Products

| Permission | Access |
|------------|:------:|
| products.create | ✓ |
| products.update | ✓ |
| products.archive | ✓ |

---

## Inventory

| Permission | Access |
|------------|:------:|
| inventory.read | ✓ |
| inventory.adjust | ✓ |

---

## Orders

| Permission | Access |
|------------|:------:|
| orders.read | ✓ |
| orders.update | ✓ |
| orders.export | ✓ |

---

## Sellers

| Permission | Access |
|------------|:------:|
| sellers.read | ✓ |
| sellers.approve | ✓ |
| sellers.suspend | ✓ |

---

## Returns

| Permission | Access |
|------------|:------:|
| returns.approve | ✓ |
| returns.reject | ✓ |

---

## Payments

| Permission | Access |
|------------|:------:|
| payments.read | ✓ |
| refunds.process | ✓ |

---

## Payouts

| Permission | Access |
|------------|:------:|
| payouts.release | ✓ |
| payouts.retry | ✓ |

---

# 8. Super Administrator

Full unrestricted access.

Additional permissions:

- system.settings
- roles.manage
- permissions.manage
- audit_logs.read
- feature_flags.manage
- maintenance.enable
- emergency.shutdown (future)

---

# 9. Permission Evaluation Order

Every request follows:

```text
Authentication

↓

Role Check

↓

Permission Check

↓

Ownership Check

↓

Business Rule Validation

↓

Execution
```

---

# 10. Ownership Rules

Customer

Only owns:

- Orders
- Addresses
- Wishlist
- Reviews

Seller

Owns:

- Store
- Store Branding
- Store Products
- Analytics
- Store Coupons

Administrators do not own resources.

They manage platform resources.

---

# 11. API Authorization

Every endpoint specifies:

Authentication

Required Role

Required Permission

Ownership Rule

Example:

```http
PATCH /stores/:id
```

Requires:

Authenticated

Seller

store.update

Must own store

---

# 12. Frontend Authorization

UI must hide actions users cannot perform.

Backend must still enforce authorization.

Frontend authorization is a usability feature, not a security mechanism.

---

# 13. Background Workers

Workers execute with system-level permissions.

Workers never inherit end-user permissions.

Every worker action must be auditable.

---

# 14. Permission Caching

Permissions may be cached in Redis.

Maximum cache lifetime:

15 minutes

Permission changes immediately invalidate cache.

---

# 15. Audit Requirements

Every authorization failure records:

- User ID
- Resource
- Action
- Timestamp
- IP Address
- Correlation ID

---

# 16. Acceptance Criteria

Authorization is complete when:

- Every API requires explicit permissions.
- Every UI action maps to a permission.
- Resource ownership is enforced.
- Workers operate under system permissions.
- Authorization failures are auditable.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established the platform authorization model and permission matrix. |