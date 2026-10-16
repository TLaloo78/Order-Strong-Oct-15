import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AppProviders } from '../../AppProviders'
import type { AuthService } from '../../data/authService'
import { friendlyAuthError } from '../../data/supabaseAuthService'
import { routes } from '../../routes'
import type { AppUser, AuthChange } from '../../types/auth'

const TEST_USER: AppUser = { id: 'u1', email: 'pat@example.com' }

/** An in-memory stand-in for Supabase Auth. */
function fakeAuth(overrides: Partial<AuthService> = {}, startUser: AppUser | null = null) {
  let user = startUser
  const listeners = new Set<(change: AuthChange) => void>()
  const emit = (event: AuthChange['event']) => listeners.forEach((l) => l({ event, user }))

  const service: AuthService = {
    available: true,
    subscribe(listener) {
      listeners.add(listener)
      listener({ event: 'INITIAL_SESSION', user })
      return () => listeners.delete(listener)
    },
    signIn: vi.fn<AuthService['signIn']>(async (email) => {
      user = { id: 'u1', email }
      emit('SIGNED_IN')
      return { ok: true }
    }),
    signUp: vi.fn<AuthService['signUp']>(async () => ({ ok: true, needsConfirmation: true })),
    requestPasswordReset: vi.fn<AuthService['requestPasswordReset']>(async () => ({ ok: true })),
    updatePassword: vi.fn<AuthService['updatePassword']>(async () => ({ ok: true })),
    signOut: vi.fn<AuthService['signOut']>(async () => {
      user = null
      emit('SIGNED_OUT')
      return { ok: true }
    }),
    ...overrides,
  }
  return { service, emit, setUser: (next: AppUser | null) => (user = next) }
}

