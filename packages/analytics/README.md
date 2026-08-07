# @loom/analytics

Shared analytics tracking for Project Loom.

## Purpose

Analytics event tracking.

## Usage

```typescript
import { trackEvent } from '@loom/analytics'

trackEvent({ event: 'page_view', properties: { page: '/products' } })
```
