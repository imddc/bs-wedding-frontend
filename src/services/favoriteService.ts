import axios from 'axios'
import type { FavoriteItem } from '~/components/profile/FavoritesPanel.vue'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

export const FavoriteService = {
  // Get all favorites
  getFavorites(): Promise<ApiResponse<FavoriteItem[]>> {
    return apiClient.get('/favorites')
  },

  // Add to favorites
  addFavorite(type: string, itemId: number): Promise<ApiResponse<{ id: number }>> {
    return apiClient.post('/favorites', {
      type,
      itemId,
    })
  },

  // Remove from favorites
  removeFavorite(favoriteId: number): Promise<ApiResponse<any>> {
    return apiClient.delete(`/favorites/${favoriteId}`)
  },

  // Check if item is favorited
  checkFavoriteStatus(type: string, itemId: number): Promise<ApiResponse<{ isFavorite: boolean, favoriteId?: number }>> {
    return apiClient.get(`/favorites/check?type=${type}&itemId=${itemId}`)
  },

  // Get favorites by type
  getFavoritesByType(type: string): Promise<ApiResponse<FavoriteItem[]>> {
    return apiClient.get(`/favorites/type/${type}`)
  },
}
