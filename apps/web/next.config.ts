import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

/**
 * Scope Next's output tracing to the pnpm workspace root. Without this,
 * Next falls back to guessing the root from whatever lockfiles it finds and
 * may pick up unrelated lockfiles outside the repo.
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
}

export default nextConfig
