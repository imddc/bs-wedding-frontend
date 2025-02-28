export interface Hotel {
  id: number
  name: string
  image: string
  rating: number
  location: string
  tables: string
  price: number
}

export interface Company {
  id: number
  name: string
  image: string
  rating: number
  ratingType: 'comprehensive' | 'service' | 'premium'
  price: number
  priceType: string
  location: string
}
