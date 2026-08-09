# ADR-018 — Analytics Events Partitioning Strategy (Design)

**Status:** Accepted

**Date:** 2026-08-09

**Decision ID:** ADR-018

**Owners:** Engineering

---

# Context

Project Loom's Product Data Model defines `analytics_events` as an append-only log of business activity. Volume projections (DB-009) estimate 10+ billion events over the platform's lifetime.

The event table is not yet created (Phase 14). Partitioning strategy must be designed NOW because:
- Adding range partitioning to a table with 100M+ rows requires a multi-step migration (new partitioned table, dual-write, backfill, cutover).
- Adding partitioning to an empty table is a single clause in `CREATE TABLE`.
- The partitioning scheme influences the table schema, indexes, and ingestion path — all of which are easier to design upfront.

This ADR establishes the partitioning strategy as a **design specification only**. It does not build the analytics subsystem.

---

# Design Decisions

## Partition Key: `created_at` (timestamp)

All analytics events are time-bound: consumers query events within a date range. Partitioning by `created_at` allows:
- Time-range queries to prune partitions.
- Old partitions to be detached and archived (data retention).
- Bulk ingestion without locking.

## Partition Interval: Monthly

Monthly partitions balance:
- Partition count (120 partitions per decade — manageable).
- Query performance (most analytic queries span days or weeks).
- Maintenance overhead (one partition detach per month).

## Retention Policy

- **Hot (current+2 months):** Full resolution, all columns, primary indexes.
- **Warm (3–24 months):** Full resolution, reduced index set (only `(store_id, event_type, created_at)`).
- **Cold (25+ months):** Aggregate-only; raw rows copied to compressed archive then detached from the main table.
- **Compliance (legally required):** Retained in the archive indefinitely.

Retention is enforced by a scheduled periodic task (Phase 14 worker) that detaches partitions older than the warm retention limit.

## Index Strategy Per Partition

All indexes are local (per-partition):

| Index | Purpose |
|-------|---------|
| `(store_id, created_at)` | Tenant-scoped time-range queries |
| `(event_type, created_at)` | Event-type filtered queries |
| `(created_at)` | Time-range queries without store/event filter |

## Ingestion Model

- Events are INSERT-only (no UPDATE, no DELETE within retention).
- Inserts are batched where possible (bulk logging).
- No cross-partition transactions required.
- The application inserts into the partitioned parent table; PostgreSQL routes the row to the correct partition.

## Partition Management

A background worker (Phase 14) runs monthly:
1. Creates the next month's partition.
2. Detaches partitions older than warm retention to a compressed archive table.
3. Records partition metadata in a `_partition_meta` tracking table.

## Query Patterns (Expected)

| Query | How partitioning helps |
|-------|----------------------|
| "Store X's revenue this week" | Prunes to ~1 partition (monthly) |
| "Platform-wide GMV last quarter" | Scans 3 partitions sequentially |
| "Most-viewed products today" | Prunes to current partition |
| "User A's order history" | Not an analytics query — goes to orders table |
| "Retention report for Jan 2025" | Single partition scan |

---

# Implementation Plan (Phase 14)

When the `analytics_events` table is created in Phase 14, it will use:

```sql
CREATE TABLE analytics_events (
  id          UUID DEFAULT uuid_generate_v7(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  store_id    UUID,
  event_type  TEXT NOT NULL,
  event_name  TEXT NOT NULL,
  payload     JSONB,
  correlation_id UUID,
  actor_id    TEXT
) PARTITION BY RANGE (created_at);

-- Initial partition
CREATE TABLE analytics_events_2026_01
  PARTITION OF analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

The table schema and partition interval are design specifications. They will be finalized in Phase 14 when the analytics module is built.

---

# Scope Boundaries

- This ADR does NOT create the `analytics_events` table.
- This ADR does NOT build the analytics module.
- This ADR does NOT implement the background partition worker.
- This ADR does NOT specify the full column layout — that belongs to Phase 14.
- This ADR does NOT address archive table compression strategy (future).

# Consequences

Positive:

- Partitioning is designed before the table exists — no retrofitting needed.
- The monthly interval and retention policy provide operational clarity.
- Index strategy is tenant-scoped (aligned with ADR-004).

Negative:

- Monthly partitioning may need to be revisited if query latency requirements demand weekly or daily partitions.
- Archive/compression strategy is deferred (acceptable for V1).
- Background partition worker adds complexity to Phase 14.

# Success Criteria

This decision remains valid while:

- The Phase 14 `analytics_events` CREATE TABLE includes `PARTITION BY RANGE (created_at)`.
- Partitions are created monthly.
- Tenants can query their analytics within their retention window without full-table scans.
- Partition management (create/detach) is automated by the scheduled worker.

If query patterns diverge significantly from the expected patterns above, a new ADR may re-evaluate the interval or partition key.

---

# Related Documents

- `docs/product/Product-Data-Model.md` — Analytics Event entity
- `docs/database/Database-Package.md` — DB-009 (Estimated Scale)
- `docs/database/Event-Catalog.md` — Event definitions
- `docs/adr/ADR-002-PostgreSQL.md`
- `docs/adr/ADR-004-Multi-Tenancy.md`

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-09 | Designed analytics events monthly range partitioning strategy. |
