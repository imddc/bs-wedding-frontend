import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  MerchantCreateParams,
  MerchantInfo,
  MerchantPageResult,
  MerchantQueryParams,
  MerchantStatusParams,
  MerchantUpdateParams,
} from './type'

/**
 * 创建商家
 * @param data 商家信息
 */
export async function createMerchant(data: MerchantCreateParams) {
  return request.post<DataType<number>>({
    url: '/merchants',
    data,
  })
}

/**
 * 更新商家信息
 * @param data 商家信息
 */
export async function updateMerchant(data: MerchantUpdateParams) {
  return request.put<DataType<boolean>>({
    url: `/merchants/${data.id}`,
    data,
  })
}

/**
 * 获取商家详情
 * @param id 商家ID
 */
export async function getMerchantById(id: number) {
  return request.get<DataType<MerchantInfo>>({
    url: `/merchants/${id}`,
  })
}

/**
 * 分页查询商家列表
 * @param params 查询参数
 */
export async function pageMerchants(params: MerchantQueryParams) {
  return request.get<DataType<MerchantPageResult>>({
    url: '/merchants',
    params,
  })
}

/**
 * 删除商家
 * @param id 商家ID
 */
export async function deleteMerchant(id: number) {
  return request.delete<DataType<boolean>>({
    url: `/merchants/${id}`,
  })
}

/**
 * 更新商家状态
 * @param data 状态信息
 */
export async function updateMerchantStatus(data: MerchantStatusParams) {
  return request.patch<DataType<boolean>>({
    url: `/merchants/${data.id}/status`,
    params: {
      status: data.status,
    },
  })
}
