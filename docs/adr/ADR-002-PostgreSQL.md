# ADR-002 — Adopt PostgreSQL as the Primary Database

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-002

**Owners:** Engineering

---

# Context

Project Loom requires a database capable of supporting:

- Multi-tenant storefronts
- ACID-compliant financial transactions
- Orders
- Payments
- Inventory
- Returns
- Seller payouts
- Complex reporting
- Full relational integrity

The database is expected to scale to:

- 500,000+ users
- 100,000+ stores
- 50,000,000+ orders
- Billions of analytics events

Candidate databases evaluated:

- PostgreSQL
- MySQL
- MariaDB
- MongoDB
- CockroachDB

---

# Decision

Project Loom will use **PostgreSQL** as the primary operational database.

PostgreSQL will be the source of truth for all transactional business data.

---

# Responsibilities

PostgreSQL stores:

- Users
- Stores
- Products
- Variants
- Categories
- Inventory
- Orders
- Payments
- Returns
- Payouts
- Reviews
- Coupons
- Audit Logs

---

# Responsibilities Excluded

PostgreSQL will **not** be used as:

- Full-text search engine
- Image storage
- CDN
- Analytics warehouse
- Queue broker

Those concerns are delegated to:

| Responsibility | Technology |
|---------------|------------|
| Search | Meilisearch |
| Images | Cloudflare R2 |
| Queue | Redis + BullMQ |
| Cache | Redis |

---

# Decision Drivers

Highest priorities:

1. Data integrity
2. Transaction safety
3. Mature ecosystem
4. Performance
5. Scalability
6. Tooling support

---

# Why PostgreSQL?

Advantages:

- Excellent ACID guarantees
- Rich indexing options
- Strong foreign key support
- Mature replication
- JSONB support where appropriate
- Excellent performance
- Extensive tooling
- Strong Drizzle ORM integration

---

# Why Not MySQL?

Reasons:

- Less expressive indexing and advanced SQL capabilities for our expected workload.
- PostgreSQL aligns better with complex relational queries and future reporting needs.

---

# Why Not MongoDB?

Reasons:

- Core business data is highly relational.
- Financial workflows require strong transactional guarantees.
- Inventory, orders, payments, and payouts depend on referential integrity.

MongoDB may be evaluated separately for specialized future workloads but will not be the system of record.

---

# Data Modeling Principles

The schema shall be:

- Normalized by default
- UUID-based
- Audit-friendly
- Event-driven
- Migration-first

---

# Scaling Strategy

## Phase 1

- Single primary instance

## Phase 2

- Read replicas
- Connection pooling (PgBouncer)

## Phase 3

- Partition large tables
- Archival strategy
- Dedicated reporting replicas

Scaling decisions must be based on production metrics rather than anticipated load.

---

# Operational Standards

Mandatory:

- Daily backups
- Point-in-time recovery
- Automated migrations
- Health monitoring
- Connection pooling

---

# Risks

Potential risks:

- Long-running queries
- Table bloat
- Lock contention

Mitigations:

- Query profiling
- Proper indexing
- Routine VACUUM/ANALYZE
- Load testing
- Performance monitoring

---

# Consequences

Positive:

- Reliable financial consistency
- Mature operational tooling
- Excellent ecosystem support
- Long-term maintainability

Negative:

- Requires careful schema design
- Requires migration discipline
- Scaling strategy becomes important at very large data volumes

---

# Success Criteria

This decision remains valid while:

- Transaction latency meets targets.
- Database growth remains manageable.
- Horizontal read scaling satisfies demand.
- Operational complexity remains acceptable.

If these assumptions change, a new ADR will evaluate architectural alternatives without replacing PostgreSQL as the system of record unless there is compelling evidence.

---

# Related Documents

- Database Philosophy
- Product Data Model
- Database Package
- Event Catalog
- Engineering Standards

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted PostgreSQL as the primary operational database. |