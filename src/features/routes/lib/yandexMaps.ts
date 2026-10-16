import type { RoutePoint } from '../model/types'

type Coordinates = Pick<RoutePoint, 'latitude' | 'longitude'>

const YANDEX_MAPS = 'https://yandex.ru/maps/'

// Точка на карте: `pt` — сначала долгота, потом широта.
export const buildPointUrl = ({ latitude, longitude }: Coordinates): string =>
  `${YANDEX_MAPS}?pt=${longitude},${latitude}&z=17&l=map`

// Пешеходный маршрут через все точки по порядку: `rtext` — «широта,долгота» через `~`.
// Линию между точками Яндекс строит сам: бэкенд хранит только точки.
export const buildRouteUrl = (points: Coordinates[]): string | null => {
  if (points.length === 0) return null
  if (points.length === 1) return buildPointUrl(points[0])

  const rtext = points.map((p) => `${p.latitude},${p.longitude}`).join('~')
  return `${YANDEX_MAPS}?rtext=${rtext}&rtt=pd`
}
