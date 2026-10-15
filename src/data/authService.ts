// Authentication service. Screens use this through AuthProvider, never the Supabase client directly.
//
// Uses Supabase Auth when Supabase is configured; otherwise sign-in is reported as unavailable.
import type { AuthChange, AuthResult } from '../types/auth'
import { supabase } from './supabaseClient'
import { createSupabaseAuthService } from './supabaseAuthService'

export interface AuthService {
  /** False when there is no backend to sign in to (the app then hides sign-in). */
  available: boolean
  /** Calls `listener` with the current state right away, then on every change. Returns an unsubscribe function. */
  subscribe(listener: (change: AuthChange) => void): () => void
  signIn(email: string, password: string): Promise<AuthResult>
  /** `needsConfirmation` is true when the person must confirm their email before signing in. */
  signUp(email: string, password: string): Promise<AuthResult<{ needsConfirmation: boolean }>>
  requestPasswordReset(email: string): Promise<AuthResult>
  updatePassword(password: string): Promise<AuthResult>
  signOut(): Promise<AuthResult>
}

const unavailable: AuthService = {
  available: false,
  subscribe: () => () => {},
  signIn: async () => ({ ok: false, message: 'Sign-in is not available right now.' }),
  signUp: async () => ({ ok: false, message: 'Sign-in is not available right now.' }),
  requestPasswordReset: async () => ({ ok: false, message: 'Sign-in is not available right now.' }),
  updatePassword: async () => ({ ok: false, message: 'Sign-in is not available right now.' }),
  signOut: async () => ({ ok: true }),
}

export const authService: AuthService = supabase
  ? createSupabaseAuthService(supabase)
  : unavailable
