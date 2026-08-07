# ADR-004 — Adopt Shared-Database Multi-Tenant Architecture

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-004

**Owners:** Engineering

---

# Context

Project Loom enables thousands of independent sellers to operate branded storefronts while sharing the same platform infrastructure.

Each seller requires logical isolation of:

- Storefront
- Products
- Orders
- Analytics
- Customers
- Branding
- Coupons
- Reports

The platform must support:

- 100,000+ stores
- 500,000+ users
- Millions of orders
- Low operational cost
- Easy onboarding
- Horizontal scaling

Candidate tenancy models:

1. Database per tenant
2. Schema per tenant
3. Shared database with row-level tenancy

---

# Decision

Project Loom will use a **shared PostgreSQL database with logical row-level multi-tenancy**.

Every tenant-owned record includes a `store_id` (or equivalent tenant identifier) where appropriate.

Tenant isolation is enforced by the application layer, repository layer, and automated tests.

---

# Why This Decision

Advantages:

- Simple operations
- Lower infrastructure cost
- Easier migrations
- Easier analytics
- Easier backups
- Faster onboarding
- Shared connection pools
- Efficient resource utilization

---

# Why Not Database per Tenant?

Rejected because:

- Operational complexity increases rapidly.
- Migrations become difficult.
- Backups multiply.
- Analytics across tenants becomes expensive.
- Resource usage is inefficient for small sellers.

Database-per-tenant may be revisited only for enterprise customers in the future.

---

# Why Not Schema per Tenant?

Rejected because:

- Schema management becomes complex at scale.
- Migration tooling becomes more difficult.
- Cross-tenant reporting is harder.
- Tooling compatibility is reduced.

---

# Tenant Identification

Every authenticated seller request resolves:

```text id="tenantflow1"
JWT

↓

User

↓

Store

↓

Tenant Context

↓

Repository
```

Public storefront requests resolve tenant context from:

```text id="tenantflow2"
HTTP Host Header

↓

Subdomain

↓

Store

↓

Tenant Context
```

Future support for custom domains will resolve tenant context through the mapped domain.

---

# Data Ownership

Global tables (no tenant ownership):

- users
- roles
- permissions
- products
- categories
- collections
- inventory_items

Tenant-owned tables:

- stores
- seller_products
- orders
- payouts
- analytics
- coupons
- reviews
- notifications

Mixed ownership is allowed only when explicitly documented.

---

# Repository Standards

Repositories must always operate within tenant scope for tenant-owned entities.

Example:

Correct:

```sql id="repoexample1"
SELECT *
FROM orders
WHERE store_id = :storeId;
```

Incorrect:

```sql id="repoexample2"
SELECT *
FROM orders;
```

No tenant-owned query may omit tenant filtering unless executed by privileged administrative services.

---

# Authorization

Authorization consists of three checks:

1. Authentication
2. Permission validation
3. Tenant ownership validation

Passing role checks alone is insufficient for accessing tenant data.

---

# Indexing

Tenant-owned tables should include composite indexes where beneficial.

Examples:

```text id="tenantindexes"
(store_id, created_at)

(store_id, status)

(store_id, product_id)

(store_id, order_number)
```

Indexes should be reviewed periodically based on production query patterns.

---

# Caching

Cache keys must include tenant context.

Example:

```text id="cachekeys"
store:abc123:products

store:abc123:dashboard

store:abc123:analytics
```

No cached response may be shared across tenants unless explicitly global.

---

# Events

All tenant events must include:

- store_id
- correlation_id
- event_id

This enables correct downstream processing and tracing.

---

# Analytics

Analytics are isolated by tenant.

Platform-wide analytics aggregate across tenants using dedicated reporting processes rather than direct application queries.

---

# Testing Requirements

Automated tests must verify:

- Sellers cannot access another seller's data.
- Tenant filters are applied consistently.
- Cache isolation works correctly.
- Events contain tenant identifiers.
- Administrative overrides behave as expected.

Cross-tenant access bugs are considered critical severity.

---

# Future Evolution

If enterprise customers require dedicated infrastructure:

- Enterprise tenants may migrate to dedicated databases.
- Application code should not require changes because repositories already abstract data access.
- Tenant resolution remains unchanged.

---

# Consequences

Positive:

- Simple deployment model
- Lower infrastructure cost
- Strong scalability
- Easier analytics
- Easier maintenance

Negative:

- Requires strict discipline around tenant filtering.
- Repository standards must be consistently enforced.
- Automated testing is essential to prevent data leakage.

---

# Success Criteria

This decision remains valid while:

- Tenant isolation remains reliable.
- Query performance meets targets.
- Operational overhead stays low.
- Enterprise isolation requirements remain limited.

If these assumptions change, a future ADR will evaluate hybrid tenancy models.

---

# Related Documents

- ADR-001 — Modular Monolith
- ADR-002 — PostgreSQL
- ADR-003 — Drizzle ORM
- Permission Matrix
- Database Package
- Event Catalog

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted shared-database row-level multi-tenancy. |