import type { UseQueryResult } from '@tanstack/react-query'
import { Alert, Button, Card, Empty, Segmented, Skeleton, Table } from 'antd'
import { useState } from 'react'
import type { RankingItem, RankingMetric } from '../model/types'
import { RankingBarChart } from './RankingBarChart'

type View = 'chart' | 'table'

interface RankingCardProps {
  title: string
  /** Подпись значения: «Маршрутов», «Отзывов»… */
  valueLabel: string
  /** Подпись колонки с объектом: «Пользователь», «Маршрут». */
  entityLabel: string
  query: UseQueryResult<RankingMetric>
  limit?: number
}

const VIEW_OPTIONS: { label: string; value: View }[] = [
  { label: 'График', value: 'chart' },
  { label: 'Таблица', value: 'table' },
]

export function RankingCard({
  title,
  valueLabel,
  entityLabel,
  query,
  limit = 10,
}: RankingCardProps) {
  const [view, setView] = useState<View>('chart')
  const items = query.data?.items ?? []

  const renderBody = () => {
    if (query.isPending) {
      return <Skeleton active paragraph={{ rows: 5 }} />
    }

    if (query.isError) {
      return (
        <Alert
          type="error"
          showIcon
          title="Не удалось загрузить данные"
          action={
            <Button size="small" onClick={() => query.refetch()}>
              Повторить
            </Button>
          }
        />
      )
    }

    if (items.length === 0) {
      return <Empty description="Данных пока нет" />
    }

    if (view === 'table') {
      return (
        <Table<RankingItem>
          size="small"
          rowKey="key"
          dataSource={items}
          pagination={items.length > 10 ? { pageSize: 10 } : false}
          columns={[
            {
              title: '#',
              key: 'rank',
              width: 48,
              render: (_value, _item, index) => index + 1,
            },
            { title: entityLabel, dataIndex: 'label', key: 'label' },
            {
              title: valueLabel,
              dataIndex: 'value',
              key: 'value',
              align: 'right',
              width: 120,
            },
          ]}
        />
      )
    }

    return (
      <RankingBarChart items={items.slice(0, limit)} valueLabel={valueLabel} />
    )
  }

  return (
    <Card
      title={title}
      extra={
        <Segmented<View>
          size="small"
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
        />
      }
    >
      {renderBody()}
    </Card>
  )
}
