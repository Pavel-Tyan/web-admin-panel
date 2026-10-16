import { http as mock, HttpResponse } from 'msw'
import { tokenStorage } from '@/shared/auth/tokenStorage'
import { server } from '@/shared/mocks/server'
import { http } from './http'

describe('http client', () => {
  it('sends the token as a Bearer header', async () => {
    let auth: string | null = null
    server.use(
      mock.get('*/api/ping', ({ request }) => {
        auth = request.headers.get('Authorization')
        return HttpResponse.json({})
      }),
    )
    tokenStorage.set('jwt')

    await http.get('/ping')

    expect(auth).toBe('Bearer jwt')
  })

  it('drops the session on 401', async () => {
    server.use(
      mock.get('*/api/ping', () => new HttpResponse(null, { status: 401 })),
    )
    tokenStorage.set('jwt')

    await expect(http.get('/ping')).rejects.toThrow()
    expect(tokenStorage.get()).toBeNull()
  })

  it('keeps the session when login itself returns 401', async () => {
    server.use(
      mock.get(
        '*/api/security-service/security/login',
        () => new HttpResponse(null, { status: 401 }),
      ),
    )
    tokenStorage.set('jwt')

    await expect(
      http.get('/security-service/security/login'),
    ).rejects.toThrow()
    expect(tokenStorage.get()).toBe('jwt')
  })
})
