import type { PriceRange } from '../types/restaurant'

export interface PricePreset {
  id: string
  label: string
  range: PriceRange
}

// Bounds are inclusive. 14.99 and 30.01 keep a $15 dish out of "Under $15"
// and a $30 dish out of "$30+".
export const PRICE_PRESETS: readonly PricePreset[] = [
  { id: 'any', label: 'Any price', range: { min: 0, max: Infinity } },
  { id: 'under-15', label: 'Under $15', range: { min: 0, max: 14.99 } },
  { id: '15-30', label: '$15–30', range: { min: 15, max: 30 } },
  { id: '30-plus', label: '$30+', range: { min: 30.01, max: Infinity } },
]

export const DEFAULT_HOME_PRICE_ID = '15-30'
export const DEFAULT_MENU_PRICE_ID = 'any'

export function getPricePreset(id: string | null | undefined, fallbackId: string): PricePreset {
  const found = PRICE_PRESETS.find((p) => p.id === id)
  if (found) return found
  return PRICE_PRESETS.find((p) => p.id === fallbackId) ?? PRICE_PRESETS[0]!
}

export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`
}

export function priceLevelLabel(level: 1 | 2 | 3): string {
  return '$'.repeat(level)
}

export function rangesOverlap(aMin: number, aMax: number, range: PriceRange): boolean {
  return aMin <= range.max && aMax >= range.min
}
