'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { Input } from '../ui/input'
import { AuthShell } from './auth-shell'

/**
 * Sign-in form. Static demo bound to the existing Better Auth backend flows
 * (sign in / registration / Google OAuth / password recovery / verification).
 * No authentication functionality is invented here — wiring to the API lands
 * in the authentication integration phase.
 */
export function SignInPage(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Loom workspace to curate and launch your storefront."
      footer={
        <p>
          New to Loom?{' '}
          <Link
            href="/register"
            className="text-tertiary transition-colors hover:text-on-tertiary-container"
          >
            Create an account
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
        <div className="relative">
          <label
            htmlFor="password"
            className="mb-1.5 block font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded border border-outline-variant bg-surface px-4 py-3 pr-10 font-body-lg text-body-lg text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-tertiary-container focus:ring-1 focus:ring-tertiary-container"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-10 right-3 text-on-surface-variant transition-colors hover:text-on-surface"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded-sm border-outline-variant bg-surface"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-body-sm text-tertiary transition-colors hover:text-on-tertiary-container"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign In
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
