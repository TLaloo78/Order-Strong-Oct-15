// Data-access layer for the user's saved restaurants and dishes.
//
// Backed by localStorage for now. Every function returns the new full state, so
// a Supabase version can return the same shape after writing to a user-scoped table.
import type { SavedDish, SavedState } from '../types/restaurant'

const STORAGE_KEY = 'protein-first:saved:v1'

const EMPTY: SavedState = { restaurantIds: [], dishes: [] }

function read(): SavedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return EMPTY
    const { restaurantIds, dishes } = parsed as Partial<SavedState>
    return {
      restaurantIds: Array.isArray(restaurantIds) ? restaurantIds : [],
      dishes: Array.isArray(dishes) ? dishes : [],
    }
  } catch {
    return EMPTY
  }
}

function write(state: SavedState): SavedState {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be full or blocked (private mode). The in-memory state still updates.
  }
  return state
}

export async function getSaved(): Promise<SavedState> {
  return read()
}

export async function setRestaurantSaved(restaurantId: string, saved: boolean): Promise<SavedState> {
  const state = read()
  const others = state.restaurantIds.filter((id) => id !== restaurantId)
  return write({ ...state, restaurantIds: saved ? [...others, restaurantId] : others })
}

type DishFlag = 'saved' | 'goingHere'

async function setDishFlag(
  restaurantId: string,
  dishId: string,
  flag: DishFlag,
  value: boolean,
): Promise<SavedState> {
  const state = read()
  const existing = state.dishes.find((d) => d.dishId === dishId)
  const next: SavedDish = {
    saved: false,
    goingHere: false,
    ...existing,
    restaurantId,
    dishId,
    [flag]: value,
  }
  const others = state.dishes.filter((d) => d.dishId !== dishId)
  // An entry exists only while at least one flag is on.
  const keep = next.saved || next.goingHere
  return write({ ...state, dishes: keep ? [...others, next] : others })
}

export function setDishSaved(restaurantId: string, dishId: string, saved: boolean) {
  return setDishFlag(restaurantId, dishId, 'saved', saved)
}

export function setDishGoingHere(restaurantId: string, dishId: string, goingHere: boolean) {
  return setDishFlag(restaurantId, dishId, 'goingHere', goingHere)
}

export async function removeDish(dishId: string): Promise<SavedState> {
  const state = read()
  return write({ ...state, dishes: state.dishes.filter((d) => d.dishId !== dishId) })
}
