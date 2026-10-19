import { DeleteOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  Alert,
  App,
  Avatar,
  Button,
  Checkbox,
  Col,
  Empty,
  Flex,
  Popconfirm,
  Progress,
  Rate,
  Row,
  Segmented,
  Skeleton,
  Tag,
  Typography,
  theme,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { deletedReviews, useDeletedIds } from '@/shared/lib/deletedStore'
import { plural } from '@/shared/lib/plural'
import { formatRating } from '../lib/format'
import { summarizeReviews } from '../lib/mappers'
import type { ReviewsSummary, RouteReview } from '../model/types'

const { Text, Title, Paragraph } = Typography

type Sort = 'new' | 'high' | 'low'

const SORT_OPTIONS: { label: string; value: Sort }[] = [
  { label: 'Сначала новые', value: 'new' },
  { label: 'Высокая оценка', value: 'high' },
  { label: 'Низкая оценка', value: 'low' },
]

// Стабильная ссылка на пустой массив: иначе useMemo будет пересчитываться каждый рендер.
const NO_REVIEWS: RouteReview[] = []

const time = (value: string) => {
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const comparators: Record<Sort, (a: RouteReview, b: RouteReview) => number> = {
  new: (a, b) => time(b.createdAt) - time(a.createdAt),
  high: (a, b) => b.rating - a.rating || time(b.createdAt) - time(a.createdAt),
  low: (a, b) => a.rating - b.rating || time(b.createdAt) - time(a.createdAt),
}

const formatDate = (value: string) => {
  const date = dayjs(value)
  return date.isValid() ? date.format('D MMMM YYYY, HH:mm') : value
}

function RatingOverview({ summary }: { summary: ReviewsSummary }) {
  const { token } = theme.useToken()
  const rated = summary.distribution.reduce((sum, row) => sum + row.count, 0)

  return (
    <Flex vertical gap={12}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          {formatRating(summary.average)}
        </Title>
        <Rate
          disabled
          allowHalf
          value={
            summary.average === null ? 0 : Math.round(summary.average * 2) / 2
          }
        />
        <Text type="secondary" style={{ display: 'block' }}>
          {summary.count} {plural(summary.count, ['отзыв', 'отзыва', 'отзывов'])}
        </Text>
      </div>

      <Flex vertical gap={4} aria-label="Распределение оценок">
        {summary.distribution.map(({ rating, count }) => (
          <Flex key={rating} align="center" gap={8}>
            <Text type="secondary" style={{ width: 24 }}>
              {rating}★
            </Text>
            <Progress
              percent={rated > 0 ? Math.round((count / rated) * 100) : 0}
              showInfo={false}
              strokeColor={token.colorWarning}
              style={{ flex: 1, margin: 0 }}
            />
            <Text type="secondary" style={{ width: 28, textAlign: 'right' }}>
              {count}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

interface ReviewItemProps {
  review: RouteReview
  hidden: boolean
  onHide: (review: RouteReview) => void
  onRestore: (reviewId: string) => void
}

function ReviewItem({ review, hidden, onHide, onRestore }: ReviewItemProps) {
  return (
    <Flex gap={12} align="flex-start" style={{ opacity: hidden ? 0.6 : 1 }}>
      <Avatar
        src={review.photoUrl ?? undefined}
        icon={review.photoUrl ? undefined : <UserOutlined />}
        alt=""
      />
      <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Flex justify="space-between" wrap gap={8}>
          <Flex align="center" gap={8} wrap>
            <Text strong>{review.userName}</Text>
            {hidden && <Tag>Удалён</Tag>}
          </Flex>
          <Flex align="center" gap={8}>
            <Text type="secondary">{formatDate(review.createdAt)}</Text>
            {hidden ? (
              <Button
                size="small"
                type="link"
                icon={<UndoOutlined />}
                onClick={() => onRestore(review.id)}
                aria-label={`Вернуть отзыв ${review.userName}`}
              >
                Вернуть
              </Button>
            ) : (
              <Popconfirm
                title="Удалить отзыв?"
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{ danger: true }}
                onConfirm={() => onHide(review)}
              >
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Удалить отзыв ${review.userName}`}
                />
              </Popconfirm>
            )}
          </Flex>
        </Flex>
        <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
        {review.text ? (
          <Paragraph style={{ margin: '4px 0 0', whiteSpace: 'pre-line' }}>
            {review.text}
          </Paragraph>
        ) : (
          <Text type="secondary" italic>
            Без текста
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export function RouteReviews({
  query,
}: {
  query: UseQueryResult<RouteReview[]>
}) {
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const [sort, setSort] = useState<Sort>('new')
  const [showHidden, setShowHidden] = useState(false)

  const hidden = useDeletedIds(deletedReviews)
  const hiddenIds = useMemo(() => new Set(hidden), [hidden])

  const all = query.data ?? NO_REVIEWS
  const hiddenCount = all.filter((review) => hiddenIds.has(review.id)).length

  // Удалённые не идут в рейтинг.
  const visible = useMemo(
    () => all.filter((review) => !hiddenIds.has(review.id)),
    [all, hiddenIds],
  )
  const shown = showHidden ? all : visible
  const sorted = useMemo(
    () => [...shown].sort(comparators[sort]),
    [shown, sort],
  )

  const hideReview = (review: RouteReview) => {
    deletedReviews.hide(review.id)
    message.success(`Отзыв «${review.userName}» удалён`)
  }

  const restoreReview = (reviewId: string) => {
    deletedReviews.restore(reviewId)
    message.success('Отзыв восстановлен')
  }

  if (query.isPending) {
    return <Skeleton active avatar paragraph={{ rows: 4 }} />
  }

  if (query.isError) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не удалось загрузить отзывы"
        action={
          <Button size="small" onClick={() => query.refetch()}>
            Повторить
          </Button>
        }
      />
    )
  }

  if (all.length === 0) {
    return <Empty description="Отзывов пока нет" />
  }

  return (
    <Row gutter={[32, 24]}>
      <Col xs={24} lg={7}>
        <RatingOverview summary={summarizeReviews(visible)} />
      </Col>
      <Col xs={24} lg={17}>
        <Flex
          justify="space-between"
          align="center"
          wrap
          gap={12}
          style={{ marginBottom: 16 }}
        >
          {hiddenCount > 0 ? (
            <Checkbox
              checked={showHidden}
              onChange={(event) => setShowHidden(event.target.checked)}
            >
              Удалённые ({hiddenCount})
            </Checkbox>
          ) : (
            <span />
          )}
          <Segmented<Sort>
            size="small"
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </Flex>

        {sorted.length === 0 ? (
          <Empty description="Все отзывы удалены" />
        ) : (
          <Flex vertical>
            {sorted.map((review, index) => (
              <div
                key={review.key}
                style={{
                  padding: '16px 0',
                  borderTop:
                    index > 0
                      ? `1px solid ${token.colorBorderSecondary}`
                      : undefined,
                }}
              >
                <ReviewItem
                  review={review}
                  hidden={hiddenIds.has(review.id)}
                  onHide={hideReview}
                  onRestore={restoreReview}
                />
              </div>
            ))}
          </Flex>
        )}
      </Col>
    </Row>
  )
}
