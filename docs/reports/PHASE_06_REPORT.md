# Phase 06 — Application Shell

**Completion Date:** 2026-08-25
**Status:** Complete
**Duration:** 1 session

---

## Summary

Phase 06 implements the complete application shell for the Loom platform. This includes extracting shared global styles into the packages/ui package, fixing the Button component with real Loom design tokens, aligning apps/web with the shared Tailwind preset, restructuring routes into logical groups, implementing the authentication boundary, and creating the authenticated shell layout.

---

## Deliverables

### 1. Shared globals.css

**Location:** `packages/ui/src/globals.css`

Extracted the shared global styles from apps/web into packages/ui. All three frontend applications (apps/web, apps/admin-dashboard, apps/seller-dashboard) now consume the single shared source of truth.

**Changes:**
- Created `packages/ui/src/globals.css` with all base styles, utilities, and accessibility rules
- Updated `packages/ui/package.json` to export the CSS file
- Updated all three app layouts to import from `@loom/ui/globals.css`

### 2. Button with Loom Design Tokens

**Location:** `packages/ui/src/button.tsx`

Fixed the packages/ui Button component to use the real Loom design tokens from the Material 3 dark scheme.

**Changes:**
- Updated variant styles to use proper token classes (tertiary-container, outline-variant, etc.)
- Added proper loading state with accessible spinner
- Added focus-visible styles for keyboard navigation
- Maintained consistent sizing with label-caps typography

### 3. Tailwind Preset Alignment

**Location:** `apps/web/tailwind.config.ts`

Aligned apps/web with the shared @loom/ui/tailwind-preset, eliminating token duplication.

**Changes:**
- Updated apps/web tailwind.config.ts to extend @loom/ui/tailwind-preset
- Added app-specific animation keyframes (fade-in, rise-in)
- Admin and seller dashboards already used the preset (no changes needed)

### 4. Route Restructuring

**Location:** `apps/web/src/app/(public)`, `(auth)`, `(authenticated)`

Restructured apps/web routes into logical groups using Next.js route groups.

**Route Groups:**
- `(public)`: Landing page (`/`)
- `(auth)`: Authentication routes (`/sign-in`, `/register`, `/forgot-password`, `/verify-email`)
- `(authenticated)`: Protected routes (`/catalog`, `/editor`)

**Preserved URLs:** All existing public URLs remain unchanged.

### 5. Auth Boundary

**Location:** `apps/web/src/middleware.ts`

Implemented the authentication boundary using Next.js middleware and Better Auth.

**Components:**
- **Middleware** (`middleware.ts`): Checks for `loom_session` cookie on protected routes
- **Route Handler** (`app/api/auth/[...all]/route.ts`): Better Auth API endpoints with dynamic import for build-time compatibility
- **Auth Client** (`lib/auth.ts`): Client-side auth utilities with nextCookies plugin

**Behavior:**
- Protected routes (`/catalog`, `/editor`) redirect to `/sign-in` when unauthenticated
- Auth routes (`/sign-in`, `/register`, etc.) redirect to `/catalog` when authenticated
- Cookie name: `loom_session` (configured via `cookiePrefix: 'loom'` in auth-config.ts)

### 6. Authenticated Shell

**Location:** `apps/web/src/app/(authenticated)/layout.tsx`

Implemented the authenticated shell layout using existing @loom/ui shell components.

**Features:**
- Sidebar navigation with store identity
- Top bar with notifications and user menu
- Mobile bottom navigation
- Active route highlighting with tertiary indicator
- "Soon" labels for disabled nav items

### 7. aria-current Navigation

**Location:** `packages/ui/src/shell/nav-item.tsx`

Added `aria-current="page"` attribute to active navigation items for accessibility.

---

## Validation Results

| Check | Result |
|-------|--------|
| `pnpm build` | ✅ Pass |
| `pnpm lint` | ✅ Pass |
| `pnpm typecheck` | ✅ Pass |
| Auth protection | ✅ /catalog, /editor redirect to /sign-in when unauthenticated |
| Authenticated access | ✅ Sidebar navigation works when authenticated |
| Public URLs preserved | ✅ All existing routes accessible |
| Mobile navigation | ✅ Bottom nav works on mobile viewports |
| Reduced motion | ✅ No animations when prefers-reduced-motion is set |
| Console errors | ✅ None |

