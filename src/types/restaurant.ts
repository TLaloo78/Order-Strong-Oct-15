export type Confidence = 'high' | 'medium' | 'low'

/** Estimated grams of protein for a typical serving, as a range. */
export interface ProteinEstimate {
  minG: number
  maxG: number
  confidence: Confidence
}

export type Cuisine =
  | 'Grill'
  | 'Mediterranean'
  | 'Mexican'
  | 'Asian'
  | 'Café'
  | 'Steakhouse'

export interface Restaurant {
  id: string
  name: string
  cuisine: Cuisine
  /** 1 = $, 2 = $$, 3 = $$$ */
  priceLevel: 1 | 2 | 3
  /** Typical entrée price range in dollars. */
  entreeMinPrice: number
  entreeMaxPrice: number
  /** Mock distance in miles. */
  distanceMi: number
  neighborhood: string
  /** Map position in decimal degrees. Sample data: see supabase/migrations. */
  latitude: number
  longitude: number
  blurb: string
}

export interface Dish {
  id: string
  restaurantId: string
  name: string
  description: string
  /** Price in dollars. */
  price: number
  protein: ProteinEstimate
  /** One line, e.g. "Add extra chicken, swap fries for greens." */
  customizationTip: string
  customizations: string[]
  /** Placeholder explanation of how the estimate was reached. */
  whyEstimate: string
}

/** A restaurant plus its single best protein pick, for the home list. */
export interface RestaurantSummary extends Restaurant {
  bestPick: Dish | null
}

export interface PriceRange {
  min: number
  /** Infinity means no upper limit. */
  max: number
}

export interface RestaurantSearchParams {
  query?: string
  /** Keep restaurants whose typical entrée range overlaps this range. */
  priceRange?: PriceRange
}

/** Saved state for one dish. An entry exists while either flag is true. */
export interface SavedDish {
  restaurantId: string
  dishId: string
  saved: boolean
  goingHere: boolean
}

export interface SavedState {
  restaurantIds: string[]
  dishes: SavedDish[]
}
