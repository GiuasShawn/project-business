# AI Operating Rules

> **Project:** Project Loom
>
> **Status:** Active (2026-08-07)
>
> **Purpose:** Rules that every AI implementation session must follow.

---

## Session Management

1. **Read TASKS.md first** — Understand current state before any work.
2. **Read PHASES.md second** — Understand the full roadmap.
3. **Read AI_CONTEXT.md third** — Understand engineering standards.
4. **Work on ONE task at a time** — Do not multitask.
5. **Complete ONE phase at a time** — Do not skip ahead.
6. **Stop after the current phase** — Never auto-continue to next phase.

---

## Code Generation

7. **Never skip phases** — Sequential completion is mandatory.
8. **Never modify completed architecture** — Frozen decisions are final.
9. **Never replace chosen technologies** — Technology stack is locked.
10. **Never refactor unrelated files** — Keep changes minimal and cohesive.
11. **Never generate duplicate components** — Reuse existing packages.
12. **Never introduce new libraries without justification** — Document rationale.

---

## Documentation

13. **Always update TASKS.md** — Mark completed tasks before ending session.
14. **Always update PROGRESS.md** — Record milestones.
15. **Always write completion reports** — Document what was done.
16. **Never modify completed phases** — Unless fixing a bug.

---

## Validation

17. **Always run validation before marking tasks complete** — Build, lint, test.
18. **Never mark a task complete if validation fails** — Fix issues first.
19. **Always verify documentation consistency** — Keep docs in sync.

---

## Quality

20. **Never use `any`** — Strict TypeScript only.
21. **Never skip validation** — Zod schemas for all inputs.
22. **Never skip authorization** — RBAC for all endpoints.
23. **Never bypass repositories** — Use the repository pattern.
24. **Never ignore tenant filtering** — Multi-tenancy is mandatory.

---

## Communication

25. **Always ask for approval before next phase** — Wait for user confirmation.
26. **Always explain architectural tradeoffs** — Document decisions.
27. **Never assume requirements** — Clarify ambiguity before implementing.

---

*Document created on 2026-08-07.*
