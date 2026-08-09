'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { Input } from '../ui/input'
import { AuthShell } from './auth-shell'

/**
 * Registration demo screen — mirrors the Better Auth registration flow
 * (email + password + name + terms). No invented functionality.
 */
export function RegisterPage(): React.JSX.Element {
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
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <Input label="Full name" name="name" autoComplete="name" placeholder="Aarav Mehta" />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <label className="flex items-start gap-2 text-body-sm text-on-surface-variant">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded-sm border-outline-variant bg-surface"
          />
          <span>
            I agree to the <span className="text-on-surface underline">Terms of Service</span> and{' '}
            <span className="text-on-surface underline">Privacy Policy</span>.
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full">
          Create Account
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
