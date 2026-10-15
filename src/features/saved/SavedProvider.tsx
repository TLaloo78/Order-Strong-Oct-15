import { useEffect, useMemo, useState, type ReactNode } from 'react'
import * as savedRepository from '../../data/savedRepository'
import type { SavedState } from '../../types/restaurant'
import { SavedContext, type SavedContextValue } from './SavedContext'

const INITIAL: SavedState = { restaurantIds: [], dishes: [] }

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedState>(INITIAL)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    savedRepository
      .getSaved()
      .then((state) => {
        if (!cancelled) setSaved(state)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<SavedContextValue>(() => {
    const apply = (next: Promise<SavedState>) => {
      next.then(setSaved).catch(() => {
        // Saving is best-effort; the UI simply keeps its previous state.
      })
    }
    const getSavedDish = (dishId: string) => saved.dishes.find((d) => d.dishId === dishId)

    return {
      saved,
      ready,
      isRestaurantSaved: (id) => saved.restaurantIds.includes(id),
      getSavedDish,
      toggleRestaurant: (id) =>
        apply(savedRepository.setRestaurantSaved(id, !saved.restaurantIds.includes(id))),
      toggleDishSaved: (restaurantId, dishId) =>
        apply(
          savedRepository.setDishSaved(restaurantId, dishId, !getSavedDish(dishId)?.saved),
        ),
      toggleGoingHere: (restaurantId, dishId) =>
        apply(
          savedRepository.setDishGoingHere(restaurantId, dishId, !getSavedDish(dishId)?.goingHere),
        ),
      removeDish: (dishId) => apply(savedRepository.removeDish(dishId)),
    }
  }, [saved, ready])

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}
