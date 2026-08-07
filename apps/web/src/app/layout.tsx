import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Loom',
  description: 'Multi-tenant fashion commerce platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
