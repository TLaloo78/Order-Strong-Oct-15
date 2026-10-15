import { useState } from 'react'
import { Navigate } from 'react-router'
import { Button } from '../../components/Button'
import { LoadingList } from '../../components/StatusViews'
import { useAuth } from './AuthContext'
import { FormMessage } from './FormParts'

export function AccountPage() {
  const { status, user, signOut } = useAuth()
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'loading') return <LoadingList label="Loading your account" count={1} />
  if (status === 'unavailable') return <Navigate to="/" replace />
  if (status === 'signedOut') {
    // After choosing "Sign out" go home; otherwise this is someone who needs to sign in first.
    return leaving ? <Navigate to="/" replace /> : <Navigate to="/login" replace state={{ from: '/account' }} />
  }

  async function handleSignOut() {
    setLeaving(true)
    setError(null)
    const result = await signOut()
    if (!result.ok) {
      setLeaving(false)
      setError(result.message)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-5 pt-2 md:pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Your account</h1>

      <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        <div>
          <p className="text-sm font-semibold text-ink-soft">Signed in as</p>
          <p className="break-all text-lg font-semibold">{user?.email}</p>
        </div>
        <p className="text-ink-soft">
          Your saved dishes and restaurants are kept on this device for now.
        </p>
        <Button variant="secondary" className="w-full" onClick={handleSignOut} disabled={leaving}>
          {leaving ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </div>
  )
}
