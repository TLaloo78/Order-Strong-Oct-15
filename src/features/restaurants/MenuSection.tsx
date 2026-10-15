import { useSearchParams } from 'react-router'
import { Button } from '../../components/Button'
import { Chip, FilterGroup } from '../../components/Chip'
import { EmptyState } from '../../components/StatusViews'
import { PRICE_PRESETS } from '../../lib/price'
import { filterDishes, MIN_PROTEIN_OPTIONS, sortDishes } from '../../lib/protein'
import type { Dish } from '../../types/restaurant'
import { DishRow } from './DishCards'
import { hasActiveFilters, parseMenuParams, SORT_OPTIONS } from './menuParams'

/** The full menu, ranked by protein, with price / minimum-protein filters and sorting. */
export function MenuSection({ dishes }: { dishes: Dish[] }) {
  const [params, setParams] = useSearchParams()
  const filters = parseMenuParams(params)

  function update(key: 'price' | 'minProtein' | 'sort', value: string | undefined) {
    const next = new URLSearchParams(params)
    if (value === undefined) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const visible = sortDishes(
    filterDishes(dishes, { priceRange: filters.price.range, minProtein: filters.minProtein }),
    filters.sort,
  )

  return (
    <section aria-labelledby="full-menu" className="space-y-4">
      <div>
        <h2 id="full-menu" className="text-xl font-bold">
          Full menu
        </h2>
        <p className="text-ink-soft">Every dish, ranked by protein.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-line bg-surface p-4">
        <FilterGroup label="Price">
          {PRICE_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              selected={preset.id === filters.price.id}
              onClick={() => update('price', preset.id === 'any' ? undefined : preset.id)}
            >
              {preset.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Minimum protein">
          <Chip selected={filters.minProtein === undefined} onClick={() => update('minProtein', undefined)}>
            Any
          </Chip>
          {MIN_PROTEIN_OPTIONS.map((grams) => (
            <Chip
              key={grams}
              selected={filters.minProtein === grams}
              onClick={() => update('minProtein', String(grams))}
            >
              {grams}g+
            </Chip>
          ))}
        </FilterGroup>

        <div>
          <label htmlFor="menu-sort" className="mb-1.5 block text-sm font-semibold text-ink-soft">
            Sort by
          </label>
          <select
            id="menu-sort"
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value === 'protein' ? undefined : e.target.value)}
            className="min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-base md:w-64"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <output className="block text-sm text-ink-soft">
        Showing {visible.length} of {dishes.length} dishes
      </output>

      {visible.length === 0 ? (
        <EmptyState
          title="No dishes match those filters"
          action={
            hasActiveFilters(filters) ? (
              <Button
                variant="secondary"
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.delete('price')
                  next.delete('minProtein')
                  setParams(next, { replace: true })
                }}
              >
                Clear filters
              </Button>
            ) : null
          }
        >
          Try a lower protein minimum or a wider price range.
        </EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {visible.map((dish) => (
            <DishRow key={dish.id} dish={dish} />
          ))}
        </ul>
      )}
    </section>
  )
}