---

## Files Created

| File | Purpose |
|------|---------|
| `packages/ui/src/globals.css` | Shared global styles |
| `apps/web/src/middleware.ts` | Auth boundary middleware |
| `apps/web/src/app/api/auth/[...all]/route.ts` | Better Auth route handler |
| `apps/web/src/lib/auth.ts` | Auth client with nextCookies |
| `apps/web/src/app/(public)/layout.tsx` | Public route group layout |
| `apps/web/src/app/(auth)/layout.tsx` | Auth route group layout |
| `apps/web/src/app/(authenticated)/layout.tsx` | Authenticated shell layout |
| `docs/reports/PHASE_06_REPORT.md` | This report |

---

## Files Modified

| File | Changes |
|------|---------|
| `packages/ui/package.json` | Added globals.css export |
| `packages/ui/src/button.tsx` | Updated with Loom design tokens |
| `packages/ui/src/shell/nav-item.tsx` | Added aria-current="page" |
| `packages/ui/src/shell/sidebar.tsx` | Fixed a11y lint (backdrop keyboard handler) |
| `apps/web/package.json` | Added @loom/auth dependency |
| `apps/web/tailwind.config.ts` | Aligned with @loom/ui/tailwind-preset |
| `apps/web/src/app/layout.tsx` | Changed to import @loom/ui/globals.css |
| `apps/web/src/app/page.tsx` | Moved to (public) route group |
| `apps/web/src/app/sign-in/page.tsx` | Moved to (auth) route group |
| `apps/web/src/app/register/page.tsx` | Moved to (auth) route group |
| `apps/web/src/app/forgot-password/page.tsx` | Moved to (auth) route group |
| `apps/web/src/app/verify-email/page.tsx` | Moved to (auth) route group |
| `apps/web/src/app/catalog/page.tsx` | Moved to (authenticated) route group |
| `apps/web/src/app/editor/page.tsx` | Moved to (authenticated) route group |
| `apps/admin-dashboard/src/app/layout.tsx` | Changed to import @loom/ui/globals.css |
| `apps/seller-dashboard/src/app/layout.tsx` | Changed to import @loom/ui/globals.css |

---

## Architecture Decisions

### 1. Route Groups

Used Next.js route groups `(public)`, `(auth)`, `(authenticated)` to organize routes without affecting URLs. This provides clear separation of concerns while maintaining clean URL structure.

### 2. Middleware-based Auth

Implemented auth check at the middleware level for consistent protection across all authenticated routes. This is more reliable than checking auth in individual pages or layouts.

### 3. Cookie-based Session

Used Better Auth's `loom_session` cookie (configured via `cookiePrefix: 'loom'` in auth-config.ts). The middleware checks for cookie presence as a first-pass gate; full session validation happens client-side.

### 4. Shell Components

Reused existing @loom/ui shell components (Shell, Sidebar, TopBar, MobileNav) for the authenticated layout. This ensures consistency with the admin and seller dashboards.

### 5. Design Token Alignment

apps/web now extends @loom/ui/tailwind-preset instead of duplicating tokens. This eliminates token drift and ensures all apps share the same design language.

---

## Notes

- The auth middleware performs a simple cookie presence check. Full session validation should be implemented in the authenticated layout when the API is integrated.
- The Better Auth route handler uses `toNextJsHandler` from `better-auth/next-js` with dynamic import to defer `@loom/auth` initialization to runtime (preventing `@loom/config`'s environment validation from running at Next.js build time).
- The authenticated shell preserves all existing Phase 05 visual components (catalog sidebar, mobile bottom nav, etc.).
- No seller or admin shell components were modified unless a genuine integration issue was discovered.

---

## Next Steps

Phase 06 is complete. The application shell is ready for:

- **Phase 07**: Shared Components (DataTable, SearchBar, Pagination, etc.)
- **Phase 08**: Inventory Module
- **Phase 09**: Products Module

The auth boundary is in place and ready for full session validation when the API integration is complete.
