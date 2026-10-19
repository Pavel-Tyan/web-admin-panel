import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Table, type TableProps } from 'antd'
import type { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { formatDuration, formatLength } from '../lib/format'
import { routePath } from '../lib/paths'
import type { RouteListItem } from '../model/types'
import { CategoryTags } from './CategoryTags'
import { RoutePreview } from './RoutePreview'

interface RoutesTableProps {
  routes: RouteListItem[]
  loading: boolean
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
  onDelete: (route: RouteListItem) => void
}

const byNumber =
  (field: 'length' | 'duration') => (a: RouteListItem, b: RouteListItem) =>
    (a[field] ?? -1) - (b[field] ?? -1)

const buildColumns = ({
  selectedCategories,
  onToggleCategory,
  onDelete,
}: Pick<
  RoutesTableProps,
  'selectedCategories' | 'onToggleCategory' | 'onDelete'
>): TableProps<RouteListItem>['columns'] => [
  {
    key: 'preview',
    width: 96,
    render: (_, route) => (
      <RoutePreview
        src={route.previewUrl}
        alt={route.name}
        width={72}
        radius={6}
        iconSize={16}
      />
    ),
  },
  {
    key: 'name',
    title: 'Название',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, 'ru'),
    render: (name: string, route) => <Link to={routePath(route.id)}>{name}</Link>,
  },
  {
    key: 'categories',
    title: 'Категории',
    render: (_, route) => (
      <CategoryTags
        categories={route.categories}
        selected={selectedCategories}
        onToggle={onToggleCategory}
      />
    ),
  },
  {
    key: 'length',
    title: 'Длина',
    dataIndex: 'length',
    width: 120,
    align: 'right',
    sorter: byNumber('length'),
    render: formatLength,
  },
  {
    key: 'duration',
    title: 'Время',
    dataIndex: 'duration',
    width: 130,
    align: 'right',
    sorter: byNumber('duration'),
    render: formatDuration,
  },
  {
    key: 'actions',
    width: 150,
    align: 'right',
    // Клик по ячейке не должен открывать маршрут (см. openRoute ниже).
    render: (_, route) => (
      <div data-row-click="ignore">
        <Popconfirm
          title="Удалить маршрут?"
          okText="Удалить"
          cancelText="Отмена"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(route)}
        >
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label={`Удалить маршрут ${route.name}`}
          />
        </Popconfirm>
      </div>
    ),
  },
]

export function RoutesTable({
  routes,
  loading,
  selectedCategories,
  onToggleCategory,
  onDelete,
}: RoutesTableProps) {
  const navigate = useNavigate()
  const columns = buildColumns({
    selectedCategories,
    onToggleCategory,
    onDelete,
  })

  // Вся строка кликабельна. Клик по ссылке обрабатывает Link, по тегу — фильтр,
  // по кнопке в колонке действий — она сама.
  const openRoute = (route: RouteListItem) => (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('a, [data-row-click="ignore"]'))
      return
    navigate(routePath(route.id))
  }

  return (
    <Table<RouteListItem>
      rowKey="id"
      columns={columns}
      dataSource={routes}
      loading={loading}
      pagination={{ pageSize: 20, hideOnSinglePage: true }}
      locale={{ emptyText: loading ? ' ' : 'Маршрутов нет' }}
      onRow={(route) => ({
        onClick: openRoute(route),
        style: { cursor: 'pointer' },
      })}
      scroll={{ x: 760 }}
    />
  )
}
