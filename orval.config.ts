import { defineConfig } from 'orval'

// Генерация типов и хуков TanStack Query по OpenAPI-спецификации бэкенда.
// Запуск: npm run api:generate
// Источник: OPENAPI_URL (URL или путь к файлу), по умолчанию springdoc локального бэкенда.
export default defineConfig({
  admin: {
    input: {
      target: process.env.OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/generated/endpoints',
      schemas: 'src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      formatter: 'prettier',
      override: {
        mutator: {
          path: 'src/shared/api/http.ts',
          name: 'apiClient',
        },
      },
    },
  },
})
