import { theme } from 'antd'
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RankingItem } from '../model/types'

interface RankingBarChartProps {
  items: RankingItem[]
  valueLabel: string
}

const ROW_HEIGHT = 36
const MAX_LABEL_LENGTH = 22

const truncate = (text: string) =>
  text.length > MAX_LABEL_LENGTH ? `${text.slice(0, MAX_LABEL_LENGTH - 1)}…` : text

// Горизонтальные столбцы топ-N: одна серия, один цвет, значение на конце столбца.
export function RankingBarChart({ items, valueLabel }: RankingBarChartProps) {
  const { token } = theme.useToken()

  return (
    <ResponsiveContainer width="100%" height={items.length * ROW_HEIGHT + 16}>
      <BarChart
        layout="vertical"
        data={items}
        margin={{ top: 8, right: 48, bottom: 8, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={170}
          tickLine={false}
          axisLine={false}
          tickFormatter={truncate}
          tick={{ fill: token.colorText, fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: token.colorFillTertiary }}
          formatter={(value) => [value, valueLabel]}
          contentStyle={{
            borderRadius: token.borderRadius,
            borderColor: token.colorBorderSecondary,
          }}
        />
        <Bar
          dataKey="value"
          fill={token.colorPrimary}
          barSize={20}
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="value"
            position="right"
            fill={token.colorTextSecondary}
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
