import { Link } from 'react-router'
import { ProteinRange } from '../../components/ProteinInfo'
import { formatPrice, priceLevelLabel } from '../../lib/price'
import { restaurantPath } from '../../lib/paths'
import type { RestaurantSummary } from '../../types/restaurant'

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSummary }) {
  const { bestPick } = restaurant
  return (
    <li>
      <Link
        to={restaurantPath(restaurant.id)}
        className="block h-full rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold leading-snug">{restaurant.name}</h2>
            <p className="text-ink-soft">
              {restaurant.cuisine} · {priceLevelLabel(restaurant.priceLevel)} ·{' '}
              {restaurant.distanceMi.toFixed(1)} mi
            </p>
          </div>
          <span aria-hidden="true" className="text-2xl leading-none text-brand">
            ›
          </span>
        </div>

        {bestPick ? (
          <div className="mt-3 rounded-xl bg-cream p-3">
            <p className="text-sm font-semibold text-ink-soft">Best protein pick</p>
            <p className="mt-0.5 font-semibold">
              {bestPick.name}{' '}
              <span className="font-normal text-ink-soft">· {formatPrice(bestPick.price)}</span>
            </p>
            <div className="mt-1">
              <ProteinRange estimate={bestPick.protein} />
            </div>
          </div>
        ) : null}
      </Link>
    </li>
  )
}
