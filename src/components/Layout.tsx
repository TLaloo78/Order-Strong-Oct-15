import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/AuthContext'
import { useSaved } from '../features/saved/SavedContext'
import { BRAND } from '../brand'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

function navClass({ isActive }: { isActive: boolean }) {
  return `flex min-h-14 flex-1 items-center justify-center gap-2 px-4 text-base font-semibold md:min-h-11 md:flex-none md:rounded-xl ${
    isActive ? 'text-brand md:bg-brand-tint' : 'text-ink-soft hover:text-ink md:hover:bg-sand'
  }`
}

export function Layout() {
  const { saved } = useSaved()
  const { status, recovering } = useAuth()
  const navigate = useNavigate()
  const count = saved.restaurantIds.length + saved.dishes.length

  // Someone who opened a password-reset email link needs to choose a new password.
  useEffect(() => {
    if (recovering) navigate('/reset-password', { replace: true })
  }, [recovering, navigate])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-20 border-b border-line bg-cream">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <NavLink to="/" className="flex min-h-11 items-center" aria-label={`${BRAND.name} home`}>
            <Logo />
          </NavLink>

          <div className="flex items-center gap-3">
            <nav
              aria-label="Main"
              className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:static md:z-auto md:gap-1 md:border-0 md:bg-transparent md:pb-0"
            >
              <NavLink to="/" end className={navClass}>
                Restaurants
              </NavLink>
              <NavLink to="/saved" className={navClass}>
                Saved
                {count > 0 ? (
                  <span className="rounded-full bg-brand px-2 text-sm text-on-brand">
                    {count}
                    <span className="sr-only"> saved items</span>
                  </span>
                ) : null}
              </NavLink>
              {status === 'signedIn' ? (
                <NavLink to="/account" className={navClass}>
                  Account
                </NavLink>
              ) : status === 'signedOut' ? (
                <NavLink to="/login" className={navClass}>
                  Sign in
                </NavLink>
              ) : null}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 md:px-6 md:pb-12 md:pt-8"
      >
        <Outlet />
      </main>
    </div>
  )
}
