import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/shared/mocks/server'

// В jsdom нет matchMedia, а он нужен AntD (Grid, адаптивные компоненты).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
  }),
})

// В jsdom нет ResizeObserver, а он нужен Recharts (ResponsiveContainer) и AntD.
class ResizeObserverMock {
  observe() { }
  unobserve() { }
  disconnect() { }
}
globalThis.ResizeObserver = ResizeObserverMock

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
