import { Flex, Tag } from 'antd'

export function CategoryTags({ categories }: { categories: string[] }) {
  if (categories.length === 0) return null

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
