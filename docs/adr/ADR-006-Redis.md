# ADR-006 — Adopt Redis as the Distributed Cache & Coordination Layer

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-006

**Owners:** Engineering

---

# Context

Project Loom requires a fast, in-memory data store to support:

- Application caching
- Background job infrastructure
- Rate limiting
- Distributed locking
- Session-related transient data
- Temporary checkout state
- Idempotency keys
- Feature flags (future)

Candidate technologies evaluated:

- Redis
- Memcached
- DragonflyDB
- KeyDB
- In-memory Node.js cache

---

# Decision

Project Loom will adopt **Redis** as the primary distributed in-memory data platform.

Redis will be shared across multiple infrastructure concerns while maintaining logical key separation.

---

# Responsibilities

Redis is responsible for:

- Response caching
- BullMQ queue backend
- Rate limiting
- Idempotency keys
- Distributed locks
- Temporary application state
- Cache invalidation coordination

Redis is **not** the source of truth for business data.

---

# Responsibilities Excluded

Redis will **not** store:

- Orders
- Payments
- Inventory
- Products
- Users
- Payouts

Persistent business data always belongs in PostgreSQL.

---

# Why Redis?

Advantages:

- Extremely fast
- Mature ecosystem
- Excellent BullMQ integration
- Rich data structures
- Broad community support
- Operational simplicity

---

# Why Not Memcached?

Reasons:

- Fewer data structures
- No persistence options
- Poor fit for queues
- No distributed locking support

---

# Why Not DragonflyDB?

Reasons:

- Excellent technology, but Redis has a more mature ecosystem and operational tooling.
- May be re-evaluated in the future if operational advantages become compelling.

---

# Key Namespace Strategy

All keys follow a consistent namespace.

Examples:

```text id="rediskeys"
cache:product:{id}

cache:store:{id}

cache:homepage

queue:emails

queue:payouts

rate_limit:user:{id}

idempotency:{key}

lock:inventory:{product_id}
```

---

# Cache Categories

## Short-lived

- Product pages
- Categories
- Collections

TTL:

5–15 minutes

---

## Medium-lived

- Homepage sections
- Store configuration
- Navigation

TTL:

30–60 minutes

---

## Long-lived

- Feature flags
- Platform configuration

TTL:

Several hours

Invalidated immediately after changes.

---

# Cache Invalidation

Preferred strategy:

Event-driven invalidation.

Example:

```text id="cacheflow"
ProductUpdated

↓

CacheInvalidationEvent

↓

Redis

↓

Next Request Rebuilds Cache
```

Manual cache clearing is reserved for operational tooling.

---

# Distributed Locks

Redis locks protect:

- Inventory reservation
- Payment processing
- Payout generation
- Coupon redemption

Locks must include:

- Timeout
- Automatic release
- Failure recovery

---

# Idempotency

Redis stores temporary idempotency records for:

- Checkout
- Payment creation
- Refund requests
- Payout requests

Expired keys are removed automatically.

---

# Rate Limiting

Redis backs rate limiting for:

- Authentication
- Public APIs
- Search
- Checkout
- Admin endpoints

Limits are configurable per endpoint category.

---

# Monitoring

Monitor:

- Memory usage
- Hit ratio
- Evictions
- Latency
- Connected clients
- Queue depth

Alerts should trigger before resource exhaustion.

---

# Scaling Strategy

Phase 1:

- Single Redis instance

Phase 2:

- High availability
- Replica

Phase 3:

- Redis Cluster if operational metrics justify it

Scaling decisions must be evidence-based.

---

# Security

Requirements:

- Authentication enabled
- TLS where supported
- Private network access
- No public exposure
- Secrets managed securely

---

# Risks

Potential risks:

- Memory exhaustion
- Cache stampedes
- Improper invalidation
- Large keys

Mitigations:

- TTL policies
- Request coalescing where appropriate
- Monitoring
- Size limits
- Consistent naming conventions

---

# Consequences

Positive:

- Very low latency
- Simplified queue infrastructure
- Centralized transient state
- Excellent scalability

Negative:

- Additional infrastructure component
- Requires cache discipline
- Incorrect cache invalidation can cause stale reads

---

# Success Criteria

This decision remains valid while:

- Cache hit rates remain healthy.
- Redis latency stays within targets.
- Queue performance meets service objectives.
- Redis remains a transient data layer only.

---

# Related Documents

- ADR-001 — Modular Monolith
- ADR-002 — PostgreSQL
- Event Catalog
- Database Package
- Engineering Standards
- BOOT-001

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted Redis as the distributed cache and coordination layer. |