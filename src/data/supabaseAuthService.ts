import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { AppUser, AuthEvent } from '../types/auth'
import type { AuthService } from './authService'
import type { Database } from './database.types'

interface AuthErrorLike {
  code?: string
  name?: string
  message: string
}

/** Turns a Supabase auth error into a short, friendly message. Raw error text is never shown. */
export function friendlyAuthError(error: AuthErrorLike): string {
  switch (error.code) {
    case 'invalid_credentials':
      return "That email and password don't match. Check them and try again."
    case 'email_not_confirmed':
      return 'Please confirm your email first. We sent you a link when you created your account.'
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with that email already exists. Try signing in instead.'
    case 'weak_password':
      return 'Choose a stronger password with at least 8 characters.'
    case 'same_password':
      return 'Choose a password that is different from your current one.'
    case 'signup_disabled':
      return "New accounts aren't being accepted right now."
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Please wait a few minutes and try again.'
    case 'session_not_found':
    case 'session_expired':
    case 'refresh_token_not_found':
      return 'Your session has ended. Please sign in again.'
  }
  if (error.name === 'AuthRetryableFetchError') {
    return "We couldn't reach the server. Check your connection and try again."
  }
  return 'Something went wrong. Please try again.'
}

function toAppUser(user: User): AppUser {
  return { id: user.id, email: user.email ?? '' }
}

function toAuthEvent(event: string): AuthEvent {
  switch (event) {
    case 'INITIAL_SESSION':
    case 'SIGNED_IN':
    case 'SIGNED_OUT':
    case 'PASSWORD_RECOVERY':
      return event
    default:
      return 'OTHER'
  }
}

export function createSupabaseAuthService(client: SupabaseClient<Database>): AuthService {
  // Where Supabase sends people back to after they click an email link.
  // These URLs must be in the project's Auth > URL Configuration > Redirect URLs list.
  const origin = () => window.location.origin

  return {
    available: true,

    subscribe(listener) {
      // Fires INITIAL_SESSION right away, then SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, and so on.
      // Keep this callback synchronous: calling other Supabase methods inside it can deadlock.
      const { data } = client.auth.onAuthStateChange((event, session) => {
        listener({
          event: toAuthEvent(event),
          user: session?.user ? toAppUser(session.user) : null,
        })
      })
      return () => data.subscription.unsubscribe()
    },

    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password })
      return error ? { ok: false, message: friendlyAuthError(error) } : { ok: true }
    },

    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: origin() },
      })
      if (error) return { ok: false, message: friendlyAuthError(error) }
      // No session means email confirmation is on. This is also what Supabase returns for an
      // email that is already registered, so the message stays the same either way.
      return { ok: true, needsConfirmation: !data.session }
    },

    async requestPasswordReset(email) {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin()}/reset-password`,
      })
      return error ? { ok: false, message: friendlyAuthError(error) } : { ok: true }
    },

    async updatePassword(password) {
      const { error } = await client.auth.updateUser({ password })
      return error ? { ok: false, message: friendlyAuthError(error) } : { ok: true }
    },

    async signOut() {
      const { error } = await client.auth.signOut()
      return error ? { ok: false, message: friendlyAuthError(error) } : { ok: true }
    },
  }
}
