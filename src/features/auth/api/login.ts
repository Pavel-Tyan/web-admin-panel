import { http } from '@/shared/api/http'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

// По OpenAPI security-service ответ 200 — строка с JWT.
export function extractToken(data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return data.trim()
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
