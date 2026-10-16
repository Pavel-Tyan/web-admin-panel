import { PictureOutlined } from '@ant-design/icons'
import { Flex, theme } from 'antd'
import { useState, type CSSProperties } from 'react'

interface RoutePreviewProps {
  src: string | null
  alt: string
  width?: CSSProperties['width']
  radius?: number
  iconSize?: number
}

// Превью маршрута 16:9. Нет фото или оно не загрузилось — заглушка того же размера.
export function RoutePreview({
  src,
  alt,
  width = '100%',
  radius,
  iconSize = 40,
}: RoutePreviewProps) {
  const { token } = theme.useToken()
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const frame: CSSProperties = {
    width,
    aspectRatio: '16 / 9',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radius ?? token.borderRadiusLG,
    background: token.colorFillTertiary,
  }

  if (!src || failedSrc === src) {
    return (
      <Flex
        align="center"
        justify="center"
        role="img"
        aria-label={`${alt}: нет фото`}
        style={{ ...frame, color: token.colorTextQuaternary, fontSize: iconSize }}
      >
        <PictureOutlined />
      </Flex>
    )
  }

  return (
    <div style={frame}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailedSrc(src)}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  )
}
