// DTO data-provider (OpenAPI, «Контроллер маршрутов» и «Контроллер отзывов»).
// Поля, не помеченные в схеме как required, — необязательные.

export interface CategoryDto {
  routeId?: string
  categoryName: string
}

export interface RouteCoordinateDto {
  id?: string
  routeId?: string
  latitude?: number
  longitude?: number
  orderNumber?: number
  title?: string
  description?: string
}

/** Элемент списка: `GET /routes/user/all`. */
export interface RouteCartDto {
  id: string
  routeName?: string
  duration?: number
  length?: number
  routePreview?: string
  distanceToUser?: number
  categories?: CategoryDto[]
}

/** Карточка маршрута: `GET /routes/user/page`. */
export interface RoutePageDto {
  id: string
  routeName?: string
  description?: string
  duration?: number
  length?: number
  startPoint?: string
  endPoint?: string
  routePreview?: string
  isFavourite?: boolean
  routeCoordinate?: RouteCoordinateDto[]
  categories?: CategoryDto[]
}

export interface ReviewInfoDto {
  userId: string
  userName: string
  photoUrl?: string
  reviewText?: string
  rating: number
  createdAt: string
}

/** Отзывы о маршруте: `GET /reviews/user/all`. */
export interface ReviewDto {
  curUserId?: string
  reviews: ReviewInfoDto[]
}

// Модели для UI.

export interface RouteListItem {
  id: string
  name: string
  /** Минуты. */
  duration: number | null
  /** Километры. */
  length: number | null
  previewUrl: string | null
  categories: string[]
}

export interface RoutePoint {
  key: string
  title: string
  description: string
  latitude: number
  longitude: number
}

export interface RouteDetails {
  id: string
  name: string
  description: string
  duration: number | null
  length: number | null
  startPoint: string
  endPoint: string
  previewUrl: string | null
  categories: string[]
  /** Отсортированы по `orderNumber`, без точек без координат. */
  points: RoutePoint[]
}

export interface RouteReview {
  key: string
  /** Устойчивый id: у пользователя один отзыв на маршрут. */
  id: string
  userId: string
  userName: string
  photoUrl: string | null
  text: string
  rating: number
  createdAt: string
}

export interface ReviewsSummary {
  count: number
  /** null — отзывов нет. */
  average: number | null
  /** От 5 звёзд к 1. */
  distribution: { rating: number; count: number }[]
}
