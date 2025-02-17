import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Nav {
  label: string
  path: string
}

export const useNavStore = defineStore('nav', () => {
  const navList = ref<Nav[]>([
    {
      label: '活动页面',
      path: '/activity',
    },
    {
      label: '首页',
      path: '/',
    },
  ])

  return {
    navList,
  }
})
