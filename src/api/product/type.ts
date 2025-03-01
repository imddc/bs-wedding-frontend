// src/api/product/types.ts
export interface Product {
  id: number
  merchantId: number
  merchantName?: string
  productName: string
  categoryId: number
  categoryName?: string
  productType: number
  productTypeName?: string
  price: number
  rating: number
  mainImage?: string
  subImagesList?: string[]
  description?: string
  tagsList?: string[]
  servicesMap?: Record<string, string>
  detail?: string
  stock?: number
  sales: number
  location?: string
  establishmentYears?: number
  status: number
  statusName?: string
  createTime: string
  updateTime: string
}

export interface PhotographyProduct extends Product {
  shootingLocationsList?: string[]
  costumeCount?: number
  photographerLevel?: string
  photoCount?: number
}

export interface HotelProduct extends Product {
  venueSize?: number
  maxTables?: number
  minTables?: number
  cateringStyleList?: string[]
}

export interface HostProduct extends Product {
  hostingExperience?: number
  hostingStyle?: string
  languagesList?: string[]
}

export interface ProductQueryParams {
  productName?: string
  categoryId?: number
  productType?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  tags?: string
  location?: string
  status?: number
  pageNum?: number
  pageSize?: number
  orderBy?: string
}

export interface HotProductQueryParams {
  productType?: number
  categoryId?: number
  limit?: number
}

export interface ProductCreateParams {
  merchantId: number
  productName: string
  categoryId: number
  productType: number
  price: number
  rating?: number
  mainImage?: string
  subImages?: string
  description?: string
  tags?: string
  services?: string
  detail?: string
  stock?: number
  location?: string
  establishmentYears?: number
  status?: number
}

export interface PhotographyProductParams extends ProductCreateParams {
  shootingLocations?: string
  costumeCount?: number
  photographerLevel?: string
  photoCount?: number
}

export interface HotelProductParams extends ProductCreateParams {
  venueSize?: number
  maxTables?: number
  minTables?: number
  cateringStyle?: string
}

export interface HostProductParams extends ProductCreateParams {
  hostingExperience?: number
  hostingStyle?: string
  languages?: string
}

export interface PageResult<T> {
  total: number
  list: T[]
  pageNum: number
  pageSize: number
  pages: number
}

export interface HotProduct {
  id: number
  productName: string
  productType: number
  productTypeName: string
  price: number
  rating: number
  mainImage?: string
  description?: string
  sales: number
  location?: string
}
