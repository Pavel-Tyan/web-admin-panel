import {
  mapFinishedRoutes,
  mapLikes,
  mapPublishedRoutes,
  mapReviews,
  toCount,
} from './mappers'

describe('metrics mappers', () => {
  it('maps finished routes and sorts by count', () => {
    expect(
      mapFinishedRoutes({
        totalFinishedRoutes: 12,
        finishedRoutesPerUser: [
          { userId: 'u1', userName: 'anna', finishedRoutesCount: 3 },
          { userId: 'u2', userName: 'boris', finishedRoutesCount: 9 },
        ],
      }),
    ).toEqual({
      total: 12,
      items: [
        { key: 'u2', label: 'boris', value: 9 },
        { key: 'u1', label: 'anna', value: 3 },
      ],
    })
  })

  it('treats a missing breakdown as empty', () => {
    expect(mapFinishedRoutes({ totalFinishedRoutes: 0 })).toEqual({
      total: 0,
      items: [],
    })
    expect(mapReviews({ totalReviews: 5 }).items).toEqual([])
  })

  it('maps published routes, reviews and likes', () => {
    expect(
      mapPublishedRoutes({
        totalPublishedRoutes: 4,
        publishedRoutesPerUser: [
          { userId: 'u3', userName: 'vera', publishedRoutesCount: 4 },
        ],
      }).items,
    ).toEqual([{ key: 'u3', label: 'vera', value: 4 }])

    expect(
      mapReviews({
        totalReviews: 6,
        reviewsCountPerUser: [
          { routeId: 'r1', routeName: 'Арбат', reviewsCount: 6 },
        ],
      }).items,
    ).toEqual([{ key: 'r1', label: 'Арбат', value: 6 }])

    expect(
      mapLikes({
        totalLikesCount: 2,
        likesCountPerRoute: [
          { routeId: 'r2', routeName: 'Парк', likesCount: 2 },
        ],
      }),
    ).toEqual({ total: 2, items: [{ key: 'r2', label: 'Парк', value: 2 }] })
  })

  it('parses the registered users count', () => {
    expect(toCount(128)).toBe(128)
    expect(toCount('128')).toBe(128)
    expect(() => toCount({})).toThrow()
  })
})
