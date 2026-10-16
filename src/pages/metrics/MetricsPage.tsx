import { ReloadOutlined } from '@ant-design/icons'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Flex, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import {
  metricsKeys,
  RankingCard,
  StatTile,
  useFinishedRoutesMetric,
  useLikesMetric,
  usePublishedRoutesMetric,
  useRegisteredUsersCount,
  useReviewsMetric,
  type RankingMetric,
} from '@/features/metrics'

const { Title, Text } = Typography

const selectTotal = (metric: RankingMetric) => metric.total
const selectCount = (count: number) => count

export function MetricsPage() {
  const queryClient = useQueryClient()
  const isFetching = useIsFetching({ queryKey: metricsKeys.all }) > 0

  const registeredUsers = useRegisteredUsersCount()
  const likes = useLikesMetric()
  const finishedRoutes = useFinishedRoutesMetric()
  const publishedRoutes = usePublishedRoutesMetric()
  const reviews = useReviewsMetric()

  const updatedAt = Math.max(
    registeredUsers.dataUpdatedAt,
    likes.dataUpdatedAt,
    finishedRoutes.dataUpdatedAt,
    publishedRoutes.dataUpdatedAt,
    reviews.dataUpdatedAt,
  )

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: metricsKeys.all })

  return (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Бизнес-метрики
          </Title>
          <Text type="secondary">
            {updatedAt > 0
              ? `Обновлено в ${dayjs(updatedAt).format('HH:mm:ss')}`
              : 'Загрузка…'}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={isFetching}
          onClick={refresh}
        >
          Обновить
        </Button>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col flex="1 1 220px">
          <StatTile
            title="Зарегистрировано пользователей"
            query={registeredUsers}
            select={selectCount}
          />
        </Col>
        <Col flex="1 1 220px">
          <StatTile
            title="Опубликовано маршрутов"
            query={publishedRoutes}
            select={selectTotal}
          />
        </Col>
        <Col flex="1 1 220px">
          <StatTile
            title="Пройдено маршрутов"
            query={finishedRoutes}
            select={selectTotal}
          />
        </Col>
        <Col flex="1 1 220px">
          <StatTile title="Отзывов" query={reviews} select={selectTotal} />
        </Col>
        <Col flex="1 1 220px">
          <StatTile title="Лайков" query={likes} select={selectTotal} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <RankingCard
            title="Пройденные маршруты по пользователям"
            entityLabel="Пользователь"
            valueLabel="Пройдено маршрутов"
            query={finishedRoutes}
          />
        </Col>
        <Col xs={24} xl={12}>
          <RankingCard
            title="Опубликованные маршруты по авторам"
            entityLabel="Автор"
            valueLabel="Опубликовано маршрутов"
            query={publishedRoutes}
          />
        </Col>
        <Col xs={24} xl={12}>
          <RankingCard
            title="Отзывы по маршрутам"
            entityLabel="Маршрут"
            valueLabel="Отзывов"
            query={reviews}
          />
        </Col>
        <Col xs={24} xl={12}>
          <RankingCard
            title="Лайки по маршрутам"
            entityLabel="Маршрут"
            valueLabel="Лайков"
            query={likes}
          />
        </Col>
      </Row>
    </Flex>
  )
}
