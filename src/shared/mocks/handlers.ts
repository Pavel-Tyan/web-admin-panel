import type { RequestHandler } from 'msw'

// Общие MSW-хендлеры для тестов и dev-режима без бэкенда.
export const handlers: RequestHandler[] = []
