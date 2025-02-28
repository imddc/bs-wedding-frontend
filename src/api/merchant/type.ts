// 商家相关接口类型定义

// 商家类型枚举
export enum MerchantType {
  PHOTOGRAPHY = 1, // 婚纱摄影
  HOTEL = 2, // 婚宴酒店
  HOST = 3, // 司仪主持
}

// 商家状态枚举
export enum MerchantStatus {
  OFFLINE = 0, // 下架
  ONLINE = 1, // 上架
}

// 商家查询参数
export interface MerchantQueryParams {
  merchantName?: string
  city?: string
  merchantType?: MerchantType
  status?: MerchantStatus
  pageNum?: number
  pageSize?: number
}

// 商家创建参数
export interface MerchantCreateParams {
  userId: number
  merchantName: string
  logo?: string
  description?: string
  address?: string
  city?: string
  contactPhone?: string
  contactPerson?: string
  merchantType: MerchantType
  status?: MerchantStatus
}

// 商家更新参数
export interface MerchantUpdateParams extends MerchantCreateParams {
  id: number
}

// 商家状态更新参数
export interface MerchantStatusParams {
  id: number
  status: MerchantStatus
}

// 商家详情返回结果
export interface MerchantInfo {
  id: number
  userId: number
  merchantName: string
  logo: string
  description: string
  address: string
  city: string
  contactPhone: string
  contactPerson: string
  favoriteCount: number
  merchantType: MerchantType
  merchantTypeName: string
  status: MerchantStatus
  statusName: string
  createTime: string
  updateTime: string
}

// 商家分页返回结果
export interface MerchantPageResult {
  records: MerchantInfo[]
  total: number
  size: number
  current: number
  pages: number
}
