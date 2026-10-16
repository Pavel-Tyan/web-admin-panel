import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useIsAuthenticated } from '@/features/auth'

// Пускает только с токеном (REQ-4.8-02). Проверка роли администратора — после
// того, как станет известен формат ответа /security/info.
export function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
