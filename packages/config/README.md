# @loom/config

Shared configuration package for Project Loom.

## Purpose

Provides type-safe environment variable validation and configuration.

## Usage

```typescript
import { env } from '@loom/config'

console.log(env.DATABASE_URL)
console.log(env.NODE_ENV)
```

## Environment Variables

See `.env.example` at the project root for all available variables.

## Validation

Environment variables are validated at startup using Zod schemas. The application will fail to start if required variables are missing or invalid.
