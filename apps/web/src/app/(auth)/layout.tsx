/**
 * Auth route group layout.
 *
 * Wraps authentication routes (sign-in, register, forgot-password, verify-email).
 * The root layout.tsx handles html/body/fonts — this layout is a
 * passthrough for grouping purposes.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return <>{children}</>
}
