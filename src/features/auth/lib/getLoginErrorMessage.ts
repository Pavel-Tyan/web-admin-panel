import { isAxiosError } from 'axios'

// Понятные сообщения об ошибке входа (REQ-3.1-06, REQ-4.1-06, REQ-4.8-08, REQ-5.1-06).
// Коды — из OpenAPI security-service: 400, 401, 404, 500.
export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Сервер не отвечает. Проверьте подключение и попробуйте ещё раз.'
    }

    switch (error.response.status) {
      case 400:
      case 401:
      case 404: // пользователь с таким email не найден
        return 'Неверный email или пароль'
      case 403: // в спецификации нет, но может прийти от API Gateway
        return 'У этой учётной записи нет прав администратора'
    }
  }

  return 'Не удалось войти. Попробуйте позже.'
}
