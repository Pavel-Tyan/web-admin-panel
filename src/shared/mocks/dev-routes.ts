import { delay, http, HttpResponse, type AnyHandler } from 'msw'

// Моки маршрутов и отзывов для `npm run dev:mock` (формат — OpenAPI data-provider).
// Названия и число отзывов совпадают с моками метрик.

const ROUTES = [
  // [название, отзывов, широта центра, долгота центра, категории]
  ['По бульварному кольцу', 18, 55.764, 37.604, ['пешеходный', 'исторический']],
  ['Парк Горького и Нескучный сад', 15, 55.73, 37.603, ['парки', 'семейный']],
  ['Старый Арбат', 12, 55.7495, 37.5915, ['пешеходный', 'культурный']],
  ['Замоскворечье: тихие переулки', 10, 55.739, 37.626, ['исторический']],
  ['Набережные Яузы', 8, 55.75, 37.66, ['набережные']],
  ['Коломенское', 7, 55.667, 37.67, ['парки', 'исторический']],
  ['Китай-город и Зарядье', 6, 55.7525, 37.63, ['культурный']],
  ['Воробьёвы горы', 5, 55.71, 37.545, ['парки', 'виды']],
  ['Патриаршие пруды', 3, 55.7635, 37.593, ['пешеходный']],
  ['Хитровка', 2, 55.7535, 37.642, ['исторический']],
  ['Сокольники по кругу', 1, 55.793, 37.675, ['парки']],
  ['Лефортовский парк', 0, 55.759, 37.702, []],
] as const

const REVIEWERS = [
  'Анна Смирнова',
  'Борис Иванов',
  'Вера Кузнецова',
  'Глеб Попов',
  'Дарья Соколова',
  'Егор Лебедев',
]

const REVIEW_TEXTS = [
  'Отличная прогулка! Маршрут продуман, по пути много интересного.',
  'Понравилось, но в одном месте точка стоит посреди стройки — пришлось обходить.',
  'Шли с детьми, всем понравилось. Удобно, что есть где передохнуть.',
  'Неплохо, но длиннее, чем указано.',
  '',
  'Красиво, особенно на закате. Обязательно пройду ещё раз осенью.',
]

const RATINGS = [5, 4, 5, 3, 5, 4, 2, 5, 4, 5, 1, 4]

const routeId = (index: number) =>
  `bbbbbbbb-0000-4000-8000-${String(index).padStart(12, '0')}`

const round = (value: number, digits: number) =>
  Math.round(value * 10 ** digits) / 10 ** digits

const lengthOf = (index: number) => round(1.6 + index * 0.55, 1)
const durationOf = (index: number) => Math.round(lengthOf(index) * 14)
// У нечётных маршрутов фото нет — видно заглушку.
const previewOf = (index: number) =>
  index % 2 === 0 ? `https://picsum.photos/seed/route-${index}/960/540` : ''

const categoriesOf = (index: number) =>
  (ROUTES[index][4] as readonly string[]).map((categoryName) => ({
    routeId: routeId(index),
    categoryName,
  }))

function pointsOf(index: number) {
  const [, , lat, lon] = ROUTES[index]
  const count = 4 + (index % 5)

  // Отдаём точки не по порядку: админка должна сама отсортировать по orderNumber.
  return Array.from({ length: count }, (_, i) => ({
    id: `cccccccc-${String(index).padStart(4, '0')}-4000-8000-${String(i).padStart(12, '0')}`,
    routeId: routeId(index),
    latitude: round(lat + i * 0.0014, 6),
    longitude: round(lon + Math.sin(i) * 0.0022, 6),
    orderNumber: i,
    title: i === 0 ? 'Старт' : i === count - 1 ? 'Финиш' : `Точка ${i}`,
    description:
      i === 0 ? 'Встречаемся у выхода из метро.' : i % 2 ? 'Смотровая площадка' : '',
  })).reverse()
}

function reviewsOf(index: number) {
  const count = ROUTES[index][1]
  const now = Date.UTC(2026, 9, 15, 12)

  return Array.from({ length: count }, (_, i) => ({
    userId: `aaaaaaaa-0000-4000-8000-${String(i % REVIEWERS.length).padStart(12, '0')}`,
    userName: REVIEWERS[i % REVIEWERS.length],
    photoUrl: '',
    reviewText: REVIEW_TEXTS[(i + index) % REVIEW_TEXTS.length],
    rating: RATINGS[(i + index) % RATINGS.length],
    createdAt: new Date(now - (i * 3 + index) * 86_400_000).toISOString(),
  }))
}

const indexOf = (request: Request) => {
  const id = new URL(request.url).searchParams.get('routeId')
  return ROUTES.findIndex((_, index) => routeId(index) === id)
}

const BASE = '*/api/data-provider'

export const routeHandlers: AnyHandler[] = [
  http.get(`${BASE}/routes/user/all`, async () => {
    await delay(500)
    return HttpResponse.json(
      ROUTES.map(([routeName], index) => ({
        id: routeId(index),
        routeName,
        duration: durationOf(index),
        length: lengthOf(index),
        routePreview: previewOf(index),
        distanceToUser: round(index * 1.3, 1),
        categories: categoriesOf(index),
      })),
    )
  }),

  http.get(`${BASE}/routes/user/page`, async ({ request }) => {
    await delay(400)
    const index = indexOf(request)
    if (index === -1) {
      return HttpResponse.text('Route not found', { status: 404 })
    }

    const points = pointsOf(index)
    const [routeName] = ROUTES[index]
    return HttpResponse.json({
      id: routeId(index),
      routeName,
      description:
        `${routeName} — неспешная прогулка по одному из самых живописных мест Москвы.\n\n` +
        'По пути — архитектура разных эпох, уютные дворы и пара хороших кофеен. ' +
        'Маршрут подходит для прогулки в любое время года.',
      duration: durationOf(index),
      length: lengthOf(index),
      startPoint: 'Выход из метро',
      endPoint: `${routeName}, финиш`,
      routePreview: previewOf(index),
      isFavourite: false,
      routeCoordinate: points,
      categories: categoriesOf(index),
    })
  }),

  http.get(`${BASE}/reviews/user/all`, async ({ request }) => {
    await delay(650)
    const index = indexOf(request)
    if (index === -1) {
      return HttpResponse.text('Route not found', { status: 404 })
    }
    return HttpResponse.json({
      curUserId: '00000000-0000-0000-0000-000000000000',
      reviews: reviewsOf(index),
    })
  }),
]
