# ADR-012 — Adopt an Observability-First Architecture

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-012

**Owners:** Engineering

---

# Context

Project Loom is expected to support:

- Hundreds of thousands of users
- Thousands of sellers
- Millions of orders
- Financial transactions
- Background workers
- Search indexing
- Distributed queues

As the platform grows, debugging production issues through logs alone becomes insufficient.

The platform requires complete observability across:

- API
- Frontend
- Database
- Workers
- Infrastructure
- External providers

Candidate approaches evaluated:

- Logs only
- Logs + Metrics
- Full Observability

---

# Decision

Project Loom adopts a **Full Observability** architecture.

Every production service must expose:

- Structured Logs
- Metrics
- Distributed Traces
- Error Tracking
- Health Checks
- Dashboards
- Alerts

Observability is considered a first-class engineering feature.

---

# Observability Stack

## Logging

Technology

```text id="1"
Pino
```

Characteristics

- Structured JSON
- Correlation IDs
- Request IDs
- Automatic redaction

---

## Error Tracking

Technology

```text id="2"
Sentry
```

Tracks

- Backend exceptions
- Frontend exceptions
- Worker failures
- Source maps
- Releases

---

## Distributed Tracing

Technology

```text id="3"
OpenTelemetry
```

Traces

```text id="4"
HTTP

↓

API

↓

Database

↓

Redis

↓

BullMQ

↓

External APIs

↓

Response
```

Every request receives a Trace ID.

---

## Metrics

Technology

```text id="5"
Prometheus
```

Collected Metrics

- Request Count
- Request Duration
- Error Rate
- Queue Depth
- Cache Hit Ratio
- Database Connections
- Search Latency
- Upload Latency
- Worker Throughput

---

## Dashboards

Technology

```text id="6"
Grafana
```

Dashboards

- API
- Workers
- PostgreSQL
- Redis
- Meilisearch
- Payments
- Payouts
- Storefront Performance

---

# Logging Standards

Every log includes:

```text id="7"
timestamp

level

service

request_id

trace_id

user_id

store_id

message
```

When available:

```text id="8"
order_id

payment_id

job_id

correlation_id
```

---

# Sensitive Data

Never log:

- Passwords
- JWTs
- Refresh Tokens
- Card Data
- OTPs
- Secrets
- Personal financial information

Sensitive values must be redacted automatically.

---

# Health Checks

Every service exposes:

```text id="9"
/health

/ready

/live
```

Health checks verify:

- PostgreSQL
- Redis
- Meilisearch
- Queue
- Storage

---

# Alerting

Critical alerts include:

- API Error Rate
- Queue Backlog
- Payment Failures
- Database Connectivity
- Redis Memory
- Search Failure
- Upload Failure

Alerts should notify engineering before users report problems.

---

# Correlation IDs

Every incoming request receives:

```text id="10"
Correlation ID
```

The same ID propagates through:

```text id="11"
API

↓

Worker

↓

Redis

↓

Database

↓

Notifications

↓

Logs

↓

Sentry
```

This enables end-to-end debugging.

---

# Performance Budgets

Targets

API

```text id="12"
P95

<250ms
```

Search

```text id="13"
<150ms
```

Dashboard

```text id="14"
<2s
```

Largest Contentful Paint

```text id="15"
<2.5s
```

Error Rate

```text id="16"
<0.1%
```

Queue Latency

```text id="17"
<30s
```

These targets should be reviewed as the platform evolves.

---

# Release Tracking

Every deployment records:

- Version
- Git Commit
- Build Date
- Environment
- Deployment Time

Sentry releases and source maps should align with deployment versions.

---

# Incident Investigation

Every production incident should be traceable through:

```text id="18"
Alert

↓

Dashboard

↓

Trace

↓

Logs

↓

Database

↓

Root Cause
```

---

# Monitoring Requirements

Monitor

Infrastructure

- CPU
- Memory
- Disk
- Network

Application

- Latency
- Errors
- Throughput

Business

- Orders
- Payments
- Returns
- Payouts

Engineering

- Build Success
- Deployment Success
- Test Success

---

# Retention

Suggested retention:

Logs

30–90 days

Metrics

12 months

Traces

7–30 days

Audit Logs

Permanent (per business and legal requirements)

Retention periods should be configurable and comply with applicable regulations.

---

# Risks

Potential risks:

- Excessive logging
- High storage costs
- Missing instrumentation
- Alert fatigue

Mitigations:

- Log sampling where appropriate
- Severity-based alerts
- Dashboard reviews
- Regular instrumentation audits

---

# Consequences

Positive:

- Faster debugging
- Better reliability
- Lower MTTR (Mean Time to Recovery)
- Improved operational visibility
- Easier capacity planning

Negative:

- Additional infrastructure
- Increased storage requirements
- Ongoing dashboard and alert maintenance

---

# Success Criteria

This decision remains valid while:

- Production issues are diagnosable.
- Performance regressions are detected early.
- Monitoring overhead remains reasonable.
- Engineers can trace requests end-to-end.

---

# Related Documents

- Engineering Standards
- Event Catalog
- Repository Architecture
- BOOT-001
- ADR-001 through ADR-011

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted a full observability-first architecture. |