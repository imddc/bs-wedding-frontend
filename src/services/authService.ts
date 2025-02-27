import axios from 'axios'

// Response interface
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// User interfaces
export interface UserProfile {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  userType: number // 0: User, 1: Vendor
  createdTime: string
}

export interface LoginCredentials {
  username?: string
  email?: string
  phone?: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  phone?: string
  inviteCode?: string
}

export interface ResetPasswordData {
  email?: string
  phone?: string
  verificationCode: string
  newPassword: string
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
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

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 Unauthorized and not from a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken')

        if (refreshToken) {
          const { data } = await AuthService.refreshToken(refreshToken)

          if (data.code === 200) {
            // Save new tokens
            const { accessToken, refreshToken: newRefreshToken } = data.data
            AuthService.saveTokens(accessToken, newRefreshToken)

            // Update the header and retry the request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return apiClient(originalRequest)
          }
        }

        // If refresh fails, log out the user
        AuthService.logout()

        // Redirect to login page
        window.location.href = '/login'
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        AuthService.logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

/**
 * AuthService
 *
 * Provides authentication functionality including:
 * - Login and registration
 * - Token management
 * - Password reset
 * - User profile retrieval
 * - Session management
 */
export const AuthService = {
  /**
   * Log in with credentials
   * @param credentials - Login credentials (username/email/phone + password)
   */
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthToken & { user: UserProfile }>> {
    return apiClient.post('/auth/login', credentials)
  },

  /**
   * Register a new user
   * @param userData - Registration data
   */
  register(userData: RegisterData): Promise<ApiResponse<{ userId: number }>> {
    return apiClient.post('/auth/register', userData)
  },

  /**
   * Verify email with code
   * @param email - Email address
   * @param code - Verification code
   */
  verifyEmail(email: string, code: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post('/auth/verify-email', { email, code })
  },

  /**
   * Send verification code to email
   * @param email - Email address
   * @param purpose - Purpose of verification (register, reset-password, login)
   */
  sendEmailVerificationCode(email: string, purpose: string): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post('/auth/send-email-code', { email, purpose })
  },

  /**
   * Send verification code to phone
   * @param phone - Phone number
   * @param purpose - Purpose of verification (register, reset-password, login)
   */
  sendPhoneVerificationCode(phone: string, purpose: string): Promise<ApiResponse<{ sent: boolean }>> {
    return apiClient.post('/auth/send-phone-code', { phone, purpose })
  },

  /**
   * Log in with verification code (no password)
   * @param email - Email address
   * @param code - Verification code
   */
  loginWithCode(email: string, code: string): Promise<ApiResponse<AuthToken & { user: UserProfile }>> {
    return apiClient.post('/auth/login-with-code', { email, code })
  },

  /**
   * Refresh authentication token
   * @param refreshToken - Refresh token
   */
  refreshToken(refreshToken: string): Promise<ApiResponse<AuthToken>> {
    return apiClient.post('/auth/refresh-token', { refreshToken })
  },

  /**
   * Reset password
   * @param resetData - Password reset data
   */
  resetPassword(resetData: ResetPasswordData): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post('/auth/reset-password', resetData)
  },

  /**
   * Get current user profile
   */
  getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get('/auth/me')
  },

  /**
   * Log out user
   */
  logout(): Promise<ApiResponse<{ success: boolean }>> {
    // First, call the server to invalidate the token
    const result = apiClient.post('/auth/logout')

    // Then, clear local storage
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')

    return result
  },

  /**
   * Check authentication status
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null
  },

  /**
   * Save tokens to local storage
   * @param accessToken - Access token
   * @param refreshToken - Refresh token
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('authToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  /**
   * Save user info to local storage
   * @param user - User profile
   */
  saveUserInfo(user: UserProfile): void {
    localStorage.setItem('userInfo', JSON.stringify(user))
  },

  /**
   * Get user info from local storage
   */
  getUserInfo(): UserProfile | null {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  },

  /**
   * Log in with third-party providers
   * @param provider - Provider name (wechat, weibo, qq)
   * @param code - Authorization code from provider
   */
  loginWithThirdParty(provider: string, code: string): Promise<ApiResponse<AuthToken & { user: UserProfile }>> {
    return apiClient.post('/auth/third-party', { provider, code })
  },

  /**
   * Get login QR code for WeChat
   */
  getWechatQRCode(): Promise<ApiResponse<{ qrCode: string, sceneId: string }>> {
    return apiClient.get('/auth/wechat-qrcode')
  },

  /**
   * Check WeChat QR code login status
   * @param sceneId - Scene ID from QR code
   */
  checkWechatLogin(sceneId: string): Promise<ApiResponse<{ status: 'pending' | 'scanned' | 'confirmed' | 'expired', token?: AuthToken, user?: UserProfile }>> {
    return apiClient.get(`/auth/wechat-status?sceneId=${sceneId}`)
  },

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword })
  },

  /**
   * Get active sessions
   */
  getActiveSessions(): Promise<ApiResponse<Array<{
    id: string
    deviceName: string
    platform: string
    lastActive: string
    location: string
    isCurrent: boolean
  }>>> {
    return apiClient.get('/auth/sessions')
  },

  /**
   * Terminate a session
   * @param sessionId - ID of the session to terminate
   */
  terminateSession(sessionId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete(`/auth/sessions/${sessionId}`)
  },

  /**
   * Terminate all sessions except current
   */
  terminateAllSessions(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete('/auth/sessions')
  },

  /**
   * Generate invite code
   */
  generateInviteCode(): Promise<ApiResponse<{ inviteCode: string }>> {
    return apiClient.post('/auth/invite-code')
  },

  /**
   * Validate invite code
   * @param inviteCode - Invite code to validate
   */
  validateInviteCode(inviteCode: string): Promise<ApiResponse<{ valid: boolean, owner?: string }>> {
    return apiClient.get(`/auth/invite-code/validate?code=${inviteCode}`)
  },
}
