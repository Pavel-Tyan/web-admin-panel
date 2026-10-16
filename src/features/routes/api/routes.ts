import { http } from '@/shared/api/http'
import { getCurrentUserId } from '@/shared/auth/currentUser'
import {
  mapReviews,
  mapRouteDetails,
  mapRouteList,
} from '../lib/mappers'
import type { ReviewDto, RoutePageDto } from '../model/types'

const ROUTES = '/data-provider/routes/user'
const REVIEWS = '/data-provider/reviews/user'

// Админского списка маршрутов в data-provider нет. Берём `routes/user/all`:
// координаты обязательны, радиус не передаём — пусть вернутся все.
// Центр Москвы влияет только на `distanceToUser`, его админка не показывает.
export const ROUTES_LIST_ORIGIN = { latitude: 55.7558, longitude: 37.6173 }

const userHeaders = () => ({ 'X-User-Id': getCurrentUserId() })

export const fetchRoutes = () =>
  http
    .get<unknown>(`${ROUTES}/all`, { params: ROUTES_LIST_ORIGIN })
    .then(({ data }) => mapRouteList(data))

export const fetchRoute = (routeId: string) =>
  http
    .get<RoutePageDto>(`${ROUTES}/page`, {
      params: { routeId },
      headers: userHeaders(),
    })
    .then(({ data }) => mapRouteDetails({ ...data, id: data?.id ?? routeId }))

export const fetchRouteReviews = (routeId: string) =>
  http
    .get<ReviewDto>(`${REVIEWS}/all`, {
      params: { routeId },
      headers: userHeaders(),
    })
    .then(({ data }) => mapReviews(data))
