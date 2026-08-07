# API-001 — REST API Standards & Contract

**Project:** Project Loom  
**Version:** 1.0.0  
**Status:** Living Specification

---

# 1. Purpose

This document defines the standards for every REST API in Project Loom.

All endpoints must follow these conventions regardless of module.

---

# 2. Base URL

Development

```text
http://localhost:3001/api/v1
```

Production

```text
https://api.projectloom.com/v1
```

---

# 3. API Versioning

All endpoints are versioned.

Example

```text
/v1/products
/v1/orders
/v1/stores
```

Breaking changes require a new API version.

---

# 4. Authentication

Authentication uses:

- Better Auth
- JWT Access Token
- Refresh Token
- Secure HTTP-only cookies (Web)

Authorization uses:

- RBAC
- Ownership validation
- Permission matrix

---

# 5. Resource Naming

Resources use plural nouns.

Correct

```text
GET /products
POST /orders
PATCH /stores/{id}
DELETE /wishlists/{id}
```

Never use verbs.

Incorrect

```text
/createOrder
/getProducts
/deleteStore
```

---

# 6. HTTP Methods

GET

Read

POST

Create

PATCH

Partial update

PUT

Full replacement (rare)

DELETE

Delete/archive

---

# 7. Standard Success Response

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

---

# 8. Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

# 9. Pagination

Cursor-based pagination by default.

```text
GET /products?cursor=abc123&limit=20
```

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "nextCursor": "...",
    "hasMore": true
  }
}
```

Maximum page size:

100

---

# 10. Filtering

Example

```text
GET /products

?category=shirts

&color=black

&size=L

&price_min=500

&price_max=1500
```

---

# 11. Sorting

```text
sort=price

order=asc
```

Supported:

- newest
- oldest
- price
- rating
- popularity
- relevance

---

# 12. Search

```text
GET /search?q=oversized+tshirt
```

Powered by Meilisearch.

---

# 13. Idempotency

Required for:

- Payment creation
- Checkout
- Refunds
- Payouts

Uses:

```text
Idempotency-Key
```

header.

---

# 14. Rate Limiting

Public

100 requests/minute

Authenticated

300 requests/minute

Admin

1000 requests/minute

Configurable.

---

# 15. Status Codes

200 OK

201 Created

202 Accepted

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# 16. File Uploads

Images upload through dedicated endpoints.

Files are stored in Cloudflare R2.

The API returns metadata and public asset URLs rather than binary content.

---

# 17. Dates & Time

All timestamps use ISO 8601 UTC.

Example

```text
2026-08-07T14:35:27Z
```

---

# 18. Monetary Values

All monetary amounts use integer paise.

Example

```json
{
  "price": 99999
}
```

---

# 19. API Documentation

Every endpoint must include:

- Summary
- Description
- Authentication
- Permissions
- Request schema
- Response schema
- Error codes
- Examples

Generated through OpenAPI.

---

# 20. Acceptance Criteria

Every endpoint:

- Follows naming conventions.
- Returns standard responses.
- Uses correct HTTP verbs.
- Enforces permissions.
- Is documented in OpenAPI.
- Includes automated tests.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established global REST API standards. |