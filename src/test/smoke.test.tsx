import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { http, HttpResponse } from 'msw'
import { http as apiHttp } from '@/shared/api/http'
import { server } from '@/shared/mocks/server'

// Проверка, что тестовое окружение настроено: jsdom, AntD, user-event, MSW, axios.
describe('test environment', () => {
  it('renders AntD and handles clicks', async () => {
    const onClick = vi.fn()
    render(
      <ConfigProvider locale={ruRU}>
        <Button onClick={onClick}>Удалить</Button>
      </ConfigProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('intercepts API requests with MSW', async () => {
    server.use(
      http.get('*/api/ping', () => HttpResponse.json({ status: 'ok' })),
    )

    // Относительный путь, как в приложении: запрос на тот же origin, без CORS.
    const { data } = await apiHttp.get('/ping')

    expect(data).toEqual({ status: 'ok' })
  })
})
