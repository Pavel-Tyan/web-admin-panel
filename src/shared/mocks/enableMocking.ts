// Включает MSW в браузере, только если запущено `npm run dev:mock`
// (`vite --mode mock`). В обычной сборке ничего не делает.
export async function enableMocking() {
  if (import.meta.env.MODE !== 'mock') return

  const [{ setupWorker }, { devHandlers }] = await Promise.all([
    import('msw/browser'),
    import('./dev-handlers'),
  ])

  // Запросы без мока (статика, HMR) уходят как обычно.
  await setupWorker(...devHandlers).start({ onUnhandledFrame: 'bypass' })
}
