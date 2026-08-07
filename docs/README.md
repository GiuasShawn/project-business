# Project Loom — Documentation

**Version:** 1.0.0

This directory contains all engineering, product, and architecture documentation for Project Loom.

---

## Directory Structure

| Folder | Purpose |
|--------|---------|
| [product/](./product/) | Product requirements, business rules, feature specifications, and data models |
| [architecture/](./architecture/) | System design, engineering standards, tech stack, and bootstrap configuration |
| [database/](./database/) | Database philosophy, schema, state machines, events, and permissions |
| [api/](./api/) | REST API standards, specifications, and error codes |
| [frontend/](./frontend/) | Frontend architecture, design system, UI components, and routing |
| [backend/](./backend/) | Backend architecture, authentication, jobs, search, and storage |
| [operations/](./operations/) | Deployment, monitoring, logging, CI/CD, and security |
| [adr/](./adr/) | Architecture Decision Records documenting key technical choices |
| [spec/](./spec/) | Domain, database, API, event, permission, and UI specifications |

---

## Document Ownership

- **Product documents** — Product & Engineering Teams
- **Architecture documents** — Engineering Team
- **Database documents** — Database & Backend Teams
- **API documents** — Backend & Frontend Teams
- **Frontend documents** — Frontend Team
- **Backend documents** — Backend Team
- **Operations documents** — DevOps & Platform Team
- **ADRs** — Engineering Team (any engineer may propose)

---

## Relationships

- Architecture documents define the technical foundation
- Product documents define business requirements
- Database documents implement the data layer
- API documents define the interface contracts
- Frontend and Backend documents implement the application layer
- Operations documents govern deployment and monitoring
- ADRs record significant architectural decisions

---

## Conventions

- All documents use Markdown (.md)
- Filenames use kebab-case
- Every folder contains this README.md
- Documents are versioned and owned by specific teams
