import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seller Dashboard - Project Loom',
  description: 'Seller portal for Project Loom',
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
