# ADR-008 — Adopt Meilisearch as the Product Search Engine

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-008

**Owners:** Engineering

---

# Context

Project Loom requires a fast, scalable search experience for:

- Product search
- Category search
- Collection search
- Seller storefront search
- Autocomplete
- Typo tolerance
- Faceted filtering
- Sorting
- Instant search

Projected scale:

- 250,000+ products
- 1,000,000+ variants
- Millions of searches per month

Candidate technologies evaluated:

- Meilisearch
- Elasticsearch
- OpenSearch
- PostgreSQL Full-Text Search
- Algolia

---

# Decision

Project Loom will adopt **Meilisearch** as the dedicated search engine.

PostgreSQL remains the system of record.

Meilisearch maintains a searchable index derived from PostgreSQL.

---

# Responsibilities

Meilisearch is responsible for:

- Product search
- Autocomplete
- Typo tolerance
- Filtering
- Sorting
- Search ranking
- Search suggestions

---

# Responsibilities Excluded

Meilisearch is **not** responsible for:

- Product storage
- Inventory
- Orders
- Payments
- Analytics
- Authentication

Business data always resides in PostgreSQL.

---

# Why Meilisearch?

Advantages:

- Fast search
- Simple deployment
- Excellent developer experience
- Typo tolerance
- Faceted filtering
- Low operational overhead
- Easy integration with TypeScript

---

# Why Not Elasticsearch/OpenSearch?

Reasons:

- Greater operational complexity
- Higher infrastructure requirements
- More tuning required
- Overkill for expected scale

May be reconsidered if search requirements become significantly more complex.

---

# Why Not PostgreSQL Full-Text Search?

Reasons:

- Transactional database should prioritize operational workloads.
- Dedicated search engines provide better ranking, filtering, and autocomplete capabilities.
- Separating concerns improves scalability.

---

# Data Flow

```text id="searchflow"
PostgreSQL

↓

Product Event

↓

BullMQ Queue

↓

Search Worker

↓

Meilisearch Index
```

Search indexes are updated asynchronously.

---

# Indexed Entities

Initial indexes:

- Products
- Categories
- Collections
- Stores (public metadata)

Future:

- Blog content
- Help center
- Documentation

---

# Indexed Fields

Example product fields:

- Product name
- Brand
- Description
- Category
- Collection
- Tags
- Available sizes
- Available colors
- Price
- Popularity
- Rating

Inventory quantities and other rapidly changing operational data should only be indexed if necessary and updated appropriately.

---

# Search Features

Supported:

- Full-text search
- Prefix search
- Typo tolerance
- Synonyms
- Faceted filters
- Sorting
- Pagination
- Highlighting

---

# Ranking

Primary ranking signals:

1. Relevance
2. Availability
3. Popularity
4. Rating
5. Newness

Future ranking signals may include personalization.

---

# Synchronization

Events triggering index updates:

- ProductCreated
- ProductUpdated
- ProductPublished
- ProductArchived

Search workers consume these events and update the index.

---

# Failure Handling

If indexing fails:

- Retry via BullMQ
- Log failure
- Retry according to queue policy
- Dead Letter Queue if retries are exhausted

Search failures must never affect transactional workflows.

---

# Monitoring

Track:

- Index size
- Search latency
- Failed indexing jobs
- Query throughput
- Error rate

Alerts should detect stale indexes and degraded search performance.

---

# Security

Meilisearch:

- Private network access
- API keys with least privilege
- Separate administrative and search keys
- No direct public write access

---

# Scaling Strategy

Phase 1:

- Single Meilisearch instance

Phase 2:

- Larger instance
- Improved indexing throughput

Future scaling decisions should be based on production metrics and operational requirements.

---

# Risks

Potential risks:

- Stale indexes
- Failed indexing
- Incorrect ranking
- Large index growth

Mitigations:

- Event-driven synchronization
- Retry policies
- Monitoring
- Periodic reconciliation jobs

---

# Consequences

Positive:

- Fast search experience
- Rich search capabilities
- Reduced database load
- Independent scaling

Negative:

- Additional infrastructure component
- Eventual consistency between PostgreSQL and search index
- Operational monitoring required

---

# Success Criteria

This decision remains valid while:

- Search latency meets performance targets.
- Index synchronization remains reliable.
- Search quality meets business expectations.
- Operational overhead remains acceptable.

---

# Related Documents

- ADR-002 — PostgreSQL
- ADR-006 — Redis
- ADR-007 — BullMQ
- Event Catalog
- System Blueprint

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted Meilisearch as the dedicated product search engine. |