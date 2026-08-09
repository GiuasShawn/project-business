# Loom Design System

> Canonical project-level design documentation.
>
> Derived from the approved Stitch foundation: `design/cinematic_commerce/DESIGN.md`.
>
> This document describes the actual implemented design system in `apps/web`.

---

## Overview

Loom uses a **Modern Minimalist with Industrial Edge** design system built on Material 3 dark scheme tokens. The visual language is engineered for high-end commerce, positioning sellers as premium curators. The interface acts as a silent frame for editorial product photography.

**Design Philosophy:**
- Dark Mode First (nighttime retail environment)
- High-density information layouts
- Disciplined whitespace
- Visual hierarchy through scale, not decoration
- Architectural shapes (4px max radius)

---

## Color System

### Material 3 Dark Scheme

The palette is defined in `tailwind.config.ts` and sourced from `design/cinematic_commerce/DESIGN.md`.

**Core Surfaces:**
- `background` / `surface`: `#131316` (Deep Charcoal — base canvas)
- `surface-dim`: `#131316`
- `surface-bright`: `#39393c`
- `surface-container-lowest`: `#0e0e11`
- `surface-container-low`: `#1b1b1e`
- `surface-container`: `#1f1f22`
- `surface-container-high`: `#2a2a2d`
- `surface-container-highest`: `#353437`

**Primary (Neutral):**
- `primary`: `#c8c6c7` (Crisp White — high-impact triggers)
- `on-primary`: `#313031`
- `primary-container`: `#0f0f10`

**Tertiary (Action Indigo):**
- `tertiary`: `#c3c0ff` (commission data, active states, CTAs)
- `on-tertiary`: `#1d00a5`
- `tertiary-container`: `#060046`
- `on-tertiary-container`: `#6c66ff`

**Outlines (Blueprint Borders):**
- `outline`: `#919094`
- `outline-variant`: `#46464a` (low-contrast structural borders)

**Error:**
- `error`: `#ffb4ab`
- `error-container`: `#93000a`

---

## Typography

### Type Scale

Defined in `tailwind.config.ts`:

| Token | Size | Line Height | Weight | Font | Use Case |
|-------|------|-------------|--------|------|----------|
| `display-lg` | 48px | 1.1 | 700 | Public Sans | Hero headlines |
| `display-lg-mobile` | 32px | 1.2 | 700 | Public Sans | Mobile headlines |
| `headline-md` | 24px | 1.3 | 600 | Public Sans | Section headers |
| `body-lg` | 16px | 1.6 | 400 | Inter | Body text |
| `body-sm` | 14px | 1.5 | 400 | Inter | Secondary text |
| `label-caps` | 11px | 1.2 | 600 | Inter | Uppercase labels |
| `data-mono` | 14px | 1.0 | 600 | ui-monospace | Prices/commissions |

### Font Stacks

```css
font-family: 'Public Sans', system-ui, sans-serif  /* Display */
font-family: Inter, system-ui, sans-serif          /* Body */
font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace  /* Data */
```

**Offline Fallback:** Fonts load via `<link>` with system-font fallback. Build never depends on network access.

---

## Spacing

Defined in `tailwind.config.ts`:

| Token | Value | Use Case |
|-------|-------|----------|
| `stack-xs` | 4px | Tight spacing |
| `stack-sm` | 8px | Related metadata |
| `stack-md` | 16px | Standard spacing |
| `stack-lg` | 32px | Section separation |
| `grid-gutter` | 20px | Grid column gaps |
| `grid-margin` | 40px | Outer margins |
| `container-max` | 1440px | Max content width |

---

## Shape Language

**Architectural and Sharp:**

- `rounded-sm`: 2px (inputs, buttons)
- `rounded`: 4px (default — cards, containers)
- `rounded-md`: 6px
- `rounded-lg`: 8px
- `rounded-xl`: 12px
- `rounded-full`: 9999px (avatars, pills)

**Rule:** Maximum 4px for standard components. Product imagery remains perfectly square (0px) for editorial feel.

---

## Components

### Button

Located: `components/ui/button.tsx`

- **Variants:** `primary` (tertiary-container), `secondary` (on-surface), `ghost` (transparent), `danger` (error)
- **Sizes:** `sm`, `md`, `lg`
- **Typography:** `label-caps` uppercase tracking
- **Motion:** Subtle scale on hover/tap via Motion (reduced-motion: instant)
- **Focus:** Tertiary ring on focus

### Input

Located: `components/ui/input.tsx`

- **Variants:** Boxed (bordered), Underline (bottom-border only)
- **Focus:** Tertiary border + ring
- **Typography:** `body-sm` or `body-lg`

### Dialog

Located: `components/ui/dialog.tsx`

- **Semantics:** `role="dialog"`, `aria-modal`, `aria-label`
- **Backdrop:** Black/60 with blur
- **Focus Trap:** Tab cycling within dialog
- **Escape:** Closes dialog
- **Motion:** Scale/opacity enter/exit (reduced-motion: opacity only)
- **Design:** Surface-container-lowest background, outline-variant borders

### Data Table

Located: `components/ui/data-table.tsx`

- **Semantics:** `<table>` with proper `role="table"`, `<th scope="col">`
- **States:** Empty, Loading, Data
- **Responsive:** Horizontal scroll on overflow
- **Design:** Surface-container-lowest background, outline-variant borders

### Icon

Located: `components/ui/icon.tsx`

- **Family:** Material Symbols Outlined
- **Filled:** `fontVariationSettings: 'FILL' 1`
- **Sizes:** Configurable via `size` prop

### Glass Panel

Located: `components/ui/glass-panel.tsx`

- **Effect:** Translucent surface + backdrop blur
- **Use:** Landing hero background

