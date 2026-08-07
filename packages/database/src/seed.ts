import { db } from './client.js'

/**
 * Seed runner infrastructure.
 *
 * Each domain registers its own seed function. The runner executes them in order.
 * Usage: pnpm db:seed
 */

export type SeedFn = (
  db: Awaited<ReturnType<typeof import('./client.js').createDb>>,
) => Promise<void>

const seedFns: Array<{ name: string; fn: SeedFn }> = []

/**
 * Register a seed function for a domain.
 *
 * @example
 * ```ts
 * registerSeed('users', async (db) => {
 *   await db.insert(users).values([{ ... }])
 * })
 * ```
 */
export function registerSeed(name: string, fn: SeedFn): void {
  seedFns.push({ name, fn })
}

/**
 * Run all registered seeds in order.
 */
export async function runSeeds(): Promise<void> {
  console.log('🌱 Running database seeds...')

  for (const { name, fn } of seedFns) {
    console.log(`  → Seeding: ${name}`)
    try {
      await fn(db)
      console.log(`  ✓ ${name} seeded`)
    } catch (error) {
      console.error(`  ✗ ${name} failed:`, error)
      throw error
    }
  }

  console.log('🌱 All seeds completed')
}

/**
 * CLI entry point.
 */
runSeeds()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
