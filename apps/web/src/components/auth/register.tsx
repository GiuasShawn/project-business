'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { authClient } from '../../lib/auth'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { Input } from '../ui/input'
import { AuthShell } from './auth-shell'

/**
 * Registration form wired to Better Auth signUp.email().
 * Handles form state, validation, API errors, and redirect on success.
 */
export function RegisterPage(): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    // Client-side validation
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.')
      return
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.')
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

      // Success — redirect to catalog (session cookie is set by Better Auth)
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
    <AuthShell
      title="Create your account"
      subtitle="Join Loom and start curating products for your storefront."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-tertiary transition-colors hover:text-on-tertiary-container"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Aarav Mehta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Min. 12 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label className="flex items-start gap-2 text-body-sm text-on-surface-variant">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded-sm border-outline-variant bg-surface"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            I agree to the <span className="text-on-surface underline">Terms of Service</span> and{' '}
            <span className="text-on-surface underline">Privacy Policy</span>.
          </span>
        </label>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          or
        </span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <Button type="button" variant="ghost" className="w-full">
        <Icon name="mail" size={18} />
        Continue with Google
      </Button>
    </AuthShell>
  )
}
