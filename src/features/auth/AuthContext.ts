import { createContext, useContext } from 'react'
import type { AppUser, AuthResult } from '../../types/auth'

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn' | 'unavailable'

export interface AuthContextValue {
  status: AuthStatus
  user: AppUser | null
  /** True after someone opens a password-reset email link, until they choose a new password. */
  recovering: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult<{ needsConfirmation: boolean }>>
  requestPasswordReset: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
