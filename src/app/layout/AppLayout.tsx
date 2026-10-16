import {
  Avatar,
  Button,
  Flex,
  Layout,
  Menu,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  Activity,
  ArrowUpRight,
  ChartColumn,
  Footprints,
  LogOut,
  Route as RouteIcon,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useLogout, useSessionEmail } from '@/features/auth'
import { MONITORING_URL } from '@/shared/config/links'

// Иконки сайдбара — Lucide: одна толщина линии и размер для всех пунктов.
const ICON_SIZE = 18
const ICON_STROKE = 1.75

const navIcon = (Icon: LucideIcon) => (
  <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden />
)

// Разделы панели (REQ-3.1-08). Пользователи и отзывы добавятся сюда же.
const NAV_ITEMS: MenuProps['items'] = [
  { key: '/metrics', icon: navIcon(ChartColumn), label: 'Метрики' },
  { key: '/routes', icon: navIcon(RouteIcon), label: 'Маршруты' },
]

// Внешние сервисы: открываются в новой вкладке, не участвуют в выделении активного пункта.
const EXTERNAL_ITEMS: MenuProps['items'] = [
  {
    key: 'monitoring',
    icon: navIcon(Activity),
    label: (
      <a
        href={MONITORING_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Мониторинг (откроется в новой вкладке)"
      >
        Мониторинг{' '}
        <ArrowUpRight
          size={14}
          strokeWidth={ICON_STROKE}
          aria-hidden
          style={{ opacity: 0.6, verticalAlign: '-2px' }}
        />
      </a>
    ),
  },
]

const SIDER_WIDTH = 232

export function AppLayout() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useLogout()
  const email = useSessionEmail()
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
              <Footprints size={18} strokeWidth={ICON_STROKE} />
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

          <Menu
            mode="inline"
            items={EXTERNAL_ITEMS}
            selectable={false}
            style={{ borderInlineEnd: 'none' }}
          />

          <Flex
            vertical
            gap={4}
            style={{
              padding: collapsed ? 8 : 12,
              borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {email && (
              <Tooltip title={collapsed ? email : undefined} placement="right">
                <Flex
                  align="center"
                  gap={10}
                  data-testid="session-user"
                  style={{
                    padding: collapsed ? '4px 0' : '4px 8px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    size={32}
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      background: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      fontWeight: 600,
                    }}
                  >
                    {email[0].toUpperCase()}
                  </Avatar>
                  {!collapsed && (
                    <Flex vertical style={{ minWidth: 0 }}>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        Вы вошли как
                      </Typography.Text>
                      <Typography.Text
                        ellipsis={{ tooltip: email }}
                        style={{ fontSize: 13, maxWidth: '100%' }}
                      >
                        {email}
                      </Typography.Text>
                    </Flex>
                  )}
                </Flex>
              </Tooltip>
            )}

            <Tooltip title={collapsed ? 'Выйти' : undefined} placement="right">
              <Button
                type="text"
                block
                icon={navIcon(LogOut)}
                onClick={logout}
                aria-label="Выйти"
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                {!collapsed && 'Выйти'}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Layout.Sider>

      <Layout.Content style={{ padding: 24, minWidth: 0 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
