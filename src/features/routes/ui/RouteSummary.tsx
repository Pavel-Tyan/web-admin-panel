import { StarFilled } from '@ant-design/icons'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  Descriptions,
  Flex,
  Tooltip,
  Typography,
  theme,
  type DescriptionsProps,
} from 'antd'
import { plural } from '@/shared/lib/plural'
import { deletedReviews, useDeletedIds } from '@/shared/lib/deletedStore'
import { formatDuration, formatLength, formatRating } from '../lib/format'
import { summarizeReviews } from '../lib/mappers'
import type { RouteDetails, RouteReview } from '../model/types'

const { Text } = Typography

interface RouteSummaryProps {
  route: RouteDetails
  reviews: UseQueryResult<RouteReview[]>
}

const shortId = (id: string) =>
  id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id

// Поля, которых нет в DTO маршрута: место под них оставлено заранее.
function MissingValue() {
  return (
    <Tooltip title="Бэкенд пока не отдаёт это поле">
      <Text type="secondary">Нет данных</Text>
    </Tooltip>
  )
}

function RatingValue({ reviews }: Pick<RouteSummaryProps, 'reviews'>) {
  const { token } = theme.useToken()
  // Удалённые отзывы не участвуют в рейтинге.
  const hidden = useDeletedIds(deletedReviews)

  if (reviews.isPending) return <Text type="secondary">Загрузка…</Text>
  if (reviews.isError) return <Text type="danger">Не удалось загрузить</Text>

  const { average, count } = summarizeReviews(
    reviews.data.filter((review) => !hidden.includes(review.id)),
  )
  if (average === null) return <Text type="secondary">Нет оценок</Text>

  return (
    <Flex align="center" gap={6}>
      <StarFilled style={{ color: token.colorWarning }} />
      <Text strong>{formatRating(average)}</Text>
      <Text type="secondary">
        · {count} {plural(count, ['отзыв', 'отзыва', 'отзывов'])}
      </Text>
    </Flex>
  )
}

export function RouteSummary({ route, reviews }: RouteSummaryProps) {
  const items: DescriptionsProps['items'] = [
    { key: 'length', label: 'Длина', children: formatLength(route.length) },
    { key: 'duration', label: 'Время', children: formatDuration(route.duration) },
    { key: 'start', label: 'Старт', children: route.startPoint || '—' },
    { key: 'end', label: 'Финиш', children: route.endPoint || '—' },
    { key: 'points', label: 'Точек', children: route.points.length },
    { key: 'rating', label: 'Рейтинг', children: <RatingValue reviews={reviews} /> },
    { key: 'author', label: 'Автор', children: <MissingValue /> },
    { key: 'status', label: 'Статус', children: <MissingValue /> },
    {
      key: 'id',
      label: 'ID',
      children: (
        <Text
          code
          copyable={{ text: route.id, tooltips: ['Скопировать ID', 'Скопировано'] }}
        >
          {shortId(route.id)}
        </Text>
      ),
    },
  ]

  return (
    <Descriptions
      bordered
      size="small"
      column={1}
      items={items}
      styles={{ label: { width: 120 } }}
    />
  )
}
