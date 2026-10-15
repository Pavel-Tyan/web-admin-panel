import type { UseQueryResult } from '@tanstack/react-query'
import { Button, Card, Flex, Statistic, Typography } from 'antd'

interface StatTileProps<T> {
  title: string
  query: UseQueryResult<T>
  /** Достаёт число из данных запроса (итог берётся из того же ответа, что и рейтинг). */
  select: (data: T) => number
}

export function StatTile<T>({ title, query, select }: StatTileProps<T>) {
  return (
    <Card style={{ height: '100%' }}>
      {query.isError ? (
        <Flex vertical gap={8} align="flex-start">
          <Typography.Text type="secondary">{title}</Typography.Text>
          <Typography.Text type="danger">Не удалось загрузить</Typography.Text>
          <Button size="small" onClick={() => query.refetch()}>
            Повторить
          </Button>
        </Flex>
      ) : (
        <Statistic
          title={title}
          value={query.data === undefined ? undefined : select(query.data)}
          loading={query.isPending}
          groupSeparator={' '}
        />
      )}
    </Card>
  )
}
