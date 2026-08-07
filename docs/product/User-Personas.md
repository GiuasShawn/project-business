# Document 02 — Domain Model & Bounded Contexts

**Project:** Project Loom *(Working Name)*  
**Document ID:** DOM-002  
**Version:** 1.0.0  
**Status:** Draft (Living Document)

---

# 1. Purpose

This document defines the business domains of Project Loom.

Each domain represents an independent business capability with clearly defined responsibilities, ownership, and data boundaries.

All backend modules, APIs, database tables, events, and services shall follow these boundaries.

---

# 2. Domain-Driven Design Principles

The platform shall follow the following principles:

- High cohesion
- Low coupling
- Clear ownership
- Event-driven communication
- Explicit boundaries
- Shared language across engineering and business

Each domain owns its own:

- Business rules
- Services
- Events
- Data models
- Validation
- APIs
- Tests

---

# 3. Domain Map

```text
Platform
│
├── Identity & Access
├── Users
├── Stores
├── Products
├── Inventory
├── Catalog
├── Orders
├── Payments
├── Payouts
├── Shipping
├── Returns
├── Reviews
├── Coupons
├── Search
├── Analytics
├── Notifications
├── Files
├── Settings
└── Administration
```

---

# 4. Domain Definitions

## Identity & Access

Responsible for:

- Registration
- Login
- Sessions
- JWT
- Refresh Tokens
- Password Reset
- MFA (Future)
- Email Verification
- Permissions
- Roles

Owns:

- Authentication
- Authorization

---

## Users

Responsible for:

- User Profiles
- Addresses
- Preferences
- Contact Information
- Saved Payment Methods
- Wishlist Ownership

---

## Stores

Responsible for:

- Seller Stores
- Branding
- Logos
- Themes
- Subdomains
- Store Settings
- Policies
- Custom Pages

Each seller owns exactly one primary store in Version 1.

---

## Products

Responsible for:

- Master Products
- Variants
- Sizes
- Colors
- Images
- Product Metadata
- Specifications
- Pricing Rules

Products are platform-owned.

---

## Catalog

Responsible for:

- Collections
- Categories
- Product Visibility
- Seller Product Selection
- Featured Products
- Merchandising

The Catalog determines **which products appear in each storefront**.

It does **not** own product data.

---

## Inventory

Responsible for:

- Global Stock
- Warehouses
- Reservations
- Availability
- Stock Adjustments

Inventory exists once globally.

Stores never duplicate inventory.

---

## Orders

Responsible for:

- Cart Conversion
- Order Creation
- Order Status
- Order Items
- Order History
- Order Timeline

Orders never process payments directly.

---

## Payments

Responsible for:

- Payment Authorization
- Payment Capture
- Refunds
- Payment Gateways
- Webhooks
- Transaction History

Payments never calculate commissions.

---

## Payouts

Responsible for:

- Commission Calculation
- Settlement
- Seller Earnings
- Pending Balance
- Withdrawable Balance
- Payout History

Payouts depend on:

- Orders
- Returns
- Payment Status

---

## Shipping

Responsible for:

- Shipment Creation
- Courier Integration
- Tracking Numbers
- Delivery Status

---

## Returns

Responsible for:

- Return Requests
- Approval Workflow
- Return Window
- Refund Eligibility
- Return Status

Returns determine payout eligibility.

---

## Reviews

Responsible for:

- Ratings
- Reviews
- Images
- Moderation

Only verified purchases may leave reviews.

---

## Coupons

Responsible for:

- Coupons
- Promotions
- Discount Rules
- Eligibility
- Campaigns

---

## Search

Responsible for:

- Product Search
- Store Search
- Suggestions
- Filters
- Ranking

Uses Meilisearch.

---

## Analytics

Responsible for:

- Dashboard Metrics
- Sales Reports
- Seller Analytics
- Revenue
- Conversion
- Product Performance

Analytics is read-only.

It never changes business data.

---

## Notifications

Responsible for:

- Email
- SMS
- Push Notifications
- In-App Notifications

Notifications are asynchronous.

---

## Files

Responsible for:

- Image Uploads
- Image Optimization
- Asset Storage
- CDN URLs

Files are stored in Cloudflare R2.

---

## Settings

Responsible for:

- Platform Configuration
- Feature Flags
- Tax Rules
- Return Policies
- Commission Configuration

---

## Administration

Responsible for:

- Admin Dashboard
- Seller Management
- Product Management
- Moderation
- Reports
- Platform Operations

---

# 5. Domain Relationships

```text
Identity
      │
      ▼
Users
      │
      ▼
Stores
      │
      ▼
Catalog
      │
      ▼
Products
      │
      ▼
Inventory
      │
      ▼
Orders
      │
 ┌────┴────┐
 ▼         ▼
Payments Returns
      │
      ▼
Payouts
```

---

# 6. Ownership Rules

| Domain | Owns |
|---------|------|
| Identity | Authentication |
| Users | User Profiles |
| Stores | Seller Storefronts |
| Products | Product Data |
| Catalog | Product Visibility |
| Inventory | Stock |
| Orders | Orders |
| Payments | Transactions |
| Returns | Return Lifecycle |
| Payouts | Seller Earnings |
| Analytics | Reports |
| Notifications | Communication |

No two domains shall own the same business responsibility.

---

# 7. Event Communication

Domains communicate through events.

Examples:

OrderPlaced

↓

InventoryReserved

↓

PaymentCaptured

↓

CommissionCalculated

↓

AnalyticsUpdated

↓

SellerNotified

↓

PayoutScheduled

No domain should directly modify another domain's internal state.

---

# 8. Cross-Domain Rules

- Products never modify inventory directly.
- Inventory never creates orders.
- Orders never calculate payouts.
- Payments never update analytics directly.
- Analytics never modify business data.
- Notifications never block user requests.
- Returns determine settlement eligibility.
- Stores never own inventory.
- Catalog controls visibility, not ownership.

---

# 9. Future Domains

Reserved for future expansion:

- Marketplace Suppliers
- Warehouses
- Loyalty
- Referrals
- Marketing Automation
- Public APIs
- Mobile Services
- AI Services
- ERP Integration

These domains must remain independent when introduced.

---

# 10. Acceptance Criteria

The architecture is compliant when:

- Every business capability belongs to exactly one domain.
- Cross-domain communication uses defined interfaces or events.
- No circular dependencies exist.
- Business logic resides within its owning domain.
- Future domains can be added without restructuring existing domains.

---

# Revision History

| Version | Date | Summary |
|--------:|------|---------|
| 1.0.0 | Initial Draft | Defined business domains and bounded contexts for Project Loom. |