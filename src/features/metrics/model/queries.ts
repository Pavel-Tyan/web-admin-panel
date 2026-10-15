import { useQuery } from '@tanstack/react-query'
import {
  fetchFinishedRoutes,
  fetchLikes,
  fetchPublishedRoutes,
  fetchRegisteredUsersCount,
  fetchReviews,
} from '../api/metrics'

export const metricsKeys = {
  all: ['metrics'] as const,
  registeredUsers: () => [...metricsKeys.all, 'registered-users'] as const,
  likes: () => [...metricsKeys.all, 'likes'] as const,
  finishedRoutes: () => [...metricsKeys.all, 'finished-routes'] as const,
  publishedRoutes: () => [...metricsKeys.all, 'published-routes'] as const,
  reviews: () => [...metricsKeys.all, 'reviews'] as const,
}

export const useRegisteredUsersCount = () =>
  useQuery({
    queryKey: metricsKeys.registeredUsers(),
    queryFn: fetchRegisteredUsersCount,
  })

export const useLikesMetric = () =>
  useQuery({ queryKey: metricsKeys.likes(), queryFn: fetchLikes })

export const useFinishedRoutesMetric = () =>
  useQuery({
    queryKey: metricsKeys.finishedRoutes(),
    queryFn: fetchFinishedRoutes,
  })

export const usePublishedRoutesMetric = () =>
  useQuery({
    queryKey: metricsKeys.publishedRoutes(),
    queryFn: fetchPublishedRoutes,
  })

export const useReviewsMetric = () =>
  useQuery({ queryKey: metricsKeys.reviews(), queryFn: fetchReviews })
