import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Project Loom',
  description: 'Admin portal for Project Loom',
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
