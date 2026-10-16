import { Link, useLocation } from 'react-router'
import { ProteinIcon, ProteinSourceTag } from '../../components/illustrations/ProteinIcon'
import { ProteinRange } from '../../components/ProteinInfo'
import { dishPath } from '../../lib/paths'
import { formatPrice } from '../../lib/price'
import { formatProteinPerDollar } from '../../lib/protein'
import { proteinSource } from '../../lib/proteinSource'
import type { Dish } from '../../types/restaurant'

/** Keeps the current filters in the URL so closing the sheet returns to the same list. */
function useDishLink(dish: Dish) {
  const { search } = useLocation()
  return { pathname: dishPath(dish.restaurantId, dish.id), search }
}

export function PickCard({ dish, rank }: { dish: Dish; rank: number }) {
  const to = useDishLink(dish)
  return (
    <li>
      <Link
        to={to}
        className="flex h-full flex-col rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand"
          >
            {rank}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-snug">
              <span className="sr-only">Pick {rank}: </span>
              {dish.name}
            </h3>
            <p className="text-ink-soft">
              {formatPrice(dish.price)} · {formatProteinPerDollar(dish)}
            </p>
            <div className="mt-1">
              <ProteinSourceTag dish={dish} />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <ProteinRange estimate={dish.protein} />
        </div>

        <p className="mt-3 rounded-xl bg-cream p-3 text-base">
          <span className="font-semibold">Tip: </span>
          {dish.customizationTip}
        </p>
      </Link>
    </li>
  )
}

export function DishRow({ dish }: { dish: Dish }) {
  const to = useDishLink(dish)
  return (
    <li>
      <Link
        to={to}
        className="block rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-dark">
            <ProteinIcon source={proteinSource(dish)} className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-snug">{dish.name}</h3>
              <p className="shrink-0 font-semibold">{formatPrice(dish.price)}</p>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <ProteinRange estimate={dish.protein} />
              <p className="text-sm text-ink-soft">{formatProteinPerDollar(dish)}</p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
