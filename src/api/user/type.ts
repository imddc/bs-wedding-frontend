// 用户相关接口类型定义

// 用户类型枚举
export enum UserType {
  NORMAL = 0, // 普通用户
  MERCHANT = 1, // 商家
}

// 用户状态枚举
export enum UserStatus {
  DISABLED = 0, // 禁用
  ACTIVE = 1, // 正常
}

// 用户查询参数
export interface UserQueryParams {
  username?: string
  realName?: string
  phone?: string
  email?: string
  userType?: UserType
  status?: UserStatus
  pageNum?: number
  pageSize?: number
}

// 用户创建参数
export interface UserCreateParams {
  username: string
  password: string
  realName?: string
  phone?: string
  email?: string
  userType?: UserType
  status?: UserStatus
}

// 用户更新参数
export interface UserUpdateParams {
  id: number
  realName?: string
  phone?: string
  email?: string
  userType?: UserType
  status?: UserStatus
}

// 密码更新参数
export interface PasswordUpdateParams {
  id: number
  oldPassword: string
  newPassword: string
}

// 用户状态更新参数
export interface UserStatusParams {
  id: number
  status: UserStatus
}

// 用户详情返回结果
export interface UserInfo {
  id: number
  username: string
  realName: string
  phone: string
  email: string
  userType: UserType
  status: UserStatus
  statusName: string
  createTime: string
  updateTime: string
}

// 用户分页返回结果
export interface UserPageResult {
  records: UserInfo[]
  total: number
  size: number
  current: number
  pages: number
}
