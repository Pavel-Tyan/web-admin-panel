import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/shared/mocks/server'
import { renderWithProviders } from '@/test/render'
import { LoginPage } from './LoginPage'

const LOGIN_URL = '*/api/security-service/security/login'

async function submitLogin() {
  await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com')
  await userEvent.type(screen.getByLabelText('Пароль'), 'secret')
  await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
}

describe('LoginPage', () => {
  it('sends credentials as query params and confirms success', async () => {
    let query: URLSearchParams | undefined
    server.use(
      http.get(LOGIN_URL, ({ request }) => {
        query = new URL(request.url).searchParams
        return HttpResponse.text('jwt-token')
      }),
    )
    renderWithProviders(<LoginPage />)

    await submitLogin()

    expect(await screen.findByText('Вход выполнен')).toBeInTheDocument()
    expect(query?.get('email')).toBe('admin@example.com')
    expect(query?.get('password')).toBe('secret')
  })

  it('reports invalid credentials', async () => {
    server.use(
      http.get(LOGIN_URL, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )
    renderWithProviders(<LoginPage />)

    await submitLogin()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Неверный email или пароль',
    )
  })

  it('reports a user without admin rights', async () => {
    server.use(
      http.get(LOGIN_URL, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    )
    renderWithProviders(<LoginPage />)

    await submitLogin()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'У этой учётной записи нет прав администратора',
    )
  })

  it('reports a network failure', async () => {
    server.use(http.get(LOGIN_URL, () => HttpResponse.error()))
    renderWithProviders(<LoginPage />)

    await submitLogin()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Сервер не отвечает',
    )
  })

  it('reports an unexpected response', async () => {
    server.use(http.get(LOGIN_URL, () => HttpResponse.json({})))
    renderWithProviders(<LoginPage />)

    await submitLogin()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось войти',
    )
  })
})
