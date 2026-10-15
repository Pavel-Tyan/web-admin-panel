import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('shows validation errors for empty fields', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<LoginForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Введите email')).toBeInTheDocument()
    expect(screen.getByText('Введите пароль')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
    await userEvent.type(screen.getByLabelText('Пароль'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Некорректный email')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits entered credentials', async () => {
    const onSubmit = vi.fn()
    renderWithProviders(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com')
    await userEvent.type(screen.getByLabelText('Пароль'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'secret',
      }),
    )
  })

  it('shows the error passed from outside', () => {
    renderWithProviders(
      <LoginForm onSubmit={vi.fn()} error="Неверный email или пароль" />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Неверный email или пароль',
    )
  })
})
