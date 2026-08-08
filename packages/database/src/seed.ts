import { registerDevelopmentSeeds } from './seeds/index.js'
import { runSeeds } from './seeds/runner.js'

/**
 * Seed runner entrypoint.
 *
 * Usage: `pnpm db:seed`
 *
 * Pre-condition: the Phase 04 first migration has been applied (`pnpm db:migrate`)
 * against the target database. Running against an unmigrated database will
 * fail with a table-missing error.
 *
 * This CLI registers development seeds only. Production seeding (if any) is
 * intentionally not provided.
 */

registerDevelopmentSeeds()
runSeeds()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
