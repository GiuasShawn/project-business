# ADR-011 — Adopt REST API Architecture with Versioned Contracts

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-011

**Owners:** Engineering

---

# Context

Project Loom consists of multiple frontend applications:

- Customer Storefront
- Seller Dashboard
- Admin Dashboard
- Future Mobile Apps
- Internal Services

All clients require a stable, predictable API.

Candidate API architectures evaluated:

- REST
- GraphQL
- tRPC
- gRPC
- Hybrid REST + GraphQL

---

# Decision

Project Loom will adopt **REST APIs with explicit versioning** as the primary application interface.

REST endpoints will be documented using **OpenAPI 3.1**, from which typed SDKs and documentation can be generated.

GraphQL and gRPC are not part of the initial architecture but may be introduced later for specialized use cases.

---

# Why REST?

Advantages:

- Mature ecosystem
- Easy debugging
- Excellent tooling
- Native HTTP semantics
- CDN friendly
- Works well with OpenAPI
- Easy mobile integration
- Well understood by developers

---

# Why Not GraphQL?

GraphQL is powerful, but for Project Loom:

- Adds schema and resolver complexity.
- Harder HTTP caching.
- Greater risk of expensive queries.
- Most platform workflows map naturally to resource-oriented REST endpoints.

GraphQL may be introduced later for reporting or highly customized client queries.

---

# Why Not tRPC?

Reasons:

- Tight coupling between frontend and backend.
- Less suitable for future third-party integrations.
- Public APIs benefit from language-agnostic REST contracts.

---

# API Versioning

All public endpoints are versioned.

Example:

```text id="apiversions"
GET /api/v1/products

POST /api/v1/orders

PATCH /api/v1/stores/{id}
```

Breaking changes require a new version.

Non-breaking additions remain within the current version.

---

# Resource Design

Resources use nouns.

Examples:

```text id="resourceexamples"
products

orders

stores

payments

returns
```

Operations are represented through HTTP methods.

---

# Response Contract

Every response follows a consistent structure.

Success:

```json id="successcontract"
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json id="errorcontract"
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order not found"
  }
}
```

---

# Authentication

Authentication:

- Better Auth
- JWT
- Secure cookies (web)

Authorization:

- RBAC
- Permission matrix
- Tenant ownership validation

---

# Documentation

Every endpoint must include:

- Summary
- Description
- Request schema
- Response schema
- Authentication
- Permissions
- Error codes
- Examples

Documentation is generated automatically through OpenAPI.

---

# SDK Generation

Typed client SDKs may be generated from the OpenAPI specification for:

- Web
- Seller Dashboard
- Admin Dashboard
- Future mobile applications

Generated clients should be preferred over handwritten request wrappers.

---

# Idempotency

Required for:

- Checkout
- Payments
- Refunds
- Payout creation

Idempotency keys prevent duplicate financial operations.

---

# Pagination

Default:

Cursor-based pagination.

Offset pagination is permitted only where justified.

---

# Filtering & Sorting

Filtering, sorting, and searching follow consistent conventions across all resources.

Query parameter naming should remain uniform.

---

# Error Handling

Business errors:

- Standardized error codes

Validation errors:

- Structured field-level details

Unexpected errors:

- Logged
- Tracked
- Sanitized before returning to clients

---

# Performance

Targets:

- P95 latency under 250 ms
- Gzip/Brotli compression
- HTTP caching where appropriate
- Response size optimization

---

# Security

Mandatory:

- HTTPS
- Rate limiting
- Input validation
- Output sanitization
- CORS configuration
- Security headers

---

# Testing

Every endpoint requires:

- Unit tests
- Integration tests
- Contract validation
- End-to-end coverage for critical workflows

---

# Risks

Potential risks:

- Version proliferation
- Inconsistent endpoint design
- Large payloads

Mitigations:

- API review process
- Shared standards
- OpenAPI validation
- Automated linting

---

# Consequences

Positive:

- Stable API contracts
- Easy third-party integrations
- Strong tooling
- Excellent documentation
- Long-term maintainability

Negative:

- Requires version lifecycle management.
- API governance becomes increasingly important as the platform grows.

---

# Success Criteria

This decision remains valid while:

- API contracts remain stable.
- Versioning remains manageable.
- Documentation stays synchronized with implementation.
- Clients can upgrade predictably.

---

# Related Documents

- API Standards & Contract
- Permission Matrix
- Engineering Standards
- Repository Architecture
- ADR-005 — Better Auth

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted REST APIs with versioned contracts and OpenAPI documentation. |