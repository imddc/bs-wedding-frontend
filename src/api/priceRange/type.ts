/**
 * 价格范围DTO
 */
export interface PriceRangeDTO {
  id: number
  code: string
  name: string
  minPrice: number | null
  maxPrice: number | null
  sortOrder: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 创建/更新价格范围参数
 */
export interface PriceRangeParams {
  code: string
  name: string
  minPrice?: number | null
  maxPrice?: number | null
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
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
