import { extractToken } from './login'

describe('extractToken', () => {
  it('accepts a token string', () => {
    expect(extractToken('jwt-token')).toBe('jwt-token')
    expect(extractToken('  jwt-token\n')).toBe('jwt-token')
  })

  it('rejects an empty or non-string response', () => {
    expect(() => extractToken('')).toThrow()
    expect(() => extractToken({ token: 'a' })).toThrow()
    expect(() => extractToken(null)).toThrow()
  })
})
