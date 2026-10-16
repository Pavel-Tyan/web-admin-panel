import { ExportOutlined } from '@ant-design/icons'
import { Table, Typography, type TableProps } from 'antd'
import { formatCoordinates } from '../lib/format'
import { buildPointUrl } from '../lib/yandexMaps'
import type { RoutePoint } from '../model/types'

const { Text, Link } = Typography

const columns: TableProps<RoutePoint>['columns'] = [
  {
    key: 'order',
    title: '№',
    width: 56,
    align: 'center',
    render: (_, __, index) => index + 1,
  },
  {
    key: 'point',
    title: 'Точка',
    render: (_, point) => (
      <>
        <Text strong>{point.title || 'Без названия'}</Text>
        {point.description && (
          <Text type="secondary" style={{ display: 'block', whiteSpace: 'pre-line' }}>
            {point.description}
          </Text>
        )}
      </>
    ),
  },
  {
    key: 'coordinates',
    title: 'Координаты',
    width: 260,
    render: (_, point) => {
      const value = formatCoordinates(point.latitude, point.longitude)
      return (
        <Text
          code
          copyable={{ text: value, tooltips: ['Скопировать', 'Скопировано'] }}
        >
          {value}
        </Text>
      )
    },
  },
  {
    key: 'map',
    width: 130,
    render: (_, point) => (
      <Link href={buildPointUrl(point)} target="_blank" rel="noopener noreferrer">
        На карте <ExportOutlined />
      </Link>
    ),
  },
]

export function RoutePointsTable({ points }: { points: RoutePoint[] }) {
  return (
    <Table<RoutePoint>
      rowKey="key"
      size="middle"
      columns={columns}
      dataSource={points}
      pagination={false}
      locale={{ emptyText: 'У маршрута нет точек с координатами' }}
      scroll={{ x: 640 }}
    />
  )
}
