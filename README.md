# Админ-панель Walking Route Planner

Веб-панель администратора приложения для пеших маршрутов: вход, бизнес-метрики, а дальше — управление пользователями, маршрутами и отзывами (SRS, раздел 4.8).

## Стек

- React 19, TypeScript, Vite
- Ant Design 6 (локаль `ru_RU`) — UI, Recharts — графики
- React Router — маршрутизация
- TanStack Query + axios — работа с API
- dayjs — даты
- Vitest, Testing Library, MSW — тесты и моки API

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # при необходимости поправьте адреса
npm run dev                  # с настоящим бэкендом
npm run dev:mock             # без бэкенда, на моковых данных
```

Dev-сервер проксирует `/api` на `API_PROXY_TARGET` — по умолчанию стенд `https://mpi.notme.work.gd`.

## Страницы

| Адрес | Что там |
|---|---|
| `/login` | Вход по email и паролю |
| `/metrics` | Бизнес-метрики: итоги и рейтинги топ-10 (график или таблица) |
| `/`, остальные | Перенаправление на `/metrics` |

Все страницы, кроме `/login`, открываются только после входа (`app/guards/RequireAuth.tsx`) и показываются внутри `app/layout/AppLayout.tsx`: слева панель навигации с разделами и кнопкой «Выйти». Новый раздел добавляется в `NAV_ITEMS` в `AppLayout.tsx` и дочерним маршрутом в `app/router.tsx`.

Сессия: JWT после входа хранится в `sessionStorage` (`shared/auth/tokenStorage.ts`) и уходит в заголовке `Authorization: Bearer`. Ответ 401 на любой запрос, кроме входа, сбрасывает сессию и возвращает на `/login`.

Пока нет: проверки роли администратора и ссылки на Grafana.

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Dev-сервер, запросы идут в бэкенд |
| `npm run dev:mock` | Dev-сервер с моками MSW вместо бэкенда |
| `npm run build` | Проверка типов и production-сборка |
| `npm run start` | Раздать собранный `dist` на порту 3000 (так запускается на Amvera) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Проверка типов |
| `npm run format` / `format:check` | Prettier |
| `npm test` | Тесты (один прогон) |
| `npm run test:watch` | Тесты в режиме наблюдения |
| `npm run test:coverage` | Тесты с отчётом о покрытии (`coverage/`) |
| `npm run api:generate` | Сгенерировать API-клиент orval из `OPENAPI_URL` |

## Переменные окружения

Задаются в `.env.local` (не коммитится), образец — `.env.example`.

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `API_PROXY_TARGET` | Куда `vite` и `vite preview` проксируют `/api` | `https://mpi.notme.work.gd` |
| `VITE_API_BASE_URL` | Базовый путь axios-клиента | `/api` |
| `OPENAPI_URL` | Спецификация для `api:generate` | `http://localhost:8080/v3/api-docs` |

## Структура

```
src/
├── app/          # провайдеры, тема, роутер
├── pages/        # страницы: login, metrics
├── features/     # бизнес-логика по доменам: auth, metrics (api, model, lib, ui)
├── shared/       # api/http.ts, mocks/
└── test/         # настройка Vitest и хелпер renderWithProviders
```

Зависимости идут только вниз: `pages → features → shared`. Фичи не импортируют друг друга, страницы импортируют фичу только через её `index.ts`.

## Бэкенд и API

- Swagger: https://mpi.notme.work.gd/swagger-ui/index.html — два сервиса:
  - `security-service` (`/v3/api-docs/security-service`) — вход: `GET /api/security-service/security/login?email&password`, ответ — строка с JWT;
  - `data-provider` (`/v3/api-docs/data-provider`) — метрики: `GET /api/data-provider/metrics/admin/*`.
- Все запросы идут через `src/shared/api/http.ts` (axios, таймаут 10 с — REQ-5.1-06).
- Типы ответов метрик сейчас перенесены из OpenAPI вручную: `src/features/metrics/model/types.ts`.
- `npm run api:generate` кладёт сгенерированный код в `src/shared/api/generated` — он правится только перегенерацией и коммитится, чтобы сборка не зависела от бэкенда. Спецификация разбита на два сервиса, поэтому `orval.config.ts` нужно будет настроить на оба.

## Моки и тесты

- **Dev-режим без бэкенда** — `npm run dev:mock`. MSW перехватывает запросы в браузере (`public/mockServiceWorker.js`), данные — в `src/shared/mocks/dev-handlers.ts`. Вход проходит с любыми данными, пароль `wrong` даёт ошибку. В production-сборку моки не попадают.
- **Тесты** — `src/test/setup.ts`: jsdom, jest-dom, MSW, заглушки `matchMedia` и `ResizeObserver` для AntD и Recharts. Каждый тест задаёт свои ответы через `server.use(...)`; запрос без хендлера валит тест (`onUnhandledFrame: 'error'`). Компоненты с провайдерами рендерятся через `renderWithProviders` из `src/test/render.tsx`.

## Деплой (Amvera)

Конфиг — `amvera.yml` в корне. Amvera ставит зависимости, собирает проект (`npm run build`) и запускает `npm run start` — это `vite preview` на порту 3000. Он раздаёт `dist`, открывает прямые ссылки вроде `/metrics` и проксирует `/api` на бэкенд, поэтому CORS не нужен.

Адрес бэкенда — `API_PROXY_TARGET` (по умолчанию `https://mpi.notme.work.gd`); при необходимости задаётся в переменных окружения приложения Amvera.

## CI

GitHub Actions (`.github/workflows/ci.yml`) на push в `main` и на pull request: `npm ci` → `lint` → `typecheck` → `test` → `build`.
