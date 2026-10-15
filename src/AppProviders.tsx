import type { ReactNode } from 'react'
import type { AuthService } from './data/authService'
import { AuthProvider } from './features/auth/AuthProvider'
import { SavedProvider } from './features/saved/SavedProvider'

export function AppProviders({
  authService,
  children,
}: {
  authService?: AuthService
  children: ReactNode
}) {
  return (
    <AuthProvider service={authService}>
      <SavedProvider>{children}</SavedProvider>
    </AuthProvider>
  )
}
