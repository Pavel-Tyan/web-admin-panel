import type { RouteListItem } from '../model/types'

export interface RouteFilters {
  /** Поиск по названию и категориям. */
  query: string
  /** Маршрут подходит, если у него есть хотя бы одна из выбранных категорий. */
  categories: string[]
}

export function filterRoutes(
  routes: RouteListItem[],
  { query, categories }: RouteFilters,
): RouteListItem[] {
  const text = query.trim().toLowerCase()

  return routes.filter((route) => {
    if (
      categories.length > 0 &&
      !route.categories.some((c) => categories.includes(c))
    ) {
      return false
    }
    if (!text) return true

    return (
      route.name.toLowerCase().includes(text) ||
      route.categories.some((c) => c.toLowerCase().includes(text))
    )
  })
}

export interface CategoryOption {
  name: string
  count: number
}

// Все категории из списка с числом маршрутов: частые — первыми.
export function collectCategories(routes: RouteListItem[]): CategoryOption[] {
  const counts = new Map<string, number>()
  for (const route of routes) {
    for (const category of route.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }

  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'))
}
