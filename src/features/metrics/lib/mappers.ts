import type {
  MetricFinishedRoutesPerUserDto,
  MetricPublishedRoutesCountPerUserDto,
  MetricReviewsCountPerRouteDto,
  MetricRoutesLikesCountDto,
  RankingItem,
  RankingMetric,
} from '../model/types'

const byValueDesc = (a: RankingItem, b: RankingItem) => b.value - a.value

export const mapFinishedRoutes = (
  dto: MetricFinishedRoutesPerUserDto,
): RankingMetric => ({
  total: dto.totalFinishedRoutes,
  items: (dto.finishedRoutesPerUser ?? [])
    .map((row) => ({
      key: row.userId,
      label: row.userName,
      value: row.finishedRoutesCount,
    }))
    .sort(byValueDesc),
})

export const mapPublishedRoutes = (
  dto: MetricPublishedRoutesCountPerUserDto,
): RankingMetric => ({
  total: dto.totalPublishedRoutes,
  items: (dto.publishedRoutesPerUser ?? [])
    .map((row) => ({
      key: row.userId,
      label: row.userName,
      value: row.publishedRoutesCount,
    }))
    .sort(byValueDesc),
})

export const mapReviews = (
  dto: MetricReviewsCountPerRouteDto,
): RankingMetric => ({
  total: dto.totalReviews,
  items: (dto.reviewsCountPerUser ?? [])
    .map((row) => ({
      key: row.routeId,
      label: row.routeName,
      value: row.reviewsCount,
    }))
    .sort(byValueDesc),
})

export const mapLikes = (dto: MetricRoutesLikesCountDto): RankingMetric => ({
  total: dto.totalLikesCount,
  items: (dto.likesCountPerRoute ?? [])
    .map((row) => ({
      key: row.routeId,
      label: row.routeName,
      value: row.likesCount,
    }))
    .sort(byValueDesc),
})

/** `registered/count` отдаёт голое число (integer). */
export function toCount(data: unknown): number {
  const value = typeof data === 'string' ? Number(data) : data
  if (typeof value === 'number' && Number.isFinite(value)) return value
  throw new Error('Unexpected count response')
}
