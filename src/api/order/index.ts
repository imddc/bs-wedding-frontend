import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  OrdersCreateParams,
  OrdersDetailResponse,
  OrdersPageResponse,
  OrdersQueryParams,
  OrdersStatusUpdateParams,
  OrdersUpdateParams,
} from './type'

/**
 * 创建订单
 * @param data 创建订单参数
 * @returns 订单ID
 */
export async function createOrder(data: OrdersCreateParams) {
  return request.post<DataType<number>>({
    url: '/orders',
    data,
  })
}

/**
 * 更新订单信息
 * @param data 更新订单参数
 * @returns 是否成功
 */
export async function updateOrder(data: OrdersUpdateParams) {
  return request.put<DataType<boolean>>({
    url: '/orders',
    data,
  })
}

/**
 * 更新订单状态
 * @param data 订单状态更新参数
 * @returns 是否成功
 */
export async function updateOrderStatus(data: OrdersStatusUpdateParams) {
  return request.put<DataType<boolean>>({
    url: '/orders/status',
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
    url: `/orders/${id}`,
  })
}

/**
 * 获取订单详情
 * @param id 订单ID
 * @returns 订单详情
 */
export async function getOrderDetail(id: number) {
  return request.get<DataType<OrdersDetailResponse>>({
    url: `/orders/${id}`,
  })
}

/**
 * 分页查询订单列表
 * @param params 查询参数
 * @returns 分页订单列表
 */
export async function getOrdersPage(params: OrdersQueryParams) {
  return request.get<DataType<OrdersPageResponse>>({
    url: '/orders/page',
    params,
  })
}