### Badge / Chip

Located: `components/ui/badge.tsx`, `components/ui/chip.tsx`

- **Design:** Tertiary-container fills, outline-variant borders

---

## Motion Principles

### Libraries

- **Motion** (v13): Interactive UI — entrances, exits, layout, hover/tap
- **Anime.js** (v4.5): Continuous loops — catalog wall scrolling

### Shared Variants

Defined in `lib/motion.ts`:

```typescript
fadeUp:   opacity: 0 → 1, y: 14 → 0 (0.55s)
fadeIn:   opacity: 0 → 1 (0.5s)
scaleIn:  opacity: 0 → 1, scale: 0.97 → 1 (0.4s)
stagger:  0.07s between children
```

### Easing

```typescript
EASE_OUT: [0.22, 1, 0.36, 1]
```

### Reduced Motion

All motion components check `useReducedMotion()` and degrade to:
- Instant appearance (no y/scale transforms)
- Opacity-only transitions
- No continuous animations

**Catalog Wall:** Anime.js loops disabled entirely. Wall remains static.

### Visibility Handling

Anime.js loops pause when `document.hidden` and resume on visibility change.

---

## Responsive Rules

### Breakpoints

- **Mobile:** < 640px (default)
- **Tablet:** 640px - 1024px (`sm:`, `md:`)
- **Desktop:** 1024px+ (`lg:`)
- **Large Desktop:** 1280px+ (`xl:`)

### Layout Adaptations

**Catalog:**
- Mobile: Bottom nav, category chips, filter drawer (slide-in), 2-column grid
- Tablet: 3-column grid, category chips
- Desktop: Sidebar (380px), desktop filter pane (260px), 3-4 column grid

**Auth:**
- Mobile: Full-width card, stacked form
- Desktop: Centered card, max-width 440px

**Editor:**
- Desktop: Split-pane (380px sidebar + fluid preview)
- Mobile: Not implemented (design foundation only)

---

## Product Card Rules

Located: `components/catalog/product-card.tsx`

**Desktop Variant:**
- Aspect ratio: 3/4
- Image: Full bleed, grayscale, brightness 75%
- On hover: Opacity 80%, wishlist button appears
- Metadata: Name (body-lg), Brand (body-sm)
- Price: `data-mono` text-on-surface
- Commission: `data-mono` tertiary-container bg/40, tertiary text

**Compact Variant (Catalog Grid):**
- Same structure, smaller scale
- Commission always visible inline (never hidden)

### Commission Presentation

- **Always visible** — never behind interaction
- **Format:** `{rate}% COMMISSION` or `{rate}% Comm.`
- **Typography:** `data-mono` font
- **Color:** Tertiary (Action Indigo) on tertiary-container/40 background
- **Position:** Bottom-left of card, after price

---

## Accessibility

### Semantic HTML

- `<nav>` for navigation
- `<main>` for primary content
- `<aside>` for sidebars
- `<table>` with `<th scope="col">` for data tables
- `role="dialog"` with `aria-modal` for dialogs

### Focus Management

- Focus trap in dialogs
- Escape to close dialogs/popovers
- Focus restoration on dialog close
- Visible focus rings (tertiary color)

### Reduced Motion

- All animations respect `prefers-reduced-motion: reduce`
- Degrade to instant appearance or opacity-only
- No information lost in reduced-motion mode

### Color Contrast

- Primary text (on-surface: `#e4e1e5`) on surface (`#131316`): 14.5:1
- Tertiary text (on-tertiary-container: `#6c66ff`) on tertiary-container (`#060046`): 8.2:1

### Screen Readers

- Icons use `aria-hidden`
- Loading states announced via `aria-live`
- Form labels associated via `htmlFor`/`useId`

---

## Screen Architecture

### Landing (`/`)

- Catalog wall (decorative, aria-hidden)
- Hero with staggered entrances
- Site navigation

### Catalog (`/catalog`)

- Sidebar (380px, desktop only)
- Sticky toolbar (search, sort, filters)
- Desktop filter pane (260px, xl+)
- Product grid with motion reflow
- Mobile bottom nav

### Auth (`/sign-in`, `/register`, `/forgot-password`, `/verify-email`)

- Shared AuthShell
- Centered card layout
- Form validation

### Editor (`/editor`)

- Split-pane: Sidebar (380px) + Preview
- Accordion sections for customization
- Live storefront preview
- Local/mock state only

---

## Known Limitations

1. **Fonts:** Load via Google Fonts CDN; offline fallback to system fonts
2. **Images:** Product images hosted on `lh3.googleusercontent.com`; offline placeholders via gradient backgrounds
3. **Favicon:** SVG format only; no ICO fallback
4. **Mobile Editor:** Not implemented (design foundation only)
5. **Backend Integration:** All forms are static demos; API wiring in future phases

---

## File Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing
│   │   ├── layout.tsx            # Root layout + fonts
│   │   ├── globals.css           # Global styles
│   │   ├── catalog/page.tsx      # Catalog
│   │   ├── editor/page.tsx       # Editor
│   │   ├── sign-in/page.tsx      # Auth
│   │   ├── register/page.tsx     # Auth
│   │   ├── forgot-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── components/
│   │   ├── ui/                   # Design system primitives
│   │   ├── catalog/              # Catalog-specific
│   │   ├── auth/                 # Auth-specific
│   │   ├── landing/              # Landing-specific
│   │   └── editor/               # Editor-specific
│   └── lib/
│       ├── motion.ts             # Shared variants
│       └── catalog-data.ts       # Mock data
├── tailwind.config.ts            # Design tokens
└── next.config.ts                # Build config
```

---

*Last Updated: 2026-08-09*
*Source: design/cinematic_commerce/DESIGN.md*
