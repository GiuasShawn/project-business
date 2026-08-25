'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span
        aria-hidden
        className="material-symbols-outlined select-none text-error/30"
        style={{ fontSize: 80 }}
      >
        warning
      </span>
      <h1 className="mt-4 font-display text-headline-md font-bold text-on-surface">
        Something Went Wrong
      </h1>
      <p className="mt-2 max-w-md font-body text-body-sm text-on-surface-variant">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest ? (
        <p className="mt-2 font-data-mono text-xs text-on-surface-variant/50">
          Error ID: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded bg-tertiary-container px-6 py-3 font-label-caps text-xs uppercase tracking-widest text-tertiary transition-colors hover:bg-tertiary hover:text-on-tertiary"
      >
        Try Again
      </button>
    </div>
  )
}
