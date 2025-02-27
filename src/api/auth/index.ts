import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'

interface RegisterParams {
  username: string
  password: string
}

interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
    // 根据实际需求添加其他用户信息字段
  }
}

interface UserInfo {
  id: number
  username: string
  email?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
  // 可以根据实际需求添加更多字段
}

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

/**
 * 获取当前登录用户信息
 * @returns Promise<UserInfo>
 */
export async function getUserInfo() {
  return request.get<DataType<UserInfo>>({
    url: '/auth/user/info',
  })
}

/**
 * 用户登出
 * @returns Promise<void>
 */
export async function logout() {
  return request.post({
    url: '/auth/logout',
  })
}
