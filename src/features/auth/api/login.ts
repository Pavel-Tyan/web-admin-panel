import { http } from '@/shared/api/http'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

// Схема ответа в коллекции Postman не описана: принимаем токен строкой
// или полем `token` / `accessToken`. Когда появится OpenAPI, оставить один вариант.
export function extractToken(data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return data.trim()
  }

  if (data && typeof data === 'object') {
    for (const key of ['accessToken', 'token'] as const) {
      const value = (data as Record<string, unknown>)[key]
      if (typeof value === 'string' && value) {
        return value
      }
    }
  }

  throw new Error('Unexpected login response')
}

// GET /api/security-service/security/login?email=…&password=… (через API Gateway).
export const login = ({ email, password }: LoginCredentials) =>
  http
    .get<unknown>('/security-service/security/login', {
      params: { email, password },
    })
    .then(({ data }): LoginResponse => ({ accessToken: extractToken(data) }))
