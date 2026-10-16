import { Table, type TableProps } from 'antd'
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
}

const byNumber =
  (field: 'length' | 'duration') => (a: RouteListItem, b: RouteListItem) =>
    (a[field] ?? -1) - (b[field] ?? -1)

const columns: TableProps<RouteListItem>['columns'] = [
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
    render: (_, route) => <CategoryTags categories={route.categories} />,
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
]

export function RoutesTable({ routes, loading }: RoutesTableProps) {
  const navigate = useNavigate()

  // Вся строка кликабельна; клик по самой ссылке обрабатывает Link.
  const openRoute = (route: RouteListItem) => (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest('a')) return
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
      scroll={{ x: 720 }}
    />
  )
}
