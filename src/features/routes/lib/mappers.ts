import type {
  CategoryDto,
  ReviewDto,
  ReviewInfoDto,
  ReviewsSummary,
  RouteCartDto,
  RouteCoordinateDto,
  RouteDetails,
  RouteListItem,
  RoutePageDto,
  RoutePoint,
  RouteReview,
} from '../model/types'

const UNTITLED = 'Без названия'

const toNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

const toText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

// Загрузка фото возвращает URL в S3 — его и показываем.
// Что-то другое (ключ, пустая строка) в <img> не открыть: показываем заглушку.
export const toImageUrl = (value: unknown): string | null => {
  const url = toText(value)
  return /^https?:\/\//i.test(url) ? url : null
}

const toCategories = (categories: CategoryDto[] | undefined): string[] => [
  ...new Set(
    (categories ?? []).map((c) => toText(c?.categoryName)).filter(Boolean),
  ),
]

export const mapRouteListItem = (dto: RouteCartDto): RouteListItem => ({
  id: dto.id,
  name: toText(dto.routeName) || UNTITLED,
  duration: toNumber(dto.duration),
  length: toNumber(dto.length),
  previewUrl: toImageUrl(dto.routePreview),
  categories: toCategories(dto.categories),
})

export const mapRouteList = (data: unknown): RouteListItem[] =>
  Array.isArray(data)
    ? (data as RouteCartDto[])
        .filter((dto) => typeof dto?.id === 'string')
        .map(mapRouteListItem)
    : []

// Точки — в порядке `orderNumber`; без координат точку не нанести на карту.
export const mapRoutePoints = (
  coordinates: RouteCoordinateDto[] | undefined,
): RoutePoint[] =>
  (coordinates ?? [])
    .flatMap((point, index) => {
      const latitude = toNumber(point?.latitude)
      const longitude = toNumber(point?.longitude)
      if (latitude === null || longitude === null) return []

      const order = toNumber(point.orderNumber) ?? index
      return [{ point, index, order, latitude, longitude }]
    })
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ point, index, latitude, longitude }) => ({
      key: point.id ?? `point-${index}`,
      title: toText(point.title),
      description: toText(point.description),
      latitude,
      longitude,
    }))

export const mapRouteDetails = (dto: RoutePageDto): RouteDetails => ({
  id: dto.id,
  name: toText(dto.routeName) || UNTITLED,
  description: toText(dto.description),
  duration: toNumber(dto.duration),
  length: toNumber(dto.length),
  startPoint: toText(dto.startPoint),
  endPoint: toText(dto.endPoint),
  previewUrl: toImageUrl(dto.routePreview),
  categories: toCategories(dto.categories),
  points: mapRoutePoints(dto.routeCoordinate),
})

// Своего id у отзыва в DTO нет, а смена порядка в ответе не должна ломать
// пометки: считаем отзыв уникальным по автору и времени создания.
const reviewId = (review: ReviewInfoDto) =>
  `${review.userId}|${review.createdAt}`

export const mapReviews = (data: ReviewDto | undefined): RouteReview[] =>
  (Array.isArray(data?.reviews) ? data.reviews : []).map((review, index) => {
    const id = reviewId(review)

    return {
      key: `${id}|${index}`,
      id,
      userId: review.userId,
      userName: toText(review.userName) || 'Пользователь',
      photoUrl: toImageUrl(review.photoUrl),
      text: toText(review.reviewText),
      rating: Math.min(
        5,
        Math.max(0, Math.round(toNumber(review.rating) ?? 0)),
      ),
      createdAt: review.createdAt,
    }
  })

// Рейтинга в DTO маршрута нет — считаем по отзывам.
export const summarizeReviews = (reviews: RouteReview[]): ReviewsSummary => {
  const rated = reviews.filter((r) => r.rating >= 1)
  const total = rated.reduce((sum, r) => sum + r.rating, 0)

  return {
    count: reviews.length,
    average: rated.length > 0 ? total / rated.length : null,
    distribution: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: rated.filter((r) => r.rating === rating).length,
    })),
  }
}
