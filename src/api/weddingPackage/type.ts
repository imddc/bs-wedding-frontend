import type { Product } from '~/api/product/type'

// 创建婚礼方案请求参数
export interface WeddingPackageParams {
  userId: number
  budget: number
  location: string
  status: number
}

// 婚礼方案简要信息中的商品信息
export interface ProductSimpleInfo {
  id: number
  productName: string
  productType: number
  price: number
  mainImage?: string
}

// 婚礼方案列表项
export interface WeddingPackageItem {
  id: number
  userId: number
  packageName: string
  budget: number
  location: string
  totalPrice: number
  photographyProduct: ProductSimpleInfo
  venueProduct: ProductSimpleInfo
  hostProduct: ProductSimpleInfo
  status: number
  createTime: string
}

// 婚礼方案详情
export interface WeddingPackageDetail {
  id: number
  userId: number
  packageName: string
  budget: number
  location: string
  totalPrice: number
  status: number
  createTime: string
  updateTime: string
  photographyProduct: Product
  venueProduct: Product
  hostProduct: Product
}

// 分页结果
export interface PaginationResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 通用数据类型（如果项目中没有定义）
export interface DataType<T> {
  code: number
  message: string
  data: T
  success: boolean
}
