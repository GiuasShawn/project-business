export default function Loading(): React.JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
        <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
      </div>
    </div>
  )
}
