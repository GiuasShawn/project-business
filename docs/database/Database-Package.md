# Database Package

Version 1.0

This package defines the complete PostgreSQL database architecture for Project Loom.

It is divided into independent specifications.

---

# DB-001

## Database Standards

Status

✅ Complete

---

# DB-002

## Core Database Rules

### Database

PostgreSQL

---

### Character Set

UTF-8

---

### Timezone

UTC

---

### Primary Keys

UUIDv7

---

### ORM

Drizzle ORM

---

### Naming

snake_case

plural tables

---

### Soft Deletes

Only where required.

---

### Monetary Values

Stored as INTEGER

Smallest currency unit.

Example

```text
₹999.99

↓

99999 paise
```

---

### Images

Never stored inside PostgreSQL.

Cloudflare R2 only.

---

### Search

Never search PostgreSQL.

Use Meilisearch.

---

### Analytics

Never calculate reports from production tables.

Use aggregated analytics tables.

---

### Passwords

Never stored.

Hash only.

---

### Sessions

Stateless JWT

Refresh tokens stored securely.

---

### Audit

Every critical business operation must generate an audit record.

---

# DB-003

## Shared Columns

Every business table contains

```text
id UUID

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

Where required

```text
deleted_at

created_by

updated_by

deleted_by

version
```

---

# DB-004

## Global Enums

UserRole

```text
CUSTOMER

SELLER

ADMIN

SUPER_ADMIN
```

---

SellerStatus

```text
PENDING

VERIFIED

APPROVED

ACTIVE

SUSPENDED

CLOSED
```

---

StoreStatus

```text
DRAFT

CONFIGURED

PUBLISHED

ACTIVE

SUSPENDED

ARCHIVED
```

---

OrderStatus

```text
PENDING

CONFIRMED

PACKED

SHIPPED

DELIVERED

COMPLETED

CANCELLED

RETURNED
```

---

PaymentStatus

```text
INITIATED

AUTHORIZED

CAPTURED

SETTLED

FAILED

REFUNDED
```

---

ReturnStatus

```text
REQUESTED

APPROVED

COLLECTED

RECEIVED

REFUNDED

REJECTED

CLOSED
```

---

CommissionStatus

```text
PENDING

ELIGIBLE

PAID

REVERSED
```

---

PayoutStatus

```text
PENDING

SCHEDULED

PROCESSING

COMPLETED

FAILED
```

---

NotificationStatus

```text
QUEUED

SENDING

DELIVERED

FAILED
```

---

# DB-005

## Table Groups

Identity

```text
users

roles

permissions

sessions

refresh_tokens
```

---

Commerce

```text
stores

products

product_variants

categories

collections

seller_products
```

---

Inventory

```text
inventory_items

inventory_transactions

inventory_reservations
```

---

Orders

```text
orders

order_items

shipments
```

---

Payments

```text
payments

transactions

refunds
```

---

Seller

```text
commissions

payouts

settlements
```

---

Customer

```text
wishlists

wishlist_items

addresses

reviews

return_requests
```

---

Marketing

```text
coupons

campaigns
```

---

Platform

```text
notifications

analytics_events

audit_logs

file_assets
```

---

# DB-006

## High Level Relationships

```text
User

├── Store

├── Address

├── Wishlist

├── Order

└── Review

Store

├── Seller Products

├── Orders

├── Analytics

└── Coupons

Product

├── Variants

├── Inventory

├── Reviews

├── Seller Products

└── Order Items

Order

├── Order Items

├── Payment

├── Shipment

├── Return

└── Commission
```

---

# DB-007

## Table Dependency Order

Tables must be created in this order.

```text
Roles

↓

Permissions

↓

Users

↓

Sessions

↓

Stores

↓

Categories

↓

Collections

↓

Products

↓

Variants

↓

Seller Products

↓

Inventory

↓

Addresses

↓

Wishlists

↓

Orders

↓

Payments

↓

Returns

↓

Commissions

↓

Payouts

↓

Notifications

↓

Analytics

↓

Audit Logs
```

This order avoids circular foreign key dependencies during migrations.

---

# DB-008

## Index Strategy

Every table

Primary Key

---

Every FK

Indexed

---

Emails

Unique

---

Subdomains

Unique

---

SKUs

Unique

---

Status Columns

Indexed

---

Created At

Indexed

---

Search Columns

Indexed where appropriate

---

Composite indexes

Added after production profiling.

---

# DB-009

## Estimated Scale

Users

500,000+

---

Stores

100,000+

---

Products

250,000+

---

Variants

1,000,000+

---

Orders

50,000,000+

---

Order Items

150,000,000+

---

Analytics Events

10+ Billion

---

Audit Logs

Unlimited

---

This sizing informs partitioning and archival strategies but should be revisited as real usage patterns emerge.

---

# DB-010

## Acceptance Criteria

The database package is complete when:

- Every business entity has a defined table.
- Relationships are normalized.
- Naming is consistent.
- Constraints are documented.
- Migrations can be generated without ambiguity.
- The schema supports the business rules defined in earlier documents.