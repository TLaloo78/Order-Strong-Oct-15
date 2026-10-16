import type { ReactNode } from 'react'
import { PROTEIN_SOURCE_LABEL, proteinSource, type ProteinSource } from '../../lib/proteinSource'
import type { Dish } from '../../types/restaurant'

const PATHS: Record<ProteinSource, ReactNode> = {
  poultry: (
    <>
      <path d="M14.5 3.5a5.5 5.5 0 0 1 2.9 10.2c-1.4.8-3 1-4.4.6L9.6 17.7" />
      <path d="M14.5 3.5A5.5 5.5 0 0 0 9 9c0 1.4.4 2.6 1.2 3.6l-3.6 3.5" />
      <path d="M6.6 16.1a1.9 1.9 0 1 0-2.4 2.4 1.9 1.9 0 1 0 2.6 2.6 1.9 1.9 0 1 0 2.8-3.4" />
    </>
  ),
  meat: (
    <>
      <path d="M16.5 4c3 .6 4.6 3.5 4 6.7-.8 4.2-5 8.3-9.6 9.2-4.4.9-8.3-1.5-8.4-5-.1-3 2.6-4.4 4.7-5.6C9.6 7.6 12.4 3.2 16.5 4Z" />
      <path d="M8.5 14.2c1.2-.4 2.2-1.2 3-2.2" />
      <circle cx="15.5" cy="9.5" r="1.6" />
    </>
  ),
  fish: (
    <>
      <path d="M2.5 12c3-4.5 8.5-6 13-3.5L21.5 5v14l-6-3.5c-4.5 2.5-10 1-13-3.5Z" />
      <circle cx="7.5" cy="11" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  shellfish: (
    <>
      <path d="M8 5.5c5.5-1.5 11 2 11 7.5 0 3.6-2.6 6.5-6 6.5H9.5a2.5 2.5 0 0 1 0-5H13" />
      <path d="M12.5 8.5l1.5 3M16 10.5l-1.5 2.5M17.8 14.5h-3" />
      <path d="M8 5.5 4 3.5M8 5.5 5.5 8" />
    </>
  ),
  eggsDairy: (
    <>
      <path d="M12 3c3.6 0 6.5 5.3 6.5 10A6.5 6.5 0 0 1 5.5 13C5.5 8.3 8.4 3 12 3Z" />
      <path d="M9 13.5a3 3 0 0 0 3 3" />
    </>
  ),
  plant: (
    <>
      <path d="M12 21c-4.5-1.4-7.5-5.2-7.5-10.5 3.8 0 6.8 1.5 8.3 4.5" />
      <path d="M12 21c4.5-1.4 7.5-5.2 7.5-10.5-3.8 0-6.8 1.5-8.3 4.5" />
      <path d="M12 21v-8" />
    </>
  ),
}

/** Line icon for the dish's main protein. */
export function ProteinIcon({ source, className = 'size-5' }: { source: ProteinSource; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[source]}
    </svg>
  )
}

/** Icon plus a short label, e.g. "Chicken & turkey". */
export function ProteinSourceTag({ dish }: { dish: Pick<Dish, 'name' | 'description'> }) {
  const source = proteinSource(dish)
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
      <ProteinIcon source={source} className="size-4 text-brand" />
      {PROTEIN_SOURCE_LABEL[source]}
    </span>
  )
}
