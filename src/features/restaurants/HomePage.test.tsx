import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AppProviders } from '../../AppProviders'
import { routes } from '../../routes'
import type { RestaurantSummary } from '../../types/restaurant'

// Leaflet needs a real browser layout, so the tests swap in a stand-in with one button per pin.
vi.mock('./RestaurantMap', async () => {
  const { createElement } = await import('react')
  return {
    default: ({
      restaurants,
      onSelect,
    }: {
      restaurants: RestaurantSummary[]
      onSelect: (id: string) => void
    }) =>
      createElement(
        'div',
        { 'data-testid': 'map' },
        restaurants.map((r) =>
          createElement('button', { key: r.id, onClick: () => onSelect(r.id) }, `pin ${r.name}`),
        ),
      ),
  }
})

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return router
}

describe('header', () => {
  it('shows the Well Ordered logo linking home, and the theme switch', async () => {
    renderAt('/saved')
    expect(await screen.findByRole('link', { name: 'Well Ordered home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('group', { name: 'Color theme' })).toBeInTheDocument()
  })
})

describe('home map view', () => {
  it('shows the list by default, with List selected', async () => {
    renderAt('/')
    expect(await screen.findByText('Sunday Grounds Café')).toBeInTheDocument()
    expect(screen.queryByTestId('map')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Map' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches to the map, keeps the filters, and remembers the view in the URL', async () => {
    const user = userEvent.setup()
    const router = renderAt('/?price=any')
    await screen.findByText('Sunday Grounds Café')

    await user.click(screen.getByRole('button', { name: 'Map' }))

    const map = await screen.findByTestId('map')
    expect(within(map).getAllByRole('button')).toHaveLength(8)
    expect(router.state.location.search).toContain('view=map')
    expect(router.state.location.search).toContain('price=any')
    expect(screen.getByRole('button', { name: 'Map' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens on the map from a shared link and only pins restaurants matching the filters', async () => {
    renderAt('/?view=map&price=30-plus')
    const map = await screen.findByTestId('map')
    expect(within(map).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'pin Prairie & Pine Steakhouse',
    ])
  })

  it('shows the selected restaurant\'s best pick and a link to its page', async () => {
    const user = userEvent.setup()
    renderAt('/?view=map&price=any')
    const map = await screen.findByTestId('map')
    expect(screen.getByText(/Select a pin/)).toBeInTheDocument()

    await user.click(within(map).getByRole('button', { name: 'pin Casa Marigold' }))

    expect(screen.getByText('Selected: Casa Marigold')).toBeInTheDocument()
    const card = screen.getByRole('link', { name: /Casa Marigold/ })
    expect(card).toHaveAttribute('href', '/r/casa-marigold')
    expect(card).toHaveTextContent('Carne Asada Plate')
    expect(card).toHaveTextContent('40–50g')
  })

  it('returns to the list', async () => {
    const user = userEvent.setup()
    renderAt('/?view=map&price=any')
    await screen.findByTestId('map')
    await user.click(screen.getByRole('button', { name: 'List' }))
    expect(screen.queryByTestId('map')).not.toBeInTheDocument()
    expect(await screen.findByText('Sunday Grounds Café')).toBeInTheDocument()
  })

  it('keeps showing the map choice when clearing an empty search', async () => {
    const user = userEvent.setup()
    const router = renderAt('/?view=map&q=zzzz&price=any')
    await screen.findByText('No restaurants match')
    await user.click(screen.getByRole('button', { name: 'Clear search and price' }))
    expect(await screen.findByTestId('map')).toBeInTheDocument()
    expect(router.state.location.search).toContain('view=map')
    expect(router.state.location.search).not.toContain('q=')
  })
})
