import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '@/pages/login'
import { MetricsPage } from '@/pages/metrics'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Guard (RequireAdmin) и общий layout с меню — следующий шаг.
    path: '/metrics',
    element: <MetricsPage />,
  },
  {
    // «Метрики» — стартовая страница после входа.
    path: '/',
    element: <Navigate to="/metrics" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/metrics" replace />,
  },
])
