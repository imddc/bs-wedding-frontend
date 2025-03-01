// ~/api/order/types.ts

// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 0,
  PAID = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

// 订单状态描述映射
export const ORDER_STATUS_MAP = {
  [OrderStatus.PENDING_PAYMENT]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消',
}

// 创建订单参数
export interface OrderCreateParams {
  userId: number
  merchantId: number
  productId: number
  weddingDate?: string
  remark?: string
}

// 更新订单参数
export interface OrderUpdateParams {
  id: number
  weddingDate?: string
  remark?: string
}

// 更新订单状态参数
export interface OrderStatusUpdateParams {
  id: number
  orderStatus: OrderStatus
}

// 订单查询参数
export interface OrderQueryParams extends Pagination {
  userId?: number
  merchantId?: number
  productId?: number
  orderStatus?: OrderStatus
  weddingDateStart?: string
  weddingDateEnd?: string
  orderNo?: string
}

// 商家信息
export interface MerchantInfo {
  merchantId: number
  merchantName: string
  merchantPhone: string
  merchantAddress: string
}

// 商品信息
export interface ProductInfo {
  productId: number
  productName: string
  productPrice: string
  productDescription: string
}

// 订单详情
export interface OrderDetail extends MerchantInfo, ProductInfo {
  id: number
  orderNo: string
  userId: number
  weddingDate: string | null
  orderStatus: OrderStatus
  orderStatusDesc: string
  remark: string | null
  createTime: string
  updateTime: string
}

// 分页结果
export interface OrderPageResult {
  records: OrderDetail[]
  total: number
  size: number
  current: number
  pages: number
}
