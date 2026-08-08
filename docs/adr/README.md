# Architecture Decision Records (ADRs)

> **Project:** Project Loom
>
> **Purpose:** Document architectural decisions with context, rationale, and consequences.

---

## Purpose

ADRs capture important architectural decisions along with their context and consequences. They provide a consistent format for documenting why certain technologies, patterns, or approaches were chosen.

---

## When an ADR is Required

An ADR **must** be created when:

1. **Choosing a new technology** — Database, framework, library, service
2. **Adopting a new pattern** — Architecture, design, integration
3. **Making a breaking change** — To frozen architecture decisions
4. **Resolving a tradeoff** — Between competing approaches
5. **Establishing a standard** — Coding, testing, deployment

An ADR is **not** required for:

- Bug fixes
- Feature implementations (within existing architecture)
- Documentation updates
- Configuration changes

---

## ADR Lifecycle

```
Proposed → Accepted → (Superseded | Deprecated)
```

| Status | Meaning |
|--------|---------|
| **Proposed** | Under review, not yet decided |
| **Accepted** | Decision made, implement accordingly |
| **Superseded** | Replaced by a newer ADR |
| **Deprecated** | No longer relevant |

---

## ADR Naming Convention

Format: `ADR-NNN-Title-With-Dashes.md`

- **NNN** — Three-digit sequential number (001, 002, ...)
- **Title** — Short, descriptive, kebab-case

Examples:
- `ADR-001-Modular-Monolith.md`
- `ADR-005-Better-Auth.md`
- `ADR-012-Observability.md`

---

## ADR Template

```markdown
# ADR-NNN — [Title]

**Status:** [Proposed | Accepted | Superseded | Deprecated]

**Date:** [YYYY-MM-DD]

**Decision ID:** ADR-NNN

**Owners:** [Team/Individual]

---

# Context

[What is the issue that motivates this decision?]

---

# Decision

[What is the change being proposed or decided?]

---

# Options Considered

[What alternatives were evaluated?]

| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

---

# Rationale

[Why was this option chosen?]

---

# Consequences

## Positive
- ...

## Negative
- ...

---

# Success Criteria

[How will we know this decision is working?]

---

# Related Documents

- [Link to related docs]

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | [Date] | [Summary] |
```

---

## Relationship to Other Documents

| Document | Relationship |
|----------|--------------|
| `docs/architecture/` | Architecture specifications that ADRs support |
| `docs/architecture/CHANGELOG.md` | Tracks architecture version changes |
| `docs/engineering/architecture-constraints.md` | Non-negotiable rules enforced by ADRs |
| `AI_CONTEXT.md` | References ADRs for technology decisions |
| `PHASES.md` | Implementation phases that follow ADR decisions |

---

## Current ADRs

| ADR | Title | Status |
|-----|-------|--------|
| ADR-001 | Modular Monolith | Accepted |
| ADR-002 | PostgreSQL | Accepted |
| ADR-003 | Next.js (App Router) | Accepted |
| ADR-004 | NestJS Backend | Accepted |
| ADR-005 | Better Auth | Accepted |
| ADR-006 | Redis + BullMQ | Accepted |
| ADR-007 | Meilisearch | Accepted |
| ADR-008 | Cloudflare R2 | Accepted |
| ADR-009 | Drizzle ORM | Accepted |
| ADR-010 | TypeScript (Strict) | Accepted |
| ADR-011 | REST API | Accepted |
| ADR-012 | Observability | Accepted |
| ADR-013 | Database Enum Case Convention (UPPERCASE per DB-004) | Accepted |
| ADR-014 | V1 User Roles (admin/seller/customer) and SUPER_ADMIN Deferral | Accepted |
| ADR-015 | Store Status Initial State (`DRAFT`) | Accepted |
| ADR-016 | Better Auth Persistence as Cross-Domain Primitives | Accepted |

---

*Last updated on 2026-08-09.*
