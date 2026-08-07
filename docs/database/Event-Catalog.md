# Document 11 — Event Catalog & Event-Driven Architecture

**Project:** Project Loom *(Working Name)*

**Document ID:** EVT-011

**Version:** 1.0.0

**Status:** Living Specification

---

# 1. Purpose

This document defines every domain event used throughout Project Loom.

Events are the primary communication mechanism between business domains.

A domain **must never directly manipulate another domain's internal state** when an event-driven workflow is appropriate.

Instead:

```text
Domain

↓

Publish Event

↓

Event Bus

↓

Interested Domains

↓

Process Independently
```

---

# 2. Event Design Principles

Every event must be:

- Immutable
- Idempotent
- Versioned
- Timestamped
- Auditable

Events describe **facts that have already happened**.

Correct:

- OrderPlaced
- PaymentCaptured
- InventoryReserved

Incorrect:

- PlaceOrder
- CapturePayment
- ReserveInventory

Events use **past tense**.

---

# 3. Event Structure

Every event contains:

```text
event_id

event_name

event_version

occurred_at

aggregate_type

aggregate_id

correlation_id

causation_id

payload

metadata
```

---

# 4. Event Categories

## Identity

- UserRegistered
- UserVerified
- UserLoggedIn
- UserLoggedOut
- PasswordResetRequested
- PasswordChanged
- SellerApproved
- SellerSuspended

---

## Store

- StoreCreated
- StoreConfigured
- StorePublished
- StoreUpdated
- StoreArchived

---

## Products

- ProductCreated
- ProductUpdated
- ProductPublished
- ProductArchived

Variant Events

- VariantCreated
- VariantUpdated
- VariantDeleted

---

## Inventory

- InventoryReserved
- InventoryReleased
- InventoryAdjusted
- InventoryLow
- InventoryRestocked

---

## Cart

- CartCreated
- CartUpdated
- CartAbandoned
- CheckoutStarted

---

## Checkout

- CheckoutValidated
- CheckoutCompleted
- CheckoutFailed

---

## Orders

- OrderPlaced
- OrderConfirmed
- OrderPacked
- OrderShipped
- OrderDelivered
- OrderCompleted
- OrderCancelled

---

## Payments

- PaymentInitiated
- PaymentAuthorized
- PaymentCaptured
- PaymentFailed
- RefundRequested
- RefundCompleted

---

## Returns

- ReturnRequested
- ReturnApproved
- ReturnRejected
- ReturnCollected
- ReturnReceived
- ReturnRefunded

---

## Commission

- CommissionCalculated
- CommissionPending
- CommissionEligible
- CommissionPaid
- CommissionReversed

---

## Payouts

- PayoutScheduled
- PayoutStarted
- PayoutCompleted
- PayoutFailed

---

## Reviews

- ReviewCreated
- ReviewUpdated
- ReviewDeleted

---

## Coupons

- CouponCreated
- CouponActivated
- CouponExpired

---

## Notifications

- EmailQueued
- EmailDelivered
- SmsQueued
- NotificationSent

---

## Analytics

- AnalyticsEventCreated
- ReportGenerated

---

# 5. Event Ownership

| Event Group | Publisher |
|-------------|-----------|
| Identity | Identity Domain |
| Products | Products Domain |
| Inventory | Inventory Domain |
| Orders | Orders Domain |
| Payments | Payments Domain |
| Returns | Returns Domain |
| Analytics | Analytics Domain |

Only the owning domain may publish its events.

---

# 6. Event Consumers

Example:

## OrderPlaced

Published By

Orders

Consumed By

- Inventory
- Payments
- Analytics
- Notifications

---

## PaymentCaptured

Consumed By

- Orders
- Commission
- Analytics
- Notifications

---

## OrderDelivered

Consumed By

- Returns
- Commission
- Analytics
- Notifications

---

## ReturnApproved

Consumed By

- Refunds
- Inventory
- Commission

---

# 7. Event Bus

Initial implementation:

```text
NestJS

↓

BullMQ

↓

Redis
```

Future:

```text
Apache Kafka
```

No changes required to business domains.

---

# 8. Retry Policy

Transient failures:

Retry:

1 minute

↓

5 minutes

↓

30 minutes

↓

2 hours

↓

Dead Letter Queue

---

# 9. Dead Letter Queue

Messages reaching maximum retry count:

↓

Dead Letter Queue

↓

Admin Review

↓

Replay (optional)

No event is silently discarded.

---

# 10. Event Ordering

Ordering is guaranteed only:

Per Aggregate

Example:

Order

↓

OrderConfirmed

↓

OrderPacked

↓

OrderShipped

Different aggregates may process independently.

---

# 11. Idempotency

Consumers must safely process duplicate events.

Example:

InventoryReserved

received twice

↓

Inventory changes only once.

---

# 12. Correlation IDs

Every request receives:

Correlation ID

Used across:

- API
- Queue
- Logs
- Workers
- Database Audit

This enables full request tracing.

---

# 13. Event Versioning

Breaking payload changes:

↓

New Version

Never overwrite old versions.

---

# 14. Side Effects

Events may trigger:

- Emails
- SMS
- Analytics
- Search Index
- Image Processing
- Cache Invalidation
- Payout Scheduling

No side effect should block the publisher.

---

# 15. Security

Sensitive information:

Never included in event payloads.

Events contain references.

Consumers fetch sensitive data securely if required.

---

# 16. Monitoring

Track:

- Publish Rate
- Processing Time
- Retry Count
- Failure Rate
- Queue Length
- Consumer Latency

---

# 17. Acceptance Criteria

The event system is compliant when:

- Every domain publishes only its own events.
- Events are immutable.
- Consumers are idempotent.
- Failed processing supports retries.
- No business workflow depends on synchronous side effects.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established the event-driven architecture and event catalog. |