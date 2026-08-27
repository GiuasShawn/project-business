'use client'

import { Icon } from '@loom/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { authClient } from '../../lib/auth'

/**
 * Sign-in page — pixel-matched to the Stitch reference.
 *
 * Split layout: left side has editorial image with LOOM branding,
 * right side has the sign-in form with underline-style inputs.
 */
export function SignInPage(): React.JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: '/catalog',
      })

      if (authError) {
        setError(authError.message || 'Sign in failed. Please check your credentials.')
        return
      }

      if (data) {
        router.push('/catalog')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-col md:flex-row w-full h-screen flex-grow">
      {/* Left Side: Editorial Image Canvas (Hidden on Mobile) */}
      <section className="hidden md:block md:w-1/2 relative bg-surface-container border-r border-surface-container-high overflow-hidden">
        {/* Dimmed Image Overlay for Noir Aesthetic */}
        <div className="absolute inset-0 bg-black/10 z-10 mix-blend-multiply pointer-events-none" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBG0Y6NIVVQ1FIqY8FU2xgltAbIXw5DNcO7pFVRkE194fZpJCZTSZ5Df1MO69sGnCsrWw3HKT6stMBA40DwiAlB5TxL02gRMa1GdHfOdyaN91aTEvHbkRhOEVgBE4qv4aiZn34NhLOh5MCdxv1fKOHxCyfDX7rJJg4KvJRa1LbR3TgfKTG1XKVBLNy_jxG8rJ88XQ4N2JQJ1ZnJqIEYqppS_dxkXSn0VMzCch9XtAAt4Y3SX2k8hub9gA')",
          }}
        />
        {/* Minimal Branding Anchor on Image */}
        <div className="absolute bottom-12 left-12 z-20 pointer-events-none">
          <span className="font-display text-display-lg text-primary drop-shadow-lg tracking-tighter">
            LOOM
          </span>
          <p className="font-label-caps text-label-caps text-secondary-fixed-dim mt-2 uppercase tracking-widest opacity-80">
            Noir Editorial
          </p>
        </div>
      </section>

      {/* Right Side: Centered Sign In Form */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-surface relative">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden mb-12 text-center">
            <span className="font-display text-headline-md text-primary tracking-tighter block mb-1">
              LOOM
            </span>
          </div>

          {/* Header */}
          <div className="w-full mb-10">
            <h1 className="font-display text-headline-md md:text-display-lg text-primary mb-2">
              Welcome Back
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant">
              Enter your credentials to access your curated portfolio.
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <label className="sr-only" htmlFor="email">
                Email Address
              </label>
              <div className="flex items-center border-b border-surface-variant group-focus-within:border-primary transition-colors duration-300 pb-2">
                <Icon
                  name="mail"
                  size={20}
                  className="text-on-surface-variant group-focus-within:text-primary mr-3 transition-colors"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-primary font-body text-body-lg placeholder:text-on-surface-variant/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <div className="flex items-center border-b border-surface-variant group-focus-within:border-primary transition-colors duration-300 pb-2">
                <Icon
                  name="lock"
                  size={20}
                  className="text-on-surface-variant group-focus-within:text-primary mr-3 transition-colors"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-primary font-body text-body-lg placeholder:text-on-surface-variant/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end w-full pt-1">
              <Link
                href="/forgot-password"
                className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {/* Primary Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 px-6 mt-4 hover:bg-surface-tint transition-colors duration-300 flex justify-center items-center group relative overflow-hidden rounded-sm disabled:opacity-50"
            >
              <span className="font-label-caps text-label-caps uppercase tracking-widest relative z-10 font-bold group-hover:tracking-[0.1em] transition-all duration-300">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center my-8">
            <div className="flex-grow border-t border-surface-variant" />
            <span className="px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-surface-variant" />
          </div>

          {/* Social Logins (Minimalist) */}
          <div className="w-full grid grid-cols-2 gap-4">
            <button
              type="button"
              aria-label="Sign in with Google"
              className="flex justify-center items-center py-3 border border-surface-variant rounded-sm hover:border-primary hover:bg-surface-container-low transition-colors duration-200"
            >
              <Icon name="person" size={20} className="text-on-surface" />
              <span className="ml-2 font-label-caps text-label-caps">Google</span>
            </button>
            <button
              type="button"
              aria-label="Sign in with Apple"
              className="flex justify-center items-center py-3 border border-surface-variant rounded-sm hover:border-primary hover:bg-surface-container-low transition-colors duration-200"
            >
              <Icon name="person" size={20} className="text-on-surface" />
              <span className="ml-2 font-label-caps text-label-caps">Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-12 mb-20 text-center w-full">
            <p className="font-body text-body-lg text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-surface-tint underline decoration-surface-variant underline-offset-4 transition-colors duration-200 ml-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 w-full flex flex-col md:flex-row justify-between items-center px-8 py-6 bg-transparent border-t border-surface-container-low">
          <span className="text-on-surface-variant font-label-caps text-label-caps mb-4 md:mb-0">
            &copy; 2024 LOOM EDITORIAL
          </span>
          <nav className="flex space-x-6">
            <a
              href="/privacy"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-caps text-label-caps"
            >
              Contact
            </a>
          </nav>
        </footer>
      </section>
    </main>
  )
}
