# Document 03 — Business Rules Specification

**Project:** Project Loom *(Working Name)*  
**Document ID:** BRS-003  
**Version:** 1.0.0  
**Status:** Draft (Living Document)

---

# 1. Purpose

This document defines the business rules governing every operation within the platform.

Business rules are mandatory and override implementation details.

All backend services, APIs, database constraints, frontend validation, and automated tests shall conform to these rules.

---

# 2. General Rules

- Every entity shall have a globally unique UUID.
- All timestamps shall be stored in UTC.
- All monetary values shall be stored in the smallest currency unit (e.g., paise).
- No destructive database operations shall occur without authorization.
- Every critical action shall be auditable.

---

# 3. User Rules

### Registration

- Email must be unique.
- Phone number must be unique (if required).
- Email verification is mandatory before seller activation.
- Passwords are never stored in plaintext.

### Accounts

- One account may own multiple roles.
- Users may be Customers, Sellers, Admins, or Super Admins.
- Suspended users cannot authenticate.

---

# 4. Seller Rules

- Every seller must own exactly one primary store in Version 1.
- Seller names are unique.
- Store subdomains are globally unique.
- Sellers cannot access another seller's data.
- Sellers only see products assigned to their own storefront.
- Sellers cannot directly modify master product information.
- Sellers cannot modify global inventory.

---

# 5. Store Rules

Every store shall contain:

- Branding
- Logo
- Banner
- Policies
- Contact Information
- Product Collection

Stores may customize:

- Retail pricing (within platform limits)
- Product visibility
- Theme
- Homepage layout

Stores may not:

- Delete master products
- Edit global specifications
- Modify inventory
- Modify order history

---

# 6. Product Rules

Master products are owned by the platform.

Every product must contain:

- SKU
- Name
- Description
- Images
- Variant information
- Pricing
- Inventory linkage

Products cannot be published without:

- Images
- Price
- Inventory
- Category

Deleted products become archived rather than permanently removed.

---

# 7. Pricing Rules

Each product defines:

- Cost Price
- Base Selling Price
- Maximum Allowed Retail Price
- Commission Structure

Seller pricing:

- Must not be below the minimum allowed price.
- Must not exceed the maximum allowed price.
- Must comply with platform pricing policies.

Commission is calculated automatically.

---

# 8. Inventory Rules

Inventory is global.

Inventory belongs to the platform.

Rules:

- Inventory decreases only after successful order confirmation.
- Inventory is reserved during checkout.
- Expired reservations return to stock automatically.
- Inventory cannot become negative.
- Every stock adjustment is logged.

---

# 9. Cart Rules

Customers may:

- Add products
- Remove products
- Update quantities

Cart validation occurs during checkout.

Unavailable products cannot be purchased.

---

# 10. Order Rules

Order creation requires:

- Valid customer
- Valid payment method
- Available inventory
- Valid shipping address

Order status progression:

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

Orders cannot move backward except through approved administrative workflows.

---

# 11. Payment Rules

Payments require:

- Successful authorization
- Fraud validation
- Gateway confirmation

Failed payments never create completed orders.

Refunds require:

- Valid return
- Refund eligibility
- Approved workflow

---

# 12. Return Rules

Returns require:

- Delivered order
- Active return window
- Eligible product

Returns may be:

- Approved
- Rejected
- Cancelled

Completed returns update inventory according to platform policy.

---

# 13. Commission Rules

Commission is calculated per order item.

Commission depends on:

- Selling Price
- Base Price
- Commission Policy

Commission remains pending until:

- Delivery completed
- Return window expires

Returns automatically reduce pending commissions.

---

# 14. Payout Rules

Seller payouts require:

- Verified seller
- Valid bank account
- Eligible balance
- Completed settlement cycle

Pending commissions cannot be withdrawn.

Every payout generates an immutable transaction record.

---

# 15. Coupon Rules

Coupons may define:

- Expiry
- Usage limits
- Product restrictions
- Store restrictions
- Customer restrictions

Expired coupons are invalid.

Coupons never reduce platform revenue below configured limits.

---

# 16. Review Rules

Reviews require:

- Verified purchase
- Delivered order

Each customer may review a product once per completed order unless platform policy allows updates.

Platform administrators may moderate or remove reviews that violate content guidelines.

---

# 17. Analytics Rules

Analytics are read-only.

Analytics shall never modify business data.

Metrics include:

- Revenue
- Orders
- Conversion
- Returns
- Commission
- Inventory Performance

Analytics may be delayed due to asynchronous processing.

---

# 18. Search Rules

Search indexes shall include:

- Active products
- Categories
- Collections

Archived or unavailable products shall not appear in customer search results.

Search updates occur asynchronously after product changes.

---

# 19. Notification Rules

Notifications include:

- Email
- SMS
- In-App

Notifications are asynchronous.

Notification failures must never interrupt user workflows.

---

# 20. Permission Rules

### Customers

- Manage their own profile
- Place orders
- Track orders
- Submit reviews
- Request returns

### Sellers

- Manage their own storefront
- Select products
- View analytics
- View orders related to their store
- Request payouts

### Admins

- Manage products
- Manage inventory
- Manage sellers
- Process returns
- Release payouts
- Configure platform settings

### Super Admins

- Unrestricted access

---

# 21. Fraud Prevention Rules

The platform may automatically flag:

- Excessive returns
- Suspicious login activity
- Duplicate accounts
- Payment anomalies
- Coupon abuse
- Automated bot behavior

Flagged accounts may require manual review before further activity.

---

# 22. Audit Rules

The following actions must always be recorded:

- Login
- Password changes
- Seller approval
- Product creation
- Inventory adjustment
- Order status change
- Payment events
- Refunds
- Payouts
- Permission changes

Audit logs are immutable.

---

# 23. Data Integrity Rules

- Foreign keys must remain valid.
- No orphaned records.
- Soft deletion only where explicitly supported.
- Referential integrity enforced at the database level.
- Every financial transaction must be traceable.

---

# 24. Error Handling Rules

The system shall:

- Fail gracefully.
- Never expose sensitive internal information.
- Return consistent API error structures.
- Log all unexpected failures.
- Retry asynchronous operations where appropriate.

---

# 25. Acceptance Criteria

The platform is compliant when:

- Every workflow follows these business rules.
- No unauthorized operation can bypass defined permissions.
- Financial calculations remain deterministic and auditable.
- Inventory, orders, commissions, and payouts remain internally consistent under concurrent operations.

---

# Revision History

| Version | Date | Summary |
|--------:|------|---------|
| 1.0.0 | Initial Draft | Established the core business rules governing platform behavior. |