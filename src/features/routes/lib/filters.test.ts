import type { RouteListItem } from '../model/types'
import { collectCategories, filterRoutes } from './filters'

const route = (id: string, name: string, categories: string[]): RouteListItem => ({
  id,
  name,
  categories,
  duration: null,
  length: null,
  previewUrl: null,
})

const routes = [
  route('r1', 'Старый Арбат', ['пешеходный', 'культурный']),
  route('r2', 'Парк Горького', ['парки']),
  route('r3', 'Коломенское', ['парки', 'исторический']),
  route('r4', 'Без категорий', []),
]

const ids = (items: RouteListItem[]) => items.map((r) => r.id)

describe('route filters', () => {
  it('returns everything without filters', () => {
    expect(ids(filterRoutes(routes, { query: '', categories: [] }))).toEqual([
      'r1',
      'r2',
      'r3',
      'r4',
    ])
  })

  it('keeps routes with any of the selected categories', () => {
    expect(
      ids(filterRoutes(routes, { query: '', categories: ['культурный', 'исторический'] })),
    ).toEqual(['r1', 'r3'])
  })

  it('combines categories with the text search', () => {
    expect(
      ids(filterRoutes(routes, { query: 'коломен', categories: ['парки'] })),
    ).toEqual(['r3'])
  })

  it('collects categories with counts, most used first', () => {
    expect(collectCategories(routes)).toEqual([
      { name: 'парки', count: 2 },
      { name: 'исторический', count: 1 },
      { name: 'культурный', count: 1 },
      { name: 'пешеходный', count: 1 },
    ])
  })
})
