import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Flex, Input, Select, Typography } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import {
  collectCategories,
  filterRoutes,
  RoutesTable,
  useRoutes,
} from '@/features/routes'
import { plural } from '@/shared/lib/plural'

const { Title, Text } = Typography

const ROUTE_FORMS = ['маршрут', 'маршрута', 'маршрутов'] as const

export function RoutesPage() {
  const routes = useRoutes()

  // Фильтры живут в адресе: переживают переход в карточку и обратно, ссылкой можно поделиться.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const categories = searchParams.getAll('category')

  const updateParams = (next: { q?: string; categories?: string[] }) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (next.q !== undefined) {
          if (next.q) params.set('q', next.q)
          else params.delete('q')
        }
        if (next.categories !== undefined) {
          params.delete('category')
          next.categories.forEach((c) => params.append('category', c))
        }
        return params
      },
      { replace: true },
    )
  }

  const toggleCategory = (category: string) =>
    updateParams({
      categories: categories.includes(category)
        ? categories.filter((c) => c !== category)
        : [...categories, category],
    })

  const items = useMemo(() => routes.data ?? [], [routes.data])
  const categoryOptions = useMemo(
    () =>
      collectCategories(items).map(({ name, count }) => ({
        value: name,
        label: `#${name} (${count})`,
      })),
    [items],
  )
  const filtered = filterRoutes(items, { query, categories })

  const total = items.length
  const isFiltered = query.trim() !== '' || categories.length > 0

  const subtitle = !routes.isSuccess
    ? 'Загрузка…'
    : isFiltered
      ? `Найдено ${filtered.length} из ${total}`
      : `${total} ${plural(total, ROUTE_FORMS)}`

  return (
    <Flex vertical gap={24} style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Маршруты
          </Title>
          <Text type="secondary">{subtitle}</Text>
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
          <Flex wrap gap={12} align="center">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Название или категория"
              aria-label="Поиск маршрутов"
              value={query}
              onChange={(event) => updateParams({ q: event.target.value })}
              style={{ flex: '1 1 260px', maxWidth: 360 }}
            />
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Все категории"
              aria-label="Фильтр по категориям"
              options={categoryOptions}
              value={categories}
              onChange={(value: string[]) => updateParams({ categories: value })}
              maxTagCount="responsive"
              loading={routes.isPending}
              notFoundContent="Категорий нет"
              style={{ flex: '1 1 260px', maxWidth: 420 }}
            />
            {isFiltered && (
              <Button
                type="link"
                onClick={() => updateParams({ q: '', categories: [] })}
              >
                Сбросить фильтры
              </Button>
            )}
          </Flex>

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

          <RoutesTable
            routes={filtered}
            loading={routes.isPending}
            selectedCategories={categories}
            onToggleCategory={toggleCategory}
          />
        </Flex>
      </Card>
    </Flex>
  )
}
