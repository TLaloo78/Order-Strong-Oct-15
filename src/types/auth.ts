export interface AppUser {
  id: string
  email: string
}

export type AuthEvent =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'PASSWORD_RECOVERY'
  | 'OTHER'

export interface AuthChange {
  event: AuthEvent
  user: AppUser | null
}

/** Result of an auth action. `message` is safe to show to the user. */
export type AuthResult<T = object> = ({ ok: true } & T) | { ok: false; message: string }
