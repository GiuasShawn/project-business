import loomPreset from '@loom/ui/tailwind-preset'
import type { Config } from 'tailwindcss'

const config: Config = {
  ...loomPreset,
  content: ['./src/**/*.{ts,tsx}'],
}

export default config
