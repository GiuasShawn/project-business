import Link from 'next/link'
import { Button } from './ui/button'
import { Wordmark } from './ui/wordmark'

/**
 * Minimal top navigation (Stitch landing direction): wordmark + contextual
 * links + Launch Workspace CTA. Fixed over the landing background.
 */
export function SiteNav(): React.JSX.Element {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-container-max items-center justify-between px-grid-margin py-stack-md">
      <div className="flex items-center gap-stack-lg">
        <Link href="/" aria-label="Loom home">
          <Wordmark className="text-display-lg-mobile" />
        </Link>
        <Link
          href="/catalog"
          className="hidden border-b-2 border-on-surface pb-1 font-label-caps text-label-caps text-on-surface opacity-80 transition-opacity duration-200 hover:opacity-100 md:block"
        >
          Catalog
        </Link>
      </div>
      <div className="flex items-center gap-stack-md">
        <Link
          href="/sign-in"
          className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-200 hover:text-on-surface"
        >
          Sign In
        </Link>
        <Link href="/catalog">
          <Button size="sm">Launch Workspace</Button>
        </Link>
      </div>
    </nav>
  )
}
