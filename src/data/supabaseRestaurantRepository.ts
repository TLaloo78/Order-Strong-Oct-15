// Supabase implementation of the restaurant repository.
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { rankByProtein } from '../lib/protein'
import type { Confidence, Cuisine, Dish, Restaurant } from '../types/restaurant'
import type { Database } from './database.types'
import type { RestaurantRepository } from './types'

type RestaurantRow = Database['public']['Tables']['restaurants']['Row']
type DishRow = Database['public']['Tables']['dishes']['Row']

export function toRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    cuisine: row.cuisine as Cuisine,
    priceLevel: row.price_level as Restaurant['priceLevel'],
    entreeMinPrice: Number(row.entree_min_price),
    entreeMaxPrice: Number(row.entree_max_price),
    distanceMi: Number(row.distance_mi),
    neighborhood: row.neighborhood,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    blurb: row.blurb,
  }
}

export function toDish(row: DishRow): Dish {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    protein: {
      minG: row.protein_min_g,
      maxG: row.protein_max_g,
      confidence: row.protein_confidence as Confidence,
    },
    customizationTip: row.customization_tip,
    customizations: row.customizations,
    whyEstimate: row.why_estimate,
  }
}

/**
 * Builds a value for an `ilike` filter inside PostgREST's `or()` syntax:
 * escapes the LIKE wildcards in the user's text, then double-quotes it so
 * commas and parentheses can't break out of the filter.
 */
export function ilikeContains(text: string): string {
  const escapedLike = text.replace(/[\\%_]/g, '\\$&')
  const quoted = `%${escapedLike}%`.replace(/[\\"]/g, '\\$&')
  return `"${quoted}"`
}

function unwrap<T>(result: { data: T | null; error: PostgrestError | null }): T {
  if (result.error) throw new Error(result.error.message)
  return result.data as T
}

export function createSupabaseRestaurantRepository(
  client: SupabaseClient<Database>,
): RestaurantRepository {
  return {
    async searchRestaurants({ query = '', priceRange } = {}) {
      let request = client.from('restaurants').select('*, dishes(*)')

      const term = query.trim()
      if (term) {
        const pattern = ilikeContains(term)
        request = request.or(`name.ilike.${pattern},cuisine.ilike.${pattern}`)
      }
      if (priceRange) {
        // Keep restaurants whose typical entrée range overlaps the requested range.
        if (Number.isFinite(priceRange.max)) request = request.lte('entree_min_price', priceRange.max)
        if (priceRange.min > 0) request = request.gte('entree_max_price', priceRange.min)
      }

      const rows = unwrap(
        await request.order('distance_mi', { ascending: true }).order('name', { ascending: true }),
      )
      return rows.map(({ dishes, ...row }) => ({
        ...toRestaurant(row),
        bestPick: rankByProtein(dishes.map(toDish))[0] ?? null,
      }))
    },

    async getRestaurant(id) {
      const row = unwrap(await client.from('restaurants').select('*').eq('id', id).maybeSingle())
      return row ? toRestaurant(row) : null
    },

    async getRestaurantsByIds(ids) {
      if (ids.length === 0) return []
      const rows = unwrap(await client.from('restaurants').select('*').in('id', ids))
      return rows.map(toRestaurant)
    },

    async getDishesForRestaurant(restaurantId) {
      const rows = unwrap(await client.from('dishes').select('*').eq('restaurant_id', restaurantId))
      return rows.map(toDish)
    },

    async getDishesByIds(ids) {
      if (ids.length === 0) return []
      const rows = unwrap(await client.from('dishes').select('*').in('id', ids))
      return rows.map(toDish)
    },
  }
}
