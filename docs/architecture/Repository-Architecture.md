# REPO-001 — Monorepo Structure & Repository Architecture

**Project:** Project Loom

**Version:** 1.0.0

**Status:** Living Specification

---

# 1. Purpose

This document defines the complete repository structure for Project Loom.

Every source file, configuration file, package, application, and shared library shall follow this architecture.

---

# 2. Repository Philosophy

The repository shall be:

- Monorepo
- Type-safe
- Modular
- Scalable
- AI-friendly
- Independent packages
- Shared tooling
- Shared types
- Shared UI

Package manager:

```text id="qvjlwm"
pnpm
```

Workspace manager:

```text id="17owfv"
Turborepo
```

---

# 3. Root Structure

```text id="k8nt8y"
project-loom/

├── apps/
├── packages/
├── tooling/
├── docs/
├── scripts/
├── infrastructure/
├── docker/
├── .github/
├── .vscode/
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── biome.json
├── tsconfig.base.json
└── README.md
```

---

# 4. Applications

```text id="0g1z1g"
apps/

├── web/
├── seller-dashboard/
├── admin-dashboard/
├── api/
├── workers/
└── docs-site/
```

---

## apps/web

Public customer storefront.

Technology

- Next.js
- React
- Tailwind
- shadcn/ui

Responsibilities

- Shopping
- Checkout
- Customer Account
- Marketing Pages

---

## apps/seller-dashboard

Seller portal.

Responsibilities

- Products
- Analytics
- Branding
- Orders
- Payouts

---

## apps/admin-dashboard

Internal administration.

Responsibilities

- Inventory
- Products
- Sellers
- Reports
- Operations

---

## apps/api

NestJS application.

Contains

- Controllers
- Services
- Modules
- Repositories
- DTOs

---

## apps/workers

Background workers.

Contains

- BullMQ
- Email Workers
- Analytics Workers
- Search Workers
- Image Workers

---

## apps/docs-site

Internal documentation.

Technology

- Docusaurus or Fumadocs

Contains

- Architecture
- APIs
- ADRs
- Engineering Handbook

---

# 5. Shared Packages

```text id="26aqmd"
packages/

├── ui/
├── database/
├── auth/
├── types/
├── validation/
├── config/
├── utils/
├── api-client/
├── analytics/
├── logger/
├── events/
└── testing/
```

---

## ui

Shared React components.

Contains

- Buttons
- Forms
- Tables
- Dialogs
- Layouts

---

## database

Contains

- Drizzle Schema
- Migrations
- Seeders
- Database Client

---

## auth

Contains

- Better Auth
- RBAC
- Guards
- Helpers

---

## types

Shared TypeScript types.

No runtime code.

---

## validation

Shared Zod schemas.

---

## config

Shared configuration.

Examples

- Environment validation
- Feature flags
- Constants

---

## utils

Reusable utilities.

Pure functions only.

---

## api-client

Typed frontend SDK.

Generated from OpenAPI.

---

## analytics

Shared analytics tracking.

---

## logger

Pino wrapper.

---

## events

Domain event definitions.

Shared by API and Workers.

---

## testing

Shared mocks

Factories

Test utilities

---

# 6. Tooling

```text id="fihz5i"
tooling/

├── eslint/
├── prettier/
├── biome/
├── typescript/
├── commitlint/
└── husky/
```

---

# 7. Infrastructure

```text id="l34i6e"
infrastructure/

├── terraform/
├── kubernetes/
├── cloudflare/
├── postgres/
├── redis/
└── monitoring/
```

---

# 8. Scripts

```text id="63pk81"
scripts/

build

seed

generate

lint

release

backup

restore

benchmark
```

---

# 9. Documentation

```text id="dl2np0"
docs/

architecture

database

api

frontend

backend

security

operations

adr

runbooks

engineering
```

---

# 10. Environment Files

```text id="0m8j1x"
.env.example

.env.local

.env.development

.env.production
```

Secrets never committed.

---

# 11. Shared Configuration

One shared:

- tsconfig
- biome
- eslint
- prettier
- package versions

No duplication.

---

# 12. Import Rules

Allowed

```text id="81bzdc"
apps

↓

packages
```

Forbidden

```text id="l3v98t"
package A

↓

package B

↓

package A
```

No circular dependencies.

---

# 13. Package Ownership

Each package has:

- README
- Tests
- Version
- Changelog
- Maintainer

---

# 14. Build Order

```text id="yjlwmw"
types

↓

config

↓

validation

↓

database

↓

events

↓

auth

↓

logger

↓

utils

↓

api-client

↓

ui

↓

applications
```

---

# 15. Acceptance Criteria

Repository architecture is complete when:

- Every application has a single responsibility.
- Shared code lives in packages.
- Circular dependencies are impossible.
- Configuration is centralized.
- Documentation lives alongside implementation.
- The structure supports independent testing and deployment where appropriate.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Defined the monorepo structure and repository architecture. |