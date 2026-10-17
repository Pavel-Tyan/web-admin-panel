# Админ-панель Walking Route Planner

Веб-панель администратора приложения для построения пешеходных маршрутов

## Стек

- React 19, TypeScript, Vite
- Ant Design 6 (локаль `ru_RU`) — UI, Recharts — графики
- Оформление: тема AntD в `src/app/theme.ts` (фиолетовый акцент `#7c3aed`), шрифты Onest (текст) и Unbounded (заголовки, числа метрик) из Google Fonts — подключены в `index.html`, применение заголовкам — в `src/index.css`
- React Router — маршрутизация
- TanStack Query + axios — работа с API
- dayjs — даты
- Vitest, Testing Library, MSW — тесты и моки API

## Быстрый старт

```bash
npm install
cp .env.example .env.local  
npm run dev:mock             
```

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

## Переменные окружения

Задаются в `.env.local` (не коммитится), образец — `.env.example`.

| Переменная | Назначение | По умолчанию |
|---|---|---|
| `API_PROXY_TARGET` | Куда `vite` и `vite preview` проксируют `/api` | `https://mpi.notme.work.gd` |
| `VITE_API_BASE_URL` | Базовый путь axios-клиента | `/api` |
| `VITE_MONITORING_URL` | Ссылка «Мониторинг» в панели | `https://mpi2.notme.work.gd/` |

## Структура

```
src/
├── app/          # провайдеры, тема, роутер
├── pages/        # страницы: login, metrics, routes, route
├── features/     # бизнес-логика по доменам: auth, metrics, routes (api, model, lib, ui)
├── shared/       # api/http.ts, auth/, lib/, mocks/
└── test/         # настройка тестового окружения
```

Зависимости идут только вниз: `pages → features → shared`

## Деплой (Amvera)

Деплой на хостинге Amvera. Конфиг — `amvera.yml` в корне

## CI

GitHub Actions (`.github/workflows/ci.yml`) на push в `main` и на pull request: `npm ci` → `lint` → `typecheck` → `test` → `build`.
