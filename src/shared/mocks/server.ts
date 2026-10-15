import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// MSW для тестов (Node / Vitest).
export const server = setupServer(...handlers)
