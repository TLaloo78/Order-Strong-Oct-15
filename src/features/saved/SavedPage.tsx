import { Link } from 'react-router'
import { Button } from '../../components/Button'
import { ProteinRange } from '../../components/ProteinInfo'
import { EmptyState, ErrorState, LoadingList } from '../../components/StatusViews'
import { getDishesByIds, getRestaurantsByIds } from '../../data/restaurantRepository'
import { dishPath, restaurantPath } from '../../lib/paths'
import { formatPrice, priceLevelLabel } from '../../lib/price'
import { useAsync } from '../../lib/useAsync'
import type { Dish, Restaurant } from '../../types/restaurant'
import { useSaved } from './SavedContext'

export function SavedPage() {
  const { ready } = useSaved()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Saved</h1>
      {ready ? <SavedContent /> : <LoadingList label="Loading saved items" count={2} />}
    </div>
  )
}

function SavedContent() {
  const { saved, removeDish, toggleRestaurant } = useSaved()

  // Details are fetched once when the page opens; removals just filter the lists below.
  const { state, retry } = useAsync(async () => {
    const [dishes, restaurants] = await Promise.all([
      getDishesByIds(saved.dishes.map((d) => d.dishId)),
      getRestaurantsByIds([
        ...new Set([...saved.restaurantIds, ...saved.dishes.map((d) => d.restaurantId)]),
      ]),
    ])
    return { dishes, restaurants }
  }, 'details')

  if (saved.restaurantIds.length === 0 && saved.dishes.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        action={
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-white hover:bg-brand-dark"
          >
            Find a restaurant
          </Link>
        }
      >
        Save dishes you like, or mark one as “Going here” when you've decided.
      </EmptyState>
    )
  }

  if (state.status === 'loading') return <LoadingList label="Loading saved items" count={2} />
  if (state.status === 'error') {
    return <ErrorState message="We couldn't load your saved items." onRetry={retry} />
  }

  const dishById = new Map(state.data.dishes.map((d) => [d.id, d]))
  const restaurantById = new Map(state.data.restaurants.map((r) => [r.id, r]))

  const entries = saved.dishes.flatMap((entry) => {
    const dish = dishById.get(entry.dishId)
    const restaurant = restaurantById.get(entry.restaurantId)
    return dish && restaurant ? [{ entry, dish, restaurant }] : []
  })
  const going = entries.filter((e) => e.entry.goingHere)
  const savedDishes = entries.filter((e) => !e.entry.goingHere && e.entry.saved)
  const savedRestaurants = saved.restaurantIds.flatMap((id) => {
    const restaurant = restaurantById.get(id)
    return restaurant ? [restaurant] : []
  })

  return (
    <div className="space-y-8">
      {going.length > 0 ? (
        <Section title="Going here" hint="Your picks for this visit.">
          {going.map(({ dish, restaurant }) => (
            <SavedDishItem
              key={dish.id}
              dish={dish}
              restaurant={restaurant}
              onRemove={() => removeDish(dish.id)}
            />
          ))}
        </Section>
      ) : null}

      {savedDishes.length > 0 ? (
        <Section title="Saved dishes">
          {savedDishes.map(({ dish, restaurant }) => (
            <SavedDishItem
              key={dish.id}
              dish={dish}
              restaurant={restaurant}
              onRemove={() => removeDish(dish.id)}
            />
          ))}
        </Section>
      ) : null}

      {savedRestaurants.length > 0 ? (
        <Section title="Saved restaurants">
          {savedRestaurants.map((restaurant) => (
            <SavedRestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              onRemove={() => toggleRestaurant(restaurant.id)}
            />
          ))}
        </Section>
      ) : null}
    </div>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  const id = `saved-${title.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <section aria-labelledby={id} className="space-y-3">
      <div>
        <h2 id={id} className="text-xl font-bold">
          {title}
        </h2>
        {hint ? <p className="text-ink-soft">{hint}</p> : null}
      </div>
      <ul className="grid gap-3 md:grid-cols-2">{children}</ul>
    </section>
  )
}

function SavedDishItem({
  dish,
  restaurant,
  onRemove,
}: {
  dish: Dish
  restaurant: Restaurant
  onRemove: () => void
}) {
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card">
      <Link to={dishPath(restaurant.id, dish.id)} className="block">
        <h3 className="font-bold leading-snug">{dish.name}</h3>
        <p className="text-ink-soft">
          {restaurant.name} · {formatPrice(dish.price)}
        </p>
        <div className="mt-1.5">
          <ProteinRange estimate={dish.protein} />
        </div>
      </Link>
      <div className="mt-3">
        <Button variant="secondary" onClick={onRemove}>
          Remove<span className="sr-only"> {dish.name}</span>
        </Button>
      </div>
    </li>
  )
}

function SavedRestaurantItem({
  restaurant,
  onRemove,
}: {
  restaurant: Restaurant
  onRemove: () => void
}) {
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card">
      <Link to={restaurantPath(restaurant.id)} className="block">
        <h3 className="font-bold leading-snug">{restaurant.name}</h3>
        <p className="text-ink-soft">
          {restaurant.cuisine} · {priceLevelLabel(restaurant.priceLevel)} ·{' '}
          {restaurant.distanceMi.toFixed(1)} mi
        </p>
      </Link>
      <div className="mt-3">
        <Button variant="secondary" onClick={onRemove}>
          Remove<span className="sr-only"> {restaurant.name}</span>
        </Button>
      </div>
    </li>
  )
}
