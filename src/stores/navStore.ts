// ~/stores/navStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CalendarDays, Camera, Hotel, Mic } from 'lucide-vue-next'

export interface Nav {
  label: string
  path: string
  icon?: any
  children?: Nav[]
}

export const useNavStore = defineStore('nav', () => {
  const navList = ref<Nav[]>([
    {
      label: '酒店',
      path: '/hotel',
      icon: Hotel,
    },
    {
      label: '婚纱摄影',
      path: '/photography',
      icon: Camera,
    },
    {
      label: '司仪',
      path: '/siyi',
      icon: Mic,
    },
    {
      label: '婚礼策划',
      path: '/planning',
      icon: CalendarDays,
    },
  ])

  return {
    navList,
  }
})
