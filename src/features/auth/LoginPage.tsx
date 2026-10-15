import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { Button } from '../../components/Button'
import { EmptyState, LoadingList } from '../../components/StatusViews'
import { useAuth } from './AuthContext'
import { DecorativeInputRow, FormMessage, LinkButton, PasswordField, TextField } from './FormParts'

type Mode = 'signin' | 'signup' | 'forgot'

const COPY: Record<Mode, { title: string; intro: string; submit: string; pending: string }> = {
  signin: {
    title: 'Welcome back',
    intro: 'Sign in to your Order Strong account.',
    submit: 'Sign in',
    pending: 'Signing in…',
  },
  signup: {
    title: 'Create your account',
    intro: "It takes a minute. We'll only use your email to sign you in.",
    submit: 'Create account',
    pending: 'Creating account…',
  },
  forgot: {
    title: 'Reset your password',
    intro: "Enter your email and we'll send you a link to choose a new password.",
    submit: 'Send reset link',
    pending: 'Sending…',
  },
}

/** Only follow in-app paths, so a crafted link can't send someone to another site after login. */
function safeRedirect(from: unknown): string {
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/'
}

export function LoginPage() {
  const { status, signIn, signUp, requestPasswordReset } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (status === 'loading') return <LoadingList label="Checking your sign-in" count={1} />

  if (status === 'unavailable') {
    return (
      <EmptyState
        title="Sign-in isn't available yet"
        action={
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
          >
            Find a restaurant
          </Link>
        }
      >
        This version of the app isn't connected to an account service. You can still browse every
        restaurant.
      </EmptyState>
    )
  }

  // Already signed in (including right after a successful sign-in): go where they were headed.
  if (status === 'signedIn') {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={safeRedirect(from)} replace />
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
    setPassword('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    setNotice(null)

    const trimmedEmail = email.trim()
    if (mode === 'signin') {
      const result = await signIn(trimmedEmail, password)
      if (!result.ok) setError(result.message)
      // On success the auth state changes and this page redirects.
    } else if (mode === 'signup') {
      const result = await signUp(trimmedEmail, password)
      if (!result.ok) setError(result.message)
      else if (result.needsConfirmation) {
        setNotice(`Check your email. We sent a confirmation link to ${trimmedEmail}.`)
        setPassword('')
      }
    } else {
      const result = await requestPasswordReset(trimmedEmail)
      if (!result.ok) setError(result.message)
      else setNotice(`If ${trimmedEmail} has an account, a reset link is on its way.`)
    }
    setPending(false)
  }

  const copy = COPY[mode]

  return (
    <div className="mx-auto max-w-md space-y-5 pt-2 md:pt-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{copy.title}</h1>
        <p className="mt-1 text-ink-soft">{copy.intro}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        {notice ? <FormMessage tone="success">{notice}</FormMessage> : null}

        <TextField
          id="auth-email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          after={mode === 'signin' ? <DecorativeInputRow buttonText="Show" /> : undefined}
        />

        {mode !== 'forgot' ? (
          <PasswordField
            id="auth-password"
            label="Password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
            minLength={mode === 'signup' ? 8 : undefined}
            toggleText={mode === 'signin' ? 'Street' : undefined}
            value={password}
            onChange={setPassword}
          />
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? copy.pending : copy.submit}
        </Button>

        {mode === 'signin' ? (
          <div className="text-center">
            <LinkButton onClick={() => switchMode('forgot')}>Forgot your password?</LinkButton>
          </div>
        ) : null}
      </form>

      <p className="text-center text-ink-soft">
        {mode === 'signin' ? (
          <>
            New here? <LinkButton onClick={() => switchMode('signup')}>Create an account</LinkButton>
          </>
        ) : (
          <>
            {mode === 'signup' ? 'Already have an account? ' : 'Remembered it? '}
            <LinkButton onClick={() => switchMode('signin')}>Sign in</LinkButton>
          </>
        )}
      </p>

      <div className="text-center text-sm text-ink-soft">
        <p>You don't need an account to browse.</p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4"
        >
          Back to restaurants
        </Link>
      </div>
    </div>
  )
}
