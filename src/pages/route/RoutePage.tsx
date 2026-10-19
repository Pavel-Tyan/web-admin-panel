import { DeleteOutlined, EnvironmentOutlined, ExportOutlined } from '@ant-design/icons'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  Alert,
  App,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Popconfirm,
  Result,
  Row,
  Skeleton,
  Tabs,
  Tooltip,
  Typography,
  type TabsProps,
} from 'antd'
import { isAxiosError } from 'axios'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  buildRouteUrl,
  CategoryTags,
  RoutePointsTable,
  RoutePreview,
  RouteReviews,
  ROUTES_PATH,
  RouteSummary,
  useRoute,
  useRouteReviews,
  type RouteDetails,
  type RouteReview,
} from '@/features/routes'
import {
  deletedReviews,
  deletedRoutes,
  useDeletedIds,
} from '@/shared/lib/deletedStore'

const { Title, Text, Paragraph } = Typography

type ReviewsQuery = UseQueryResult<RouteReview[]>

function OpenInYandexButton({ route }: { route: RouteDetails }) {
  const url = buildRouteUrl(route.points)

  if (!url) {
    return (
      <Tooltip title="У маршрута нет точек с координатами">
        <Button icon={<EnvironmentOutlined />} disabled>
          Открыть в Яндекс Картах
        </Button>
      </Tooltip>
    )
  }

  return (
    <Button
      type="primary"
      icon={<EnvironmentOutlined />}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Открыть в Яндекс Картах <ExportOutlined />
    </Button>
  )
}

interface RouteViewProps {
  route: RouteDetails
  reviews: ReviewsQuery
  /** Удалённые отзывы — не считаем в подписи вкладки. */
  hiddenReviewIds: ReadonlySet<string>
  onDelete: () => void
}

function RouteView({
  route,
  reviews,
  hiddenReviewIds,
  onDelete,
}: RouteViewProps) {
  const visibleReviews = (reviews.data ?? []).filter(
    (review) => !hiddenReviewIds.has(review.id),
  )

  const tabs: TabsProps['items'] = [
    {
      key: 'description',
      label: 'Описание',
      children: route.description ? (
        <Paragraph
          style={{ maxWidth: '80ch', whiteSpace: 'pre-line', margin: 0 }}
        >
          {route.description}
        </Paragraph>
      ) : (
        <Empty description="Описание не заполнено" />
      ),
    },
    {
      key: 'points',
      label: `Точки (${route.points.length})`,
      children: (
        <Flex vertical gap={12}>
          <Text type="secondary">
            Линию между точками Яндекс Карты строят сами: бэкенд хранит только
            точки, поэтому путь на карте может немного отличаться от приложения.
          </Text>
          <RoutePointsTable points={route.points} />
        </Flex>
      ),
    },
    {
      key: 'reviews',
      label: reviews.data ? `Отзывы (${visibleReviews.length})` : 'Отзывы',
      children: <RouteReviews query={reviews} />,
    },
  ]

  return (
    <>
      <Card>
        <Flex justify="space-between" align="flex-start" wrap gap={16}>
          <Flex vertical gap={8} style={{ minWidth: 0 }}>
            <Title level={3} style={{ margin: 0 }}>
              {route.name}
            </Title>
            <CategoryTags categories={route.categories} />
          </Flex>

          <Flex gap={8} wrap>
            <OpenInYandexButton route={route} />
            <Popconfirm
              title="Удалить маршрут?"
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
              onConfirm={onDelete}
            >
              <Button danger icon={<DeleteOutlined />}>
                Удалить маршрут
              </Button>
            </Popconfirm>
          </Flex>
        </Flex>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={14}>
            <RoutePreview src={route.previewUrl} alt={route.name} />
          </Col>
          <Col xs={24} lg={10}>
            <RouteSummary route={route} reviews={reviews} />
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs items={tabs} />
      </Card>
    </>
  )
}

function RouteError({ query }: { query: UseQueryResult<RouteDetails> }) {
  const navigate = useNavigate()

  if (isAxiosError(query.error) && query.error.response?.status === 404) {
    return (
      <Result
        status="404"
        title="Маршрут не найден"
        subTitle="Возможно, его удалили или ссылка неверна."
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES_PATH)}>
            К списку маршрутов
          </Button>
        }
      />
    )
  }

  return (
    <Alert
      type="error"
      showIcon
      title="Не удалось загрузить маршрут"
      action={
        <Button size="small" onClick={() => query.refetch()}>
          Повторить
        </Button>
      }
    />
  )
}

export function RoutePage() {
  const { routeId = '' } = useParams()
  const route = useRoute(routeId)
  const reviews = useRouteReviews(routeId)
  const { message } = App.useApp()
  const navigate = useNavigate()

  const hiddenReviews = useDeletedIds(deletedReviews)
  const hiddenReviewIds = useMemo(() => new Set(hiddenReviews), [hiddenReviews])

  const hideRoute = () => {
    deletedRoutes.hide(routeId)
    message.success('Маршрут удалён')
    navigate(ROUTES_PATH)
  }

  return (
    <Flex vertical gap={16} style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <Link to={ROUTES_PATH}>Маршруты</Link> },
          { title: route.data?.name ?? 'Маршрут' },
        ]}
      />

      {route.isPending ? (
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      ) : route.isError ? (
        <RouteError query={route} />
      ) : (
        <RouteView
          route={route.data}
          reviews={reviews}
          hiddenReviewIds={hiddenReviewIds}
          onDelete={hideRoute}
        />
      )}
    </Flex>
  )
}
