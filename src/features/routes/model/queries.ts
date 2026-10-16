import { useQuery } from '@tanstack/react-query'
import { fetchRoute, fetchRouteReviews, fetchRoutes } from '../api/routes'

export const routesKeys = {
  all: ['routes'] as const,
  list: () => [...routesKeys.all, 'list'] as const,
  details: (routeId: string) =>
    [...routesKeys.all, 'details', routeId] as const,
  reviews: (routeId: string) =>
    [...routesKeys.all, 'reviews', routeId] as const,
}

export const useRoutes = () =>
  useQuery({ queryKey: routesKeys.list(), queryFn: fetchRoutes })

export const useRoute = (routeId: string) =>
  useQuery({
    queryKey: routesKeys.details(routeId),
    queryFn: () => fetchRoute(routeId),
    enabled: routeId !== '',
  })

export const useRouteReviews = (routeId: string) =>
  useQuery({
    queryKey: routesKeys.reviews(routeId),
    queryFn: () => fetchRouteReviews(routeId),
    enabled: routeId !== '',
  })
