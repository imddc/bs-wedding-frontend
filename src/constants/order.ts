// 订单状态常量
export const ORDER_STATUS = {
  PENDING_PAYMENT: 0,
  PAID: 1,
  COMPLETED: 2,
  CANCELLED: 3,
}

// 订单状态描述
export const ORDER_STATUS_DESCRIPTIONS = {
  [ORDER_STATUS.PENDING_PAYMENT]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

// 订单状态标签类型
export const ORDER_STATUS_TAG_TYPES = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'warning',
  [ORDER_STATUS.PAID]: 'info',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
}

// 默认分页参数
export const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
}
