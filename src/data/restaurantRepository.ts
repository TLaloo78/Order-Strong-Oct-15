// Data-access layer for restaurants and dishes. Components import from here only.
//
// Uses Supabase when VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set
// (see .env.example); otherwise falls back to the local mock data.
import { mockRestaurantRepository } from './mockRestaurantRepository'
import { createSupabaseRestaurantRepository } from './supabaseRestaurantRepository'
import { supabase } from './supabaseClient'
import type { RestaurantRepository } from './types'

const repository: RestaurantRepository = supabase
  ? createSupabaseRestaurantRepository(supabase)
  : mockRestaurantRepository

export const {
  searchRestaurants,
  getRestaurant,
  getRestaurantsByIds,
  getDishesForRestaurant,
  getDishesByIds,
} = repository
