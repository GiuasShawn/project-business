# ADR-010 — Adopt Next.js App Router as the Frontend Architecture

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-010

**Owners:** Engineering

---

# Context

Project Loom requires a frontend architecture capable of supporting:

- Customer storefront
- Seller dashboard
- Admin dashboard
- Marketing pages
- SEO
- Multi-tenant storefronts
- Server-side rendering
- Static generation where appropriate
- Modern React patterns

Candidate solutions evaluated:

- Next.js App Router
- Next.js Pages Router
- React + Vite
- Remix
- Nuxt (Vue)
- SvelteKit

---

# Decision

Project Loom will adopt **Next.js App Router** for all frontend applications.

The App Router provides:

- Server Components
- Nested layouts
- Streaming
- Route groups
- Server Actions (used selectively)
- Modern React architecture

---

# Applications

Next.js powers:

- Customer Storefront
- Seller Dashboard
- Admin Dashboard
- Marketing Website

Each application remains independently deployable while sharing packages from the monorepo.

---

# Rendering Strategy

## Static Generation (SSG)

Used for:

- Marketing pages
- Documentation
- Public informational content

---

## Incremental Static Regeneration (ISR)

Used for:

- Category pages
- Collections
- Featured products
- Landing pages

Revalidation intervals should be configurable.

---

## Server-Side Rendering (SSR)

Used for:

- Storefront pages
- Product pages
- Authenticated dashboards
- Personalized content

---

## Client Components

Reserved for:

- Interactive forms
- Modals
- Drag-and-drop
- Charts
- Real-time updates
- Shopping cart interactions

Client Components should be used only when browser-side interactivity is required.

---

# Component Strategy

Default:

Server Component

Upgrade to Client Component only when necessary.

This minimizes JavaScript sent to the browser.

---

# Data Fetching

Preferred order:

1. Server Components
2. Route Handlers / Backend API
3. TanStack Query (client state synchronization where appropriate)

Avoid unnecessary client-side fetching.

---

# State Management

Global UI state:

- Zustand

Server state:

- TanStack Query

Forms:

- React Hook Form
- Zod validation

No Redux unless a future requirement justifies it.

---

# Routing

Multi-tenant storefront routing:

```text id="routingflow"
seller.projectloom.com

↓

Middleware

↓

Resolve Store

↓

Load Storefront
```

Future custom domains should use the same tenant resolution mechanism.

---

# Authentication

Authenticated pages:

- Server-side session validation where practical
- Secure cookies
- Better Auth integration

Protected routes should not rely solely on client-side checks.

---

# Performance Principles

Priorities:

- Server Components by default
- Image optimization
- Code splitting
- Lazy loading
- Streaming
- CDN caching

Largest Contentful Paint and Core Web Vitals should be monitored continuously.

---

# Shared UI

Shared components reside in:

```text id="sharedui"
packages/ui
```

Applications should consume shared components rather than duplicating UI implementations.

---

# Styling

Technology:

- Tailwind CSS
- shadcn/ui

Design tokens are centralized.

Themes:

- Light
- Dark (future)
- Brand customization for storefronts

---

# Error Handling

Use:

- Route-level error boundaries
- Loading states
- Not Found pages
- Global error boundary

User-facing errors should be clear without exposing internal details.

---

# Testing

Frontend includes:

- Unit tests
- Component tests
- End-to-end tests
- Accessibility testing

Critical user journeys (checkout, onboarding, login) require end-to-end coverage.

---

# Risks

Potential risks:

- Excessive Client Components
- Large bundles
- Duplicate data fetching
- Hydration mismatches

Mitigations:

- Server-first architecture
- Bundle analysis
- Shared component library
- Code review guidelines

---

# Consequences

Positive:

- Excellent SEO
- High performance
- Strong developer experience
- Modern React architecture
- Long-term maintainability

Negative:

- Team must understand Server Components.
- App Router learning curve.
- Requires discipline around rendering strategies.

---

# Success Criteria

This decision remains valid while:

- Performance targets are met.
- Bundle sizes remain controlled.
- Shared UI usage remains high.
- Rendering strategies are applied consistently.

---

# Related Documents

- Engineering Standards
- Design System
- Repository Architecture
- API Standards
- System Blueprint

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted Next.js App Router as the frontend architecture. |