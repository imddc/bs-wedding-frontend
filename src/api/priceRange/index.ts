import { request } from '~/plugins/http'
import type { DataType, PageData } from '~/plugins/http/type'
import type { PageParams, PriceRangeDTO, PriceRangeParams } from './type'

/**
 * 获取价格范围详情
 */
export async function getPriceRange(id: number) {
  return request.get<DataType<PriceRangeDTO>>({
    url: `/price-ranges/${id}`,
  })
}

/**
 * 获取价格范围分页列表
 */
export async function listPriceRanges(params: PageParams) {
  return request.get<PageData<PriceRangeDTO>>({
    url: '/price-ranges',
    params,
  })
}

/**
 * 获取已启用的价格范围列表
 */
export async function listEnabledPriceRanges() {
  return request.get<DataType<PriceRangeDTO[]>>({
    url: '/price-ranges/enabled',
  })
}

/**
 * 创建价格范围
 */
export async function createPriceRange(data: PriceRangeParams) {
  return request.post<DataType<PriceRangeDTO>>({
    url: '/price-ranges',
    data,
  })
}

/**
 * 更新价格范围
 */
export async function updatePriceRange(id: number, data: PriceRangeParams) {
  return request.put<DataType<PriceRangeDTO>>({
    url: `/price-ranges/${id}`,
    data,
  })
}

/**
 * 删除价格范围
 */
export async function deletePriceRange(id: number) {
  return request.delete<DataType<void>>({
    url: `/price-ranges/${id}`,
  })
}
