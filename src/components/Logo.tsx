import { BRAND } from '../brand'

/**
 * The brand mark: a map pin holding a fork, between two weight plates.
 * Colors come from theme tokens, so it adapts to light and dark mode.
 */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="40 80 432 360" className={className} aria-hidden="true" focusable="false">
      <rect x="48" y="210" width="28" height="92" rx="10" className="fill-brand" />
      <rect x="86" y="168" width="36" height="176" rx="12" className="fill-brand" />
      <rect x="390" y="168" width="36" height="176" rx="12" className="fill-brand" />
      <rect x="436" y="210" width="28" height="92" rx="10" className="fill-brand" />
      <path
        d="M256 84a124 124 0 0 1 124 124c0 92-124 220-124 220S132 300 132 208A124 124 0 0 1 256 84Z"
        className="fill-brand-dark"
      />
      <circle cx="256" cy="208" r="76" className="fill-surface" />
      <g className="fill-brand">
        <rect x="221" y="150" width="13" height="60" rx="6.5" />
        <rect x="249.5" y="150" width="13" height="60" rx="6.5" />
        <rect x="278" y="150" width="13" height="60" rx="6.5" />
        <path d="M221 198h70v10a35 35 0 0 1-70 0Z" />
      </g>
      <rect x="247" y="232" width="18" height="86" rx="9" className="fill-brand-tint" />
    </svg>
  )
}

const SIZES = {
  md: { mark: 'h-8 w-auto', text: 'text-xl' },
  lg: { mark: 'h-12 w-auto', text: 'text-3xl' },
  /** Medium on phones, large from tablet width up. */
  responsive: { mark: 'h-8 w-auto md:h-12', text: 'text-xl md:text-3xl' },
}

/** Mark plus the two-tone wordmark. */
export function Logo({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const [first, ...rest] = BRAND.name.split(' ')
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={SIZES[size].mark} />
      <span className={`whitespace-nowrap font-extrabold tracking-tight ${SIZES[size].text}`}>
        <span className="text-brand-dark">{first}</span>
        {rest.length ? <span className="text-brand"> {rest.join(' ')}</span> : null}
      </span>
    </span>
  )
}
