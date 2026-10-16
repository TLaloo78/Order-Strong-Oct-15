import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { Button, ToggleButton } from '../../components/Button'
import { CuisineArt } from '../../components/illustrations/CuisineArt'
import { EmptyState, ErrorState, LoadingList } from '../../components/StatusViews'
import { getDishesForRestaurant, getRestaurant } from '../../data/restaurantRepository'
import { priceLevelLabel } from '../../lib/price'
import { topPicks } from '../../lib/protein'
import { useAsync } from '../../lib/useAsync'
import { useSaved } from '../saved/SavedContext'
import { PickCard } from './DishCards'
import { MenuSection } from './MenuSection'
import type { Dish, Restaurant } from '../../types/restaurant'

export interface RestaurantOutletContext {
  restaurant: Restaurant
  dishes: Dish[]
}

export function RestaurantPage() {
  const { restaurantId = '' } = useParams()
  const { state, retry } = useAsync(
    async () => {
      const [restaurant, dishes] = await Promise.all([
        getRestaurant(restaurantId),
        getDishesForRestaurant(restaurantId),
      ])
      return { restaurant, dishes }
    },
    restaurantId,
  )

  if (state.status === 'loading') return <LoadingList label="Loading restaurant" />
  if (state.status === 'error') {
    return <ErrorState message="We couldn't load this restaurant right now." onRetry={retry} />
  }
  const { restaurant, dishes } = state.data
  if (!restaurant) {
    return (
      <EmptyState title="We couldn't find that restaurant" action={<BackButton />}>
        It may have been removed. Head back to the list to pick another.
      </EmptyState>
    )
  }

  return (
    <RestaurantContent restaurant={restaurant} dishes={dishes} />
  )
}

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <Button
      variant="secondary"
      onClick={() => (location.key !== 'default' ? navigate(-1) : navigate('/'))}
    >
      ← Back
    </Button>
  )
}

function RestaurantContent({ restaurant, dishes }: RestaurantOutletContext) {
  const { isRestaurantSaved, toggleRestaurant } = useSaved()
  const picks = topPicks(dishes, 3)
  const outletContext: RestaurantOutletContext = { restaurant, dishes }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <BackButton />
          <ToggleButton
            pressed={isRestaurantSaved(restaurant.id)}
            onClick={() => toggleRestaurant(restaurant.id)}
          >
            <span aria-hidden="true">{isRestaurantSaved(restaurant.id) ? '✓' : '+'}</span>
            Save restaurant
          </ToggleButton>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 shadow-card md:p-4">
          <CuisineArt cuisine={restaurant.cuisine} className="size-20 shrink-0 md:size-28" />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{restaurant.name}</h1>
            <p className="text-ink-soft">
              {restaurant.cuisine} · {priceLevelLabel(restaurant.priceLevel)} ·{' '}
              {restaurant.distanceMi.toFixed(1)} mi · {restaurant.neighborhood}
            </p>
            <p className="mt-1 hidden text-ink-soft md:block">{restaurant.blurb}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="top-picks" className="space-y-3">
        <h2 id="top-picks" className="text-xl font-bold">
          Top 3 protein picks
        </h2>
        {picks.length === 0 ? (
          <EmptyState title="No menu yet">We don't have dishes for this restaurant.</EmptyState>
        ) : (
          <ol className="grid gap-3 md:grid-cols-3">
            {picks.map((dish, index) => (
              <PickCard key={dish.id} dish={dish} rank={index + 1} />
            ))}
          </ol>
        )}
        <p className="text-sm text-ink-soft">
          Protein values are estimates, not medical or dietary advice.
        </p>
      </section>

      <MenuSection dishes={dishes} />

      <Outlet context={outletContext} />
    </div>
  )
}
