import { defineConfig } from 'drizzle-kit'

/**
 * Drizzle Kit configuration.
 *
 * Usage:
 *   pnpm db:generate   — generate SQL migration files
 *   pnpm db:migrate    — apply pending migrations
 *   pnpm db:push       — push schema directly (dev only)
 *   pnpm db:studio     — open Drizzle Studio
 */

export default defineConfig({
  schema: './src/schema/**/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/project_loom',
  },
})
