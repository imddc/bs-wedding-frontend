import { request } from '~/plugins/http'
import type { DataType } from '~/plugins/http/type'
import type {
  Favorite,
  FavoriteCheckParams,
  FavoriteCreateParams,
  FavoritePage,
  FavoriteQueryParams,
} from './type'

/**
 * Create a new favorite
 */
export async function createFavorite(data: FavoriteCreateParams) {
  return request.post<DataType<number>>({
    url: '/favorites',
    data,
  })
}

/**
 * Delete a favorite by ID
 */
export async function deleteFavorite(id: number) {
  return request.delete<DataType<boolean>>({
    url: `/favorites/${id}`,
  })
}

/**
 * Delete a favorite by user ID and merchant ID
 */
export async function deleteFavoriteByUserAndMerchant(userId: number, merchantId: number) {
  return request.delete<DataType<boolean>>({
    url: `/favorites/user/${userId}/merchant/${merchantId}`,
  })
}

/**
 * Get a favorite by ID
 */
export async function getFavoriteById(id: number) {
  return request.get<DataType<Favorite>>({
    url: `/favorites/${id}`,
  })
}

/**
 * Get favorites by user ID
 */
export async function getFavoritesByUserId(userId: number) {
  return request.get<DataType<Favorite[]>>({
    url: `/favorites/user/${userId}`,
  })
}

/**
 * Get favorites by merchant ID
 */
export async function getFavoritesByMerchantId(merchantId: number) {
  return request.get<DataType<Favorite[]>>({
    url: `/favorites/merchant/${merchantId}`,
  })
}

/**
 * Paginate favorites with query parameters
 */
export async function pageFavorites(params: FavoriteQueryParams) {
  return request.get<DataType<FavoritePage>>({
    url: '/favorites/page',
    params,
  })
}

/**
 * Check if a favorite exists
 */
export async function checkFavoriteExists(params: FavoriteCheckParams) {
  return request.get<DataType<boolean>>({
    url: '/favorites/check',
    params,
  })
}
