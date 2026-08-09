'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { AuthShell } from './auth-shell'

/** Forgot-password demo — password recovery flow supported by the backend. */
export function ForgotPasswordPage(): React.JSX.Element {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <p>
          <Link
            href="/sign-in"
            className="text-tertiary transition-colors hover:text-on-tertiary-container"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Button type="submit" size="lg" className="w-full">
          Send Reset Link
        </Button>
      </form>
      <p className="mt-6 text-body-sm text-on-surface-variant">
        If the email exists in our system, you'll receive a link shortly.
      </p>
    </AuthShell>
  )
}
