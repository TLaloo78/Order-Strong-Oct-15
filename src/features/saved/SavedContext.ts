import { createContext, useContext } from 'react'
import type { SavedDish, SavedState } from '../../types/restaurant'

export interface SavedContextValue {
  saved: SavedState
  /** False until the first read from storage finishes. */
  ready: boolean
  isRestaurantSaved: (restaurantId: string) => boolean
  getSavedDish: (dishId: string) => SavedDish | undefined
  toggleRestaurant: (restaurantId: string) => void
  toggleDishSaved: (restaurantId: string, dishId: string) => void
  toggleGoingHere: (restaurantId: string, dishId: string) => void
  removeDish: (dishId: string) => void
}

export const SavedContext = createContext<SavedContextValue | null>(null)

export function useSaved(): SavedContextValue {
  const value = useContext(SavedContext)
  if (!value) throw new Error('useSaved must be used inside <SavedProvider>')
  return value
}
