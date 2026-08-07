# Document 04 — System Functional Specification (SFS)

**Project:** Project Loom *(Working Name)*  
**Document ID:** SFS-004  
**Version:** 1.0.0  
**Status:** Draft (Living Document)

---

# 1. Purpose

This document defines the functional capabilities of the platform.

Each module describes **what the system must do**, independent of implementation details.

---

# 2. Functional Modules

The platform consists of the following core modules:

1. Authentication & Identity
2. Customer Management
3. Seller Management
4. Store Management
5. Product Management
6. Catalog Management
7. Inventory Management
8. Search
9. Shopping Cart
10. Checkout
11. Orders
12. Payments
13. Shipping
14. Returns
15. Reviews
16. Coupons & Promotions
17. Seller Dashboard
18. Admin Dashboard
19. Analytics
20. Notifications
21. File Management
22. Settings

---

# 3. Authentication Module

## Purpose

Authenticate users securely.

## Functional Requirements

The system shall:

- Register users
- Login users
- Logout users
- Verify email addresses
- Reset passwords
- Refresh authentication tokens
- Support Google Sign-In
- Support role-based authentication
- Maintain active sessions
- Revoke compromised sessions

---

# 4. Customer Module

The system shall allow customers to:

- Manage profile
- Manage addresses
- Save payment methods (future)
- View order history
- Track shipments
- Manage wishlist
- Request returns
- Submit reviews
- Update notification preferences

---

# 5. Seller Module

The system shall allow sellers to:

- Register
- Complete verification
- Create a storefront
- Configure branding
- Select products
- Set retail pricing within limits
- Publish/unpublish products
- View commissions
- View payouts
- Access analytics
- Manage storefront settings

---

# 6. Store Module

Every storefront shall support:

- Custom logo
- Hero banner
- Theme configuration
- Homepage sections
- Collections
- Featured products
- About page
- Contact page
- Policies
- SEO metadata
- Unique subdomain

Future:

- Custom domains
- Blog
- Landing pages

---

# 7. Product Module

Administrators shall:

- Create products
- Archive products
- Restore products
- Upload media
- Configure variants
- Configure pricing
- Configure commission rules
- Configure inventory linkage

Products shall support:

- Multiple images
- Colors
- Sizes
- SKUs
- Tags
- Categories
- Collections
- Specifications

---

# 8. Catalog Module

The catalog shall:

- Organize products
- Manage categories
- Manage collections
- Control visibility
- Support featured products
- Support seasonal campaigns

Stores select products from the master catalog.

---

# 9. Inventory Module

The system shall:

- Track stock
- Reserve stock
- Release expired reservations
- Record adjustments
- Support multiple warehouses (future)
- Notify low stock
- Prevent overselling

---

# 10. Search Module

Customers shall search by:

- Product name
- Category
- Brand
- Collection
- Tags

Filters shall include:

- Price
- Size
- Color
- Availability
- Rating

---

# 11. Shopping Cart Module

Customers shall:

- Add items
- Remove items
- Update quantities
- Save cart
- View estimated totals
- Apply coupons
- Calculate shipping

---

# 12. Checkout Module

Checkout shall:

- Validate cart
- Validate inventory
- Validate address
- Calculate totals
- Calculate discounts
- Process payment
- Generate order

The checkout process should minimize friction while maintaining security.

---

# 13. Order Module

Orders shall support:

- Creation
- Status tracking
- Timeline
- Cancellation (policy-based)
- Invoice generation
- Shipment tracking
- Return initiation

Order statuses:

- Pending
- Confirmed
- Packed
- Shipped
- Delivered
- Completed
- Cancelled
- Returned

---

# 14. Payment Module

The payment module shall:

- Process online payments
- Handle payment failures
- Handle refunds
- Verify webhooks
- Record transactions
- Support multiple gateways through a provider abstraction layer

---

# 15. Shipping Module

The system shall:

- Generate shipments
- Assign courier
- Store tracking number
- Display shipment progress
- Estimate delivery dates

Future:

- Multi-warehouse routing
- Split shipments

---

# 16. Returns Module

Customers shall:

- Submit return requests
- Upload evidence (if required)
- Track return status

Administrators shall:

- Review requests
- Approve or reject returns
- Trigger refunds
- Update inventory based on return outcome

---

# 17. Review Module

Customers shall:

- Submit ratings
- Submit reviews
- Edit reviews (within policy)
- Upload review images (future)

Administrators shall moderate reported content.

---

# 18. Coupon Module

Administrators shall:

- Create coupons
- Configure eligibility
- Configure usage limits
- Configure validity dates
- Configure product/store restrictions

Customers shall:

- Apply valid coupons during checkout

---

# 19. Seller Dashboard

The dashboard shall display:

- Revenue
- Orders
- Pending commissions
- Eligible payouts
- Product performance
- Traffic
- Conversion rate
- Returns
- Best-selling products
- Notifications

The seller shall also manage:

- Store settings
- Product selection
- Pricing
- Branding

---

# 20. Admin Dashboard

Administrators shall manage:

- Sellers
- Products
- Orders
- Inventory
- Coupons
- Returns
- Payments
- Payouts
- Reports
- Notifications
- Platform settings

The dashboard shall include operational metrics and alerts.

---

# 21. Analytics Module

The system shall provide:

Customer Analytics

- Revenue
- Orders
- AOV

Seller Analytics

- Sales
- Commissions
- Conversion
- Product performance

Platform Analytics

- GMV
- Active sellers
- Active customers
- Return rate
- Payment success rate
- Inventory turnover

---

# 22. Notification Module

Supported channels:

- Email
- SMS
- In-App

Notification events include:

- Registration
- Order confirmation
- Shipment updates
- Delivery confirmation
- Return updates
- Payout completion
- Security alerts

---

# 23. File Management

The system shall:

- Upload images
- Optimize images
- Generate thumbnails
- Store files in object storage
- Serve optimized assets through the CDN

---

# 24. Settings Module

Administrators shall configure:

- Taxes
- Return policies
- Commission policies
- Feature flags
- Shipping rules
- Payment gateways
- Notification providers
- Platform branding

---

# 25. Non-Functional Requirements

Every module shall be:

- Responsive
- Accessible
- Secure
- Auditable
- Observable
- Scalable
- Fault tolerant
- Tested

---

# 26. Acceptance Criteria

The system is functionally complete when:

- Each module satisfies its defined responsibilities.
- Modules interact through documented interfaces.
- No module performs responsibilities owned by another module.
- All critical user journeys are fully supported.

---

# Revision History

| Version | Date | Summary |
|--------:|------|---------|
| 1.0.0 | Initial Draft | Defined all major functional modules and responsibilities. |