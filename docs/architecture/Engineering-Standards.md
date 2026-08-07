# Document 07 — Engineering Standards & Architecture Contract

**Project:** Project Loom *(Working Name)*  
**Document ID:** ENG-007  
**Version:** 1.0.0  
**Status:** Living Specification

---

# 1. Purpose

This document defines the engineering standards that every piece of software in Project Loom must follow.

No module, API, database table, UI component, background worker, or AI-generated code may violate these standards.

---

# 2. Engineering Principles

Every implementation shall prioritize:

1. Correctness
2. Maintainability
3. Readability
4. Performance
5. Scalability
6. Security
7. Developer Experience
8. Testability

---

# 3. Source of Truth

Every piece of data has exactly one owner.

Examples:

- Product data → Products Domain
- Inventory → Inventory Domain
- Payments → Payments Domain
- Orders → Orders Domain
- Analytics → Analytics Domain

No duplicate ownership.

---

# 4. Layered Architecture

Every backend module follows:

```text
Controller
↓

DTO Validation

↓

Service

↓

Repository

↓

Database
```

Business logic is only permitted inside the **Service** layer.

---

# 5. Dependency Rules

Allowed:

```text
Controller → Service

Service → Repository

Repository → Database
```

Forbidden:

- Controller → Database
- Controller → Repository
- Repository → Service
- Service → Controller

No circular dependencies.

---

# 6. API Standards

Every endpoint shall:

- Return JSON.
- Use HTTPS.
- Be versioned.
- Use UUID identifiers.
- Validate input.
- Return typed responses.
- Return standardized errors.
- Support pagination where appropriate.

---

# 7. Database Standards

Every table shall contain:

- id
- created_at
- updated_at

Where required:

- deleted_at
- created_by
- updated_by

No table may omit audit fields without justification.

---

# 8. UUID Policy

Every primary key:

- UUID v7 (preferred) or UUID v4
- Never sequential integers
- Immutable after creation

---

# 9. Naming Standards

## Database

Tables

```text
snake_case
plural
```

Example:

```text
seller_products
```

Columns

```text
snake_case
```

Foreign Keys

```text
product_id
store_id
user_id
```

---

## TypeScript

Classes

```text
PascalCase
```

Interfaces

```text
PascalCase
```

Functions

```text
camelCase
```

Variables

```text
camelCase
```

Constants

```text
UPPER_SNAKE_CASE
```

Files

```text
kebab-case.ts
```

---

# 10. API Naming

Resources are nouns.

Correct:

```text
GET /products

POST /orders

PATCH /stores/{id}
```

Avoid:

```text
/getProducts

/createOrder
```

---

# 11. Error Handling

Every API returns:

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

Never expose:

- SQL errors
- Stack traces
- Internal implementation details

---

# 12. Event Standards

Events are immutable.

Naming:

```text
OrderPlaced

PaymentCaptured

InventoryReserved

ReturnApproved

PayoutCompleted
```

Past tense only.

---

# 13. Logging

Log:

- Requests
- Errors
- Queue jobs
- Payment events
- Authentication
- Background workers

Never log:

- Passwords
- Tokens
- Card data
- OTPs
- Secrets

---

# 14. Security

Mandatory:

- HTTPS
- JWT Rotation
- Secure Cookies
- Rate Limiting
- CSRF Protection (where applicable)
- CSP Headers
- Input Validation
- Output Sanitization

---

# 15. Performance Budgets

API Response

- P95 < 250 ms

Search

- < 150 ms

Dashboard

- < 2 seconds

Largest Contentful Paint

- < 2.5 seconds

---

# 16. Background Jobs

Any task longer than approximately one second should be evaluated for asynchronous processing.

Examples:

- Emails
- Payouts
- Analytics
- Image Processing
- Search Indexing

---

# 17. Caching

Cache only data that is:

- Frequently read
- Rarely written
- Safe to invalidate

Never cache:

- Authentication state
- Payment status
- Inventory mutations
- Security decisions

---

# 18. Transactions

Database transactions are required for:

- Checkout
- Payment capture
- Refunds
- Payouts
- Inventory reservation
- Order creation

---

# 19. Testing Requirements

Every feature must include:

- Unit tests
- Integration tests
- End-to-end tests (where applicable)

Business logic coverage target:

≥ 90%

---

# 20. AI Coding Contract

AI-generated code must:

- Follow existing architecture.
- Reuse existing services.
- Reuse components.
- Reuse DTOs.
- Never duplicate business logic.
- Never create unnecessary abstractions.
- Preserve backward compatibility unless explicitly approved.
- Include appropriate tests for new business logic.

---

# 21. Code Review Checklist

Every pull request should verify:

- Architecture compliance
- Naming compliance
- Security review
- Performance considerations
- Error handling
- Logging
- Tests
- Documentation updates

---

# 22. Acceptance Criteria

Engineering standards are satisfied when:

- Every module follows the defined architecture.
- No forbidden dependencies exist.
- APIs remain consistent.
- Database conventions are respected.
- AI-generated code conforms to the same standards as manually written code.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established engineering standards and architecture contract. |