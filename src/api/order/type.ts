export interface OrdersCreateParams {
  userId: number
  merchantId: number
  productId: number
  weddingDate?: string
  remark?: string
}

export interface OrdersUpdateParams {
  id: number
  weddingDate?: string
  remark?: string
}

export interface OrdersStatusUpdateParams {
  id: number
  orderStatus: number
}

export interface OrdersQueryParams {
  userId?: number
  merchantId?: number
  productId?: number
  orderStatus?: number
  weddingDateStart?: string
  weddingDateEnd?: string
  pageNum?: number
  pageSize?: number
}

export interface OrdersDetailResponse {
  id: number
  orderNo: string
  userId: number
  merchantId: number
  productId: number
  weddingDate?: string
  orderStatus: number
  orderStatusDesc: string
  remark?: string
  createTime: string
}

export interface OrdersPageResponse {
  records: OrdersDetailResponse[]
  total: number
  size: number
  current: number
  pages: number
}

export interface CreateOrderParams {
  productId: number
  merchantId: number
  remark?: string
  packageId?: number // 关联的婚礼方案ID
}
