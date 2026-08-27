/**
 * Shared Loom design tokens as a Tailwind CSS preset.
 *
 * All three frontend applications extend this preset to ensure
 * consistent visual language across the platform.
 *
 * @see DESIGN.md for canonical design documentation.
 */
const loomPreset = {
  darkMode: 'class' as const,
  theme: {
    extend: {
      colors: {
        // Base canvas
        background: '#131316',
        'on-background': '#e4e1e5',
        surface: '#131316',
        'surface-dim': '#131316',
        'surface-bright': '#39393c',
        // Tonal containers (depth via color stepping, not shadows)
        'surface-container-lowest': '#0e0e11',
        'surface-container-low': '#1b1b1e',
        'surface-container': '#1f1f22',
        'surface-container-high': '#2a2a2d',
        'surface-container-highest': '#353437',
        'surface-variant': '#353437',
        'on-surface': '#e4e1e5',
        'on-surface-variant': '#c7c6ca',
        'inverse-surface': '#e4e1e5',
        'inverse-on-surface': '#303033',
        // Outlines
        outline: '#919094',
        'outline-variant': '#46464a',
        // Primary (neutral)
        'surface-tint': '#c8c6c7',
        primary: '#c8c6c7',
        'on-primary': '#313031',
        'primary-container': '#0f0f10',
        'on-primary-container': '#7d7b7c',
        'inverse-primary': '#5f5e5f',
        'primary-fixed': '#e5e2e3',
        'primary-fixed-dim': '#c8c6c7',
        secondary: '#c6c6c7',
        'on-secondary': '#2f3131',
        'secondary-container': '#454747',
        'on-secondary-container': '#b4b5b5',
        'secondary-fixed': '#e2e2e2',
        'secondary-fixed-dim': '#c6c6c7',
        // Tertiary (Action Indigo)
        tertiary: '#c3c0ff',
        'on-tertiary': '#1d00a5',
        'tertiary-container': '#060046',
        'on-tertiary-container': '#6c66ff',
        'tertiary-fixed': '#e2dfff',
        'tertiary-fixed-dim': '#c3c0ff',
        // Error
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        display: ['"Public Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        'label-caps': ['Inter', 'system-ui', 'sans-serif'],
        'data-mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg-mobile': [
          '32px',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'headline-lg': [
          '28px',
          { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        'headline-md': ['24px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-md': ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
        'label-caps': ['11px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '600' }],
        'label-sm': ['10px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '600' }],
        'data-mono': ['14px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      spacing: {
        'grid-margin': '40px',
        'grid-gutter': '20px',
        'container-max': '1440px',
        'stack-xs': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [] as unknown[],
}

export default loomPreset
