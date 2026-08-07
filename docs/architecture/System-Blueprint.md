# Document 12 — System Blueprint

**Project:** Project Loom *(Working Name)*  
**Document ID:** SYS-012  
**Version:** 1.0.0  
**Status:** Living Specification

---

# 1. Purpose

The System Blueprint provides a complete, high-level view of Project Loom.

It describes:

- Core systems
- Data flow
- User flow
- Service interactions
- Event flow
- External integrations
- Infrastructure boundaries

This document is the architectural map for the entire platform.

---

# 2. Platform Overview

```text
                     Internet
                         │
                  Cloudflare CDN/WAF
                         │
                ┌────────┴────────┐
                │                 │
         Marketing Site     Storefronts
                │                 │
                └────────┬────────┘
                         │
                   Next.js Frontend
                         │
                     REST API
                         │
                  NestJS Application
                         │
 ┌────────────────────────────────────────────────────┐
 │ Identity │ Products │ Orders │ Payments │ Inventory│
 │ Stores   │ Returns  │ Search │ Payouts  │ Analytics│
 └────────────────────────────────────────────────────┘
                         │
        PostgreSQL │ Redis │ Meilisearch │ R2 Storage
```

---

# 3. Primary Actors

## Customer

Responsibilities

- Browse stores
- Purchase products
- Track orders
- Submit reviews
- Request returns

---

## Seller

Responsibilities

- Operate storefront
- Select products
- Configure pricing
- View analytics
- Receive payouts

---

## Administrator

Responsibilities

- Manage platform
- Manage inventory
- Manage sellers
- Process returns
- Configure business rules

---

## Platform Services

- Authentication
- Search
- Payments
- Notifications
- Analytics
- Background Workers

---

# 4. Customer Purchase Flow

```text
Customer

↓

Visit Store

↓

Browse Products

↓

View Product

↓

Add To Cart

↓

Checkout

↓

Payment

↓

Order Created

↓

Inventory Reserved

↓

Shipment

↓

Delivery

↓

Return Window

↓

Review
```

---

# 5. Seller Flow

```text
Register

↓

Verification

↓

Create Store

↓

Customize Branding

↓

Select Products

↓

Publish Store

↓

Receive Orders

↓

Track Analytics

↓

Commission Generated

↓

Return Window Ends

↓

Payout
```

---

# 6. Admin Flow

```text
Manage Products

↓

Update Inventory

↓

Monitor Orders

↓

Approve Returns

↓

Release Payouts

↓

Review Reports

↓

Configure Platform
```

---

# 7. Order Processing Flow

```text
Checkout

↓

Payment Authorized

↓

Inventory Reserved

↓

Order Created

↓

Order Confirmed

↓

Warehouse Processing

↓

Shipment Created

↓

Delivered

↓

Completed
```

---

# 8. Return & Settlement Flow

```text
Delivered

↓

Return Window Active

↓

No Return

↓

Commission Eligible

↓

Settlement Created

↓

Seller Paid
```

Alternative:

```text
Delivered

↓

Return Requested

↓

Approved

↓

Refund

↓

Commission Reversed
```

---

# 9. Inventory Flow

```text
Product Published

↓

Inventory Available

↓

Reservation

↓

Allocation

↓

Shipment

↓

Delivered

↓

Stock Updated
```

Inventory is global and shared across every storefront.

---

# 10. Payment Flow

```text
Checkout

↓

Razorpay/Cashfree

↓

Webhook

↓

Payment Verified

↓

Order Confirmed

↓

Transaction Recorded
```

Refunds always follow the return workflow.

---

# 11. Event Flow

```text
OrderPlaced

↓

InventoryReserved

↓

PaymentCaptured

↓

AnalyticsUpdated

↓

NotificationQueued

↓

CommissionCalculated

↓

PayoutScheduled
```

All non-critical side effects occur asynchronously.

---

# 12. Search Flow

```text
Product Updated

↓

Search Index Queue

↓

Meilisearch

↓

Customer Search Results
```

Search never queries PostgreSQL directly for customer-facing catalog searches.

---

# 13. Analytics Flow

```text
Business Event

↓

Analytics Queue

↓

Aggregation

↓

Dashboard Metrics
```

Analytics is eventually consistent and does not affect operational workflows.

---

# 14. Notification Flow

```text
Business Event

↓

Notification Queue

↓

Email / SMS / In-App

↓

Delivery Status Logged
```

Notification failures never block user requests.

---

# 15. Storage Flow

```text
Upload Image

↓

Sharp Optimization

↓

Cloudflare R2

↓

CDN Cache

↓

Storefront Delivery
```

---

# 16. Authentication Flow

```text
Register

↓

Email Verification

↓

Login

↓

JWT Issued

↓

Refresh Token

↓

Authenticated Session
```

---

# 17. Core Design Principles

- Stateless APIs
- Event-driven side effects
- Shared inventory
- Multi-tenant storefronts
- Modular monolith
- API-first architecture
- Mobile-first frontend
- Centralized product ownership

---

# 18. Scaling Strategy

## Phase 1

- Single NestJS application
- PostgreSQL
- Redis
- BullMQ

## Phase 2

- Read replicas
- Dedicated workers
- CDN optimization
- Search cluster

## Phase 3

- Extract high-load domains
- Database partitioning
- Multi-region deployment
- Kubernetes (if justified)

---

# 19. Critical Dependencies

| Domain | Depends On |
|---------|------------|
| Orders | Inventory, Payments |
| Returns | Orders |
| Payouts | Orders, Returns |
| Analytics | Domain Events |
| Search | Products |
| Notifications | Domain Events |

---

# 20. Engineering Rule

Every new feature must answer four questions before implementation:

1. Which domain owns it?
2. Which entities change?
3. Which events are emitted?
4. Which existing workflows are affected?

If these cannot be answered, the feature specification is incomplete.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Introduced the end-to-end architectural blueprint for Project Loom. |