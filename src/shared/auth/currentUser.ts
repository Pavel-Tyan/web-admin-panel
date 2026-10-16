import { tokenStorage } from './tokenStorage'

// Ручки data-provider `*/user/*` требуют заголовок X-User-Id. Админу он нужен
// только формально (например, для `isFavourite`), поэтому берём id из JWT,
// а если в токене его нет — нулевой UUID.
export const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Состав claims в токене бэкенд не документирует — перебираем частые имена.
const USER_ID_CLAIMS = ['userId', 'user_id', 'id', 'uid', 'sub'] as const

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1]
  if (!part) return null

  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    // atob отдаёт бинарную строку — переводим её в UTF-8.
    const json = decodeURIComponent(
      Array.from(atob(padded), (char) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`,
      ).join(''),
    )
    const payload: unknown = JSON.parse(json)
    return payload !== null && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export function getCurrentUserId(token = tokenStorage.get()): string {
  const payload = token ? decodeJwtPayload(token) : null

  for (const claim of USER_ID_CLAIMS) {
    const value = payload?.[claim]
    if (typeof value === 'string' && UUID_RE.test(value)) return value
  }
  return ANONYMOUS_USER_ID
}
