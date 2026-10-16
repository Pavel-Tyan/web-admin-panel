import { NodeIndexOutlined } from '@ant-design/icons'
import { App, Card, Flex, Typography, theme } from 'antd'
import { useNavigate } from 'react-router'
import {
  getLoginErrorMessage,
  LoginForm,
  saveSession,
  useLogin,
  type LoginCredentials,
} from '@/features/auth'

const { Title, Text } = Typography

export function LoginPage() {
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const loginMutation = useLogin()
  const navigate = useNavigate()

  const handleSubmit = (values: LoginCredentials) => {
    loginMutation.mutate(values, {
      onSuccess: ({ accessToken }) => {
        saveSession(accessToken)
        message.success('Вход выполнен')
        navigate('/metrics', { replace: true })
      },
    })
  }

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100dvh',
        boxSizing: 'border-box',
        padding: 16,
        background: token.colorBgLayout,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Flex vertical align="center" gap={4} style={{ marginBottom: 32 }}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 48,
              height: 48,
              marginBottom: 12,
              borderRadius: token.borderRadiusLG,
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: 24,
            }}
            aria-hidden
          >
            <NodeIndexOutlined />
          </Flex>
          <Title level={3} style={{ margin: 0 }}>
            Вход в админ-панель
          </Title>
          <Text type="secondary">Walking Route Planner</Text>
        </Flex>

        <LoginForm
          onSubmit={handleSubmit}
          loading={loginMutation.isPending}
          error={
            loginMutation.isError
              ? getLoginErrorMessage(loginMutation.error)
              : null
          }
        />

        <Text
          type="secondary"
          style={{ display: 'block', marginTop: 24, textAlign: 'center' }}
        >
          Доступ только для администраторов
        </Text>
      </Card>
    </Flex>
  )
}
