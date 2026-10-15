import { DEFAULT_MENU_PRICE_ID, getPricePreset, type PricePreset } from '../../lib/price'
import { MIN_PROTEIN_OPTIONS, type SortKey } from '../../lib/protein'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'protein', label: 'Most protein' },
  { value: 'proteinPerDollar', label: 'Most protein per $' },
  { value: 'price', label: 'Lowest price' },
]

export interface MenuFilterState {
  price: PricePreset
  minProtein: number | undefined
  sort: SortKey
}

export function parseMenuParams(params: URLSearchParams): MenuFilterState {
  const minProtein = Number(params.get('minProtein'))
  const sort = params.get('sort')
  return {
    price: getPricePreset(params.get('price'), DEFAULT_MENU_PRICE_ID),
    minProtein: (MIN_PROTEIN_OPTIONS as readonly number[]).includes(minProtein) ? minProtein : undefined,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'protein',
  }
}

export function hasActiveFilters(filters: MenuFilterState): boolean {
  return filters.price.id !== DEFAULT_MENU_PRICE_ID || filters.minProtein !== undefined
}
