import type {
  Dish,
  Restaurant,
  RestaurantSearchParams,
  RestaurantSummary,
} from '../types/restaurant'

/** The contract every restaurant data source (mock, Supabase) implements. */
export interface RestaurantRepository {
  /** Restaurants matching the search, nearest first, each with its best protein pick. */
  searchRestaurants(params?: RestaurantSearchParams): Promise<RestaurantSummary[]>
  /** Resolves to null when no restaurant has this id. Rejects on errors. */
  getRestaurant(id: string): Promise<Restaurant | null>
  getRestaurantsByIds(ids: string[]): Promise<Restaurant[]>
  getDishesForRestaurant(restaurantId: string): Promise<Dish[]>
  getDishesByIds(ids: string[]): Promise<Dish[]>
}
