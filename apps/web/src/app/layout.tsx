import type { Metadata } from 'next'
import '@loom/ui/globals.css'

export const metadata: Metadata = {
  title: 'Loom — Premium Distributed Commerce',
  description:
    'Discover products, curate your catalog, and launch your business. Loom connects sellers to a premium product network with transparent commission-driven growth.',
  icons: {
    icon: '/favicon.svg',
  },
}

/**
 * Fonts are loaded via <link> (mirroring the Stitch foundation) so the build
 * never depends on network access; the browser falls back to the system font
 * stack when offline. Public Sans for display/headlines, Inter for body/data,
 * Material Symbols Outlined for the icon set used across screens.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Public+Sans:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
