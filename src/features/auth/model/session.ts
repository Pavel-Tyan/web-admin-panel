import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router'
import { sessionEmail } from '@/shared/auth/sessionEmail'
import { tokenStorage } from '@/shared/auth/tokenStorage'

/** Есть ли сохранённый токен. Обновляется при входе, выходе и 401. */
export const useIsAuthenticated = () =>
  useSyncExternalStore(tokenStorage.subscribe, () => tokenStorage.get() !== null)

/** Выход: сбросить токен и кэш запросов, перейти на вход. */
export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    navigate('/login', { replace: true })
  }, [navigate, queryClient])
}

/** Email, с которым вошли (для сайдбара). Меняется вместе с токеном. */
export const useSessionEmail = () =>
  useSyncExternalStore(tokenStorage.subscribe, sessionEmail.get)

export function saveSession(token: string, email: string) {
  // Сначала email: подписчики токена увидят уже полную сессию.
  sessionEmail.set(email)
  tokenStorage.set(token)
}
