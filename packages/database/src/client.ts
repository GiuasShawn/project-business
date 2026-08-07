import { env } from '@loom/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export type Database = ReturnType<typeof drizzle>

function createClient() {
  return postgres(env.DATABASE_URL, {
    max: env.DATABASE_POOL_SIZE,
    ssl: env.DATABASE_SSL,
  })
}

let client: ReturnType<typeof createClient> | null = null

export function createDb(): Database {
  if (!client) {
    client = createClient()
  }
  return drizzle(client)
}

export const db = createDb()
