/**
 * Public route group layout.
 *
 * Wraps public-facing routes (landing page) with no auth requirements.
 * The root layout.tsx handles html/body/fonts — this layout is a
 * passthrough for grouping purposes.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return <>{children}</>
}
