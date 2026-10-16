import { describe, expect, it } from 'vitest'
import { mockDishes } from '../data/mock/dishes'
import { PROTEIN_SOURCE_LABEL, proteinSource } from './proteinSource'

const dish = (name: string, description = '') => ({ name, description })

describe('proteinSource', () => {
  it.each([
    ['Herb-Grilled Chicken Plate', 'poultry'],
    ['Smoked Turkey Burger', 'poultry'],
    ['Grilled Salmon & Farro', 'fish'],
    ['Grilled Branzino', 'fish'],
    ['Shrimp Tacos (3)', 'shellfish'],
    ['Seared Scallops', 'shellfish'],
    ['Ribeye (12 oz)', 'meat'],
    ['Lamb Kofta Bowl', 'meat'],
    ['Carne Asada Plate', 'meat'],
    ['Egg White Veggie Scramble', 'eggsDairy'],
    ['Greek Yogurt & Nut Bowl', 'eggsDairy'],
    ['Tofu & Edamame Stir-Fry', 'plant'],
    ['Falafel Wrap', 'plant'],
  ] as const)('%s → %s', (name, expected) => {
    expect(proteinSource(dish(name))).toBe(expected)
  })

  it('uses the first matching group, so a chicken dish with egg counts as poultry', () => {
    expect(proteinSource(dish('Egg Drop Soup & Chicken Skewers'))).toBe('poultry')
  })

  it('falls back to the description when the name has no protein word', () => {
    expect(proteinSource(dish('Pad See Ew', 'Wide noodles with chicken and egg.'))).toBe('poultry')
  })

  it('gives every menu dish a labelled category, and uses all six', () => {
    const sources = new Set(mockDishes.map((d) => proteinSource(d)))
    for (const s of sources) expect(PROTEIN_SOURCE_LABEL[s]).toBeTruthy()
    expect(sources.size).toBe(6)
  })
})