function renderAt(path: string, service: AuthService, state?: unknown) {
  const router = createMemoryRouter(routes, { initialEntries: [{ pathname: path, state }] })
  render(
    <AppProviders authService={service}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return router
}

describe('login screen', () => {
  it('shows labelled email and password fields, and the other ways in', async () => {
    renderAt('/login', fakeAuth().service)
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Forgot your password?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument() // nav item
  })

  it('signs in, then goes home and shows Account in the nav', async () => {
    const user = userEvent.setup()
    const { service } = fakeAuth()
    const router = renderAt('/login', service)

    await user.type(await screen.findByLabelText('Email'), ' pat@example.com ')
    await user.type(screen.getByLabelText('Password'), 'correct-horse')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(service.signIn).toHaveBeenCalledWith('pat@example.com', 'correct-horse')
    expect(await screen.findByRole('heading', { name: 'What should you order today?' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument()
  })

  it('returns to the page someone was trying to reach', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login', fakeAuth().service, { from: '/saved' })
    await user.type(await screen.findByLabelText('Email'), 'pat@example.com')
    await user.type(screen.getByLabelText('Password'), 'correct-horse')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Saved' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/saved')
  })

  it('ignores a redirect that points off-site', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login', fakeAuth().service, { from: '//evil.example' })
    await user.type(await screen.findByLabelText('Email'), 'pat@example.com')
    await user.type(screen.getByLabelText('Password'), 'correct-horse')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await screen.findByRole('heading', { name: 'What should you order today?' })
    expect(router.state.location.pathname).toBe('/')
  })

  it('shows a friendly error and stays on the page when sign-in fails', async () => {
    const user = userEvent.setup()
    const { service } = fakeAuth({
      signIn: vi.fn<AuthService['signIn']>(async () => ({
        ok: false,
        message: "That email and password don't match. Check them and try again.",
      })),
    })
    renderAt('/login', service)

    await user.type(await screen.findByLabelText('Email'), 'pat@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent("That email and password don't match")
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  it('creates an account and asks them to check their email', async () => {
    const user = userEvent.setup()
    const { service } = fakeAuth()
    renderAt('/login', service)

    await user.click(await screen.findByRole('button', { name: 'Create an account' }))
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password')
    expect(screen.getByText('At least 8 characters.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'new@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-enough-1')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(service.signUp).toHaveBeenCalledWith('new@example.com', 'long-enough-1')
    expect(await screen.findByRole('status')).toHaveTextContent('Check your email')
    expect(screen.getByRole('status')).toHaveTextContent('new@example.com')
  })

  it('sends a password reset link without revealing whether the email has an account', async () => {
    const user = userEvent.setup()
    const { service } = fakeAuth()
    renderAt('/login', service)

    await user.click(await screen.findByRole('button', { name: 'Forgot your password?' }))
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Email'), 'pat@example.com')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))

    expect(service.requestPasswordReset).toHaveBeenCalledWith('pat@example.com')
    expect(await screen.findByRole('status')).toHaveTextContent('If pat@example.com has an account')
  })

  it('lets someone show and hide the password', async () => {
    const user = userEvent.setup()
    renderAt('/login', fakeAuth().service)
    const field = await screen.findByLabelText('Password')
    await user.click(screen.getByRole('button', { name: /Show/ }))
    expect(field).toHaveAttribute('type', 'text')
    await user.click(screen.getByRole('button', { name: /Hide/ }))
    expect(field).toHaveAttribute('type', 'password')
  })

  it('uses a plain Show / Hide password toggle with no extra rows', async () => {
    const user = userEvent.setup()
    renderAt('/login', fakeAuth().service)

    const toggle = await screen.findByRole('button', { name: 'Show password' })
    expect(toggle).toHaveTextContent('Show')
    expect(screen.queryByText('Street')).not.toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
    expect(screen.getAllByText('Show')).toHaveLength(1)

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveTextContent('Hide')
  })

  it('explains that sign-in is unavailable when there is no account service', async () => {
    const { service } = fakeAuth({ available: false })
    renderAt('/login', service)
    expect(await screen.findByText("Sign-in isn't available yet")).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument()
  })
})

describe('account screen', () => {
  it('sends signed-out visitors to the login screen', async () => {
    const router = renderAt('/account', fakeAuth().service)
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('shows the email and signs out back to home', async () => {
    const user = userEvent.setup()
    const { service } = fakeAuth({}, TEST_USER)
    const router = renderAt('/account', service)

    expect(await screen.findByText('pat@example.com')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(service.signOut).toHaveBeenCalled()
    expect(await screen.findByRole('heading', { name: 'What should you order today?' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
  })
})

describe('password reset link', () => {
  it('takes someone who opens the email link to choose a new password', async () => {
    const user = userEvent.setup()
    const { service, emit, setUser } = fakeAuth()
    const router = renderAt('/', service)
    await screen.findByRole('heading', { name: 'What should you order today?' })

    setUser(TEST_USER)
    emit('PASSWORD_RECOVERY')

    expect(await screen.findByRole('heading', { name: 'Choose a new password' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/reset-password')

    await user.type(screen.getByLabelText('New password'), 'brand-new-pass')
    await user.click(screen.getByRole('button', { name: 'Save password' }))

    expect(service.updatePassword).toHaveBeenCalledWith('brand-new-pass')
    expect(await screen.findByText('Your password is updated')).toBeInTheDocument()
  })

  it('says the link has expired when there is no session', async () => {
    renderAt('/reset-password', fakeAuth().service)
    expect(await screen.findByText('This reset link has expired')).toBeInTheDocument()
  })
})

describe('friendlyAuthError', () => {
  it('maps known error codes to clear messages', () => {
    expect(friendlyAuthError({ code: 'invalid_credentials', message: 'x' })).toMatch(/don't match/)
    expect(friendlyAuthError({ code: 'email_not_confirmed', message: 'x' })).toMatch(/confirm your email/)
    expect(friendlyAuthError({ code: 'weak_password', message: 'x' })).toMatch(/8 characters/)
    expect(friendlyAuthError({ code: 'over_request_rate_limit', message: 'x' })).toMatch(/Too many attempts/)
    expect(friendlyAuthError({ name: 'AuthRetryableFetchError', message: 'x' })).toMatch(/reach the server/)
  })

  it('never shows raw error text for unknown errors', () => {
    expect(friendlyAuthError({ code: 'weird', message: 'pg: relation auth.users failed' })).toBe(
      'Something went wrong. Please try again.',
    )
  })
})
