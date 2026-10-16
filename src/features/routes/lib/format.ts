// Единицы в OpenAPI не указаны. Считаем, как в мобильном приложении:
// `duration` — минуты, `length` — километры. Если окажется иначе — правится здесь.

const EMPTY = '—'

const kmFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

export function formatLength(km: number | null): string {
  return km === null ? EMPTY : `${kmFormat.format(km)} км`
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return EMPTY

  const total = Math.max(0, Math.round(minutes))
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
