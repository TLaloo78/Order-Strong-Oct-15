import type { ReactNode } from 'react'
import { Button } from './Button'
import { EmptyPlateArt } from './illustrations/SceneArt'

export function LoadingList({ label, count = 3 }: { label: string; count?: number }) {
  return (
    <output aria-live="polite" className="block space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-28 animate-pulse rounded-2xl border border-line bg-sand/70"
        />
      ))}
    </output>
  )
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-5 py-8 text-center">
      <EmptyPlateArt className="mx-auto mb-3 h-20 w-auto" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {children ? <p className="mx-auto mt-1 max-w-sm text-ink-soft">{children}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-line bg-surface px-5 py-8 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mx-auto mt-1 max-w-sm text-ink-soft">{message}</p>
      <div className="mt-4 flex justify-center">
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </div>
  )
}
