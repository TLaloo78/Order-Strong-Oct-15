import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, type AuthService } from '../../data/authService'
import type { AppUser } from '../../types/auth'
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext'

interface AuthState {
  status: AuthStatus
  user: AppUser | null
  recovering: boolean
}

export function AuthProvider({
  service = authService,
  children,
}: {
  /** Override in tests. Defaults to Supabase Auth (or "unavailable" without Supabase settings). */
  service?: AuthService
  children: ReactNode
}) {
  const [state, setState] = useState<AuthState>({
    status: service.available ? 'loading' : 'unavailable',
    user: null,
    recovering: false,
  })

  useEffect(() => {
    if (!service.available) return
    return service.subscribe(({ event, user }) => {
      setState((prev) => ({
        status: user ? 'signedIn' : 'signedOut',
        user,
        recovering: user ? prev.recovering || event === 'PASSWORD_RECOVERY' : false,
      }))
    })
  }, [service])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signIn: (email, password) => service.signIn(email, password),
      signUp: (email, password) => service.signUp(email, password),
      requestPasswordReset: (email) => service.requestPasswordReset(email),
      updatePassword: async (password) => {
        const result = await service.updatePassword(password)
        if (result.ok) setState((prev) => ({ ...prev, recovering: false }))
        return result
      },
      signOut: () => service.signOut(),
    }),
    [state, service],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
