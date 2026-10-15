import { extractToken } from './login'

describe('extractToken', () => {
  it('accepts a plain token string', () => {
    expect(extractToken('jwt-token')).toBe('jwt-token')
  })

  it('accepts token or accessToken fields', () => {
    expect(extractToken({ token: 'a' })).toBe('a')
    expect(extractToken({ accessToken: 'b' })).toBe('b')
  })

  it('rejects an empty or unknown response', () => {
    expect(() => extractToken('')).toThrow()
    expect(() => extractToken({ user: 'x' })).toThrow()
    expect(() => extractToken(null)).toThrow()
  })
})
