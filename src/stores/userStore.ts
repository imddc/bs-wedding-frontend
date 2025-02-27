import { defineStore } from 'pinia'
import type { IUserInfo } from '~/api/user/type'
import { getUserInfo, login, logout } from '~/api/auth'

// 登录请求参数接口定义
interface LoginPayload {
  username: string
  password: string
}

// 定义用户状态管理 Store
export const useUserStore = defineStore('user', {
  // 状态定义：存储用户相关的核心数据
  state: () => ({
    userInfo: null as IUserInfo | null, // 用户信息
    token: null as string | null, // 认证令牌
    loading: false, // 加载状态
    error: null as string | null, // 错误信息
  }),

  // 计算属性：派生状态
  getters: {
    isLoggedIn: state => !!state.token, // 判断用户是否已登录
    currentUser: state => state.userInfo, // 获取当前用户信息
    hasError: state => !!state.error, // 判断是否存在错误
  },

  actions: {
    // 用户登录操作
    async userLogin(payload: LoginPayload) {
      this.loading = true
      this.error = null

      try {
        const response = await login(payload)
        const { success, data } = response

        if (!success) {
          window.$message.warning(response.message)
          return
        }

        const { token, user } = data

        this.token = token
        this.userInfo = user

        // 将 token 存储到 localStorage
        localStorage.setItem('token', token)

        return true
      } catch {
        return false
      } finally {
        this.loading = false
      }
    },

    // 用户登出操作
    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('登出请求失败', error)
      } finally {
        this.clearUserState()
      }
    },

    // 清除用户状态
    clearUserState() {
      this.token = null
      this.userInfo = null
      this.error = null
      localStorage.removeItem('token')
    },

    // 从本地存储初始化用户状态
    // 用于页面刷新后恢复用户登录状态
    async initializeFromStorage() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await getUserInfo()
          this.userInfo = response
          this.token = token
        } catch (error) {
          console.error('初始化用户状态失败', error)
          this.clearUserState()
        }
      }
    },
  },
})
