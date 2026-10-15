import { confidenceLabel, formatProteinRange } from '../lib/protein'
import type { Confidence, ProteinEstimate } from '../types/restaurant'

const TONES: Record<Confidence, string> = {
  high: 'bg-leaf-tint text-leaf',
  medium: 'bg-amber-tint text-amber-ink',
  low: 'bg-stone-tint text-stone-ink',
}

const DOTS: Record<Confidence, string> = {
  high: '●●●',
  medium: '●●○',
  low: '●○○',
}

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-semibold ${TONES[confidence]}`}
    >
      <span aria-hidden="true" className="text-[0.6rem] tracking-tighter">
        {DOTS[confidence]}
      </span>
      {confidenceLabel(confidence)} confidence
    </span>
  )
}

/** "38–45g protein" with a confidence badge. */
export function ProteinRange({
  estimate,
  size = 'md',
}: {
  estimate: ProteinEstimate
  size?: 'md' | 'lg'
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className={`font-bold text-leaf ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
        {formatProteinRange(estimate)}
        <span className="ml-1 text-sm font-medium text-ink-soft">protein</span>
      </p>
      <ConfidenceBadge confidence={estimate.confidence} />
    </div>
  )
}
