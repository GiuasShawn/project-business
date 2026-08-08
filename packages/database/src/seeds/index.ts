/**
 * Seed registry — single entry point that registers every development seed.
 *
 * Importing this file once at the workflow boundary (CLI, test) registers
 * all Phase 04 seeds. Individual seeds are NOT auto-registered on import;
 * they remain opt-in for production deployment.
 */

import { seed_dev_currencies } from './dev-currencies.js'
import { seed_dev_identity } from './dev-identity.js'
import { registerSeed } from './runner.js'

export function registerDevelopmentSeeds(): void {
  registerSeed('dev-currencies', seed_dev_currencies)
  registerSeed('dev-identity', seed_dev_identity)
}
