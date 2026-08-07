# ADR-001 — Adopt a Modular Monolith Architecture

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-001

**Owners:** Engineering

---

# Context

Project Loom is expected to support:

- Hundreds of thousands of users
- Tens of thousands of sellers
- Multiple dashboards
- Background workers
- Payments
- Inventory
- Search
- Analytics
- Notifications

A key architectural decision is whether to begin with:

- Modular Monolith
- Microservices
- Distributed Monolith
- Serverless-only architecture

---

# Decision

Project Loom will begin as a **Modular Monolith**.

The application will be deployed as a single backend service while maintaining strict internal module boundaries.

Modules communicate through interfaces and domain events rather than direct implementation coupling.

---

# Architecture

```text
                 NestJS Application
────────────────────────────────────────────

Identity

Stores

Products

Catalog

Inventory

Orders

Payments

Returns

Payouts

Analytics

Notifications

Search

────────────────────────────────────────────

Shared Infrastructure

Database

Redis

BullMQ

Meilisearch
```

---

# Module Rules

Every module owns:

- Database entities
- Business logic
- Validation
- Events
- Services
- Tests

Modules must never access another module's database tables directly through repositories.

Communication occurs through:

- Public services
- Domain events
- Shared interfaces

---

# Why Not Microservices?

Microservices introduce significant operational complexity:

- Service discovery
- Distributed transactions
- Event consistency
- Deployment complexity
- Monitoring
- Debugging
- Infrastructure costs

These costs are not justified for the expected initial scale.

---

# Why a Modular Monolith?

Advantages:

- Single deployment
- Single database
- Faster development
- Easier debugging
- Simpler testing
- Lower infrastructure costs
- Easier onboarding
- Better local development experience

---

# Scaling Strategy

The architecture is intentionally designed so modules can be extracted later if necessary.

Possible future services:

- Search
- Analytics
- Notifications
- Payments
- Image Processing

Extraction should occur only when supported by production metrics.

---

# Decision Drivers

Highest priority:

1. Maintainability
2. Developer velocity
3. Simplicity
4. Scalability
5. Operational efficiency

---

# Consequences

Positive:

- Faster MVP delivery
- Lower operational overhead
- Easier refactoring
- Centralized debugging

Negative:

- Single deployment unit
- Larger application binary over time
- Requires discipline to maintain module boundaries

---

# Success Criteria

This decision remains valid while:

- Deployment time remains acceptable.
- Build times remain manageable.
- Module boundaries remain respected.
- Independent scaling is not required.

If these assumptions no longer hold, new ADRs should evaluate extracting individual domains into separate services.

---

# Related Documents

- Engineering Bible
- Domain Model
- Event Catalog
- System Blueprint
- Repository Architecture

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Initial decision adopting a Modular Monolith architecture. |