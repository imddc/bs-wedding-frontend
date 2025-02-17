import type { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

interface RequestConfig {
  baseURL?: string
  headers?: Record<string, string>
}

function createRequest(config: RequestConfig): AxiosInstance {
  const http = axios.create({
    baseURL: config.baseURL,
    headers: config.headers,
    withCredentials: true,
    timeout: 10000,
  })

  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token')
      if (token) {
        const headers = config.headers as AxiosRequestHeaders
        headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data
    },
    (error: AxiosError) => {
      if (error.response) {
        // 处理错误响应，例如 401 未授权错误
        if (error.response.status === 401) {
          // 清除 token，跳转到登录页面
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )

  return http
}

const request = createRequest({
  baseURL: 'http://localhost:3000',
})

export default request
