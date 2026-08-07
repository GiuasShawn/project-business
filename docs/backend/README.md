# Backend Documentation

**Purpose:** Defines backend architecture, authentication, background jobs, search, and storage for Project Loom.

**Owner:** Backend Team

**Relationships:**
- Implements the backend layer defined in [architecture/Architecture-Overview.md](../architecture/Architecture-Overview.md)
- Follows standards from [architecture/Engineering-Standards.md](../architecture/Engineering-Standards.md)
- Consumes events from [database/Event-Catalog.md](../database/Event-Catalog.md)
- Enforces permissions from [database/Permission-Matrix.md](../database/Permission-Matrix.md)

---

## Documents

This folder is a placeholder for future backend-specific documentation.

The following documents are defined in the target structure but do not yet exist:

- **Backend-Architecture.md** — NestJS module structure, service layer, and repository pattern
- **Authentication.md** — Better Auth integration, session management, and JWT handling
- **Background-Jobs.md** — BullMQ worker configuration, job types, and retry policies
- **Search.md** — Meilisearch integration, indexing strategies, and query patterns
- **Storage.md** — Cloudflare R2 integration, upload flows, and CDN configuration
