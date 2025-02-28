/**
 * 区域DTO
 */
export interface DistrictDTO {
  id: number
  code: string
  name: string
  sortOrder: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 创建/更新区域参数
 */
export interface DistrictParams {
  code: string
  name: string
  sortOrder?: number
  isEnabled?: boolean
}

/**
 * 分页参数
 */
export interface PageParams {
  page: number
  size: number
}

/**
 * 分页数据
 */
export interface PageData<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 通用响应类型
 */
export interface DataType<T> {
  success: boolean
  code: string
  message: string
  data: T
}
