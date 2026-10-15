// Local mock implementation of the restaurant repository.
// Used when Supabase isn't configured (no .env.local) and in tests.
import { rangesOverlap } from '../lib/price'
import { rankByProtein } from '../lib/protein'
import { mockDishes } from './mock/dishes'
import { mockRestaurants } from './mock/restaurants'
import { simulateNetwork } from './simulate'
import type { RestaurantRepository } from './types'

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

export const mockRestaurantRepository: RestaurantRepository = {
  searchRestaurants({ query = '', priceRange } = {}) {
    return simulateNetwork(() => {
      const needle = normalize(query)
      return mockRestaurants
        .filter((r) => {
          if (needle && !normalize(`${r.name} ${r.cuisine}`).includes(needle)) return false
          if (priceRange && !rangesOverlap(r.entreeMinPrice, r.entreeMaxPrice, priceRange)) {
            return false
          }
          return true
        })
        .sort((a, b) => a.distanceMi - b.distanceMi)
        .map((r) => ({
          ...r,
          bestPick: rankByProtein(mockDishes.filter((d) => d.restaurantId === r.id))[0] ?? null,
        }))
    })
  },

  getRestaurant(id) {
    return simulateNetwork(() => mockRestaurants.find((r) => r.id === id) ?? null)
  },

  getRestaurantsByIds(ids) {
    return simulateNetwork(() => mockRestaurants.filter((r) => ids.includes(r.id)))
  },

  getDishesForRestaurant(restaurantId) {
    return simulateNetwork(() => mockDishes.filter((d) => d.restaurantId === restaurantId))
  },

  getDishesByIds(ids) {
    return simulateNetwork(() => mockDishes.filter((d) => ids.includes(d.id)))
  },
}
