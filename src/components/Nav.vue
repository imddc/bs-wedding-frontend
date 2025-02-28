<script setup lang="ts">
import { h, ref } from 'vue'
import { NLayoutHeader, NDropdown, NAvatar, NIcon, NBadge } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNavStore } from '~/stores/navStore'
import { User, ShoppingBag, Bell, Heart, Settings } from 'lucide-vue-next'
import type { Nav } from '~/stores/navStore'

const router = useRouter()
const navStore = useNavStore()
const { navList } = storeToRefs(navStore)

// Whether user is logged in
const isLoggedIn = ref(true)

// Example user data
const userData = ref({
  name: '张先生',
  avatar: '/src/assets/avatar.png',
})

// User dropdown menu options
const userOptions = ref([
  {
    label: '个人信息',
    key: 'profile',
    icon: User,
  },
  {
    label: '我的收藏',
    key: 'favorites',
    icon: Heart,
  },
  {
    label: '我的订单',
    key: 'orders',
    icon: ShoppingBag,
  },
  {
    label: '我的消息',
    key: 'messages',
    icon: Bell,
    badge: 3,
  },
  {
    type: 'divider',
  },
  {
    label: '账号设置',
    key: 'settings',
    icon: Settings,
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: 'logout',
  }
])

function clickLogo() {
  console.log('clickLogo')
  router.push('/')
}

function clickNav(nav: Nav) {
  router.push(nav.path)
}

function handleUserAction(key: string) {
  console.log('User action:', key)
  switch (key) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'favorites':
      router.push('/user/favorites')
      break
    case 'orders':
      router.push('/user/orders')
      break
    case 'messages':
      router.push('/user/messages')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      // Implement logout logic
      console.log('Logging out...')
      break
  }
}

function renderIcon(icon: any) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
</script>

<template>
  <NLayoutHeader class="h-16 shadow-sm bg-white">
    <div class="container mx-auto h-full px-4 flex items-center gap-6">
      <!-- Logo -->
      <div class="flex-shrink-0 cursor-pointer" @click="clickLogo">
        <img class="h-12 w-auto" src="/src/assets/wedding-ring.png" alt="Logo">
      </div>
      
      <!-- Main Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <div
          v-for="nav in navList"
          :key="nav.path"
          class="cursor-pointer flex items-center py-2 px-1 border-b-2 transition-colors duration-150"
          :class="[
            router.currentRoute.value.path === nav.path 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent hover:text-primary-500'
          ]"
          @click="() => clickNav(nav)"
        >
          <component :is="nav.icon" v-if="nav.icon" class="h-4 w-4 mr-1" />
          {{ nav.label }}
        </div>
      </div>
      
      <!-- User Area -->
      <div class="flex items-center gap-4 ml-auto">
        <!-- Search - Could be expanded later -->
        
        <!-- User Profile / Login -->
        <div v-if="isLoggedIn">
          <NDropdown
            trigger="click"
            :options="userOptions"
            @select="handleUserAction"
          >
            <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full p-1">
              <NBadge :value="3" :max="99" dot>
                <NAvatar round size="medium" :src="userData.avatar">
                  <template #fallback>
                    <User class="h-4 w-4" />
                  </template>
                </NAvatar>
              </NBadge>
              <span class="hidden sm:inline text-sm">{{ userData.name }}</span>
            </div>
          </NDropdown>
        </div>
        <div v-else class="cursor-pointer hover:text-primary-500" @click="router.push('/login')">
          登录 / 注册
        </div>
      </div>
    </div>
  </NLayoutHeader>
</template>

<style scoped>
/* Add any custom styling here */
</style>
