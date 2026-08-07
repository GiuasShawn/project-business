# ADR-007 — Adopt BullMQ for Background Jobs & Asynchronous Processing

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-007

**Owners:** Engineering

---

# Context

Project Loom includes numerous operations that are not required to complete during the initial HTTP request.

Examples include:

- Email delivery
- Image processing
- Search indexing
- Analytics aggregation
- Seller payout generation
- Commission calculations
- Notification delivery
- Cache invalidation
- Scheduled cleanup
- Report generation

Executing these tasks synchronously would increase response times and reduce system reliability.

Candidate technologies evaluated:

- BullMQ
- Temporal
- RabbitMQ
- AWS SQS
- Apache Kafka

---

# Decision

Project Loom will adopt **BullMQ** as the platform's background job processing system.

BullMQ will use Redis as its storage backend.

Business services enqueue jobs.

Dedicated worker applications execute them.

---

# Responsibilities

BullMQ is responsible for:

- Background processing
- Delayed jobs
- Scheduled jobs
- Retry handling
- Dead-letter processing
- Queue metrics
- Job prioritization

---

# Responsibilities Excluded

BullMQ is **not** responsible for:

- Business state persistence
- Transaction management
- Authentication
- Long-term analytics storage

Those responsibilities remain with their respective domains.

---

# Queue Architecture

```text id="bullmqarchitecture"
HTTP Request

↓

Business Service

↓

Queue

↓

Redis

↓

Worker

↓

Business Logic

↓

Success / Retry / Dead Letter Queue
```

---

# Queue Categories

## Email

Examples:

- Welcome emails
- Password reset
- Order confirmation
- Seller notifications

---

## Search

Examples:

- Product indexing
- Product updates
- Category updates

---

## Analytics

Examples:

- Event aggregation
- Dashboard refresh
- Report generation

---

## Payments

Examples:

- Commission calculation
- Settlement generation
- Payout scheduling

---

## Media

Examples:

- Image optimization
- Thumbnail generation
- Metadata extraction

---

## Notifications

Examples:

- Push notifications
- SMS
- In-app notifications

---

# Job Naming

Every job follows:

```text id="jobnames"
domain.action
```

Examples:

```text id="jobexamples"
email.send

payment.calculateCommission

search.indexProduct

analytics.aggregate

inventory.releaseReservation

notification.push
```

---

# Retry Policy

Default retry schedule:

```text id="retrypolicy"
Attempt 1

↓

1 minute

↓

5 minutes

↓

30 minutes

↓

2 hours

↓

Dead Letter Queue
```

Retry policies may be customized per queue.

---

# Dead Letter Queue

Jobs exceeding retry limits move to the Dead Letter Queue.

Requirements:

- Preserved payload
- Failure reason
- Retry history
- Replay capability

No failed job should be silently discarded.

---

# Idempotency

All jobs must be idempotent.

Executing the same job multiple times must not produce duplicate business effects.

Examples:

- Duplicate payout
- Duplicate commission
- Duplicate email
- Duplicate inventory release

must be prevented.

---

# Scheduling

BullMQ schedules:

- Return window expiration
- Seller payouts
- Daily reports
- Cleanup tasks
- Analytics aggregation
- Cache refresh

Cron schedules should be centralized and version-controlled.

---

# Worker Architecture

Workers run independently from the API.

```text id="workerarchitecture"
API

↓

Redis

↓

BullMQ

↓

Worker Process

↓

Business Domain
```

Workers may scale horizontally.

---

# Monitoring

Track:

- Queue depth
- Processing latency
- Retry count
- Failure rate
- Processing throughput
- Worker availability

Operational dashboards should surface these metrics.

---

# Security

Workers:

- Authenticate with infrastructure services
- Use least-privilege credentials
- Never expose queue endpoints publicly

Sensitive job payloads should contain references rather than confidential data whenever possible.

---

# Scaling Strategy

Phase 1:

- Single worker instance

Phase 2:

- Multiple worker processes
- Dedicated queues

Phase 3:

- Horizontally scaled worker fleet
- Queue partitioning if necessary

Scaling decisions must be driven by observed workloads.

---

# Risks

Potential risks:

- Queue backlogs
- Poison jobs
- Duplicate execution
- Large payloads

Mitigations:

- Idempotent handlers
- Dead Letter Queue
- Monitoring
- Payload size limits
- Queue prioritization

---

# Consequences

Positive:

- Faster API responses
- Improved reliability
- Independent worker scaling
- Better fault isolation
- Easier operational monitoring

Negative:

- Additional infrastructure
- Eventual consistency for asynchronous workflows
- Increased operational complexity compared to synchronous processing

---

# Success Criteria

This decision remains valid while:

- API response times remain within targets.
- Queue latency stays acceptable.
- Failed jobs are observable and recoverable.
- Background workloads scale independently from the API.

---

# Related Documents

- ADR-001 — Modular Monolith
- ADR-006 — Redis
- Event Catalog
- State Machine Specification
- System Blueprint
- Engineering Standards

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted BullMQ for asynchronous processing and background jobs. |