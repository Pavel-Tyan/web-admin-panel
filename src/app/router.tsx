import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '@/pages/login'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Пока других страниц нет, всё ведёт на вход.
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
