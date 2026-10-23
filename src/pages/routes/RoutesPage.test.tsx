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
    duration: 1620,
    length: 2500,
    routePreview: '',
    distanceToUser: 1.2,
    categories: [{ categoryName: 'пешеходный' }],
  },
  {
    id: 'r2',
    routeName: 'Парк Горького',
    duration: 5700,
    length: 6000,
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

  it('filters by a category tag click and toggles it back', async () => {
    server.use(http.get(LIST_URL, () => HttpResponse.json(routes)))
    renderWithProviders(<RoutesPage />, { route: '/routes' })
    await screen.findByRole('link', { name: 'Старый Арбат' })

    const table = screen.getByRole('table')
    await userEvent.click(within(table).getByText('#парки'))

    // Клик по тегу фильтрует, а не открывает маршрут.
    expect(screen.getByText('Найдено 1 из 2')).toBeInTheDocument()
    expect(
      within(table).queryByRole('link', { name: 'Старый Арбат' }),
    ).not.toBeInTheDocument()
    expect(
      within(table).getByRole('link', { name: 'Парк Горького' }),
    ).toBeInTheDocument()

    await userEvent.click(within(table).getByText('#парки'))
    expect(screen.getByText('2 маршрута')).toBeInTheDocument()
  })

  it('reads category filters from the URL and resets them', async () => {
    server.use(http.get(LIST_URL, () => HttpResponse.json(routes)))
    renderWithProviders(<RoutesPage />, {
      route: '/routes?category=пешеходный',
    })

    expect(
      await screen.findByRole('link', { name: 'Старый Арбат' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Парк Горького' }),
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))

    expect(
      screen.getByRole('link', { name: 'Парк Горького' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Сбросить фильтры' }),
    ).not.toBeInTheDocument()
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
