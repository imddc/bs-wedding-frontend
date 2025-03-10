import { request } from '~/plugins/http'
import type { 
  WeddingPackageParams, 
  WeddingPackageItem, 
  WeddingPackageDetail, 
  PaginationResult 
} from './type'
import type { DataType } from '~/plugins/http/type'

const BASE_URL = '/weddingPackage'

/**
 * 创建婚礼方案
 * @param data 婚礼方案参数
 */
export async function createWeddingPackage(data: WeddingPackageParams) {
  return request.post<DataType<number>>({
    url: BASE_URL,
    data,
  })
}

/**
 * 更新婚礼方案
 * @param id 婚礼方案ID
 * @param data 婚礼方案参数
 */
export async function updateWeddingPackage(id: number, data: WeddingPackageParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/${id}`,
    data,
  })
}

/**
 * 删除婚礼方案
 * @param id 婚礼方案ID
 */
export async function deleteWeddingPackage(id: number) {
  return request.delete<DataType<boolean>>({
    url: `${BASE_URL}/${id}`,
  })
}

/**
 * 获取婚礼方案分页列表
 * @param params 查询参数
 */
export async function getWeddingPackageList(params: {
  page: number
  size: number
  userId?: number
  location?: string
  minBudget?: number
  maxBudget?: number
}) {
  return request.get<DataType<PaginationResult<WeddingPackageItem>>>({
    url: BASE_URL,
    params,
  })
}

/**
 * 获取婚礼方案详情
 * @param id 婚礼方案ID
 */
export async function getWeddingPackageDetail(id: number) {
  return request.get<DataType<WeddingPackageDetail>>({
    url: `${BASE_URL}/${id}`,
  })
}

/**
 * 确认婚礼方案
 * @param id 婚礼方案ID
 */
export async function confirmWeddingPackage(id: number) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/${id}/confirm`,
  })
}

/**
 * 获取用户的所有婚礼方案
 * @param userId 用户ID
 */
export async function getUserWeddingPackages(userId: number) {
  return request.get<DataType<WeddingPackageItem[]>>({
    url: `${BASE_URL}/user/${userId}`,
  })
}

/**
 * 获取推荐的婚礼方案
 * @param limit 限制数量
 */
export async function getRecommendedWeddingPackages(limit: number = 5) {
  return request.get<DataType<WeddingPackageItem[]>>({
    url: `${BASE_URL}/recommended`,
    params: { limit }
  })
}
