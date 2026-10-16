import { decodeJwtPayload } from './currentUser'
import { tokenStorage } from './tokenStorage'

// Email, с которым вошли: показывается в сайдбаре. Живёт рядом с токеном в sessionStorage
// и сбрасывается вместе с ним — при выходе и при 401.
const KEY = 'admin-panel.email'

function read(): string | null {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

let current = read()

// Запасной вариант для сессий без сохранённого email: claim из JWT.
function emailFromToken(): string | null {
  const token = tokenStorage.get()
  const payload = token ? decodeJwtPayload(token) : null

  for (const claim of ['email', 'sub', 'username']) {
    const value = payload?.[claim]
    if (typeof value === 'string' && value.includes('@')) return value
  }
  return null
}

export const sessionEmail = {
  get: (): string | null => current ?? emailFromToken(),

  set(email: string) {
    current = email.trim() || null
    try {
      if (current) sessionStorage.setItem(KEY, current)
      else sessionStorage.removeItem(KEY)
    } catch {
      // Хранилище недоступно — держим только в памяти.
    }
  },

  clear() {
    current = null
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // ignore
    }
  },
}

// Токен сброшен (выход, 401) — email тоже.
tokenStorage.subscribe(() => {
  if (tokenStorage.get() === null) sessionEmail.clear()
})
