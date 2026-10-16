import { tokenStorage } from './tokenStorage'

describe('tokenStorage', () => {
  it('stores, reads and clears the token', () => {
    tokenStorage.set('jwt')
    expect(tokenStorage.get()).toBe('jwt')
    expect(sessionStorage.getItem('admin-panel.token')).toBe('jwt')

    tokenStorage.clear()
    expect(tokenStorage.get()).toBeNull()
    expect(sessionStorage.getItem('admin-panel.token')).toBeNull()
  })

  it('notifies subscribers', () => {
    const listener = vi.fn()
    const unsubscribe = tokenStorage.subscribe(listener)

    tokenStorage.set('jwt')
    tokenStorage.clear()
    unsubscribe()
    tokenStorage.set('again')

    expect(listener).toHaveBeenCalledTimes(2)
  })
})
