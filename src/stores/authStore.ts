import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const rememberMe = ref(false)

  return {
    rememberMe,
  }
}, {
  persist: {
    key: '__s_authStore',
  },
})

export function useAuthStoreWithOut() {
  return useAuthStore()
}
