import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/shared/mocks/server'
import { renderWithProviders } from '@/test/render'
import { RoutesPage } from './RoutesPage'

const LIST_URL = '*/api/data-provider/routes/user/all'

const routes = [
  {
    id: 'r1',
    routeName: 'Старый Арбат',
    duration: 27,
    length: 2.5,
    routePreview: '',
    distanceToUser: 1.2,
    categories: [{ categoryName: 'пешеходный' }],
  },
  {
    id: 'r2',
    routeName: 'Парк Горького',
    duration: 95,
    length: 6,
    routePreview: 'https://s3.example/park.jpg',
    distanceToUser: 3,
    categories: [{ categoryName: 'парки' }],
  },
]

describe('RoutesPage', () => {
  it('lists routes with links to their pages', async () => {
    const captured: { params?: URLSearchParams } = {}
    server.use(
      http.get(LIST_URL, ({ request }) => {
        captured.params = new URL(request.url).searchParams
        return HttpResponse.json(routes)
      }),
    )

    renderWithProviders(<RoutesPage />, { route: '/routes' })

    const link = await screen.findByRole('link', { name: 'Старый Арбат' })
    expect(link).toHaveAttribute('href', '/routes/r1')
    expect(screen.getByText('2 маршрута')).toBeInTheDocument()
    expect(screen.getByText('#пешеходный')).toBeInTheDocument()
    expect(screen.getByText('1 ч 35 мин')).toBeInTheDocument()

    // Координаты обязательны в `routes/user/all`.
    expect(captured.params?.get('latitude')).toBeTruthy()
    expect(captured.params?.get('longitude')).toBeTruthy()
  })

  it('filters by name and category', async () => {
    server.use(http.get(LIST_URL, () => HttpResponse.json(routes)))
    renderWithProviders(<RoutesPage />, { route: '/routes' })
    await screen.findByRole('link', { name: 'Старый Арбат' })

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Поиск маршрутов' }),
      'парки',
    )

    const table = screen.getByRole('table')
    expect(
      within(table).queryByRole('link', { name: 'Старый Арбат' }),
    ).not.toBeInTheDocument()
    expect(
      within(table).getByRole('link', { name: 'Парк Горького' }),
    ).toBeInTheDocument()
  })

  it('shows an error with retry', async () => {
    server.use(
      http.get(LIST_URL, () => HttpResponse.text('boom', { status: 500 })),
    )
    renderWithProviders(<RoutesPage />, { route: '/routes' })

    expect(
      await screen.findByText('Не удалось загрузить маршруты'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()
  })
})
