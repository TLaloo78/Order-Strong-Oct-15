import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router'
import { Button, ToggleButton } from '../../components/Button'
import { ProteinRange } from '../../components/ProteinInfo'
import { Sheet } from '../../components/Sheet'
import { restaurantPath } from '../../lib/paths'
import { formatPrice } from '../../lib/price'
import { formatProteinPerDollar } from '../../lib/protein'
import type { RestaurantOutletContext } from '../restaurants/RestaurantPage'
import { useSaved } from '../saved/SavedContext'

/** Rendered by the nested route /r/:restaurantId/dish/:dishId over the restaurant page. */
export function DishSheet() {
  const { dishId } = useParams()
  const { restaurant, dishes } = useOutletContext<RestaurantOutletContext>()
  const navigate = useNavigate()
  const location = useLocation()
  const { getSavedDish, toggleDishSaved, toggleGoingHere } = useSaved()

  const dish = dishes.find((d) => d.id === dishId)

  // Opened from the list: go back so filters and scroll position are kept.
  // Opened from a shared link: there is no list behind it, so go to the restaurant.
  function close() {
    if (location.key !== 'default') navigate(-1)
    else navigate({ pathname: restaurantPath(restaurant.id) }, { replace: true })
  }

  const entry = dish ? getSavedDish(dish.id) : undefined

  return (
    <Sheet labelledBy="dish-title" onClose={close}>
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 pb-3 pt-5">
        <div>
          <h2 id="dish-title" className="text-xl font-extrabold leading-snug">
            {dish ? dish.name : 'Dish not found'}
          </h2>
          <p className="text-ink-soft">{restaurant.name}</p>
        </div>
        <Button variant="secondary" onClick={close} aria-label="Close">
          <span aria-hidden="true">✕</span>
          <span className="max-md:sr-only">Close</span>
        </Button>
      </div>

      {dish ? (
        <>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <div className="space-y-1">
              <ProteinRange estimate={dish.protein} size="lg" />
              <p className="text-ink-soft">
                {formatPrice(dish.price)} · {formatProteinPerDollar(dish)}
              </p>
            </div>

            <p>{dish.description}</p>

            <section aria-labelledby="custom-heading">
              <h3 id="custom-heading" className="mb-1.5 text-lg font-bold">
                Ways to customize
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                {dish.customizations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="why-heading">
              <h3 id="why-heading" className="mb-1.5 text-lg font-bold">
                Why this estimate
              </h3>
              <p>{dish.whyEstimate}</p>
              <p className="mt-2 text-sm text-ink-soft">
                Protein values are estimates, not medical or dietary advice.
              </p>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-line bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <ToggleButton
              pressed={entry?.goingHere ?? false}
              onClick={() => toggleGoingHere(restaurant.id, dish.id)}
            >
              <span aria-hidden="true">{entry?.goingHere ? '✓' : '→'}</span>
              Going here
            </ToggleButton>
            <ToggleButton
              pressed={entry?.saved ?? false}
              onClick={() => toggleDishSaved(restaurant.id, dish.id)}
            >
              <span aria-hidden="true">{entry?.saved ? '✓' : '+'}</span>
              Save dish
            </ToggleButton>
          </div>
        </>
      ) : (
        <p className="px-5 py-6">That dish isn't on this menu anymore.</p>
      )}
    </Sheet>
  )
}
