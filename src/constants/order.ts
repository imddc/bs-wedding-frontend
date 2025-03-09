// 订单状态常量
export const ORDER_STATUS = {
  PENDING: 0, // 待支付
  PAID: 1, // 已支付
  COMPLETED: 2, // 已完成
  CANCELLED: 3, // 已取消
}

// 订单状态描述
export const ORDER_STATUS_DESC = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

export const ORDER_STATUS_OPTIONS = [
  { label: ORDER_STATUS_DESC[ORDER_STATUS.PENDING], value: ORDER_STATUS.PENDING },
  { label: ORDER_STATUS_DESC[ORDER_STATUS.PAID], value: ORDER_STATUS.PAID },
  { label: ORDER_STATUS_DESC[ORDER_STATUS.COMPLETED], value: ORDER_STATUS.COMPLETED },
  { label: ORDER_STATUS_DESC[ORDER_STATUS.CANCELLED], value: ORDER_STATUS.CANCELLED },
]

// 默认分页参数
export const DEFAULT_PAGE_PARAMS = {
  pageNum: 1,
  pageSize: 10,
}
