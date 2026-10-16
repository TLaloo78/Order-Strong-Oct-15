import { useEffect, useState, type ReactNode } from 'react'
import { applyThemeChoice, readThemeChoice, type ThemeChoice } from '../lib/theme'

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

const OPTIONS: { value: ThemeChoice; label: string; icon: ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
]

/** Light / Dark / System switch. The choice is remembered on this device. */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(readThemeChoice)

  useEffect(() => {
    applyThemeChoice(choice)
    if (choice !== 'system' || typeof window.matchMedia !== 'function') return
    // Keep the browser UI color in sync if the OS theme changes while "System" is on.
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeChoice('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [choice])

  return (
    <fieldset className="m-0 flex min-w-0 rounded-xl border border-line bg-surface p-0.5">
      <legend className="sr-only">Color theme</legend>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={choice === option.value}
          title={`${option.label} theme`}
          onClick={() => setChoice(option.value)}
          className={`flex size-11 items-center justify-center rounded-[10px] transition-colors ${
            choice === option.value
              ? 'bg-brand-tint text-brand-dark'
              : 'text-ink-soft hover:bg-sand hover:text-ink'
          }`}
        >
          {option.icon}
          <span className="sr-only">{option.label} theme</span>
        </button>
      ))}
    </fieldset>
  )
}
