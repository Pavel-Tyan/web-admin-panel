import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router'
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

export const saveSession = (token: string) => tokenStorage.set(token)
