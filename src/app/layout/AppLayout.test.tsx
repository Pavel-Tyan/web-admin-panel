import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { tokenStorage } from '@/shared/auth/tokenStorage'
import { RequireAuth } from '../guards/RequireAuth'
import { AppLayout } from './AppLayout'

function renderApp(initialPath: string) {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <h1>Вход</h1> },
      {
        element: (
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        ),
        children: [{ path: '/metrics', element: <h1>Страница метрик</h1> }],
      },
    ],
    { initialEntries: [initialPath] },
  )

  render(
    <QueryClientProvider client={new QueryClient()}>
      <ConfigProvider locale={ruRU}>
        <AntApp>
          <RouterProvider router={router} />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>,
  )

  return router
}

describe('AppLayout', () => {
  it('redirects to login without a session', () => {
    const router = renderApp('/metrics')

    expect(router.state.location.pathname).toBe('/login')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('shows navigation with the active section', () => {
    tokenStorage.set('jwt')
    renderApp('/metrics')

    const nav = screen.getByRole('navigation', { name: 'Основная навигация' })
    expect(nav).toHaveTextContent('Метрики')
    expect(screen.getByText('Страница метрик')).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /Метрики/ }),
    ).toHaveClass('ant-menu-item-selected')
  })

  it('logs out: clears the token and opens login', async () => {
    tokenStorage.set('jwt')
    const router = renderApp('/metrics')

    await userEvent.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(tokenStorage.get()).toBeNull()
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.getByText('Вход')).toBeInTheDocument()
  })
})
