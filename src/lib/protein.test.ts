import { describe, expect, it } from 'vitest'
import type { Dish } from '../types/restaurant'
import { PRICE_PRESETS } from './price'
import {
  filterDishes,
  formatProteinRange,
  proteinPerDollar,
  rankByProtein,
  sortDishes,
  topPicks,
} from './protein'

function dish(id: string, price: number, minG: number, maxG: number, confidence: Dish['protein']['confidence'] = 'medium'): Dish {
  return {
    id,
    restaurantId: 'r1',
    name: id,
    description: '',
    price,
    protein: { minG, maxG, confidence },
    customizationTip: '',
    customizations: [],
    whyEstimate: '',
  }
}

const chicken = dish('chicken', 18, 40, 48) // midpoint 44, 2.4/$
const salad = dish('salad', 9, 20, 24) // midpoint 22, 2.4/$ (ties chicken on value)
const steak = dish('steak', 40, 50, 60) // midpoint 55, 1.4/$
const soup = dish('soup', 6, 10, 14) // midpoint 12, 2.0/$
const menu = [salad, steak, soup, chicken]

describe('protein ranking', () => {
  it('ranks by estimated midpoint, highest first, without mutating the input', () => {
    const input = [...menu]
    expect(rankByProtein(input).map((d) => d.id)).toEqual(['steak', 'chicken', 'salad', 'soup'])
    expect(input).toEqual(menu)
  })

  it('breaks protein ties by confidence, then by protein per dollar', () => {
    const sure = dish('sure', 20, 30, 40, 'high')
    const unsure = dish('unsure', 20, 30, 40, 'low')
    const cheaper = dish('cheaper', 10, 30, 40, 'high')
    expect(rankByProtein([unsure, sure, cheaper]).map((d) => d.id)).toEqual([
      'cheaper',
      'sure',
      'unsure',
    ])
  })

  it('returns the top N picks', () => {
    expect(topPicks(menu, 3).map((d) => d.id)).toEqual(['steak', 'chicken', 'salad'])
    expect(topPicks([salad], 3)).toHaveLength(1)
  })

  it('computes protein per dollar from the midpoint', () => {
    expect(proteinPerDollar(chicken)).toBeCloseTo(44 / 18)
    expect(proteinPerDollar(dish('free', 0, 10, 20))).toBe(0)
  })

  it('formats the estimate as a range', () => {
    expect(formatProteinRange(chicken.protein)).toBe('40–48g')
  })
})

describe('sorting', () => {
  it('sorts by protein per dollar, falling back to protein on ties', () => {
    expect(sortDishes(menu, 'proteinPerDollar').map((d) => d.id)).toEqual([
      'chicken',
      'salad',
      'soup',
      'steak',
    ])
  })

  it('sorts by lowest price first', () => {
    expect(sortDishes(menu, 'price').map((d) => d.id)).toEqual(['soup', 'salad', 'chicken', 'steak'])
  })
})

describe('filtering', () => {
  const preset = (id: string) => PRICE_PRESETS.find((p) => p.id === id)!.range

  it('filters by minimum protein using the estimate midpoint', () => {
    expect(filterDishes(menu, { minProtein: 30 }).map((d) => d.id)).toEqual(['steak', 'chicken'])
    expect(filterDishes(menu, { minProtein: 20 }).map((d) => d.id)).toEqual([
      'salad',
      'steak',
      'chicken',
    ])
  })

  it('filters by price range, inclusive at both ends', () => {
    expect(filterDishes(menu, { priceRange: preset('15-30') }).map((d) => d.id)).toEqual(['chicken'])
    expect(filterDishes(menu, { priceRange: { min: 9, max: 18 } }).map((d) => d.id)).toEqual([
      'salad',
      'chicken',
    ])
  })

  it('keeps a $15 dish out of "Under $15" and a $30 dish out of "$30+"', () => {
    const fifteen = dish('fifteen', 15, 20, 30)
    const thirty = dish('thirty', 30, 20, 30)
    expect(filterDishes([fifteen], { priceRange: preset('under-15') })).toHaveLength(0)
    expect(filterDishes([thirty], { priceRange: preset('30-plus') })).toHaveLength(0)
  })

  it('combines filters', () => {
    expect(
      filterDishes(menu, { priceRange: preset('under-15'), minProtein: 20 }).map((d) => d.id),
    ).toEqual(['salad'])
  })

  it('returns everything when no filters are set', () => {
    expect(filterDishes(menu, {})).toHaveLength(menu.length)
  })
})
