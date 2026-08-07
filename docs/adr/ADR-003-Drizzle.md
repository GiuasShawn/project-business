# ADR-003 — Adopt Drizzle ORM as the Data Access Layer

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-003

**Owners:** Engineering

---

# Context

Project Loom requires a data access layer that is:

- Fully type-safe
- Fast
- Migration-first
- SQL-friendly
- Compatible with PostgreSQL
- Suitable for a large modular monolith
- Easy for AI coding agents to understand

Candidate solutions evaluated:

- Drizzle ORM
- Prisma ORM
- TypeORM
- MikroORM
- Kysely
- Raw SQL

---

# Decision

Project Loom will use **Drizzle ORM** as the primary ORM and migration tool.

Drizzle will be the single interface between the application and PostgreSQL.

No module may bypass Drizzle except for approved raw SQL used for performance-critical queries.

---

# Decision Drivers

Highest priorities:

1. Type safety
2. SQL transparency
3. Performance
4. Predictable migrations
5. Long-term maintainability
6. AI-friendly code generation

---

# Why Drizzle?

Advantages:

- SQL-first approach
- Excellent TypeScript inference
- Lightweight runtime
- No hidden query generation
- Schema defined in code
- Easy to optimize with raw SQL
- Excellent PostgreSQL support
- Fast startup and build times

---

# Why Not Prisma?

Prisma is an excellent ORM, but for Project Loom:

- It introduces an additional schema language separate from TypeScript.
- Complex SQL optimizations can become less transparent.
- The generated client is larger.
- The SQL-first approach of Drizzle aligns better with our architecture.

Prisma remains a strong alternative for projects with different priorities.

---

# Why Not TypeORM?

Reasons:

- Decorator-heavy model
- Less predictable behavior
- Higher runtime complexity
- More difficult to reason about at scale

---

# Why Not Raw SQL?

Raw SQL is powerful but:

- Increases boilerplate
- Reduces consistency
- Makes shared abstractions harder
- Requires more manual type maintenance

Raw SQL is permitted only when measurable performance benefits justify it.

---

# Schema Strategy

All schema definitions live in:

```text id="m0lhjz"
packages/database/schema/
```

Each business domain owns its own schema file.

Example:

```text id="7wsnsm"
identity.ts

stores.ts

products.ts

inventory.ts

orders.ts

payments.ts

returns.ts

analytics.ts
```

---

# Migration Strategy

Migrations are:

- Forward-only
- Version controlled
- Peer reviewed
- Generated through Drizzle Kit

Production databases must only be modified through migrations.

---

# Query Strategy

General business queries:

- Drizzle Query Builder

Complex reporting:

- Drizzle SQL API
- Approved raw SQL where justified

---

# Transactions

Drizzle transactions are mandatory for:

- Checkout
- Order creation
- Inventory reservation
- Payment capture
- Refund processing
- Seller payouts

No financial workflow may span multiple independent transactions.

---

# Repository Pattern

Every domain exposes repositories.

Example:

```text id="0x7owh"
ProductRepository

OrderRepository

InventoryRepository

PaymentRepository
```

Business services interact with repositories rather than directly with Drizzle tables.

---

# Performance Guidelines

Preferred:

- Explicit column selection
- Batched operations
- Proper indexes
- Pagination
- Transactions only when necessary

Avoid:

- N+1 queries
- Unbounded SELECT *
- Long-running transactions

---

# Testing

Repository tests:

- Integration tests against PostgreSQL

Business logic:

- Unit tests using mocked repositories

This separation allows business rules to be tested independently of persistence.

---

# Risks

Potential risks:

- Team members unfamiliar with Drizzle
- Overuse of raw SQL
- Inconsistent repository implementations

Mitigation:

- Shared repository standards
- Code reviews
- Repository templates
- Documentation

---

# Consequences

Positive:

- Excellent TypeScript support
- SQL remains visible
- High performance
- Easier optimization
- Clean migration workflow

Negative:

- Slightly lower abstraction than some ORMs
- Developers should understand SQL fundamentals

---

# Success Criteria

This decision remains valid while:

- Schema evolution remains straightforward.
- Queries are understandable and performant.
- Repository implementations stay consistent.
- AI-generated code follows repository standards.

---

# Related Documents

- ADR-002 — PostgreSQL
- Database Philosophy
- Database Package
- Engineering Standards
- Repository Architecture

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted Drizzle ORM as the primary data access layer. |