# Project Loom

**Multi-Tenant Fashion Commerce Platform**

Project Loom is a multi-tenant fashion commerce platform that enables sellers, influencers, creators, and brands to launch their own storefronts while selling products owned and fulfilled by the platform.

---

## Technology Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, TypeScript, Drizzle ORM, PostgreSQL, Better Auth
- **Infrastructure:** Redis, BullMQ, Meilisearch, Cloudflare R2, Docker, Turborepo, pnpm

---

## Architecture

**Architecture Version:** 1.0
**Status:** Frozen
**Last Reviewed:** 2026-08-07

See [Architecture Changelog](./docs/architecture/CHANGELOG.md) for version history.

---

## Repository Structure

```
project-loom/
├── apps/
│   ├── web/                    # Customer storefront
│   ├── seller-dashboard/       # Seller dashboard
│   ├── admin-dashboard/        # Admin dashboard
│   └── api/                    # NestJS API
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── auth/                   # Authentication
│   ├── database/               # Database package
│   ├── shared/                 # Shared utilities
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   └── config/                 # Configuration
├── docs/                       # Documentation
├── tooling/                    # Development tooling
├── docker/                     # Docker configuration
└── infrastructure/             # Infrastructure as code
```

---

## Documentation

All project documentation lives in the [`docs/`](./docs/) directory.

| Section | Description |
|---------|-------------|
| [Product](./docs/product/) | Requirements, business rules, features, and data models |
| [Architecture](./docs/architecture/) | System design, engineering standards, and tech stack |
| [Database](./docs/database/) | Database philosophy, schema, state machines, and events |
| [API](./docs/api/) | REST API standards and specifications |
| [Frontend](./docs/frontend/) | Frontend architecture and routing |
| [Backend](./docs/backend/) | Backend architecture and services |
| [Operations](./docs/operations/) | Deployment, monitoring, and security |
| [ADRs](./docs/adr/) | Architecture Decision Records |
| [Specs](./docs/spec/) | Detailed specifications by domain |

---

## Getting Started

1. Read [`AI_CONTEXT.md`](./AI_CONTEXT.md) for the canonical engineering context
2. Review the [Architecture Decision Records](./docs/adr/) for key technical choices
3. Check the [Bootstrap Specification](./docs/architecture/Bootstrap-Specification.md) for project setup

---

## License

See [LICENSE](./LICENSE) for details.
