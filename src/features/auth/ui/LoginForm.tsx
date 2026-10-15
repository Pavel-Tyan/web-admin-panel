import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input } from 'antd'
import type { LoginCredentials } from '../api/login'

interface LoginFormProps {
  onSubmit: (values: LoginCredentials) => void
  loading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  return (
    <Form<LoginCredentials>
      name="login"
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Введите email' },
          { type: 'email', message: 'Некорректный email' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="admin@example.com"
          autoComplete="username"
          autoFocus
        />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Пароль"
          autoComplete="current-password"
        />
      </Form.Item>

      {error && (
        <Alert
          type="error"
          showIcon
          title={error}
          role="alert"
          style={{ marginBottom: 24 }}
        />
      )}

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Войти
        </Button>
      </Form.Item>
    </Form>
  )
}
