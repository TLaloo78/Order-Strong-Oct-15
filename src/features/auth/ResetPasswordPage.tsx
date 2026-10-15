import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '../../components/Button'
import { EmptyState, LoadingList } from '../../components/StatusViews'
import { useAuth } from './AuthContext'
import { FormMessage, PasswordField } from './FormParts'

/** Where the link in a password-reset email lands. */
export function ResetPasswordPage() {
  const { status, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (status === 'loading') return <LoadingList label="Checking your reset link" count={1} />

  const homeLink = (
    <Link
      to="/"
      className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
    >
      Find a restaurant
    </Link>
  )

  if (done) {
    return (
      <div className="mx-auto max-w-md pt-2 md:pt-8">
        <EmptyState title="Your password is updated" action={homeLink}>
          You're signed in and ready to go.
        </EmptyState>
      </div>
    )
  }

  if (status !== 'signedIn') {
    return (
      <div className="mx-auto max-w-md pt-2 md:pt-8">
        <EmptyState
          title="This reset link has expired"
          action={
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
            >
              Back to sign in
            </Link>
          }
        >
          Reset links work once and only for a short time. Choose “Forgot your password?” to get a
          new one.
        </EmptyState>
      </div>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    const result = await updatePassword(password)
    if (result.ok) setDone(true)
    else setError(result.message)
    setPending(false)
  }

  return (
    <div className="mx-auto max-w-md space-y-5 pt-2 md:pt-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Choose a new password</h1>
        <p className="mt-1 text-ink-soft">You'll stay signed in once it's saved.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        <PasswordField
          id="new-password"
          label="New password"
          autoComplete="new-password"
          hint="At least 8 characters."
          minLength={8}
          value={password}
          onChange={setPassword}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Saving…' : 'Save password'}
        </Button>
      </form>
    </div>
  )
}
