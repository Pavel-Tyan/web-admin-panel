import {
  BarChartOutlined,
  LogoutOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons'
import { Button, Flex, Layout, Menu, Tooltip, Typography, theme } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useLogout } from '@/features/auth'

// Разделы панели (REQ-3.1-08). Пользователи, маршруты и отзывы добавятся сюда же.
const NAV_ITEMS: MenuProps['items'] = [
  { key: '/metrics', icon: <BarChartOutlined />, label: 'Метрики' },
]

const SIDER_WIDTH = 232

export function AppLayout() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useLogout()
  const [collapsed, setCollapsed] = useState(false)

  // Активный пункт — по первому сегменту пути: /metrics/… → /metrics.
  const selectedKey = `/${pathname.split('/')[1] ?? ''}`

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <Layout.Sider
        theme="light"
        width={SIDER_WIDTH}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex vertical style={{ height: '100%' }}>
          <Flex
            align="center"
            gap={12}
            style={{
              height: 64,
              padding: collapsed ? 0 : '0 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <Flex
              align="center"
              justify="center"
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: token.borderRadius,
                background: token.colorPrimaryBg,
                color: token.colorPrimary,
                fontSize: 18,
              }}
              aria-hidden
            >
              <NodeIndexOutlined />
            </Flex>
            {!collapsed && (
              <Typography.Text strong ellipsis>
                Админ-панель
              </Typography.Text>
            )}
          </Flex>

          <nav aria-label="Основная навигация" style={{ flex: 1 }}>
            <Menu
              mode="inline"
              items={NAV_ITEMS}
              selectedKeys={[selectedKey]}
              onClick={({ key }) => navigate(key)}
              style={{ borderInlineEnd: 'none' }}
            />
          </nav>

          <div style={{ padding: collapsed ? 8 : 12 }}>
            <Tooltip title={collapsed ? 'Выйти' : undefined} placement="right">
              <Button
                type="text"
                block
                icon={<LogoutOutlined />}
                onClick={logout}
                aria-label="Выйти"
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                {!collapsed && 'Выйти'}
              </Button>
            </Tooltip>
          </div>
        </Flex>
      </Layout.Sider>

      <Layout.Content style={{ padding: 24, minWidth: 0 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
