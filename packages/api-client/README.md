# @loom/api-client

Typed frontend SDK for Project Loom.

## Purpose

Generated from OpenAPI. Typed API client for frontend applications.

## Usage

```typescript
import { createApiClient } from '@loom/api-client'

const api = createApiClient(process.env.NEXT_PUBLIC_API_URL)
const response = await api.get('/products')
```

## Rules

- Generated from OpenAPI
- Never manually edit generated code
- Type-safe by default
