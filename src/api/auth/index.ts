import type { RegisterParams, RegisterResponse } from '~/api/auth/type'
import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'

/**
 * 用户注册
 * @param data 注册参数
 * @returns Promise<RegisterResponse>
 */
export async function register(data: RegisterParams) {
  return request.post<DataType<RegisterResponse>>({
    url: '/users',
    data,
  })
}

/**
 * 用户登录
 * @param data 登录参数
 * @returns Promise<RegisterResponse>
 */
export async function login(data: RegisterParams) {
  return request.post<DataType<RegisterResponse>>({
    url: '/auth/login',
    data,
  })
}
