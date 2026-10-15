import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * True when both env vars are set. Tests always use the mock data so they stay
 * offline and deterministic, even if a .env.local exists.
 */
export const isSupabaseConfigured = Boolean(url && key) && import.meta.env.MODE !== 'test'

/** The browser client, or null when Supabase isn't configured (the app then uses mock data). */
export const supabase = isSupabaseConfigured
  ? createClient<Database>(url as string, key as string)
  : null
