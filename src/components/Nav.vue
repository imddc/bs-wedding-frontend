<!-- src/layouts/AppHeader.vue -->
<script setup lang="ts">
import { h, ref } from 'vue'
import type { Component } from 'vue'
import { NAvatar, NDropdown, NLayoutHeader } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { useRouter } from 'vue-router'
import { Camera, Heart, Hotel, Mic, User } from 'lucide-vue-next'
import { useUserStore } from '~/stores'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const {userInfo, isLoggedIn} = storeToRefs(userStore)

function renderIcon(icon: Component) {
  return () => h(icon, { class: 'size-4' })
}

// User dropdown menu options
const userOptions = ref<DropdownOption[]>([
  {
    label: '个人信息',
    key: 'profile',
    icon: renderIcon(User),
  },
  {
    label: '我的收藏',
    key: 'favorites',
    icon: renderIcon(Heart),
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '退出登录',
    key: 'logout',
  },
])

function clickLogo() {
  router.push('/')
}

function clickNav(path: string) {
  router.push(path)
}

function handleUserAction(key: string) {
  console.log('User action:', key)
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'favorites':
      router.push('/favorites')
      break
    case 'logout':
      // Implement logout logic
      userStore.userLogout()
      router.replace('/')
      break
    default:
      break
  }
}

// 自定义导航列表，适配我们的婚礼服务主题
const navigationItems = [
  {
    label: '首页',
    path: '/',
    icon: null,
    activeColor: '',
  },
  {
    label: '婚纱摄影',
    path: '/photography',
    icon: Camera,
    activeColor: 'text-red-600 border-red-600',
  },
  {
    label: '婚宴酒店',
    path: '/hotel',
    icon: Hotel,
    activeColor: 'text-amber-600 border-amber-600',
  },
  {
    label: '司仪主持',
    path: '/siyi',
    icon: Mic,
    activeColor: 'text-indigo-600 border-indigo-600',
  },
  {
    label: '定制方案',
    path: '/custom',
    icon: Heart,
    activeColor: 'text-pink-600 border-pink-600',
  },
]

// 获取当前活动路由
const currentPath = ref(router.currentRoute.value.path)

// 计算当前活动项的颜色
// function getActiveColor(path: string) {
//   const activeItem = navigationItems.find(item =>
//     path === item.path || (item.path !== '/' && path.startsWith(item.path)),
//   )
//   return activeItem?.activeColor || 'text-gray-900 border-gray-900'
// }

// 监听路由变化
router.afterEach((to) => {
  currentPath.value = to.path
})
</script>

<template>
  <NLayoutHeader class="h-16 shadow-sm bg-white z-10 sticky top-0">
    <div class="container mx-auto h-full px-4 flex items-center gap-6">
      <!-- Logo -->
      <div class="flex-shrink-0 cursor-pointer flex items-center" @click="clickLogo">
        <img class="h-10 w-auto mr-2" src="/src/assets/wedding-ring.png" alt="Logo">
        <span class="text-xl font-bold text-red-600 font-serif tracking-wider">良缘喜事</span>
      </div>

      <!-- Main Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <div
          v-for="item in navigationItems"
          :key="item.path"
          class="cursor-pointer flex items-center py-2 px-1 border-b-2 transition-colors duration-200 text-gray-700 hover:opacity-80"
          :class="[
            currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))
              ? [item.activeColor || 'text-gray-900 border-gray-900', 'font-medium']
              : 'border-transparent hover:border-gray-300',
          ]"
          @click="() => clickNav(item.path)"
        >
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4 mr-1.5" />
          {{ item.label }}
        </div>
      </div>

      <!-- User Area -->
      <div class="flex items-center gap-4 ml-auto">
        <!-- User Profile / Login -->
        <div v-if="isLoggedIn">
          <NDropdown trigger="click" :options="userOptions" @select="handleUserAction">
            <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full p-1">
                <NAvatar round size="medium" src="">
                  <template #fallback>
                    <User class="h-4 w-4" />
                  </template>
                </NAvatar>
              <span class="hidden sm:inline text-sm">{{ userInfo?.realName || userInfo?.username }}</span>
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
/* 定制头像样式 */
:deep(.n-avatar) {
  background-color: #f3f4f6;
}

/* 中国风字体 */
.font-serif {
  font-family: 'STZhongsong', 'SimSun', serif;
}
</style>
