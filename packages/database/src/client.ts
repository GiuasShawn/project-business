import { env } from '@loom/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/index.js'

export type Database = ReturnType<typeof drizzle<typeof schema>>

function createClient() {
  return postgres(env.DATABASE_URL, {
    max: env.DATABASE_POOL_SIZE,
    ssl: env.DATABASE_SSL,
  })
}

let client: ReturnType<typeof createClient> | null = null

/**
 * Create a Drizzle ORM client bound to the canonical schema map.
 *
 * Passing `{ schema }` is required by `@better-auth/drizzle-adapter` at
 * version 1.6.26 — the adapter reads `db._.fullSchema` when no explicit
 * `schema` option is supplied. Listing every schema here also enables
 * Drizzle's Relational Query API for future domain phases.
 *
 * @see docs/adr/ADR-016-Better-Auth-Persistence.md
 */
export function createDb(): Database {
  if (!client) {
    client = createClient()
  }
  return drizzle(client, { schema })
}

export const db = createDb()
