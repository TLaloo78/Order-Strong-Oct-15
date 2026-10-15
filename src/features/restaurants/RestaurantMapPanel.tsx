import { lazy, Suspense, useState } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ErrorState, LoadingList } from '../../components/StatusViews'
import type { RestaurantSummary } from '../../types/restaurant'
import { RestaurantCard } from './RestaurantCard'

// Loaded on demand so the map library isn't part of the first download.
const RestaurantMap = lazy(() => import('./RestaurantMap'))

/** The map plus the card for whichever pin is selected. */
export function RestaurantMapPanel({ restaurants }: { restaurants: RestaurantSummary[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = restaurants.find((r) => r.id === selectedId) ?? null

  return (
    <div className="space-y-3">
      <ErrorBoundary
        fallback={(reset) => (
          <ErrorState message="We couldn't load the map right now." onRetry={reset} />
        )}
      >
        <Suspense fallback={<LoadingList label="Loading map" count={1} />}>
          <RestaurantMap restaurants={restaurants} selectedId={selectedId} onSelect={setSelectedId} />
        </Suspense>
      </ErrorBoundary>

      <output className="block text-sm text-ink-soft">
        {selected
          ? `Selected: ${selected.name}`
          : 'Select a pin to see that restaurant’s best protein pick. Pins show the price level.'}
      </output>

      {selected ? (
        <ul>
          <RestaurantCard restaurant={selected} />
        </ul>
      ) : null}
    </div>
  )
}
