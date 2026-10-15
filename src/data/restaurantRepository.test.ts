import { afterEach, describe, expect, it } from 'vitest'
import { PRICE_PRESETS } from '../lib/price'
import {
  getDishesByIds,
  getDishesForRestaurant,
  getRestaurant,
  searchRestaurants,
} from './restaurantRepository'
import { setSimulation } from './simulate'

afterEach(() => setSimulation({ delayMs: 0, fail: false }))

describe('restaurantRepository', () => {
  it('returns all restaurants nearest first, each with a best pick', async () => {
    const results = await searchRestaurants()
    expect(results.length).toBeGreaterThanOrEqual(8)
    const distances = results.map((r) => r.distanceMi)
    expect(distances).toEqual([...distances].sort((a, b) => a - b))
    for (const r of results) {
      expect(r.bestPick?.restaurantId).toBe(r.id)
    }
  })

  it("picks the dish with the most estimated protein as each restaurant's best pick", async () => {
    const [first] = await searchRestaurants({ query: 'Prairie' })
    const dishes = await getDishesForRestaurant(first!.id)
    const best = Math.max(...dishes.map((d) => (d.protein.minG + d.protein.maxG) / 2))
    expect(first!.bestPick!.protein.minG + first!.bestPick!.protein.maxG).toBe(best * 2)
  })

  it('searches by name or cuisine, ignoring case and whitespace', async () => {
    const byName = await searchRestaurants({ query: '  ember ' })
    expect(byName.map((r) => r.name)).toEqual(['Ember & Oak Grill'])

    const byCuisine = await searchRestaurants({ query: 'mediterranean' })
    expect(byCuisine.length).toBe(2)
    expect(byCuisine.every((r) => r.cuisine === 'Mediterranean')).toBe(true)
  })

  it('filters by whether the typical entrée range overlaps the price range', async () => {
    const range = PRICE_PRESETS.find((p) => p.id === '15-30')!.range
    const results = await searchRestaurants({ priceRange: range })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.entreeMinPrice <= 30 && r.entreeMaxPrice >= 15)).toBe(true)
    // The café tops out at $16, so it overlaps; nothing here is excluded for being cheap.
    expect(results.some((r) => r.id === 'sunday-grounds')).toBe(true)

    const premium = await searchRestaurants({ priceRange: PRICE_PRESETS.find((p) => p.id === '30-plus')!.range })
    expect(premium.map((r) => r.id)).toContain('prairie-pine')
    expect(premium.map((r) => r.id)).not.toContain('sunday-grounds')
  })

  it('returns an empty list when nothing matches', async () => {
    expect(await searchRestaurants({ query: 'zzzz' })).toEqual([])
  })

  it('gets one restaurant, or null when the id is unknown', async () => {
    expect((await getRestaurant('lotus-table'))?.name).toBe('Lotus Table')
    expect(await getRestaurant('nope')).toBeNull()
  })

  it('gives every restaurant a map position near the sample location', async () => {
    for (const r of await searchRestaurants()) {
      expect(r.latitude).toBeGreaterThan(41.7)
      expect(r.latitude).toBeLessThan(42.0)
      expect(r.longitude).toBeGreaterThan(-88.3)
      expect(r.longitude).toBeLessThan(-87.9)
    }
    const ids = (await searchRestaurants()).map((r) => `${r.latitude},${r.longitude}`)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has 6-10 dishes for every restaurant, belonging to that restaurant', async () => {
    const restaurants = await searchRestaurants()
    for (const r of restaurants) {
      const dishes = await getDishesForRestaurant(r.id)
      expect(dishes.length).toBeGreaterThanOrEqual(6)
      expect(dishes.length).toBeLessThanOrEqual(10)
      expect(dishes.every((d) => d.restaurantId === r.id)).toBe(true)
    }
  })

  it('looks up dishes by id', async () => {
    const dishes = await getDishesForRestaurant('casa-marigold')
    const found = await getDishesByIds([dishes[0]!.id, 'missing'])
    expect(found).toEqual([dishes[0]])
  })

  it('rejects when a network failure is simulated', async () => {
    setSimulation({ fail: true })
    await expect(searchRestaurants()).rejects.toThrow('Simulated network failure')
    await expect(getRestaurant('lotus-table')).rejects.toThrow('Simulated')
  })
})
