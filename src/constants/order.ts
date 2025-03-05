// 订单状态常量
export const ORDER_STATUS = {
  PENDING: 0, // 待付款
  PAID: 1, // 已付款
  SHIPPED: 2, // 已发货
  COMPLETED: 3, // 已完成
  CANCELLED: 4, // 已取消
}

// 订单状态描述
export const ORDER_STATUS_DESC = {
  [ORDER_STATUS.PENDING]: '待付款',
  [ORDER_STATUS.PAID]: '已付款',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

// 订单状态类型映射
export const ORDER_STATUS_TYPE = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PAID]: 'info',
  [ORDER_STATUS.SHIPPED]: 'processing',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
}

// 默认分页参数
export const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
}
