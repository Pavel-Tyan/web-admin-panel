// Единицы в OpenAPI не указаны, поэтому взяты по реальному ответу data-provider:
// `length` — метры, `duration` — секунды (4276 м и 2969 с — это 4,3 км за 49 минут,
// около 11,6 минуты на километр). Если окажется иначе — правится здесь.

const EMPTY = '—'

const METERS_IN_KM = 1000

const kmFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })
const mFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

/** Метры: до километра показываем в метрах, дальше — в километрах. */
export function formatLength(meters: number | null): string {
  if (meters === null) return EMPTY
  if (meters < METERS_IN_KM) return `${mFormat.format(meters)} м`
  return `${kmFormat.format(meters / METERS_IN_KM)} км`
}

/** Секунды: до часа — в минутах, дальше — часы и минуты. */
export function formatDuration(seconds: number | null): string {
  if (seconds === null) return EMPTY

  const total = Math.max(0, Math.round(seconds / 60))
  if (total < 60) return `${total} мин`

  const hours = Math.floor(total / 60)
  const rest = total % 60
  return rest > 0 ? `${hours} ч ${rest} мин` : `${hours} ч`
}

const ratingFormat = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatRating(value: number | null): string {
  return value === null ? EMPTY : ratingFormat.format(value)
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}
