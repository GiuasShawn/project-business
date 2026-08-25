import loomPreset from '@loom/ui/tailwind-preset'
import type { Config } from 'tailwindcss'

/**
 * Loom web application Tailwind config.
 *
 * Extends the shared @loom/ui/tailwind-preset which contains all
 * Material 3 dark scheme design tokens. App-specific extensions
 * (animation keyframes, etc.) are added here.
 */
const config: Config = {
  ...loomPreset,
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    ...loomPreset.theme,
    extend: {
      ...loomPreset.theme?.extend,
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'rise-in': 'rise-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
