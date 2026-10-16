// Хранилище JWT. sessionStorage: токен живёт до закрытия вкладки
// и не остаётся в браузере надолго (REQ-5.3-08).
const KEY = 'admin-panel.token'

type Listener = () => void
const listeners = new Set<Listener>()

function read(): string | null {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

let current = read()

function emit(next: string | null) {
  current = next
  listeners.forEach((listener) => listener())
}

export const tokenStorage = {
  get: () => current,

  set(token: string) {
    try {
      sessionStorage.setItem(KEY, token)
    } catch {
      // Хранилище недоступно (приватный режим) — держим токен только в памяти.
    }
    emit(token)
  },

  clear() {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // ignore
    }
    emit(null)
  },

  /** Подписка для useSyncExternalStore. */
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
