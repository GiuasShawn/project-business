# Success Metrics

> **Project:** Project Loom
>
> **Status:** Active (2026-08-07)
>
> **Purpose:** Measurable engineering goals for the platform.

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API P95 Latency | < 250ms | Prometheus |
| Search Latency | < 150ms | Meilisearch metrics |
| Dashboard Load | < 2s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Web Vitals |
| Error Rate | < 0.1% | Sentry |
| Queue Latency | < 30s | BullMQ metrics |

---

## Reliability Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.9% | Health checks |
| MTTR | < 30 minutes | Incident tracking |
| Recovery Point Objective | < 5 minutes | Database backups |
| Payment Success Rate | > 99.5% | Stripe dashboard |

---

## Code Quality Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| TypeScript Strict Mode | 100% | tsconfig.json |
| Test Coverage (Business Logic) | > 80% | Vitest |
| Lint Pass Rate | 100% | ESLint |
| No `any` (Unjustified) | 0 | Code review |
| Module Boundary Violations | 0 | ESLint rules |

---

## Security Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| OWASP Top 10 | Pass | Security audit |
| Rate Limiting | All endpoints | Implementation |
| Input Validation | 100% | Zod schemas |
| Tenant Isolation | 100% | Row-level security |
| Secret Exposure | 0 | Logging audit |

---

## Developer Experience Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Fresh Install Time | < 5 minutes | Manual testing |
| Build Time (Dev) | < 30 seconds | Turborepo |
| Build Time (Prod) | < 2 minutes | Turborepo |
| Documentation Coverage | 100% | Manual review |
| Onboarding Time (New Dev) | < 1 day | Documentation |

---

## Testing Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Unit Test Coverage | > 80% | Vitest |
| Integration Test Coverage | > 70% | Vitest |
| E2E Test Coverage | Critical paths | Playwright |
| Test Execution Time | < 5 minutes | CI/CD |

---

*Document created on 2026-08-07.*
