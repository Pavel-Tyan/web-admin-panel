import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Flex, Input, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { RoutesTable, useRoutes } from '@/features/routes'
import { plural } from '@/shared/lib/plural'

const { Title, Text } = Typography

export function RoutesPage() {
  const routes = useRoutes()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const items = routes.data ?? []
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.categories.some((c) => c.toLowerCase().includes(query)),
    )
  }, [routes.data, search])

  const total = routes.data?.length ?? 0

  return (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Маршруты
          </Title>
          <Text type="secondary">
            {routes.isSuccess
              ? `${total} ${plural(total, ['маршрут', 'маршрута', 'маршрутов'])}`
              : 'Загрузка…'}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={routes.isFetching}
          onClick={() => routes.refetch()}
        >
          Обновить
        </Button>
      </Flex>

      <Card>
        <Flex vertical gap={16}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Название или категория"
            aria-label="Поиск маршрутов"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ maxWidth: 360 }}
          />

          {routes.isError && (
            <Alert
              type="error"
              showIcon
              title="Не удалось загрузить маршруты"
              action={
                <Button size="small" onClick={() => routes.refetch()}>
                  Повторить
                </Button>
              }
            />
          )}

          <RoutesTable routes={filtered} loading={routes.isPending} />
        </Flex>
      </Card>
    </Flex>
  )
}
