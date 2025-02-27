import { defineStore } from 'pinia'
import type { IUserInfo } from '~/api/user/type'
import { login } from '~/api/auth'
import { logout } from '~/api/user'
import { useUserInfo, useUserToken } from '~/composables/useUserStorage'

// 登录请求参数接口定义
interface LoginPayload {
  username: string
  password: string
}

const userInfo = useUserInfo()
const userToken = useUserToken()

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
          return false
        }

        const { token, user } = data

        this.token = token
        userToken.value = token

        this.userInfo = user
        userInfo.value = user

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

      // 清空本地数据
      userInfo.value = null
      userToken.value = ''
    },
  },
})
