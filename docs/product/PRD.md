# Document 01 — Product Requirements Document (PRD)

**Project:** Project Loom *(Working Name)*  
**Document ID:** PRD-001  
**Version:** 1.0.0  
**Status:** Draft (Living Document)

---

# 1. Executive Summary

Project Loom is a multi-tenant fashion commerce platform that allows businesses to manufacture and manage products centrally while enabling creators, influencers, entrepreneurs, and brands to launch their own branded online clothing stores without inventory investment.

Unlike traditional affiliate programs, sellers operate complete branded storefronts under their own subdomain, select products from a shared catalog, set their own retail pricing within configurable limits, promote their store, and receive commissions on successful sales.

The platform manages inventory, payments, logistics, returns, settlements, analytics, and payouts.

---

# 2. Problem Statement

Launching a fashion brand requires:

- Manufacturing
- Inventory investment
- Warehousing
- Packaging
- Shipping
- Payment processing
- Customer support
- Return management
- Website development
- Marketing infrastructure

These requirements create a high barrier to entry.

The platform removes these barriers while allowing creators to focus on branding, audience growth, and sales.

---

# 3. Vision

Become the operating system for creator-led fashion brands by combining:

- Shopify's storefront experience
- Meesho's fulfillment model
- Myntra's shopping experience
- Enterprise analytics
- Automated seller payouts

---

# 4. Goals

## Business Goals

- Enable anyone to launch a fashion store within minutes.
- Increase product sales through creator distribution.
- Maintain centralized inventory.
- Automate payouts and commissions.
- Build a scalable marketplace infrastructure.

---

## User Goals

Customers should be able to:

- Discover products easily.
- Purchase securely.
- Track orders.
- Request returns.

Sellers should be able to:

- Create a branded store.
- Choose products.
- Monitor performance.
- Receive payouts.

Administrators should be able to:

- Manage inventory.
- Manage sellers.
- Process returns.
- Monitor business performance.

---

# 5. Non-Goals (Version 1)

The first release will NOT include:

- Multiple manufacturers
- Third-party supplier onboarding
- Marketplace seller-to-seller trading
- Wholesale ordering
- Physical retail POS
- Native mobile applications
- AI-generated clothing designs
- International logistics
- Cryptocurrency payments

These may be introduced in later versions.

---

# 6. User Roles

## Customer

Purchases products.

---

## Seller

Operates a branded storefront.

Selects products.

Earns commissions.

Views analytics.

Requests payouts.

---

## Administrator

Manages:

- Products
- Sellers
- Orders
- Inventory
- Pricing
- Returns
- Coupons
- Reports
- Settings

---

## Super Administrator

Platform owner with unrestricted access.

---

# 7. Core Platform Modules

- Authentication
- Customer Storefront
- Seller Dashboard
- Admin Dashboard
- Product Catalog
- Inventory
- Cart
- Checkout
- Payments
- Orders
- Returns
- Reviews
- Notifications
- Search
- Analytics
- Payouts
- Coupons
- Settings

---

# 8. Primary User Flow

## Seller

1. Register.
2. Verify identity.
3. Create store.
4. Choose subdomain.
5. Customize branding.
6. Select products.
7. Publish storefront.
8. Share storefront.
9. Receive orders.
10. Track commissions.
11. Receive payouts.

---

## Customer

1. Visit storefront.
2. Browse products.
3. Search/filter.
4. View product details.
5. Add to cart.
6. Checkout.
7. Track order.
8. Receive delivery.
9. Leave review or request return.

---

## Admin

1. Add products.
2. Update inventory.
3. Process orders.
4. Manage returns.
5. Approve sellers.
6. Release payouts.
7. Monitor analytics.

---

# 9. Business Model

Revenue sources:

- Product margin
- Seller commissions
- Premium seller subscriptions (future)
- Advertising placements (future)
- Platform services (future)

---

# 10. Store Model

Each seller receives:

- Unique subdomain
- Branding
- Logo
- Hero banners
- Product collection
- About page
- Contact page
- Policies
- Analytics dashboard

Future versions may support custom domains.

---

# 11. Product Model

Every product contains:

- Images
- Variants
- Sizes
- Colors
- SKU
- Inventory
- Cost price
- Base selling price
- Maximum commission
- Shipping information
- Return policy

One master product may appear in thousands of storefronts.

---

# 12. Commission Model

Each product defines:

- Base cost
- Maximum retail price
- Commission structure

Example:

- Platform Price: ₹999
- Seller Price: ₹1,199
- Seller Commission: ₹200

The platform automatically calculates commissions during order processing.

---

# 13. Inventory Model

Inventory remains centralized.

Stores do not own inventory.

Orders reduce global inventory.

Inventory updates appear across all storefronts immediately.

---

# 14. Payout Model

Order Lifecycle:

Placed

↓

Paid

↓

Packed

↓

Shipped

↓

Delivered

↓

Return Window

↓

Eligible for Settlement

↓

Seller Paid

Payouts shall never occur before the return period expires.

---

# 15. Functional Requirements

The platform shall support:

- User registration
- Seller onboarding
- Product browsing
- Product search
- Product filtering
- Shopping cart
- Checkout
- Online payments
- Order tracking
- Returns
- Reviews
- Wishlist
- Coupons
- Notifications
- Seller analytics
- Admin management
- Commission tracking
- Automated settlements

---

# 16. Non-Functional Requirements

The system shall be:

- Highly available
- Secure
- Responsive
- Mobile-first
- SEO optimized
- Horizontally scalable
- Fault tolerant
- Observable
- Maintainable

---

# 17. Success Metrics

Business

- Monthly Gross Merchandise Value (GMV)
- Total revenue
- Active sellers
- Active customers
- Average Order Value (AOV)
- Customer Acquisition Cost (CAC)
- Seller retention

Technical

- 99.9% uptime
- API latency
- Error rate
- Checkout success rate
- Payment success rate
- Search latency

---

# 18. Future Roadmap

## Phase 1

- Marketplace
- Seller stores
- Analytics
- Commissions
- Payouts

---

## Phase 2

- Custom domains
- Email marketing
- Discount engine
- Loyalty points
- Referral program

---

## Phase 3

- Multiple suppliers
- Warehouses
- Mobile applications
- International shipping
- AI-powered recommendations

---

## Phase 4

- Public APIs
- App marketplace
- Third-party integrations
- ERP integrations
- Multi-currency support

---

# 19. Risks

Business

- Inventory forecasting
- Seller fraud
- High return rates

Technical

- Payment failures
- Inventory synchronization
- Scaling bottlenecks
- Data consistency
- Security vulnerabilities

Operational

- Logistics delays
- Customer support load
- Warehouse capacity

---

# 20. Acceptance Criteria (MVP)

The MVP is considered complete when:

- Sellers can register and create a storefront.
- Sellers can publish products from the central catalog.
- Customers can browse and purchase products.
- Orders are processed successfully.
- Inventory updates automatically.
- Seller commissions are calculated correctly.
- Payouts are released after the return window.
- Admins can manage products, sellers, orders, and inventory.
- Analytics accurately reflect sales and commissions.
- The platform supports the target scalability defined in the Master Engineering Bible.

---

# Revision History

| Version | Date | Summary |
|--------:|------|---------|
| 1.0.0 | Initial Draft | Initial Product Requirements Document. |