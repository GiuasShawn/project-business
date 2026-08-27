'use client'

import { Icon } from '@loom/ui'
import Link from 'next/link'

/**
 * Loom landing page — pixel-matched to the Stitch reference.
 *
 * Layout: two-column grid. Left column: tagline, headline, description, CTAs, stats.
 * Right column: full-height hero image with gradient overlay.
 * Footer: brand, copyright, legal links.
 */
export function LandingPage(): React.JSX.Element {
  return (
    <div className="bg-surface-container-low text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-surface-variant bg-surface-container-low text-primary fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-12">
          <span className="font-display text-headline-md font-bold tracking-tight text-primary">
            LOOM
          </span>
          <nav className="hidden md:flex gap-8" />
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="text-on-surface-variant hover:text-primary transition-colors font-medium hidden md:block"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-primary text-on-primary px-5 py-2 rounded-lg font-medium hover:bg-surface-tint transition-colors"
          >
            Start Selling
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex items-center relative z-10 px-8 pt-24 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left content */}
          <div className="flex flex-col items-start gap-8 max-w-xl">
            <div className="inline-flex items-center gap-3">
              <div className="w-8 h-px bg-primary" />
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="font-display text-display-lg text-primary">
                The Future of Distributed Commerce.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Discover premium products, curate your perfect catalog, and launch your business
                with a single click. Loom connects visionary sellers to a global product network
                with transparent, commission-driven growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/register"
                className="bg-primary text-on-primary px-8 py-3.5 rounded-lg font-medium hover:bg-surface-tint transition-colors w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/catalog"
                className="bg-surface-container text-primary px-8 py-3.5 rounded-lg font-medium hover:bg-surface-container-high transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Explore Catalog
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-surface-variant w-full flex items-center gap-8 opacity-70">
              <div className="flex flex-col">
                <span className="text-primary font-bold text-xl">10k+</span>
                <span className="text-on-surface-variant text-sm">Premium Brands</span>
              </div>
              <div className="w-px h-8 bg-surface-variant" />
              <div className="flex flex-col">
                <span className="text-primary font-bold text-xl">$50M+</span>
                <span className="text-on-surface-variant text-sm">Seller Earnings</span>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative w-full h-[500px] lg:h-[700px] rounded overflow-hidden shadow-2xl">
            <img
              alt="Sophisticated black bodycon dress on a model in a minimalist studio setting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTvwnTGV_XvlzytU0ReM6jlEok512waPW1j2Tx9-j8c7g0cYhA0TrPKY44GZ-PT2PIrugr-Er4Jg7ml2S3NO89y5rEPWrFf0XWk0_GPgxSVFfcdhD4l3sWyo4zFEPL6yw6PBlQBh4KBBJsp5HREwDjlfkiaCys4mouiV9yWBaQHlSqaNAwV25wEyB-P5w2-zTRM_UiHb57aHP7Jmajbqf_OE_FpPNXwqO_erEDdPjv2ZPzbszJM1ASRw"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/80 via-transparent to-transparent" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low text-on-surface-variant w-full py-12 border-t border-surface-variant relative z-10 flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto transition-colors duration-200 gap-6">
        <div className="font-display text-primary text-xl font-bold" />
        <div className="text-on-surface-variant">
          &copy; 2026 LOOM Commerce. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="/privacy">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="/terms">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="/legal">
            Legal
          </a>
        </div>
      </footer>
    </div>
  )
}
