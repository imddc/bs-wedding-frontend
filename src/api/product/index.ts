import { request } from '~/plugins/http'
import type {
  DataType,
  PageResult,
  Product,
  ProductQuery,
  ProductType,
} from './type'

/**
 * 获取商品列表（分页）
 */
export async function getProductList(params: ProductQuery) {
  return request.get<DataType<PageResult<Product>>>({
    url: '/products',
    params,
  })
}

/**
 * 根据商品类型获取商品列表
 */
export async function getProductsByType(productType: ProductType, params?: Omit<ProductQuery, 'productType'>) {
  return request.get<DataType<PageResult<Product>>>({
    url: '/products',
    params: { ...params, productType },
  })
}

/**
 * 获取商品详情
 */
export async function getProductDetail(id: number) {
  return request.get<DataType<Product>>({
    url: `/products/${id}`,
  })
}

/**
 * 创建商品
 */
export async function createProduct(data: Product) {
  return request.post<DataType<Product>>({
    url: '/products',
    data,
  })
}

/**
 * 更新商品
 */
export async function updateProduct(id: number, data: Partial<Product>) {
  return request.put<DataType<Product>>({
    url: `/products/${id}`,
    data,
  })
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number) {
  return request.delete<DataType<null>>({
    url: `/products/${id}`,
  })
}

/**
 * 更新商品状态（上下架）
 */
export async function updateProductStatus(id: number, status: number) {
  return request.patch<DataType<Product>>({
    url: `/products/${id}/status`,
    data: { status },
  })
}

/**
 * 获取商品分类列表(根据商品类型)
 */
export async function getCategoriesByType(productType: ProductType) {
  return request.get<DataType<any[]>>({
    url: '/categories',
    params: { merchantType: productType },
  })
}

/**
 * 获取商家列表
 */
export async function getMerchantList(type?: ProductType) {
  return request.get<DataType<any[]>>({
    url: '/merchants',
    params: type ? { merchantType: type } : undefined,
  })
}

/**
 * 上传图片
 */
export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<DataType<{ url: string }>>({
    url: '/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
