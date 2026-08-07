# Document 09 — Product Data Model (PDM)

**Project:** Project Loom *(Working Name)*  
**Document ID:** PDM-009  
**Version:** 1.0.0  
**Status:** Living Specification

---

# 1. Purpose

The Product Data Model defines every core business entity in Project Loom.

This document describes **what each entity represents**, **who owns it**, **how it behaves**, **its lifecycle**, **relationships**, **permissions**, and **events**.

This document is implementation-independent and serves as the canonical reference for:

- Database schema
- API design
- Backend services
- Frontend models
- Business rules
- Event system

---

# 2. Core Business Entities

## Identity Domain

- User
- Session
- Refresh Token
- Role
- Permission

---

## Commerce Domain

- Store
- Product
- Product Variant
- Category
- Collection
- Seller Product

---

## Inventory Domain

- Inventory Item
- Inventory Reservation
- Inventory Transaction

---

## Shopping Domain

- Cart
- Cart Item
- Wishlist

---

## Order Domain

- Order
- Order Item
- Shipment

---

## Payment Domain

- Payment
- Transaction
- Refund

---

## Seller Domain

- Commission
- Payout
- Settlement

---

## Customer Domain

- Address
- Review
- Return Request

---

## Marketing Domain

- Coupon
- Campaign

---

## System Domain

- Notification
- Analytics Event
- Audit Log
- File Asset

---

# 3. Entity Specification Template

Every entity shall define:

- Purpose
- Owner Domain
- Responsibilities
- Relationships
- Lifecycle
- State Machine
- Business Rules
- Events
- Permissions
- Future Extensions

---

# 4. Entity — User

## Purpose

Represents a person who interacts with the platform.

A user may be:

- Customer
- Seller
- Admin
- Super Admin

A single account may hold multiple roles.

---

### Owner Domain

Identity

---

### Responsibilities

- Authentication
- Profile
- Preferences
- Roles
- Addresses
- Notification settings

---

### Relationships

```text
User
├── Sessions
├── Stores
├── Orders
├── Addresses
├── Reviews
├── Notifications
├── Wishlists
└── Audit Logs
```

---

### Lifecycle

```text
Registered

↓

Email Verified

↓

Active

↓

Suspended

↓

Deleted
```

---

### Business Rules

- Email must be unique.
- Passwords are never stored.
- Email verification required for sellers.
- Suspended users cannot authenticate.
- Deleted users retain historical business records.

---

### Events

- UserRegistered
- UserVerified
- UserUpdated
- UserSuspended
- UserDeleted

---

### Permissions

Customer

- Own Profile

Seller

- Own Profile
- Seller Dashboard

Admin

- View Users
- Suspend Users

Super Admin

- Full Access

---

# 5. Entity — Store

## Purpose

Represents a seller's public storefront.

---

### Owner Domain

Stores

---

### Responsibilities

- Branding
- Theme
- Homepage
- Product Collection
- Policies
- SEO

---

### Relationships

```text
Store

├── Seller

├── Products

├── Orders

├── Analytics

├── Coupons

└── Customers
```

---

### Lifecycle

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

---

### Business Rules

- One primary store per seller (Version 1).
- Subdomain must be unique.
- Stores never own inventory.
- Stores cannot modify master products.

---

### Events

- StoreCreated
- StorePublished
- StoreUpdated
- StoreSuspended
- StoreArchived

---

# 6. Entity — Product

## Purpose

Represents a master product owned by the platform.

---

### Owner Domain

Products

---

### Responsibilities

- Product Information
- Variants
- Images
- Pricing Rules
- Categories

---

### Relationships

```text
Product

├── Variants

├── Inventory

├── Seller Products

├── Order Items

├── Reviews

└── Collections
```

---

### Lifecycle

```text
Draft

↓

Ready

↓

Published

↓

Archived
```

---

### Business Rules

- SKU required.
- Images required.
- Inventory required before publication.
- Products cannot be deleted if referenced by orders.

---

### Events

- ProductCreated
- ProductUpdated
- ProductPublished
- ProductArchived

---

# 7. Entity — Inventory Item

## Purpose

Represents the platform's stock for a product variant.

---

### Owner Domain

Inventory

---

### Responsibilities

- Available Quantity
- Reserved Quantity
- Stock Adjustments

---

### Business Rules

- Quantity can never become negative.
- Reservations expire automatically.
- Every adjustment is logged.

---

### Events

- InventoryReserved
- InventoryReleased
- InventoryAdjusted
- InventoryLow

---

# 8. Entity — Order

## Purpose

Represents a completed purchase.

---

### Relationships

```text
Order

├── Customer

├── Store

├── Order Items

├── Payment

├── Shipment

├── Return

└── Commission
```

---

### Lifecycle

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

↓

Archived
```

---

### Business Rules

- Orders are immutable after completion.
- Every order belongs to exactly one store.
- Every order belongs to one customer.

---

### Events

- OrderPlaced
- OrderConfirmed
- OrderPacked
- OrderShipped
- OrderDelivered
- OrderCompleted

---

# 9. Entity — Payment

## Purpose

Represents the financial transaction for an order.

---

### Lifecycle

```text
Initiated

↓

Authorized

↓

Captured

↓

Refunded

↓

Failed
```

---

### Events

- PaymentAuthorized
- PaymentCaptured
- PaymentFailed
- PaymentRefunded

---

# 10. Entity — Commission

Represents the seller's earnings for an order.

States:

```text
Pending

↓

Eligible

↓

Paid

↓

Reversed
```

Events:

- CommissionCalculated
- CommissionEligible
- CommissionPaid

---

# 11. Entity — Return

Lifecycle

```text
Requested

↓

Approved

↓

Collected

↓

Received

↓

Refunded

↓

Closed
```

---

# 12. Entity — Payout

Lifecycle

```text
Pending

↓

Scheduled

↓

Processing

↓

Completed

↓

Failed
```

---

# 13. Entity — Analytics Event

Purpose

Immutable record of business activity used for reporting.

Examples

- Product Viewed
- Product Clicked
- Cart Updated
- Checkout Started
- Order Completed

Analytics events never modify operational data.

---

# 14. Cross-Entity Rules

- Stores never own inventory.
- Orders never modify products.
- Payments never calculate commissions.
- Analytics never update business entities.
- Notifications never block business workflows.

---

# 15. Acceptance Criteria

The Product Data Model is complete when:

- Every business concept is represented by exactly one entity.
- Entity ownership is unambiguous.
- Relationships are documented.
- Lifecycles are defined.
- Business rules are explicit.
- Events are standardized.
- Permissions are assigned.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established the canonical business entity model for Project Loom. |