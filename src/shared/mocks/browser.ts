import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// MSW для браузера (dev-режим без бэкенда).
// Требует public/mockServiceWorker.js: npx msw init public --save
export const worker = setupWorker(...handlers)
