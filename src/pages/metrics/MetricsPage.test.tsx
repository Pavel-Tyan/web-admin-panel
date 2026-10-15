import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/shared/mocks/server'
import { renderWithProviders } from '@/test/render'
import { MetricsPage } from './MetricsPage'

const url = (path: string) => `*/api/data-provider/metrics/admin/${path}`

// Ответы в формате схем OpenAPI data-provider.
function mockAllMetrics() {
  server.use(
    http.get(url('registered/count'), () => HttpResponse.json(128)),
    http.get(url('likes/total'), () =>
      HttpResponse.json({
        totalLikesCount: 57,
        likesCountPerRoute: [
          { routeId: 'r1', routeName: 'Арбат', likesCount: 40 },
          { routeId: 'r2', routeName: 'Парк Горького', likesCount: 17 },
        ],
      }),
    ),
    http.get(url('finished/per-user'), () =>
      HttpResponse.json({
        totalFinishedRoutes: 12,
        finishedRoutesPerUser: [
          { userId: 'u1', userName: 'anna', finishedRoutesCount: 3 },
          { userId: 'u2', userName: 'boris', finishedRoutesCount: 9 },
        ],
      }),
    ),
    http.get(url('published/per-user'), () =>
      HttpResponse.json({
        totalPublishedRoutes: 4,
        publishedRoutesPerUser: [
          { userId: 'u3', userName: 'vera', publishedRoutesCount: 4 },
        ],
      }),
    ),
    http.get(url('reviews/per-route'), () =>
      HttpResponse.json({
        totalReviews: 31,
        reviewsCountPerUser: [
          { routeId: 'r1', routeName: 'Арбат', reviewsCount: 31 },
        ],
      }),
    ),
  )
}

const getCard = (title: string) =>
  screen.getByText(title).closest('.ant-card') as HTMLElement

describe('MetricsPage', () => {
  it('shows totals from every endpoint', async () => {
    mockAllMetrics()
    renderWithProviders(<MetricsPage />)

    expect(await screen.findByText('128')).toBeInTheDocument()
    expect(await screen.findByText('57')).toBeInTheDocument()
    expect(await screen.findByText('12')).toBeInTheDocument()
    expect(await screen.findByText('4')).toBeInTheDocument()
    expect(await screen.findByText('31')).toBeInTheDocument()
  })

  it('shows a ranking as a sorted table', async () => {
    mockAllMetrics()
    renderWithProviders(<MetricsPage />)

    const card = getCard('Пройденные маршруты по пользователям')
    await userEvent.click(within(card).getByText('Таблица'))

    const rows = await within(card).findAllByRole('row')
    // Заголовок + 2 строки, первым идёт пользователь с большим значением.
    expect(rows).toHaveLength(3)
    expect(rows[1]).toHaveTextContent('boris')
    expect(rows[1]).toHaveTextContent('9')
    expect(rows[2]).toHaveTextContent('anna')
  })

  it('shows an error only in the failed block', async () => {
    mockAllMetrics()
    server.use(
      http.get(url('likes/total'), () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    )
    renderWithProviders(<MetricsPage />)

    const failed = getCard('Лайки по маршрутам')
    expect(
      await within(failed).findByText('Не удалось загрузить данные'),
    ).toBeInTheDocument()
    expect(await screen.findByText('128')).toBeInTheDocument()
  })

  it('shows an empty state when there is no breakdown', async () => {
    mockAllMetrics()
    server.use(
      http.get(url('reviews/per-route'), () =>
        HttpResponse.json({ totalReviews: 0 }),
      ),
    )
    renderWithProviders(<MetricsPage />)

    const card = getCard('Отзывы по маршрутам')
    expect(await within(card).findByText('Данных пока нет')).toBeInTheDocument()
  })
})
