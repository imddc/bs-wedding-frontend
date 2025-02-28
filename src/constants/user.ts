import { UserStatus, UserType } from '~/api/user/type'

/**
 * 用户类型选项
 */
export const USER_TYPE_OPTIONS = [
  { label: '普通用户', value: UserType.NORMAL },
  { label: '商家', value: UserType.MERCHANT },
]

/**
 * 用户状态选项
 */
export const USER_STATUS_OPTIONS = [
  { label: '正常', value: UserStatus.ACTIVE },
  { label: '禁用', value: UserStatus.DISABLED },
]

/**
 * 用户类型映射
 */
export const USER_TYPE_MAP: Record<number, string> = {
  [UserType.NORMAL]: '普通用户',
  [UserType.MERCHANT]: '商家',
}

/**
 * 用户状态映射
 */
export const USER_STATUS_MAP: Record<number, string> = {
  [UserStatus.ACTIVE]: '正常',
  [UserStatus.DISABLED]: '禁用',
}

/**
 * 状态对应的标签类型
 */
export const STATUS_TAG_TYPE: Record<number, 'success' | 'warning' | 'error' | 'info'> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.DISABLED]: 'error',
}
