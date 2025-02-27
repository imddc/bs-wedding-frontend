import type { IUserInfo } from '~/api/user/type'
import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'

/**
 * 获取当前登录用户信息
 * @returns Promise<UserInfo>
 */
export async function getUserInfo() {
  return request.get<DataType<IUserInfo>>({
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
