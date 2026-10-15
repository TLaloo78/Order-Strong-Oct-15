import { useSearchParams } from 'react-router'
import { Button } from '../../components/Button'
import { Chip, FilterGroup } from '../../components/Chip'
import { EmptyState, ErrorState, LoadingList } from '../../components/StatusViews'
import { searchRestaurants } from '../../data/restaurantRepository'
import { DEFAULT_HOME_PRICE_ID, getPricePreset, PRICE_PRESETS } from '../../lib/price'
import { useAsync } from '../../lib/useAsync'
import { useDebouncedValue } from '../../lib/useDebouncedValue'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantMapPanel } from './RestaurantMapPanel'

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const price = getPricePreset(params.get('price'), DEFAULT_HOME_PRICE_ID)
  const view = params.get('view') === 'map' ? 'map' : 'list'
  const debouncedQuery = useDebouncedValue(query)

  const { state, retry } = useAsync(
    () => searchRestaurants({ query: debouncedQuery, priceRange: price.range }),
    `${debouncedQuery}|${price.id}`,
  )

  function update(next: { q?: string; price?: string; view?: 'list' | 'map' }) {
    const merged = new URLSearchParams(params)
    if (next.q !== undefined) {
      if (next.q) merged.set('q', next.q)
      else merged.delete('q')
    }
    if (next.price !== undefined) merged.set('price', next.price)
    if (next.view !== undefined) {
      if (next.view === 'map') merged.set('view', 'map')
      else merged.delete('view')
    }
    setParams(merged, { replace: true })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          What should you order today?
        </h1>
        <p className="mt-1 max-w-xl text-ink-soft">
          Pick a restaurant to see the dishes that give you the most protein for your money.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="restaurant-search" className="mb-1.5 block text-sm font-semibold text-ink-soft">
            Search restaurants or cuisines
          </label>
          <input
            id="restaurant-search"
            type="search"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Try “Mediterranean” or “Grill”"
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-base placeholder:text-ink-soft md:max-w-md"
          />
        </div>

        <FilterGroup label="Typical entrée price">
          {PRICE_PRESETS.map((preset) => (
            <Chip
              key={preset.id}
              selected={preset.id === price.id}
              onClick={() => update({ price: preset.id })}
            >
              {preset.label}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      <section aria-labelledby="near-you">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="near-you" className="text-lg font-bold">
            Near you
          </h2>
          <fieldset className="m-0 flex min-w-0 gap-2 border-0 p-0">
            <legend className="sr-only">View</legend>
            <Chip selected={view === 'list'} onClick={() => update({ view: 'list' })}>
              List
            </Chip>
            <Chip selected={view === 'map'} onClick={() => update({ view: 'map' })}>
              Map
            </Chip>
          </fieldset>
        </div>
        <p className="mb-3 text-sm text-ink-soft">Sample restaurants, locations and distances</p>

        {state.status === 'loading' ? <LoadingList label="Loading restaurants" /> : null}

        {state.status === 'error' ? (
          <ErrorState message="We couldn't load restaurants right now." onRetry={retry} />
        ) : null}

        {state.status === 'success' && state.data.length === 0 ? (
          <EmptyState
            title="No restaurants match"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  const cleared = new URLSearchParams(params)
                  cleared.delete('q')
                  cleared.set('price', 'any')
                  setParams(cleared, { replace: true })
                }}
              >
                Clear search and price
              </Button>
            }
          >
            Try a different name or widen the price range.
          </EmptyState>
        ) : null}

        {state.status === 'success' && state.data.length > 0 ? (
          <>
            <output className="sr-only">
              {state.data.length} {state.data.length === 1 ? 'restaurant' : 'restaurants'} found
            </output>
            {view === 'map' ? (
              <RestaurantMapPanel restaurants={state.data} />
            ) : (
              <ul className="grid gap-3 md:grid-cols-2">
                {state.data.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </ul>
            )}
          </>
        ) : null}
      </section>
    </div>
  )
}
