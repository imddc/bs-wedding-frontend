import { request } from '~/plugins/http'
import type { DataType, PageData } from '~/plugins/http/type'
import type { DistrictDTO, DistrictParams, PageParams } from './type'

/**
 * 获取区域详情
 */
export async function getDistrict(id: number) {
  return request.get<DataType<DistrictDTO>>({
    url: `/districts/${id}`,
  })
}

/**
 * 获取区域分页列表
 */
export async function listDistricts(params: PageParams) {
  return request.get<PageData<DistrictDTO>>({
    url: '/districts',
    params,
  })
}

/**
 * 获取已启用的区域列表
 */
export async function listEnabledDistricts() {
  return request.get<DataType<DistrictDTO[]>>({
    url: '/districts/enabled',
  })
}

/**
 * 创建区域
 */
export async function createDistrict(data: DistrictParams) {
  return request.post<DataType<DistrictDTO>>({
    url: '/districts',
    data,
  })
}

/**
 * 更新区域
 */
export async function updateDistrict(id: number, data: DistrictParams) {
  return request.put<DataType<DistrictDTO>>({
    url: `/districts/${id}`,
    data,
  })
}

/**
 * 删除区域
 */
export async function deleteDistrict(id: number) {
  return request.delete<DataType<void>>({
    url: `/districts/${id}`,
  })
}
