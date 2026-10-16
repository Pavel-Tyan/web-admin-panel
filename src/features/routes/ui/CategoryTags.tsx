import { Flex, Tag } from 'antd'

interface CategoryTagsProps {
  categories: string[]
  /** Выбранные категории — подсвечиваются. */
  selected?: string[]
  /** Если передан, теги кликабельны: клик включает или выключает категорию. */
  onToggle?: (category: string) => void
}

export function CategoryTags({ categories, selected = [], onToggle }: CategoryTagsProps) {
  if (categories.length === 0) return null

  if (!onToggle) {
    return (
      <Flex wrap gap={4}>
        {categories.map((category) => (
          <Tag key={category} style={{ marginInlineEnd: 0 }}>
            #{category}
          </Tag>
        ))}
      </Flex>
    )
  }

  return (
    // data-row-click="ignore": клик по тегу не открывает маршрут в таблице.
    <Flex wrap gap={4} data-row-click="ignore">
      {categories.map((category) => {
        const checked = selected.includes(category)
        return (
          <Tag.CheckableTag
            key={category}
            checked={checked}
            onChange={() => onToggle(category)}
            style={{ marginInlineEnd: 0 }}
          >
            #{category}
          </Tag.CheckableTag>
        )
      })}
    </Flex>
  )
}
