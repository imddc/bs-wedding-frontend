import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { RequestConfig, RequestInterceptors, RequestOptions } from './type'

class Request {
  instance: AxiosInstance
  interceptors?: RequestInterceptors

  constructor(config: RequestConfig) {
    // 创建 axios 实例
    this.instance = axios.create(config)
    // 保存基本信息
    this.interceptors = config.interceptors

    // 实例的拦截器
    this.instance.interceptors.request.use(
      // 请求拦截
      // @ts-expect-error non
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch,
    )

    this.instance.interceptors.response.use(
      // 响应拦截
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch,
    )

    // 全局的拦截器 (每个实例都会执行的)
    this.instance.interceptors.request.use(
      (config) => {
        // 做一些请求拦截操作

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    this.instance.interceptors.response.use(
      (res) => {
        // 做一些响应拦截操作
        // console.log('全局的拦截器 响应拦截', res)

        return res
      },
      (error) => {
        // console.log('全局的拦截器 响应错误拦截', error)
        // 请求错误时也要移除
        return Promise.reject(error)
      },
    )
  }

  request<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      // 单个请求的拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      // 将自定义的 options 选项合并到 config 中
      config = { ...config, ...options }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          resolve(res)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }

  get<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  patch<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PATCH' }, options)
  }

  put<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T>(config: RequestConfig<T>, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }
}

export default Request
