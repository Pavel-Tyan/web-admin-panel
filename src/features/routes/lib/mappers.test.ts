import {
  mapReviews,
  mapRouteDetails,
  mapRouteList,
  summarizeReviews,
  toImageUrl,
} from './mappers'

describe('routes mappers', () => {
  it('sorts points by orderNumber and drops points without coordinates', () => {
    const route = mapRouteDetails({
      id: 'r1',
      routeCoordinate: [
        { id: 'c', latitude: 3, longitude: 3, orderNumber: 2, title: 'Финиш' },
        { id: 'a', latitude: 1, longitude: 1, orderNumber: 0, title: 'Старт' },
        { id: 'x', orderNumber: 1, title: 'Без координат' },
        { id: 'b', latitude: 2, longitude: 2, orderNumber: 1, title: ' Середина ' },
      ],
    })

    expect(route.points.map((p) => p.key)).toEqual(['a', 'b', 'c'])
    expect(route.points[1].title).toBe('Середина')
  })

  it('fills defaults for missing fields', () => {
    const route = mapRouteDetails({ id: 'r1' })

    expect(route).toMatchObject({
      name: 'Без названия',
      description: '',
      duration: null,
      length: null,
      previewUrl: null,
      categories: [],
      points: [],
    })
  })

  it('keeps unique category names', () => {
    const [route] = mapRouteList([
      {
        id: 'r1',
        routeName: 'Арбат',
        categories: [
          { categoryName: 'пешеходный' },
          { categoryName: 'пешеходный' },
          { categoryName: '' },
          { categoryName: 'культурный' },
        ],
      },
    ])

    expect(route.categories).toEqual(['пешеходный', 'культурный'])
  })

  it('ignores a non-array list response', () => {
    expect(mapRouteList('<!doctype html>')).toEqual([])
  })

  it('accepts only http(s) preview urls', () => {
    expect(toImageUrl('https://s3.example/route.jpg')).toBe(
      'https://s3.example/route.jpg',
    )
    expect(toImageUrl('routes/abc.jpg')).toBeNull()
    expect(toImageUrl('')).toBeNull()
    expect(toImageUrl(undefined)).toBeNull()
  })

  it('summarizes ratings', () => {
    const reviews = mapReviews({
      reviews: [
        { userId: 'u1', userName: 'Аня', rating: 5, createdAt: '2026-10-01' },
        { userId: 'u2', userName: 'Боря', rating: 4, createdAt: '2026-10-02' },
        { userId: 'u3', userName: 'Вера', rating: 5, createdAt: '2026-10-03' },
      ],
    })

    const summary = summarizeReviews(reviews)

    expect(summary.count).toBe(3)
    expect(summary.average).toBeCloseTo(14 / 3)
    expect(summary.distribution).toEqual([
      { rating: 5, count: 2 },
      { rating: 4, count: 1 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ])
  })

  it('has no average without reviews', () => {
    expect(summarizeReviews(mapReviews(undefined)).average).toBeNull()
  })
})
