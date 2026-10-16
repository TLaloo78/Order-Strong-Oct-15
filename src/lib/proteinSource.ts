import type { Dish } from '../types/restaurant'

export type ProteinSource = 'shellfish' | 'fish' | 'poultry' | 'meat' | 'eggsDairy' | 'plant'

export const PROTEIN_SOURCE_LABEL: Record<ProteinSource, string> = {
  shellfish: 'Shellfish',
  fish: 'Fish',
  poultry: 'Chicken & turkey',
  meat: 'Beef, lamb & pork',
  eggsDairy: 'Eggs & dairy',
  plant: 'Plant protein',
}

// Checked in order: the first group with a matching word wins
// (so "Egg Drop Soup & Chicken Skewers" counts as poultry).
const RULES: [ProteinSource, RegExp][] = [
  ['shellfish', /\b(shrimp|prawns?|scallops?|lobster|crab|mussels?|clams?)\b/i],
  ['fish', /\b(salmon|tuna|fish|branzino|cod|trout|halibut|sea bass|mahi)\b/i],
  ['poultry', /\b(chicken|turkey|duck)\b/i],
  ['meat', /\b(steak|beef|sirloin|ribeye|filet|burger|lamb|kofta|carne asada|bulgogi|pork|chops?|brisket)\b/i],
  ['eggsDairy', /\b(eggs?|egg whites?|yogurt|cottage cheese|halloumi|cheese)\b/i],
]

/** The main protein in a dish, guessed from its name (then description). */
export function proteinSource(dish: Pick<Dish, 'name' | 'description'>): ProteinSource {
  for (const text of [dish.name, dish.description]) {
    for (const [source, pattern] of RULES) {
      if (pattern.test(text)) return source
    }
  }
  return 'plant'
}
