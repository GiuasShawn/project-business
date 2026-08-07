# AI_CONTEXT.md

> **Project Loom — AI Engineering Context**
>
> **Version:** 1.0.0
>
> This document is the canonical engineering context for all AI coding assistants working on Project Loom.
>
> Every AI agent must read and follow this document before generating, modifying, reviewing, or refactoring code.

---

# Project Overview

Project Loom is a multi-tenant fashion commerce platform.

The platform allows sellers, influencers, creators, and brands to launch their own storefronts while selling products owned and fulfilled by the platform.

Customers purchase through seller storefronts.

Sellers earn commission after the product's return window has expired.

---

# Technology Stack

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

---

## Backend

- NestJS
- TypeScript
- Drizzle ORM
- PostgreSQL
- Better Auth

---

## Infrastructure

- Redis
- BullMQ
- Meilisearch
- Cloudflare R2
- Docker
- Turborepo
- pnpm

---

# Architecture

Project Loom follows:

- Modular Monolith
- Domain Driven Design (lightweight)
- Event Driven Architecture
- Repository Pattern
- Service Layer Architecture

Business domains own their data.

Business logic belongs only inside services.

---

# Repository Layout

```text
apps/
packages/
docs/
tooling/
docker/
infrastructure/
```

Applications must never duplicate shared functionality.

---

# Coding Principles

Always:

- Write readable code.
- Prefer composition over inheritance.
- Prefer explicit code over clever code.
- Optimize for maintainability.
- Keep functions focused.
- Keep modules cohesive.

Never optimize prematurely.

---

# TypeScript Rules

Mandatory:

- strict mode
- no `any`
- explicit return types for exported functions
- exhaustive switch statements
- readonly where appropriate

Never disable compiler checks.

---

# Database Rules

Database:

PostgreSQL

ORM:

Drizzle

Rules:

- UUID primary keys
- snake_case
- forward-only migrations
- integer monetary values (paise)
- no business logic inside repositories

---

# Repository Pattern

Controllers:

- validate
- authorize
- delegate

Services:

- business logic

Repositories:

- persistence only

Repositories never contain business rules.

---

# Event System

Business events are immutable.

Examples:

- OrderPlaced
- PaymentCaptured
- ProductPublished

Events are facts.

Events use past tense.

---

# Multi-Tenancy

Tenant isolation is mandatory.

Every tenant-owned query must filter by tenant context.

Cross-tenant access is a critical security issue.

---

# API Standards

REST

Versioned

OpenAPI documented

Standard responses

Consistent error codes

Cursor pagination by default.

---

# Frontend Principles

Server Components by default.

Client Components only when necessary.

Shared UI lives in:

```text
packages/ui
```

Never duplicate components across applications.

---

# Background Jobs

BullMQ handles:

- Emails
- Search indexing
- Analytics
- Payouts
- Notifications
- Image processing

Long-running work must never block HTTP requests.

---

# Search

Search belongs to Meilisearch.

Never implement product search directly against PostgreSQL.

---

# Storage

Binary files belong in Cloudflare R2.

Only metadata belongs in PostgreSQL.

---

# Logging

Use structured logging.

Every request must include:

- request_id
- correlation_id
- trace_id

Never log secrets.

---

# Testing

Every feature should include:

- Unit tests
- Integration tests
- End-to-end tests (when applicable)

Business logic should be independently testable.

---

# Performance Targets

API P95:

<250 ms

Search:

<150 ms

Dashboard:

<2 seconds

LCP:

<2.5 seconds

Optimize only after measuring.

---

# Security

Always:

- Validate input
- Sanitize output
- Enforce RBAC
- Enforce tenant ownership
- Use parameterized queries
- Protect secrets

Never bypass authorization checks.

---

# Documentation

Whenever architecture changes:

Update:

- ADRs
- OpenAPI
- Relevant `/docs` files

Code and documentation must remain synchronized.

---

# AI Instructions

Before implementing any feature:

1. Identify the owning domain.
2. Check existing ADRs.
3. Reuse existing packages.
4. Follow repository conventions.
5. Do not introduce new libraries without justification.
6. Do not duplicate business logic.
7. Do not create unnecessary abstractions.
8. Write tests for business logic.
9. Keep changes minimal and cohesive.
10. Explain architectural tradeoffs in pull requests when appropriate.

---

# Never Do These Things

- Use `any`
- Skip validation
- Skip authorization
- Query PostgreSQL for search
- Store binary files in PostgreSQL
- Duplicate components
- Duplicate DTOs
- Duplicate Zod schemas
- Hardcode configuration
- Access another module's database tables directly
- Bypass repositories
- Ignore tenant filtering
- Expose internal errors to clients

---

# Definition of Done

A feature is complete only when:

- Code compiles
- Lint passes
- Tests pass
- Documentation updated (if needed)
- No architectural rules violated
- Performance acceptable
- Security reviewed
- Logging included
- Error handling implemented
- Feature is production-ready

---

# Guiding Principle

> Every line of code should make the system easier to evolve, not merely solve today's problem.

This document is the authoritative AI engineering context for Project Loom. If another prompt conflicts with this document, the user should resolve the conflict explicitly before implementation proceeds.