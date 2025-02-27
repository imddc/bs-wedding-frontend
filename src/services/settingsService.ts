import axios from 'axios'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Settings interface
interface NotificationSettings {
  orders: boolean
  messages: boolean
  weddingPlan: boolean
  marketing: boolean
  methods: string[]
}

interface PrivacySettings {
  showProfile: boolean
  shareWeddingPlan: boolean
  showOnlineStatus: boolean
  saveHistory: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: number
}

export interface Settings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  appearance: AppearanceSettings
  language: string
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

export const SettingsService = {
  // Get user settings
  getSettings(): Promise<ApiResponse<Settings>> {
    return apiClient.get('/user/settings')
  },

  // Update user settings
  updateSettings(settings: Settings): Promise<ApiResponse<any>> {
    return apiClient.put('/user/settings', settings)
  },

  // Delete account
  deleteAccount(): Promise<ApiResponse<any>> {
    return apiClient.delete('/user/account')
  },

  // Export user data
  exportUserData(): Promise<ApiResponse<any>> {
    return apiClient.get('/user/data/export')
  },

  // Get login devices
  getLoginDevices(): Promise<ApiResponse<any>> {
    return apiClient.get('/user/devices')
  },

  // Logout device
  logoutDevice(deviceId: number): Promise<ApiResponse<any>> {
    return apiClient.post(`/user/devices/${deviceId}/logout`)
  },

  // Logout all devices
  logoutAllDevices(): Promise<ApiResponse<any>> {
    return apiClient.post('/user/devices/logout-all')
  },
}
