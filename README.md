# Админ-панель Walking Route Planner

Веб-панель администратора: пользователи, маршруты, отзывы, бизнес-метрики и ссылка на мониторинг (Grafana).

## Стек

- React 19, TypeScript, Vite
- Ant Design (локаль `ru_RU`), Recharts — UI и графики
- React Router — маршрутизация
- TanStack Query + axios — работа с API; клиент генерирует orval по OpenAPI бэкенда
- dayjs — даты
- Vitest, Testing Library, MSW — тесты и моки API

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # при необходимости поправьте адреса
npm run dev
```

Dev-сервер проксирует `/api` на `API_PROXY_TARGET` (по умолчанию `http://localhost:8080`).

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер |
| `npm run build` | Проверка типов и production-сборка |
| `npm run lint` | ESLint |
| `npm run typecheck` | Проверка типов |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Тесты (один прогон) |
| `npm run test:watch` | Тесты в режиме наблюдения |
| `npm run test:coverage` | Тесты с отчётом о покрытии (`coverage/`) |
| `npm run api:generate` | Сгенерировать API-клиент из `OPENAPI_URL` в `src/shared/api/generated` |

## API-клиент

Код в `src/shared/api/generated` генерируется orval и правится только перегенерацией. Генерируемый код коммитится, чтобы сборка не зависела от запущенного бэкенда. Все запросы идут через `src/shared/api/http.ts`.

## Тесты и моки

- Настройка окружения: `src/test/setup.ts` (jsdom, jest-dom, MSW, заглушки `matchMedia` и `ResizeObserver` для AntD и Recharts).
- Общие хендлеры MSW: `src/shared/mocks/handlers.ts`. В тесте их можно переопределить через `server.use(...)`.
- Запрос без хендлера валит тест (`onUnhandledFrame: 'error'`).
