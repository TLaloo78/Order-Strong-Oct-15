import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import type { Database } from './database.types'
import {
  createSupabaseRestaurantRepository,
  ilikeContains,
  toDish,
  toRestaurant,
} from './supabaseRestaurantRepository'

type Call = [method: string, args: unknown[]]

/** A stand-in for the Supabase query builder: records calls, resolves to `result` when awaited. */
function fakeClient(result: { data: unknown; error: { message: string } | null }) {
  const calls: Call[] = []
  const builder: object = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'then') {
          return (resolve: (value: unknown) => void) => resolve(result)
        }
        return (...args: unknown[]) => {
          calls.push([String(prop), args])
          return builder
        }
      },
    },
  )
  const client = {
    from: (table: string) => {
      calls.push(['from', [table]])
      return builder
    },
  } as unknown as SupabaseClient<Database>
  return { client, calls }
}

const restaurantRow = {
  id: 'ember-oak-grill',
  name: 'Ember & Oak Grill',
  cuisine: 'Grill',
  price_level: 2,
  entree_min_price: 14,
  entree_max_price: 26,
  distance_mi: 0.8,
  neighborhood: 'Main Street',
  latitude: 41.87751,
  longitude: -88.1097,
  blurb: 'Wood-fired grill.',
  created_at: '2026-10-08T00:00:00Z',
}

const dishRow = (id: string, minG: number, maxG: number, price: number) => ({
  id,
  restaurant_id: 'ember-oak-grill',
  name: id,
  description: '',
  price,
  protein_min_g: minG,
  protein_max_g: maxG,
  protein_confidence: 'high',
  customization_tip: 'Tip',
  customizations: ['One'],
  why_estimate: 'Because',
  created_at: '2026-10-08T00:00:00Z',
})

describe('row mapping', () => {
  it('maps a restaurant row to the app type', () => {
    expect(toRestaurant(restaurantRow)).toEqual({
      id: 'ember-oak-grill',
      name: 'Ember & Oak Grill',
      cuisine: 'Grill',
      priceLevel: 2,
      entreeMinPrice: 14,
      entreeMaxPrice: 26,
      distanceMi: 0.8,
      neighborhood: 'Main Street',
      latitude: 41.87751,
      longitude: -88.1097,
      blurb: 'Wood-fired grill.',
    })
  })

  it('maps a dish row, nesting the protein estimate', () => {
    expect(toDish(dishRow('d1', 40, 48, 17.5))).toMatchObject({
      id: 'd1',
      restaurantId: 'ember-oak-grill',
      price: 17.5,
      protein: { minG: 40, maxG: 48, confidence: 'high' },
      customizationTip: 'Tip',
      customizations: ['One'],
      whyEstimate: 'Because',
    })
  })
})

describe('ilikeContains', () => {
  it('wraps text in wildcards and quotes', () => {
    expect(ilikeContains('grill')).toBe('"%grill%"')
  })

  it('escapes LIKE wildcards and quote characters, and keeps commas/parens inside the quotes', () => {
    expect(ilikeContains('50%_off')).toBe('"%50\\\\%\\\\_off%"')
    expect(ilikeContains('a,b)"c')).toBe('"%a,b)\\"c%"')
  })
})

describe('createSupabaseRestaurantRepository', () => {
  it('searches with text and price filters, ordered nearest first, and attaches the best pick', async () => {
    const { client, calls } = fakeClient({
      data: [
        {
          ...restaurantRow,
          dishes: [dishRow('light', 20, 24, 10), dishRow('best', 44, 52, 19), dishRow('mid', 30, 36, 15)],
        },
      ],
      error: null,
    })
    const repo = createSupabaseRestaurantRepository(client)

    const results = await repo.searchRestaurants({
      query: ' grill ',
      priceRange: { min: 15, max: 30 },
    })

    expect(results).toHaveLength(1)
    expect(results[0]!.name).toBe('Ember & Oak Grill')
    expect(results[0]!.bestPick?.id).toBe('best')
    expect(calls).toContainEqual(['from', ['restaurants']])
    expect(calls).toContainEqual(['select', ['*, dishes(*)']])
    expect(calls).toContainEqual(['or', ['name.ilike."%grill%",cuisine.ilike."%grill%"']])
    expect(calls).toContainEqual(['lte', ['entree_min_price', 30]])
    expect(calls).toContainEqual(['gte', ['entree_max_price', 15]])
    expect(calls).toContainEqual(['order', ['distance_mi', { ascending: true }]])
  })

  it('skips the upper price bound when it is Infinity and the lower bound when it is 0', async () => {
    const { client, calls } = fakeClient({ data: [], error: null })
    await createSupabaseRestaurantRepository(client).searchRestaurants({
      priceRange: { min: 0, max: Infinity },
    })
    expect(calls.map(([method]) => method)).not.toContain('lte')
    expect(calls.map(([method]) => method)).not.toContain('gte')
    expect(calls.map(([method]) => method)).not.toContain('or')
  })

  it('returns null from getRestaurant when no row is found', async () => {
    const { client } = fakeClient({ data: null, error: null })
    expect(await createSupabaseRestaurantRepository(client).getRestaurant('nope')).toBeNull()
  })

  it('does not query when asked for no ids', async () => {
    const { client, calls } = fakeClient({ data: [], error: null })
    const repo = createSupabaseRestaurantRepository(client)
    expect(await repo.getDishesByIds([])).toEqual([])
    expect(await repo.getRestaurantsByIds([])).toEqual([])
    expect(calls).toHaveLength(0)
  })

  it('throws an Error with the database message when a query fails', async () => {
    const { client } = fakeClient({ data: null, error: { message: 'permission denied' } })
    await expect(createSupabaseRestaurantRepository(client).getDishesForRestaurant('x')).rejects.toThrow(
      'permission denied',
    )
  })
})
