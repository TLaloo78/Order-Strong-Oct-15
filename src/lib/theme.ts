// Light / dark / system theme. "System" means no data-theme attribute, so CSS follows the OS.
// index.html applies a saved choice before first paint to avoid a flash of the wrong theme.
export type ThemeChoice = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'well-ordered:theme'

const THEME_COLORS = { light: '#fbf7f2', dark: '#17120f' } as const

export function readThemeChoice(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function systemPrefersDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyThemeChoice(choice: ThemeChoice): void {
  const root = document.documentElement
  if (choice === 'system') delete root.dataset.theme
  else root.dataset.theme = choice

  const effective = choice === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : choice
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[effective])

  try {
    if (choice === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY)
    else window.localStorage.setItem(THEME_STORAGE_KEY, choice)
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
}
