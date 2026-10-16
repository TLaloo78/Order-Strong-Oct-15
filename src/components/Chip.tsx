import type { ReactNode } from 'react'

/** A single-choice option in a filter group. Announced as pressed when selected. */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-base font-medium transition-colors ${
        selected
          ? 'border-brand bg-brand text-on-brand'
          : 'border-line bg-surface text-ink hover:bg-sand'
      }`}
    >
      {children}
    </button>
  )
}

export function FilterGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <fieldset className="m-0 min-w-0 space-y-1.5 border-0 p-0">
      <legend className="mb-1.5 p-0 text-sm font-semibold text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}
