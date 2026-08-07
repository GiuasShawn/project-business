# @loom/database

Database package for Project Loom.

## Purpose

Drizzle ORM schema, migrations, and database client.

## Usage

```typescript
import { db } from '@loom/database'
```

## Rules

- PostgreSQL is the source of truth
- UUID primary keys
- snake_case naming
- Forward-only migrations
- No business logic in repositories
