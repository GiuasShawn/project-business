---
name: Cinematic Commerce
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353437'
  on-surface: '#e4e1e5'
  on-surface-variant: '#c7c6ca'
  inverse-surface: '#e4e1e5'
  inverse-on-surface: '#303033'
  outline: '#919094'
  outline-variant: '#46464a'
  surface-tint: '#c8c6c7'
  primary: '#c8c6c7'
  on-primary: '#313031'
  primary-container: '#0f0f10'
  on-primary-container: '#7d7b7c'
  inverse-primary: '#5f5e5f'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c3c0ff'
  on-tertiary: '#1d00a5'
  tertiary-container: '#060046'
  on-tertiary-container: '#6c66ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1c1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#131316'
  on-background: '#e4e1e5'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 40px
  grid-gutter: 20px
  container-max: 1440px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for high-end commerce, prioritizing a cinematic and confident aesthetic that positions sellers as premium curators. The visual language rejects the soft, approachable tropes of consumer SaaS in favor of a sharp, editorial atmosphere reminiscent of luxury digital lookbooks. 

The style is **Modern Minimalist with an Industrial Edge**, characterized by high-density information layouts, disciplined whitespace, and a focus on visual hierarchy through scale rather than decoration. The interface acts as a silent frame for high-quality, editorial product photography, ensuring that the platform feels like a sophisticated tool for professionals rather than a toy.

## Colors

The palette is restrained and intentional, utilizing a "Dark Mode First" philosophy to evoke a premium, nighttime retail environment.

- **Primary (Deep Charcoal):** Used for the base canvas to create a sense of infinite depth.
- **Secondary (Crisp White):** Reserved for primary text and high-impact UI triggers, providing maximum contrast.
- **Tertiary (Action Indigo):** A high-vibrancy accent used exclusively for commerce-critical data, such as commission rates, conversion spikes, and primary CTAs.
- **Neutral (Slate):** Subtle grays used for structural borders and secondary metadata to maintain a clean, information-rich density without visual noise.

## Typography

Typography is used as a structural element. By employing tight tracking (letter spacing) on headlines, the design system achieves a "compressed" editorial look that feels urgent and modern.

- **Headlines:** Public Sans provides a sturdy, geometric foundation. High-contrast sizing between headers and body text creates a clear narrative path.
- **Body & Labels:** Inter is utilized for its exceptional legibility in high-density data environments.
- **Data Display:** For financial figures and commission rates, use the `data-mono` style to ensure tabular alignment and clarity in fast-scanning scenarios.

## Layout & Spacing

This design system utilizes a **Fixed 12-Column Grid** for desktop, shifting to a **Fluid 4-Column Grid** for mobile. 

- **Density:** The system favors high-density layouts. Vertical spacing should be disciplined—use `stack-sm` for related metadata and `stack-lg` to separate distinct functional blocks.
- **Split-Pane Editor:** For the seller customization suite, use a 40/60 split-pane. The left pane (Controls) is a fixed-width, scrollable container (380px), while the right pane (Live Preview) is fluid and centered on a canvas.
- **Margins:** Generous outer margins (`grid-margin`) ensure that even high-density content feels intentional and "framed" rather than cluttered.

## Elevation & Depth

To avoid generic SaaS "floatiness," this design system avoids heavy drop shadows and blurred backgrounds. 

- **Tonal Layering:** Depth is achieved through color stepping. The base background is the darkest, while interactive surfaces (like card hover states or modals) use a slightly lighter neutral tint.
- **Low-Contrast Outlines:** Use 1px solid borders (`#27272A`) to define container boundaries. This creates a "blueprint" feel that is precise and architectural.
- **State Changes:** Instead of raising an element on the Z-axis with shadows, indicate focus or hover via border color transitions (e.g., changing from Neutral to Action Indigo) or subtle opacity shifts.

## Shapes

The shape language is strictly **Architectural and Sharp**. 

Elements use a maximum of 4px (`rounded-sm`) for standard components like buttons and inputs. Large containers or product imagery should remain perfectly square (0px) to maintain the editorial, cinematic feel. This departure from the "rounded web" standard reinforces the professional, high-end nature of the platform.

## Components

- **Product Cards:** Borderless by default. The image occupies 100% of the top area. Metadata (MRP and Commission) is locked up in the bottom-left, using `data-mono` for the commission rate in the Action color. 
- **Buttons:** Sharp-cornered with solid fills. The Primary button is White text on the Action Indigo background. Secondary buttons use a Ghost style (1px White border).
- **Navigation:** A slim, top-aligned bar with `label-caps` typography. Use high-contrast active states (underline or Action color).
- **Input Fields:** Bottom-border only or very subtle 1px box. Focus states should trigger a full Action color border to provide clear visual feedback in a dark environment.
- **Chips:** Rectangular with `rounded-sm` corners. Use for "Category" tags or "Status" indicators, utilizing low-opacity Action color fills with high-opacity text.
- **Split-Pane Editor:** Controls should be grouped in "Accordions" with thin dividers, ensuring the seller isn't overwhelmed by customization options at once.