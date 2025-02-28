// 基础响应类型
export interface DataType<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 通用分页类型
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 商品类型枚举
export enum ProductType {
  PHOTOGRAPHY = 1, // 婚纱摄影
  HOTEL = 2, // 婚宴酒店
  HOST = 3, // 司仪主持
}

// 商品状态枚举
export enum ProductStatus {
  OFF = 0, // 下架
  ON = 1, // 上架
}

// 基础商品信息类型
export interface ProductBase {
  id?: number
  merchantId: number
  productName: string
  categoryId: number
  categoryName?: string
  productType: ProductType
  location?: string
  establishmentYears?: number
  price: number
  rating?: number
  mainImage?: string
  subImagesList?: string[]
  subImages?: string
  description?: string
  tags?: string
  tagsList?: string[]
  servicesMap?: Record<string, string[]>
  services?: string
  detail?: string
  stock?: number
  sales?: number
  status: ProductStatus
  createTime?: string
  updateTime?: string
}

// 婚纱摄影特有属性
export interface PhotographyAttributes {
  shootingLocations?: string
  shootingLocationsList?: string[]
  costumeCount?: number
  photographerLevel?: string
  photoCount?: number
}

// 婚宴酒店特有属性
export interface HotelAttributes {
  venueSize?: number
  maxTables?: number
  minTables?: number
  cateringStyle?: string
  cateringStyleList?: string[]
}

// 司仪主持特有属性
export interface HostAttributes {
  hostingExperience?: number
  hostingStyle?: string
  languages?: string
  languagesList?: string[]
}

// 组合类型
export type PhotographyProduct = ProductBase & PhotographyAttributes
export type HotelProduct = ProductBase & HotelAttributes
export type HostProduct = ProductBase & HostAttributes

// 通用Product类型(包含所有可能的字段)
export type Product = ProductBase & Partial<PhotographyAttributes> & Partial<HotelAttributes> & Partial<HostAttributes>

// 查询条件类型
export interface ProductQuery {
  page?: number
  size?: number
  productType?: ProductType
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  location?: string
  tags?: string
  keyword?: string
}

// 下拉选项类型
export interface SelectOption {
  label: string
  value: number | string
}

// 类型选项
export const PRODUCT_TYPE_OPTIONS: SelectOption[] = [
  { label: '婚纱摄影', value: ProductType.PHOTOGRAPHY },
  { label: '婚宴酒店', value: ProductType.HOTEL },
  { label: '司仪主持', value: ProductType.HOST },
]

// 状态选项
export const PRODUCT_STATUS_OPTIONS: SelectOption[] = [
  { label: '下架', value: ProductStatus.OFF },
  { label: '上架', value: ProductStatus.ON },
]
