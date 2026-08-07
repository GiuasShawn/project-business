# Document 05 — Information Architecture & Navigation

**Project:** Project Loom *(Working Name)*  
**Document ID:** IA-005  
**Version:** 1.0.0  
**Status:** Draft (Living Document)

---

# 1. Purpose

This document defines the complete navigation structure, routing hierarchy, information architecture, and page organization of the platform.

Every screen in the application must belong to this hierarchy.

---

# 2. Platform Applications

The platform consists of four primary applications.

```text
Platform

├── Marketing Website
├── Customer Storefront
├── Seller Dashboard
└── Admin Dashboard
```

Each application has its own navigation while sharing authentication, design system, and APIs.

---

# 3. Marketing Website

**Purpose**

Introduce the platform and convert visitors into sellers or customers.

## Public Pages

```text
/

About

Pricing

How It Works

Features

Success Stories

FAQs

Contact

Blog (Future)

Careers (Future)

Privacy Policy

Terms of Service

Refund Policy
```

---

# 4. Customer Storefront

Each storefront is served from:

```text
sellername.projectloom.com
```

Future:

```text
www.brand.com
```

## Main Navigation

```text
Home

Shop

Collections

New Arrivals

Best Sellers

Sale

About

Contact
```

---

## Customer Pages

```text
Home

Collection Listing

Category Listing

Product Details

Search

Wishlist

Cart

Checkout

Order Confirmation

Order Tracking

Login

Register

Forgot Password

Profile

Addresses

Orders

Reviews

Returns

Settings
```

---

# 5. Seller Dashboard

Accessible from:

```text
dashboard.projectloom.com
```

## Sidebar Navigation

```text
Dashboard

Products

Collections

Pricing

Orders

Customers

Returns

Analytics

Payouts

Marketing

Store Design

Pages

Coupons

Reviews

Notifications

Settings

Help
```

---

## Seller Dashboard Pages

### Dashboard

Displays:

- Revenue
- Orders
- Conversion
- Visitors
- Pending Payouts
- Recent Orders
- Top Products

---

### Products

Functions:

- Browse master catalog
- Add products to store
- Remove products
- Configure pricing
- Configure visibility

---

### Collections

Functions:

- Create collections
- Feature products
- Reorder products

---

### Orders

Functions:

- View orders
- Filter
- Search
- Export

---

### Analytics

Displays:

- Sales
- Visitors
- Conversion
- Revenue
- Product Performance
- Returns

---

### Payouts

Displays:

- Pending
- Eligible
- Paid
- Transaction History

---

### Store Design

Functions:

- Logo
- Banner
- Colors
- Homepage Sections
- Theme
- Typography

---

### Pages

Manage:

- About
- Contact
- Policies
- FAQ

---

### Settings

Manage:

- Store Information
- Subdomain
- Notification Preferences
- Bank Account
- Tax Details

---

# 6. Admin Dashboard

Accessible from:

```text
admin.projectloom.com
```

---

## Sidebar

```text
Overview

Products

Inventory

Categories

Collections

Orders

Payments

Payouts

Returns

Sellers

Customers

Reviews

Coupons

Analytics

Marketing

Notifications

Settings

Audit Logs

System Health
```

---

# 7. Admin Pages

## Products

- Create
- Edit
- Archive
- Import
- Export

---

## Inventory

- Stock Levels
- Adjustments
- Low Stock
- Reservations

---

## Orders

- View
- Filter
- Search
- Timeline
- Export

---

## Sellers

- Approvals
- Verification
- Suspension
- Performance

---

## Payments

- Transactions
- Refunds
- Failures
- Gateway Status

---

## Analytics

Platform-wide:

- GMV
- Revenue
- Active Sellers
- Active Customers
- Orders
- Returns
- Conversion

---

## System Health

Displays:

- API Status
- Queue Status
- Storage
- Cache
- Search
- Background Workers

---

# 8. Global Navigation Rules

Users shall only see pages they are authorized to access.

Unauthorized routes return:

- 401 (Unauthenticated)
- 403 (Forbidden)

Unknown routes return:

- 404

---

# 9. URL Structure

## Marketing

```text
/

about

pricing

contact
```

---

## Storefront

```text
/

products

collections

search

cart

checkout

account

orders
```

---

## Seller

```text
/dashboard

/dashboard/products

/dashboard/orders

/dashboard/analytics

/dashboard/payouts

/dashboard/settings
```

---

## Admin

```text
/admin

/admin/products

/admin/orders

/admin/inventory

/admin/sellers

/admin/settings
```

---

# 10. Navigation Principles

Navigation shall be:

- Predictable
- Consistent
- Responsive
- Keyboard Accessible
- Mobile Friendly

Maximum navigation depth should not exceed three levels.

---

# 11. Breadcrumb Rules

Breadcrumbs are required for:

- Product Management
- Orders
- Analytics
- Settings
- Admin Modules

Example:

```text
Dashboard

↓

Products

↓

Winter Collection

↓

Product
```

---

# 12. Search Behavior

Search shall be available in:

- Storefront
- Seller Dashboard
- Admin Dashboard

Each search context only returns resources the user is authorized to view.

---

# 13. Permission Matrix

| Area | Customer | Seller | Admin | Super Admin |
|------|:--------:|:------:|:-----:|:-----------:|
| Storefront | ✓ | ✓ | ✓ | ✓ |
| Customer Account | ✓ | ✓ | ✓ | ✓ |
| Seller Dashboard | ✗ | ✓ | ✓ | ✓ |
| Admin Dashboard | ✗ | ✗ | ✓ | ✓ |
| Platform Settings | ✗ | ✗ | ✓ | ✓ |
| Audit Logs | ✗ | ✗ | ✗ | ✓ |

---

# 14. Mobile Navigation

## Customer

Bottom Navigation:

```text
Home

Search

Wishlist

Cart

Profile
```

---

## Seller

Bottom Navigation:

```text
Dashboard

Orders

Products

Analytics

More
```

---

# 15. Future Navigation

Reserved:

- Mobile App
- Public APIs
- App Marketplace
- Supplier Portal
- Warehouse Portal
- Support Portal

---

# 16. Acceptance Criteria

The information architecture is complete when:

- Every feature has a defined location.
- Every page belongs to one application.
- Routing is consistent.
- Permissions are enforced.
- Navigation is intuitive across desktop and mobile.

---

# Revision History

| Version | Date | Summary |
|--------:|------|---------|
| 1.0.0 | Initial Draft | Defined application hierarchy, routing, navigation, and page structure. |