import { ANONYMOUS_USER_ID, decodeJwtPayload, getCurrentUserId } from './currentUser'

const USER_ID = '3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b'

const jwt = (payload: object) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}.signature`

describe('currentUser', () => {
  it('decodes the JWT payload', () => {
    expect(decodeJwtPayload(jwt({ sub: 'user', role: 'ADMIN' }))).toEqual({
      sub: 'user',
      role: 'ADMIN',
    })
  })

  it('takes the user id from a uuid claim', () => {
    expect(getCurrentUserId(jwt({ userId: USER_ID }))).toBe(USER_ID)
    expect(getCurrentUserId(jwt({ sub: USER_ID }))).toBe(USER_ID)
  })

  it('falls back to the nil uuid', () => {
    expect(getCurrentUserId(jwt({ sub: 'admin@example.com' }))).toBe(
      ANONYMOUS_USER_ID,
    )
    expect(getCurrentUserId('not-a-jwt')).toBe(ANONYMOUS_USER_ID)
    expect(getCurrentUserId(null)).toBe(ANONYMOUS_USER_ID)
  })
})
