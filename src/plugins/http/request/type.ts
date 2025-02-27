import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// 配置拦截器的类型
export interface RequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: AxiosError) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}

export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>
}

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

export interface RequestOptions {
  errorMessageMode?: ErrorMessageMode
}
