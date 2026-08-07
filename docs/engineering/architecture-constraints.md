# Architecture Constraints

> **Project:** Project Loom
>
> **Status:** Frozen (2026-08-07)
>
> **Purpose:** Non-negotiable architectural rules that must be enforced throughout implementation.

---

## Module Isolation

- Domain modules **never** import each other directly.
- Communication between domains occurs **only** through public interfaces or events.
- Cross-module data access is **prohibited** — use the repository pattern.

---

## Layered Architecture

- Controllers contain **no business logic** — they validate, authorize, and delegate.
- Services **never** access the database directly — they use repositories.
- Repositories are the **only** persistence layer.

---

## Shared Packages

- Shared packages remain **framework-agnostic**.
- No NestJS, Next.js, or React dependencies in shared packages.

---

## Dependency Management

- **No circular dependencies** between modules or packages.
- Dependency direction must flow inward (domain → shared, never reverse).

---

## API Standards

- Every public API change **updates OpenAPI**.
- All endpoints follow REST conventions (ADR-011).
- Versioning is mandatory for breaking changes.

---

## TypeScript

- **Strict TypeScript only** — no exceptions.
- **No `any`** unless explicitly justified and documented.
- Explicit return types for all exported functions.

---

## Multi-Tenancy

- Every tenant-owned query **must** filter by tenant context.
- Cross-tenant access is a **critical security violation**.

---

## Event System

- Business events are **immutable**.
- Events use **past tense** (e.g., `OrderPlaced`, `PaymentCaptured`).
- Events are **facts**, not commands.

---

*Document frozen on 2026-08-07. Changes require a new ADR.*
