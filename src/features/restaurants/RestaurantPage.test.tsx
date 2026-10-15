import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from '../../routes'
import { AppProviders } from '../../AppProviders'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return router
}

describe('RestaurantPage', () => {
  it('shows the top 3 protein picks first, ranked, with range, confidence and a tip', async () => {
    renderAt('/r/ember-oak-grill')

    const heading = await screen.findByRole('heading', { name: 'Top 3 protein picks' })
    const picks = within(heading.closest('section')!).getAllByRole('listitem')
    expect(picks).toHaveLength(3)

    expect(picks[0]).toHaveTextContent('Herb-Grilled Chicken Plate')
    expect(picks[0]).toHaveTextContent('42–50g')
    expect(picks[0]).toHaveTextContent('High confidence')
    expect(picks[0]).toHaveTextContent('$17.50')
    expect(picks[0]).toHaveTextContent('g per $')
    expect(picks[0]).toHaveTextContent('Add extra chicken, swap fries for greens.')
    expect(picks[1]).toHaveTextContent('Sirloin Tips & Greens')
    expect(picks[2]).toHaveTextContent('Grilled Salmon & Farro')

    expect(screen.getByText(/estimates, not medical or dietary advice/i)).toBeInTheDocument()
  })

  it('filters the full menu by minimum protein and can clear the filter', async () => {
    const user = userEvent.setup()
    renderAt('/r/ember-oak-grill')

    expect(await screen.findByText('Showing 9 of 9 dishes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '40g+' }))
    expect(screen.getByText('Showing 3 of 9 dishes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '40g+' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Under $15' }))
    expect(await screen.findByText('No dishes match those filters')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Showing 9 of 9 dishes')).toBeInTheDocument()
  })

  it('opens a dish at its own URL and saves it to the Saved screen', async () => {
    const user = userEvent.setup()
    const router = renderAt('/r/ember-oak-grill')

    const heading = await screen.findByRole('heading', { name: 'Top 3 protein picks' })
    await user.click(within(heading.closest('section')!).getByRole('link', { name: /Herb-Grilled Chicken Plate/ }))

    expect(router.state.location.pathname).toBe('/r/ember-oak-grill/dish/ember-oak-grill--herb-chicken')
    expect(await screen.findByRole('heading', { name: 'Why this estimate' })).toBeInTheDocument()

    const save = screen.getByRole('button', { name: 'Save dish' })
    expect(save).toHaveAttribute('aria-pressed', 'false')
    await user.click(save)
    expect(screen.getByRole('button', { name: 'Save dish' })).toHaveAttribute('aria-pressed', 'true')

    await router.navigate('/saved')
    expect(await screen.findByRole('heading', { name: 'Saved dishes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Herb-Grilled Chicken Plate' })).toBeInTheDocument()
  })

  it('shows a friendly message for an unknown restaurant', async () => {
    renderAt('/r/does-not-exist')
    expect(await screen.findByText("We couldn't find that restaurant")).toBeInTheDocument()
  })
})
