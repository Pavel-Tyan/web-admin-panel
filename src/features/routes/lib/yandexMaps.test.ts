import { buildPointUrl, buildRouteUrl } from './yandexMaps'

describe('yandexMaps', () => {
  it('builds a pedestrian route through all points in order (lat,lon)', () => {
    const url = buildRouteUrl([
      { latitude: 55.75, longitude: 37.61 },
      { latitude: 55.76, longitude: 37.62 },
      { latitude: 55.77, longitude: 37.6 },
    ])

    expect(url).toBe(
      'https://yandex.ru/maps/?rtext=55.75,37.61~55.76,37.62~55.77,37.6&rtt=pd',
    )
  })

  it('shows a single point as a placemark (lon,lat)', () => {
    expect(buildRouteUrl([{ latitude: 55.75, longitude: 37.61 }])).toBe(
      'https://yandex.ru/maps/?pt=37.61,55.75&z=17&l=map',
    )
    expect(buildPointUrl({ latitude: 55.75, longitude: 37.61 })).toBe(
      'https://yandex.ru/maps/?pt=37.61,55.75&z=17&l=map',
    )
  })

  it('returns null without points', () => {
    expect(buildRouteUrl([])).toBeNull()
  })
})
