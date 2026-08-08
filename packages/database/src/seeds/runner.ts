import type { Database } from '../client.js'

/**
 * Seed runner type.
 *
 * Each domain registers a SeedFn that operates on a Drizzle database handle.
 * The runner executes them in order.
 */

export type SeedFn = (db: Database) => Promise<void>

interface NamedSeed {
  readonly name: string
  readonly fn: SeedFn
}

const seedFns: NamedSeed[] = []

/**
 * Register a seed function.
 *
 * @example
 * ```ts
 * registerSeed('dev-identity', async (db) => {
 *   await db.insert(users).values([...])
 * })
 * ```
 */
export function registerSeed(name: string, fn: SeedFn): void {
  seedFns.push({ name, fn })
}

/**
 * Run all registered seeds in order.
 *
 * Phases of registration:
 *  1. Domain seeds register themselves when imported.
 *  2. This runner executes them sequentially.
 *
 * Seeds MUST be idempotent — re-running against a populated database must
 * either no-op or grow the dataset predictably without violating unique
 * constraints.
 */
export async function runSeeds(): Promise<void> {
  console.log('🌱 Running database seeds...')

  for (const { name, fn } of seedFns) {
    console.log(`  → Seeding: ${name}`)
    try {
      await fn(await import('../client.js').then((m) => m.db))
      console.log(`  ✓ ${name} seeded`)
    } catch (error) {
      console.error(`  ✗ ${name} failed:`, error)
      throw error
    }
  }

  console.log('🌱 All seeds completed')
}

/**
 * Force eager registration — only invokes if not already populated (test runner
 * friendly). The CLI entrypoint below re-imports the registration module to
 * pick up domain seeds before running.
 */
export function getRegisteredSeedNames(): readonly string[] {
  return seedFns.map((s) => s.name)
}
