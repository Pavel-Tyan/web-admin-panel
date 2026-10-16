import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router'
import { tokenStorage } from '@/shared/auth/tokenStorage'
import { server } from '@/shared/mocks/server'
import { renderWithProviders } from '@/test/render'
import { RoutePage } from './RoutePage'

const PAGE_URL = '*/api/data-provider/routes/user/page'
const REVIEWS_URL = '*/api/data-provider/reviews/user/all'
const USER_ID = '3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b'

const routeDto = {
  id: 'r1',
  routeName: 'Измайловский Кремль',
  description: 'Прогулка по району Измайлово.',
  duration: 27,
  length: 2.5,
  startPoint: 'р-он Измайлово',
  endPoint: 'Измайловское шоссе, 73',
  routePreview: '',
  isFavourite: false,
  categories: [{ categoryName: 'пешеходный' }, { categoryName: 'культурный' }],
  // Не по порядку: страница сортирует по orderNumber.
  routeCoordinate: [
    { id: 'p2', latitude: 55.795, longitude: 37.75, orderNumber: 1, title: 'Кремль' },
    { id: 'p1', latitude: 55.788, longitude: 37.742, orderNumber: 0, title: 'Метро' },
  ],
}

const reviewsDto = {
  curUserId: USER_ID,
  reviews: [
    {
      userId: 'u1',
      userName: 'Игорь',
      reviewText: 'Отлично провёл время!',
      rating: 5,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      userId: 'u2',
      userName: 'Анна',
      reviewText: 'Неплохо',
      rating: 4,
      createdAt: '2026-10-05T10:00:00Z',
    },
  ],
}

const jwt = (payload: object) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}.sig`

function renderRoutePage(routeId = 'r1') {
  renderWithProviders(
    <Routes>
      <Route path="/routes/:routeId" element={<RoutePage />} />
    </Routes>,
    { route: `/routes/${routeId}` },
  )
}

describe('RoutePage', () => {
  it('shows the route card with a Yandex Maps link', async () => {
    tokenStorage.set(jwt({ sub: USER_ID }))
    const captured: { userId?: string | null } = {}
    server.use(
      http.get(PAGE_URL, ({ request }) => {
        captured.userId = request.headers.get('X-User-Id')
        return HttpResponse.json(routeDto)
      }),
      http.get(REVIEWS_URL, () => HttpResponse.json(reviewsDto)),
    )

    renderRoutePage()

    expect(
      await screen.findByRole('heading', { name: 'Измайловский Кремль' }),
    ).toBeInTheDocument()
    expect(captured.userId).toBe(USER_ID)
    expect(screen.getByText('#культурный')).toBeInTheDocument()
    expect(screen.getByText('Измайловское шоссе, 73')).toBeInTheDocument()
    expect(screen.getByText('27 мин')).toBeInTheDocument()
    expect(screen.getAllByText('Нет данных')).toHaveLength(2)

    // Точки по orderNumber: Метро → Кремль.
    expect(
      screen.getByRole('link', { name: /Открыть в Яндекс Картах/ }),
    ).toHaveAttribute(
      'href',
      'https://yandex.ru/maps/?rtext=55.788,37.742~55.795,37.75&rtt=pd',
    )

    // Рейтинг считается по отзывам: (5 + 4) / 2.
    expect(await screen.findByText('4,5')).toBeInTheDocument()
  })

  it('shows points and reviews in tabs', async () => {
    server.use(
      http.get(PAGE_URL, () => HttpResponse.json(routeDto)),
      http.get(REVIEWS_URL, () => HttpResponse.json(reviewsDto)),
    )
    renderRoutePage()
    await screen.findByRole('heading', { name: 'Измайловский Кремль' })

    await userEvent.click(screen.getByRole('tab', { name: 'Точки (2)' }))
    // Только открытая вкладка: сводка (Descriptions) тоже размечена как таблица.
    const rows = within(screen.getByRole('tabpanel')).getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Метро')
    expect(rows[1]).toHaveTextContent('Кремль')

    await userEvent.click(await screen.findByRole('tab', { name: 'Отзывы (2)' }))
    expect(await screen.findByText('Отлично провёл время!')).toBeInTheDocument()
    expect(screen.getByText('Игорь')).toBeInTheDocument()
  })

  it('disables the map link when there are no points', async () => {
    server.use(
      http.get(PAGE_URL, () =>
        HttpResponse.json({ ...routeDto, routeCoordinate: [] }),
      ),
      http.get(REVIEWS_URL, () => HttpResponse.json({ reviews: [] })),
    )
    renderRoutePage()

    expect(
      await screen.findByRole('button', { name: /Открыть в Яндекс Картах/ }),
    ).toBeDisabled()
  })

  it('shows "not found" for an unknown route', async () => {
    server.use(
      http.get(PAGE_URL, () => HttpResponse.text('Not found', { status: 404 })),
      http.get(REVIEWS_URL, () => HttpResponse.text('Not found', { status: 404 })),
    )
    renderRoutePage('missing')

    expect(await screen.findByText('Маршрут не найден')).toBeInTheDocument()
  })
})
