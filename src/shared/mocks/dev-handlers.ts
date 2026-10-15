import { delay, http, HttpResponse, type AnyHandler } from 'msw'

// Моки для `npm run dev:mock`: формат ответов — по OpenAPI бэкенда.
// В тестах не используются: там каждый тест задаёт свои ответы.

const users = [
  ['Анна Смирнова', 14, 6],
  ['Борис Иванов', 11, 2],
  ['Вера Кузнецова', 9, 5],
  ['Глеб Попов', 8, 1],
  ['Дарья Соколова', 7, 3],
  ['Егор Лебедев', 6, 0],
  ['Жанна Козлова', 5, 2],
  ['Захар Новиков', 4, 1],
  ['Инна Морозова', 3, 0],
  ['Кирилл Волков', 2, 1],
  ['Лидия Павлова', 1, 0],
  ['Максим Семёнов', 1, 0],
] as const

const routes = [
  ['По бульварному кольцу', 18, 42],
  ['Парк Горького и Нескучный сад', 15, 37],
  ['Старый Арбат', 12, 29],
  ['Замоскворечье: тихие переулки', 10, 21],
  ['Набережные Яузы', 8, 18],
  ['Коломенское', 7, 16],
  ['Китай-город и Зарядье', 6, 14],
  ['Воробьёвы горы', 5, 11],
  ['Патриаршие пруды', 3, 9],
  ['Хитровка', 2, 5],
  ['Сокольники по кругу', 1, 3],
  ['Лефортовский парк', 0, 2],
] as const

const uuid = (prefix: string, index: number) =>
  `${prefix}-0000-4000-8000-${String(index).padStart(12, '0')}`

const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0)

const BASE = '*/api/data-provider/metrics/admin'

export const devHandlers: AnyHandler[] = [
  http.get('*/api/security-service/security/login', async ({ request }) => {
    await delay(400)
    const password = new URL(request.url).searchParams.get('password')
    // Пароль «wrong» — чтобы посмотреть ошибку входа.
    if (password === 'wrong') {
      return HttpResponse.text('Invalid credentials', { status: 401 })
    }
    return HttpResponse.text('mock.jwt.token')
  }),

  http.get(`${BASE}/registered/count`, async () => {
    await delay(300)
    return HttpResponse.json(248)
  }),

  http.get(`${BASE}/finished/per-user`, async () => {
    await delay(500)
    return HttpResponse.json({
      totalFinishedRoutes: sum(users.map(([, finished]) => finished)),
      finishedRoutesPerUser: users.map(([userName, finished], i) => ({
        userId: uuid('aaaaaaaa', i),
        userName,
        finishedRoutesCount: finished,
      })),
    })
  }),

  http.get(`${BASE}/published/per-user`, async () => {
    await delay(450)
    const authors = users.filter(([, , published]) => published > 0)
    return HttpResponse.json({
      totalPublishedRoutes: sum(authors.map(([, , published]) => published)),
      publishedRoutesPerUser: authors.map(([userName, , published], i) => ({
        userId: uuid('aaaaaaaa', i),
        userName,
        publishedRoutesCount: published,
      })),
    })
  }),

  http.get(`${BASE}/reviews/per-route`, async () => {
    await delay(600)
    return HttpResponse.json({
      totalReviews: sum(routes.map(([, reviews]) => reviews)),
      reviewsCountPerUser: routes.map(([routeName, reviews], i) => ({
        routeId: uuid('bbbbbbbb', i),
        routeName,
        reviewsCount: reviews,
      })),
    })
  }),

  http.get(`${BASE}/likes/total`, async () => {
    await delay(550)
    return HttpResponse.json({
      totalLikesCount: sum(routes.map(([, , likes]) => likes)),
      likesCountPerRoute: routes.map(([routeName, , likes], i) => ({
        routeId: uuid('bbbbbbbb', i),
        routeName,
        likesCount: likes,
      })),
    })
  }),
]
