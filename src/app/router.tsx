import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '@/pages/login'
import { MetricsPage } from '@/pages/metrics'
import { RoutePage } from '@/pages/route'
import { RoutesPage } from '@/pages/routes'
import { RequireAuth } from './guards/RequireAuth'
import { AppLayout } from './layout/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Все страницы, кроме входа: только после входа и с панелью навигации.
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/metrics', element: <MetricsPage /> },
      { path: '/routes', element: <RoutesPage /> },
      { path: '/routes/:routeId', element: <RoutePage /> },
      // «Метрики» — стартовая страница после входа.
      { path: '/', element: <Navigate to="/metrics" replace /> },
      { path: '*', element: <Navigate to="/metrics" replace /> },
    ],
  },
])
