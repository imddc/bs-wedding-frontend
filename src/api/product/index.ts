// src/api/product/index.ts
import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  HostProduct,
  HostProductParams,
  HotelProduct,
  HotelProductParams,
  HotProduct,
  HotProductQueryParams,
  PageResult,
  PhotographyProduct,
  PhotographyProductParams,
  Product,
  ProductCreateParams,
  ProductQueryParams,
} from './type'

const BASE_URL = '/products'

// 通用产品API
export async function getProducts(params: ProductQueryParams) {
  return request.get<DataType<PageResult<Product>>>({
    url: BASE_URL,
    params,
  })
}

export async function getProduct(id: number) {
  return request.get<DataType<Product>>({
    url: `${BASE_URL}/${id}`,
  })
}

export async function createProduct(data: ProductCreateParams) {
  return request.post<DataType<boolean>>({
    url: BASE_URL,
    data,
  })
}

export async function updateProduct(id: number, data: ProductCreateParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/${id}`,
    data,
  })
}

export async function deleteProduct(id: number) {
  return request.delete<DataType<boolean>>({
    url: `${BASE_URL}/${id}`,
  })
}

export async function batchDeleteProducts(ids: number[]) {
  return request.delete<DataType<boolean>>({
    url: `${BASE_URL}/batch`,
    data: ids,
  })
}

export async function updateProductStatus(id: number, status: number) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/${id}/status/${status}`,
  })
}

// 婚纱摄影产品API
export async function getPhotographyProduct(id: number) {
  return request.get<DataType<PhotographyProduct>>({
    url: `${BASE_URL}/photography/${id}`,
  })
}

export async function createPhotographyProduct(data: PhotographyProductParams) {
  return request.post<DataType<boolean>>({
    url: `${BASE_URL}/photography`,
    data,
  })
}

export async function updatePhotographyProduct(id: number, data: PhotographyProductParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/photography/${id}`,
    data,
  })
}

// 婚宴酒店产品API
export async function getHotelProduct(id: number) {
  return request.get<DataType<HotelProduct>>({
    url: `${BASE_URL}/hotel/${id}`,
  })
}

export async function createHotelProduct(data: HotelProductParams) {
  return request.post<DataType<boolean>>({
    url: `${BASE_URL}/hotel`,
    data,
  })
}

export async function updateHotelProduct(id: number, data: HotelProductParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/hotel/${id}`,
    data,
  })
}

// 司仪主持产品API
export async function getHostProduct(id: number) {
  return request.get<DataType<HostProduct>>({
    url: `${BASE_URL}/host/${id}`,
  })
}

export async function createHostProduct(data: HostProductParams) {
  return request.post<DataType<boolean>>({
    url: `${BASE_URL}/host`,
    data,
  })
}

export async function updateHostProduct(id: number, data: HostProductParams) {
  return request.put<DataType<boolean>>({
    url: `${BASE_URL}/host/${id}`,
    data,
  })
}

// 热门产品API
export async function getHotProducts(params: HotProductQueryParams) {
  return request.get<DataType<HotProduct[]>>({
    url: `${BASE_URL}/hot`,
    params,
  })
}

export async function getHotPhotographyProducts(params: HotProductQueryParams) {
  return request.get<DataType<HotProduct[]>>({
    url: `${BASE_URL}/hot/photography`,
    params,
  })
}

export async function getHotHotelProducts(params: HotProductQueryParams) {
  return request.get<DataType<HotProduct[]>>({
    url: `${BASE_URL}/hot/hotel`,
    params,
  })
}

export async function getHotHostProducts(params: HotProductQueryParams) {
  return request.get<DataType<HotProduct[]>>({
    url: `${BASE_URL}/hot/host`,
    params,
  })
}
