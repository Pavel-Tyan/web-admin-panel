import { sessionEmail } from './sessionEmail'
import { tokenStorage } from './tokenStorage'

const jwt = (payload: object) =>
  `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}.sig`

describe('sessionEmail', () => {
  it('stores the email and clears it together with the token', () => {
    tokenStorage.set('jwt')
    sessionEmail.set(' admin@example.com ')

    expect(sessionEmail.get()).toBe('admin@example.com')
    expect(sessionStorage.getItem('admin-panel.email')).toBe('admin@example.com')

    tokenStorage.clear()

    expect(sessionEmail.get()).toBeNull()
    expect(sessionStorage.getItem('admin-panel.email')).toBeNull()
  })

  it('falls back to an email claim in the JWT', () => {
    tokenStorage.set(jwt({ sub: 'boss@example.com' }))

    expect(sessionEmail.get()).toBe('boss@example.com')
  })

  it('has no email without one in storage or token', () => {
    tokenStorage.set(jwt({ sub: '3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b' }))

    expect(sessionEmail.get()).toBeNull()
  })
})
