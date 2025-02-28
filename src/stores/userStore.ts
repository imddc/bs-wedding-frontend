import { defineStore } from 'pinia'
import { login } from '~/api/auth'
import type { UserInfo } from '~/api/user/type'
import { useUserInfo, useUserToken } from '~/composables/useUserStorage'

// 登录请求参数接口定义
interface LoginPayload {
  username: string
  password: string
}

// 用户状态接口
interface UserState {
  userInfo: UserInfo | null // 用户信息
  token: string | null // 认证令牌
  loading: boolean // 加载状态
  error: string | null // 错误信息
}

const userToken = useUserToken()
const userInfo = useUserInfo()

// 定义用户状态管理 Store
export const useUserStore = defineStore('user', {
  // 状态定义：存储用户相关的核心数据
  state: (): UserState => {
    return {
      userInfo: null,
      token: null,
      loading: false,
      error: null,
    }
  },

  // 计算属性：派生状态
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.userInfo,
    hasError: state => !!state.error,
  },

  actions: {
    // 设置用户信息
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      userInfo.value = info
    },

    // 设置token
    setToken(token: string | null) {
      this.token = token
      userToken.value = token || ''
    },

    // 设置错误信息
    setError(error: string | null) {
      this.error = error
    },

    // 用户登录操作
    async userLogin(payload: LoginPayload): Promise<boolean> {
      this.loading = true
      this.setError(null)

      try {
        const response = await login(payload)

        if (!response.success) {
          window.$message?.warning(response.message || '登录失败')
          return false
        }

        const { token, user } = response.data

        this.setToken(token)
        this.setUserInfo(user)

        return true
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试'
        this.setError(errorMessage)
        window.$message?.error(errorMessage)
        return false
      } finally {
        this.loading = false
      }
    },

    // 用户登出操作 - 直接清除本地状态，无需网络请求
    userLogout(): void {
      this.clearUserState()
      window.$message?.success('已退出登录')
    },

    // 清除用户状态
    clearUserState(): void {
      this.setToken(null)
      this.setUserInfo(null)
      this.setError(null)
    },

    // 检查并刷新令牌（可用于token即将过期时）
    async refreshToken(): Promise<boolean> {
      // 这里实现token刷新逻辑，你需要添加相应的API调用
      // 举例：
      // try {
      //   const response = await refreshTokenApi()
      //   if (response.success) {
      //     this.setToken(response.data.token)
      //     return true
      //   }
      //   return false
      // } catch {
      //   this.clearUserState()
      //   return false
      // }

      // 留作未来扩展
      return !!this.token
    },
  },
})
