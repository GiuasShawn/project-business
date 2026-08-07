# BOOT-001 — Project Bootstrap Specification

**Project:** Project Loom

**Version:** 1.0.0

**Status:** Ready for Implementation

---

# 1. Objective

Bootstrap a production-grade monorepo that can scale from a single developer to a multi-team engineering organization without requiring structural rewrites.

The repository must be immediately usable for development, testing, CI/CD, and deployment.

---

# 2. Technology Stack

## Runtime

- Node.js 22 LTS

## Package Manager

- pnpm

## Workspace

- Turborepo

## Language

- TypeScript (strict mode)

---

# 3. Repository Layout

```text
project-loom/
│
├── apps/
│   ├── web/
│   ├── seller-dashboard/
│   ├── admin-dashboard/
│   ├── api/
│   ├── workers/
│   └── docs/
│
├── packages/
│   ├── config/
│   ├── database/
│   ├── auth/
│   ├── ui/
│   ├── validation/
│   ├── types/
│   ├── utils/
│   ├── logger/
│   ├── events/
│   ├── analytics/
│   └── api-client/
│
├── infrastructure/
├── docker/
├── tooling/
├── scripts/
├── docs/
└── .github/
```

---

# 4. Applications

## Web

Customer storefront.

---

## Seller Dashboard

Seller portal.

---

## Admin Dashboard

Platform administration.

---

## API

NestJS backend.

---

## Workers

BullMQ workers.

---

## Documentation

Internal documentation site.

---

# 5. Shared Packages

Every shared package must:

- have README
- have tests
- export typed APIs
- have independent build configuration
- avoid circular dependencies

---

# 6. TypeScript Standards

Strict mode enabled.

Disallow:

- any
- implicit any
- unused locals
- unused parameters

Path aliases configured from the workspace root.

---

# 7. Code Formatting

Formatter:

- Biome

Linting:

- Biome

Pre-commit:

- Husky
- lint-staged

---

# 8. Testing

Frameworks:

- Vitest
- Jest
- Playwright

Coverage target:

90%+

Business logic:

95%+

---

# 9. Git Strategy

Branches:

```text
main

develop

feature/*

fix/*

release/*
```

Merge strategy:

Squash merge.

Protected branches:

- main
- develop

---

# 10. Commit Convention

Conventional Commits.

Examples:

```text
feat(products): add product variants

fix(payments): prevent duplicate capture

refactor(auth): simplify guards

docs(api): update checkout endpoints
```

---

# 11. CI Pipeline

Every pull request must run:

- Install
- Typecheck
- Lint
- Unit Tests
- Integration Tests
- Build

Deployment only occurs after all checks pass.

---

# 12. Development Commands

Required scripts:

```text
pnpm dev

pnpm build

pnpm lint

pnpm typecheck

pnpm test

pnpm test:e2e

pnpm db:generate

pnpm db:migrate

pnpm db:seed

pnpm docs
```

---

# 13. Logging

Structured logging.

Pino.

Request correlation IDs enabled.

Sensitive data redacted.

---

# 14. Error Handling

Global exception handling.

Consistent API responses.

No stack traces in production.

---

# 15. Security

Mandatory:

- HTTPS
- CSP
- Helmet
- Rate limiting
- Input validation
- Output sanitization

---

# 16. Observability

Integrated from day one:

- Sentry
- OpenTelemetry
- Prometheus
- Grafana

---

# 17. Build Order

```text
config

↓

types

↓

validation

↓

database

↓

events

↓

logger

↓

auth

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

# 18. Acceptance Criteria

Bootstrap is complete when:

- Repository installs with one command.
- All applications build successfully.
- Shared packages resolve correctly.
- CI passes.
- Documentation site builds.
- Developers can begin implementing features immediately.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Defined the bootstrap specification for the Project Loom repository. |