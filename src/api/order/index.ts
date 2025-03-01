// ~/api/order/index.ts
import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  OrderCreateParams,
  OrderDetail,
  OrderPageResult,
  OrderQueryParams,
  OrderStatusUpdateParams,
  OrderUpdateParams,
} from './type'

/**
 * API 基础路径
 */
const BASE_URL = '/api/orders'

/**
 * 创建订单
 * @param data 创建订单参数
 * @returns 订单ID
 */
export async function createOrder(data: OrderCreateParams) {
  return request.post<DataType<number>>({
    url: BASE_URL,
    data,
  })
}

/**
 * 更新订单
 * @param data 更新订单参数
 * @returns 是否成功
 */
export async function updateOrder(data: OrderUpdateParams) {
  return request.put<DataType<boolean>>({
    url: BASE_URL,
    data,
  })
}

/**
 * 更新订单状态
 * @param data 订单状态更新参数
 * @returns 是否成功
 */
export async function updateOrderStatus(data: OrderStatusUpdateParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/status`,
    data,
  })
}

/**
 * 删除订单
 * @param id 订单ID
 * @returns 是否成功
 */
export async function deleteOrder(id: number) {
  return request.delete<DataType<boolean>>({
    url: `${BASE_URL}/${id}`,
  })
}

/**
 * 获取订单详情
 * @param id 订单ID
 * @returns 订单详情
 */
export async function getOrderDetail(id: number) {
  return request.get<DataType<OrderDetail>>({
    url: `${BASE_URL}/${id}`,
  })
}

/**
 * 分页查询订单列表
 * @param params 查询参数
 * @returns 分页订单列表
 */
export async function getOrderPage(params: OrderQueryParams) {
  return request.get<DataType<OrderPageResult>>({
    url: `${BASE_URL}/page`,
    params,
  })
}
