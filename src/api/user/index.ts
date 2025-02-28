import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  PasswordUpdateParams,
  UserCreateParams,
  UserInfo,
  UserPageResult,
  UserQueryParams,
  UserStatusParams,
  UserUpdateParams,
} from './type'

/**
 * 创建用户
 * @param data 用户信息
 */
export async function createUser(data: UserCreateParams) {
  return request.post<DataType<number>>({
    url: '/users',
    data,
  })
}

/**
 * 更新用户信息
 * @param data 用户信息
 */
export async function updateUser(data: UserUpdateParams) {
  return request.put<DataType<boolean>>({
    url: `/users/${data.id}`,
    data,
  })
}

/**
 * 更新用户密码
 * @param data 密码信息
 */
export async function updatePassword(data: PasswordUpdateParams) {
  return request.put<DataType<boolean>>({
    url: `/users/${data.id}/password`,
    data,
  })
}

/**
 * 获取用户详情
 * @param id 用户ID
 */
export async function getUserById(id: number) {
  return request.get<DataType<UserInfo>>({
    url: `/users/${id}`,
  })
}

/**
 * 分页查询用户列表
 * @param params 查询参数
 */
export async function pageUsers(params: UserQueryParams) {
  return request.get<DataType<UserPageResult>>({
    url: '/users',
    params,
  })
}

/**
 * 删除用户
 * @param id 用户ID
 */
export async function deleteUser(id: number) {
  return request.delete<DataType<boolean>>({
    url: `/users/${id}`,
  })
}

/**
 * 更新用户状态
 * @param data 状态信息
 */
export async function updateUserStatus(data: UserStatusParams) {
  return request.patch<DataType<boolean>>({
    url: `/users/${data.id}/status`,
    params: {
      status: data.status,
    },
  })
}
