// Схемы из OpenAPI data-provider (/v3/api-docs/data-provider).
// После `npm run api:generate` заменить на сгенерированные типы.

export interface FinishedRoutesPerUser {
  userId: string
  userName: string
  finishedRoutesCount: number
}

export interface MetricFinishedRoutesPerUserDto {
  totalFinishedRoutes: number
  finishedRoutesPerUser?: FinishedRoutesPerUser[]
}

export interface PublishedRoutesPerUser {
  userId: string
  userName: string
  publishedRoutesCount: number
}

export interface MetricPublishedRoutesCountPerUserDto {
  totalPublishedRoutes: number
  publishedRoutesPerUser: PublishedRoutesPerUser[]
}

// В бэкенде тип называется ReviewCountPerUser, но по полям это отзывы по маршруту.
export interface ReviewCountPerRoute {
  routeId: string
  routeName: string
  reviewsCount: number
}

export interface MetricReviewsCountPerRouteDto {
  totalReviews: number
  reviewsCountPerUser?: ReviewCountPerRoute[]
}

export interface LikesCountPerRoute {
  routeId: string
  routeName: string
  likesCount: number
}

export interface MetricRoutesLikesCountDto {
  totalLikesCount: number
  likesCountPerRoute: LikesCountPerRoute[]
}

/** Строка рейтинга для графика и таблицы. */
export interface RankingItem {
  key: string
  label: string
  value: number
}

/** Итог + разбивка по пользователям или маршрутам. */
export interface RankingMetric {
  total: number
  items: RankingItem[]
}
