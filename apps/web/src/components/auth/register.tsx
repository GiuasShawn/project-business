'use client'

import { Icon } from '@loom/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { authClient } from '../../lib/auth'

/**
 * Registration page — pixel-matched to the Stitch reference.
 *
 * Split layout: left side has editorial image with LOOM branding + quote,
 * right side has the registration form with underline-style inputs.
 */
export function RegisterPage(): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: '/catalog',
      })

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.')
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
    <main className="flex w-full min-h-screen">
      {/* Left Cinematic Panel (Hidden on Mobile) */}
      <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Cinematic editorial fashion shot of a model in a stark architectural space"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Xf0CZ3yOXoXUQq3P7HVCeSPgdRNlLzYAC1gm1OMtBGLwv-D7QTFZaYlwD6PCayyyej-DSh6FGGyKKAeUo9V_9eBRzPi8HOAoyLgoNUsTskinvZUofSpir1NFntSqJCDxpmpBrQ2ifOngmYb4zvrvsj06Lrr2QymGMph5O0tpq7KZJHJ7r5v7kzGqKPKuwmdJMPepMuJ2b9ufvHYByPuLWGAluUOjXXgYajmlLmeSShUPd4GQCsSoQVirk"
          />
          {/* Dim overlay for text contrast */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Branding */}
        <div className="relative z-10 flex flex-col pt-8 pl-8">
          <h1 className="font-display text-display-lg tracking-tighter text-primary">LOOM</h1>
          <p className="font-label-caps text-label-caps text-primary mt-2 uppercase tracking-widest">
            Noir Editorial
          </p>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 pb-8 pl-8 max-w-md">
          <p className="font-body text-body-lg text-on-surface-variant italic">
            &quot;Curation is the ultimate expression of intent.&quot;
          </p>
        </div>
      </section>

      {/* Right Registration Form Panel */}
      <section className="w-full lg:w-1/2 bg-surface-dim flex flex-col justify-center items-center p-8 relative">
        {/* Mobile Branding Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-8 left-8">
          <h1 className="font-display text-display-lg tracking-tighter text-primary">LOOM</h1>
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-12">
            <h2 className="font-display text-headline-lg text-primary mb-2">Create Account</h2>
            <p className="font-body text-body-lg text-on-surface-variant">
              Join the exclusive editorial network.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="relative group">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
                htmlFor="fullName"
              >
                FULL NAME
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline focus:border-primary focus:ring-0 px-0 py-3 font-body text-body-lg text-primary placeholder-on-surface-variant/50 transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
                htmlFor="email"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline focus:border-primary focus:ring-0 px-0 py-3 font-body text-body-lg text-primary placeholder-on-surface-variant/50 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
                htmlFor="password"
              >
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline focus:border-primary focus:ring-0 px-0 py-3 font-body text-body-lg text-primary placeholder-on-surface-variant/50 transition-colors"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-4 mt-8 font-body text-title-md hover:bg-primary-container transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-surface-container-high" />
            <span className="px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-surface-container-high" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              aria-label="Sign up with Google"
              className="flex items-center justify-center py-3 border border-surface-container-high hover:bg-surface-container-low transition-colors duration-300"
            >
              <Icon name="person" size={20} className="text-primary mr-2" />
              <span className="font-label-caps text-label-caps text-primary">Google</span>
            </button>
            <button
              type="button"
              aria-label="Sign up with Apple"
              className="flex items-center justify-center py-3 border border-surface-container-high hover:bg-surface-container-low transition-colors duration-300"
            >
              <Icon name="person" size={20} className="text-primary mr-2" />
              <span className="font-label-caps text-label-caps text-primary">Apple</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-12 text-center">
            <p className="font-body text-body-lg text-on-surface-variant">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all ml-2 font-body"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
