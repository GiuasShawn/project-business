# Document 10 — State Machine Specification

**Project:** Project Loom *(Working Name)*  
**Document ID:** SMS-010  
**Version:** 1.0.0  
**Status:** Living Specification

---

# 1. Purpose

This document defines every state machine used throughout the platform.

A state machine specifies:

- Valid states
- Allowed transitions
- Triggering events
- Invalid transitions
- Side effects

Every implementation (backend, frontend, APIs, queues, workers) shall follow these definitions.

---

# 2. General Rules

Every state machine must:

- Start with exactly one initial state.
- Reach one terminal state.
- Reject invalid transitions.
- Emit domain events.
- Record audit history.

---

# 3. Seller Lifecycle

```text
Pending Registration
        │
        ▼
Email Verified
        │
        ▼
Identity Verification
        │
        ▼
Approved
        │
        ▼
Active
        │
 ┌──────┴────────┐
 ▼               ▼
Suspended    Closed
```

### Invalid

- Suspended → Active (without admin action)
- Closed → Active

Events:

- SellerRegistered
- SellerVerified
- SellerApproved
- SellerSuspended
- SellerClosed

---

# 4. Store Lifecycle

```text
Created

↓

Configured

↓

Published

↓

Active

↓

Suspended

↓

Archived
```

Stores cannot become Active until:

- Branding configured
- Policies completed
- At least one product selected

---

# 5. Product Lifecycle

```text
Draft

↓

Ready

↓

Published

↓

Archived
```

Requirements for Published:

- Images
- SKU
- Category
- Inventory
- Pricing

---

# 6. Inventory Reservation

```text
Available

↓

Reserved

↓

Allocated

↓

Released
```

Reservation timeout:

15 minutes (configurable).

Expired reservations automatically return to Available.

---

# 7. Shopping Cart

```text
Created

↓

Updated

↓

Checkout Started

↓

Converted

OR

Expired
```

Converted carts become immutable.

---

# 8. Checkout

```text
Started

↓

Validated

↓

Payment Processing

↓

Completed

OR

Failed
```

Validation includes:

- Inventory
- Address
- Coupon
- Payment

---

# 9. Payment Lifecycle

```text
Initiated

↓

Authorized

↓

Captured

↓

Settled

↓

Completed
```

Failure path:

```text
Initiated

↓

Failed
```

Refund path:

```text
Completed

↓

Refund Pending

↓

Refunded
```

---

# 10. Order Lifecycle

```text
Pending

↓

Confirmed

↓

Packed

↓

Shipped

↓

Delivered

↓

Completed
```

Alternative paths:

```text
Pending

↓

Cancelled
```

or

```text
Delivered

↓

Return Requested
```

---

# 11. Shipment Lifecycle

```text
Created

↓

Picked Up

↓

In Transit

↓

Out For Delivery

↓

Delivered
```

Exception:

```text
In Transit

↓

Delayed
```

---

# 12. Return Lifecycle

```text
Requested

↓

Approved

↓

Collected

↓

Received

↓

Inspected

↓

Refund Approved

↓

Refunded

↓

Closed
```

Rejected path:

```text
Requested

↓

Rejected
```

---

# 13. Refund Lifecycle

```text
Requested

↓

Approved

↓

Processing

↓

Completed
```

Failure:

```text
Processing

↓

Failed
```

---

# 14. Commission Lifecycle

```text
Calculated

↓

Pending

↓

Return Window

↓

Eligible

↓

Paid
```

Alternative:

```text
Pending

↓

Reversed
```

---

# 15. Payout Lifecycle

```text
Pending

↓

Scheduled

↓

Processing

↓

Completed
```

Failure:

```text
Processing

↓

Failed
```

---

# 16. Coupon Lifecycle

```text
Draft

↓

Active

↓

Expired
```

Administrative path:

```text
Active

↓

Disabled
```

---

# 17. Notification Lifecycle

```text
Queued

↓

Sending

↓

Delivered
```

Failure:

```text
Sending

↓

Retry

↓

Failed
```

---

# 18. File Upload Lifecycle

```text
Uploading

↓

Processing

↓

Optimized

↓

Stored

↓

Available
```

---

# 19. Analytics Event Lifecycle

```text
Generated

↓

Queued

↓

Processed

↓

Aggregated

↓

Archived
```

---

# 20. Audit Log Lifecycle

```text
Created

↓

Stored

↓

Retained

↓

Archived
```

Audit logs are immutable.

---

# 21. Invalid Transition Policy

If an invalid transition is requested:

- Reject the request.
- Return a standardized error.
- Record the attempt.
- Do not modify data.

---

# 22. Side Effects

State transitions may trigger:

- Domain events
- Notifications
- Queue jobs
- Search indexing
- Analytics updates
- Audit logging

Side effects must not alter the validity of the state transition itself.

---

# 23. Acceptance Criteria

Every entity:

- Has one defined lifecycle.
- Cannot skip required states.
- Cannot transition to invalid states.
- Emits appropriate events.
- Records audit history.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Defined platform state machines. |