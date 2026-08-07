# Architecture Changelog

> **Project:** Project Loom
>
> **Purpose:** Track architecture version history and changes.

---

## Versioning

Architecture versions follow this format: `MAJOR.MINOR`

- **MAJOR** — Breaking architectural changes (new ADR required)
- **MINOR** — Non-breaking additions or clarifications

---

## v1.0

**Date:** 2026-08-07
**Status:** Frozen

### Initial Architecture Freeze

The following decisions are now frozen:

| Decision | Technology | ADR |
|----------|------------|-----|
| Architecture Pattern | Modular Monolith | ADR-001 |
| Primary Database | PostgreSQL 16 | ADR-002 |
| Frontend Framework | Next.js (App Router) | ADR-003 |
| Backend Framework | NestJS | ADR-004 |
| Authentication | Better Auth | ADR-005 |
| Cache + Queue | Redis + BullMQ | ADR-006 |
| Search Engine | Meilisearch | ADR-007 |
| Object Storage | Cloudflare R2 | ADR-008 |
| ORM | Drizzle | ADR-009 |
| Language | TypeScript (Strict) | ADR-010 |
| API Style | REST (Versioned) | ADR-011 |
| Observability | Full Stack | ADR-012 |

### Change Policy

- Frozen decisions require a **new ADR** to modify.
- New ADRs must follow the established format (see `docs/adr/`).
- Architecture changes must be reviewed and approved before implementation.

---

*Created on 2026-08-07.*
