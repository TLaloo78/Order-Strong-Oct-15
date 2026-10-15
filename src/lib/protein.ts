import type { Confidence, Dish, PriceRange, ProteinEstimate } from '../types/restaurant'

export type SortKey = 'protein' | 'proteinPerDollar' | 'price'

export const MIN_PROTEIN_OPTIONS = [20, 30, 40] as const

export interface DishFilters {
  priceRange?: PriceRange
  /** Keep dishes whose estimated midpoint is at least this many grams. */
  minProtein?: number
}

const CONFIDENCE_RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 }

export function midpoint(estimate: ProteinEstimate): number {
  return (estimate.minG + estimate.maxG) / 2
}

/** Grams of protein per dollar, using the estimate's midpoint. */
export function proteinPerDollar(dish: Dish): number {
  return dish.price > 0 ? midpoint(dish.protein) / dish.price : 0
}

export function formatProteinRange(estimate: ProteinEstimate): string {
  return `${estimate.minG}–${estimate.maxG}g`
}

export function formatProteinPerDollar(dish: Dish): string {
  return `${proteinPerDollar(dish).toFixed(1)}g per $`
}

export function confidenceLabel(confidence: Confidence): string {
  return { high: 'High', medium: 'Medium', low: 'Low' }[confidence]
}

function byProtein(a: Dish, b: Dish): number {
  return (
    midpoint(b.protein) - midpoint(a.protein) ||
    CONFIDENCE_RANK[b.protein.confidence] - CONFIDENCE_RANK[a.protein.confidence] ||
    proteinPerDollar(b) - proteinPerDollar(a) ||
    a.name.localeCompare(b.name)
  )
}

function byProteinPerDollar(a: Dish, b: Dish): number {
  return proteinPerDollar(b) - proteinPerDollar(a) || byProtein(a, b)
}

function byPrice(a: Dish, b: Dish): number {
  return a.price - b.price || byProtein(a, b)
}

const COMPARATORS: Record<SortKey, (a: Dish, b: Dish) => number> = {
  protein: byProtein,
  proteinPerDollar: byProteinPerDollar,
  price: byPrice,
}

/** Returns a new array; the input is not mutated. */
export function sortDishes(dishes: readonly Dish[], sort: SortKey = 'protein'): Dish[] {
  return [...dishes].sort(COMPARATORS[sort])
}

export function rankByProtein(dishes: readonly Dish[]): Dish[] {
  return sortDishes(dishes, 'protein')
}

export function topPicks(dishes: readonly Dish[], count = 3): Dish[] {
  return rankByProtein(dishes).slice(0, count)
}

export function filterDishes(dishes: readonly Dish[], filters: DishFilters): Dish[] {
  const { priceRange, minProtein } = filters
  return dishes.filter((dish) => {
    if (priceRange && (dish.price < priceRange.min || dish.price > priceRange.max)) return false
    if (minProtein !== undefined && midpoint(dish.protein) < minProtein) return false
    return true
  })
}
