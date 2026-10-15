import { http } from '@/shared/api/http'
import {
  mapFinishedRoutes,
  mapLikes,
  mapPublishedRoutes,
  mapReviews,
  toCount,
} from '../lib/mappers'
import type {
  MetricFinishedRoutesPerUserDto,
  MetricPublishedRoutesCountPerUserDto,
  MetricReviewsCountPerRouteDto,
  MetricRoutesLikesCountDto,
} from '../model/types'

// GET-эндпоинты data-provider без параметров (OpenAPI: Metrics, admin).
const BASE = '/data-provider/metrics/admin'

export const fetchRegisteredUsersCount = () =>
  http.get<unknown>(`${BASE}/registered/count`).then(({ data }) => toCount(data))

export const fetchLikes = () =>
  http
    .get<MetricRoutesLikesCountDto>(`${BASE}/likes/total`)
    .then(({ data }) => mapLikes(data))

export const fetchFinishedRoutes = () =>
  http
    .get<MetricFinishedRoutesPerUserDto>(`${BASE}/finished/per-user`)
    .then(({ data }) => mapFinishedRoutes(data))

export const fetchPublishedRoutes = () =>
  http
    .get<MetricPublishedRoutesCountPerUserDto>(`${BASE}/published/per-user`)
    .then(({ data }) => mapPublishedRoutes(data))

export const fetchReviews = () =>
  http
    .get<MetricReviewsCountPerRouteDto>(`${BASE}/reviews/per-route`)
    .then(({ data }) => mapReviews(data))
