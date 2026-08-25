import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span
        aria-hidden
        className="material-symbols-outlined select-none text-on-surface-variant/20"
        style={{ fontSize: 80 }}
      >
        error
      </span>
      <h1 className="mt-4 font-display text-headline-md font-bold text-on-surface">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md font-body text-body-sm text-on-surface-variant">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded bg-tertiary-container px-6 py-3 font-label-caps text-xs uppercase tracking-widest text-tertiary transition-colors hover:bg-tertiary hover:text-on-tertiary"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
