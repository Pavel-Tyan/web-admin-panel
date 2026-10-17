import axios from 'axios'
import { tokenStorage } from '@/shared/auth/tokenStorage'

// Единый HTTP-клиент.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000, // REQ-5.1-06
})

// JWT в заголовке Authorization: Bearer (REQ-3.4-03).
http.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Протухший или отозванный токен: сбрасываем сессию, guard отправит на /login.
// Ответ 401 самого входа — это «неверный пароль», его не трогаем.
http.interceptors.response.use(undefined, (error) => {
  const isLogin = String(error?.config?.url ?? '').includes('/security/login')
  if (axios.isAxiosError(error) && error.response?.status === 401 && !isLogin) {
    tokenStorage.clear()
  }
  return Promise.reject(error)
})
