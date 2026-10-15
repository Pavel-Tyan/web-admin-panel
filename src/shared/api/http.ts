import axios, { type AxiosRequestConfig } from 'axios'

// Единый HTTP-клиент. Интерцепторы (Bearer-токен, обработка 401/403)
// добавим вместе с фичей auth.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000, // REQ-5.1-06
})

// Мутатор для orval: все сгенерированные запросы идут через этот клиент.
export const apiClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => http({ ...config, ...options }).then(({ data }) => data)
