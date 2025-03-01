export interface Favorite {
  id: number
  userId: number
  merchantId: number
  createTime: string
}

export interface FavoriteCreateParams {
  userId: number
  merchantId: number
}

export interface FavoriteQueryParams {
  userId?: number
  merchantId?: number
  current?: number
  size?: number
}

export interface FavoriteCheckParams {
  userId: number
  merchantId: number
}

export interface FavoritePage {
  records: Favorite[]
  total: number
  size: number
  current: number
  pages: number
}
