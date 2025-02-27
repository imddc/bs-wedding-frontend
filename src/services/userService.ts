import axios from 'axios'

// User information interfaces
export interface UserInfo {
  id: number
  username: string
  email: string
  phone: string
  avatar: string
  userType: number
  address: string
  createdTime: string
  updatedTime: string
  vendorType?: string
  vendorDescription?: string
}

export interface UserStats {
  orders: number
  favorites: number
  messages: number
}

export interface UserSettings {
  notifications: boolean
  newsletter: boolean
  darkMode: boolean
  language: string
}

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// Configure axios defaults
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

export const UserService = {
  // Get user information
  getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return apiClient.get('/user/info')
  },

  // Update user information
  updateUserInfo(userInfo: Partial<UserInfo>): Promise<ApiResponse<any>> {
    return apiClient.put('/user/info', userInfo)
  },

  // Get user statistics
  getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get('/user/stats')
  },

  // Update user settings
  updateUserSettings(settings: UserSettings): Promise<ApiResponse<any>> {
    return apiClient.put('/user/settings', settings)
  },

  // Change password
  changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    return apiClient.put('/user/password', {
      currentPassword,
      newPassword,
    })
  },

  // Update avatar
  updateAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append('avatar', file)

    return apiClient.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Bind phone number
  bindPhone(phone: string, verificationCode: string): Promise<ApiResponse<any>> {
    return apiClient.put('/user/phone', {
      phone,
      verificationCode,
    })
  },

  // Send phone verification code
  sendPhoneVerificationCode(phone: string): Promise<ApiResponse<any>> {
    return apiClient.post('/user/phone/send-code', { phone })
  },

  // Bind email
  bindEmail(email: string, verificationCode: string): Promise<ApiResponse<any>> {
    return apiClient.put('/user/email', {
      email,
      verificationCode,
    })
  },

  // Send email verification code
  sendEmailVerificationCode(email: string): Promise<ApiResponse<any>> {
    return apiClient.post('/user/email/send-code', { email })
  },
}
