'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import { AuthShell } from './auth-shell'

/** Email-verification demo state — flow exists in the backend (verify-email). */
export function VerifyEmailPage(): React.JSX.Element {
  return (
    <AuthShell
      title="Check your inbox"
      subtitle="We sent a verification link to your email address."
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
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-tertiary/30 bg-tertiary-container/30">
          <Icon name="mail" size={22} className="text-tertiary" />
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Verify your email to activate your Loom account. Didn't get the email?
        </p>
        <Button type="button" variant="ghost">
          Resend Verification Email
        </Button>
      </div>
    </AuthShell>
  )
}
