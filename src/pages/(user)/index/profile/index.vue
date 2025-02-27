<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import { NAvatar, NCard, NMenu, useMessage } from 'naive-ui'
import {
  Calendar,
  Camera,
  Heart,
  Home,
  MessageCircle,
  Settings,
  ShoppingBag,
  Store,
  User,
  Users,
} from 'lucide-vue-next'
import axios from 'axios'

// Import components with PascalCase naming
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import OrdersPanel from '~/components/profile/OrdersPanel.vue'
import FavoritesPanel from '~/components/profile/FavoritesPanel.vue'
import MessagesPanel from '~/components/profile/MessagesPanel.vue'
import VendorManagementPanel from '~/components/profile/VendorManagementPanel.vue'
import WeddingPlanPanel from '~/components/profile/WeddingPlanPanel.vue'
import SettingsPanel from '~/components/profile/SettingsPanel.vue'

// API service
import { UserService } from '~/services/userService'

const message = useMessage()

// User information state
const userInfo = reactive({
  id: 0,
  username: '',
  email: '',
  phone: '',
  avatar: '',
  userType: 0, // 0: Normal user, 1: Vendor
  address: '',
  createdTime: '',
  updatedTime: '',
})

// User statistics state
const userStats = reactive({
  orders: 0,
  favorites: 0,
  messages: 0,
})

// Check if user is a vendor
const isVendor = computed(() => userInfo.userType === 1)

// Active menu key for navigation
const activeKey = ref('profile-info')

// Navigation menu options
const menuOptions = computed(() => {
  const options = [
    {
      label: '个人资料',
      key: 'profile-info',
      icon: () => h(User, { size: 18 }),
    },
    {
      label: '我的订单',
      key: 'orders',
      icon: () => h(ShoppingBag, { size: 18 }),
    },
    {
      label: '我的收藏',
      key: 'favorites',
      icon: () => h(Heart, { size: 18 }),
    },
    {
      label: '消息记录',
      key: 'messages',
      icon: () => h(MessageCircle, { size: 18 }),
    },
    {
      label: '婚礼方案',
      key: 'wedding-plan',
      icon: () => h(Calendar, { size: 18 }),
    },
    {
      label: '系统设置',
      key: 'settings',
      icon: () => h(Settings, { size: 18 }),
    },
  ]

  // Add vendor management section for vendors only
  if (isVendor.value) {
    options.splice(5, 0, {
      label: '商家管理',
      key: 'vendor-management',
      icon: () => h(Store, { size: 18 }),
      children: [
        {
          label: '婚纱摄影管理',
          key: 'vendor-photography',
          icon: () => h(Camera, { size: 18 }),
        },
        {
          label: '婚宴酒店管理',
          key: 'vendor-hotel',
          icon: () => h(Home, { size: 18 }),
        },
        {
          label: '司仪主持管理',
          key: 'vendor-host',
          icon: () => h(Users, { size: 18 }),
        },
      ],
    })
  }

  return options
})

// Data for different sections
const orders = ref<any[]>([])
const favorites = ref<any[]>([])
const messages = ref<any[]>([])
const weddingPlan = ref<any>(null)
const userSettings = ref({
  notifications: true,
  newsletter: false,
  darkMode: false,
  language: 'zh-CN',
})

// Handle menu change
function handleMenuChange(key: string) {
  activeKey.value = key
  loadSectionData(key)
}

// Load user information
async function loadUserInfo() {
  try {
    const { data } = await UserService.getUserInfo()
    if (data.code === 200) {
      Object.assign(userInfo, data.data)
      loadUserStats()
    } else {
      message.error(data.message || '获取用户信息失败')
    }
  } catch (error) {
    message.error('获取用户信息失败，请检查网络连接')
    console.error('Error loading user info:', error)
  }
}

// Load user statistics
async function loadUserStats() {
  try {
    const { data } = await UserService.getUserStats()
    if (data.code === 200) {
      Object.assign(userStats, data.data)
    }
  } catch (error) {
    console.error('Error loading user stats:', error)
  }
}

// Load data for the selected section
async function loadSectionData(section: string) {
  const apiEndpoints: Record<string, string> = {
    'orders': '/api/orders',
    'favorites': '/api/favorites',
    'messages': '/api/messages',
    'wedding-plan': '/api/wedding-plan',
    'vendor-photography': '/api/vendor/photography',
    'vendor-hotel': '/api/vendor/hotel',
    'vendor-host': '/api/vendor/host',
  }

  const endpoint = apiEndpoints[section]
  if (!endpoint)
    return

  try {
    message.loading('加载数据中...')
    const { data } = await axios.get(endpoint)
    if (data.code === 200) {
      // Update the corresponding reactive reference
      switch (section) {
        case 'orders':
          orders.value = data.data
          break
        case 'favorites':
          favorites.value = data.data
          break
        case 'messages':
          messages.value = data.data
          break
        case 'wedding-plan':
          weddingPlan.value = data.data
          break
      }
      message.success('数据加载成功')
    } else {
      message.error(data.message || '获取数据失败')
    }
  } catch (error) {
    message.error('获取数据失败，请检查网络连接')
    console.error(`Error loading ${section} data:`, error)
  }
}

// Update user information
async function updateUserInfo(updatedInfo: any) {
  try {
    const { data } = await UserService.updateUserInfo(updatedInfo)
    if (data.code === 200) {
      Object.assign(userInfo, updatedInfo)
      message.success('个人信息更新成功')
    } else {
      message.error(data.message || '更新个人信息失败')
    }
  } catch (error) {
    message.error('更新个人信息失败，请检查网络连接')
    console.error('Error updating user info:', error)
  }
}

// Update user settings
async function updateSettings(updatedSettings: any) {
  try {
    const { data } = await UserService.updateUserSettings(updatedSettings)
    if (data.code === 200) {
      Object.assign(userSettings.value, updatedSettings)
      message.success('设置更新成功')
    } else {
      message.error(data.message || '更新设置失败')
    }
  } catch (error) {
    message.error('更新设置失败，请检查网络连接')
    console.error('Error updating user settings:', error)
  }
}

// Load initial data when component mounts
onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50">
    <!-- Profile Header -->
    <div class="relative h-48 bg-gradient-to-r from-pink-300 to-purple-400">
      <div class="container mx-auto px-4 relative h-full">
        <div class="absolute bottom-0 left-4 transform translate-y-1/2 flex items-end">
          <div class="relative">
            <NAvatar
              :size="96"
              :src="userInfo.avatar || ''"
              class="border-4 border-white"
            />
            <div v-if="isVendor" class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              商家
            </div>
          </div>
          <div class="ml-4 pb-6">
            <h1 class="text-white text-2xl font-bold">
              {{ userInfo.username }}
            </h1>
            <p class="text-white opacity-90">
              {{ userInfo.email }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="container mx-auto px-4 pt-16 pb-8">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Sidebar Navigation -->
        <div class="w-full md:w-1/4">
          <NCard>
            <NMenu
              v-model:value="activeKey"
              :options="menuOptions"
              @update:value="handleMenuChange"
            />
          </NCard>

          <!-- User Stats Card -->
          <NCard class="mt-4">
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <div class="text-lg font-bold text-gray-800">
                  {{ userStats.orders }}
                </div>
                <div class="text-sm text-gray-500">
                  订单
                </div>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800">
                  {{ userStats.favorites }}
                </div>
                <div class="text-sm text-gray-500">
                  收藏
                </div>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800">
                  {{ userStats.messages }}
                </div>
                <div class="text-sm text-gray-500">
                  消息
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- Content Area -->
        <div class="w-full md:w-3/4">
          <ProfileInfo
            v-if="activeKey === 'profile-info'"
            :user-info="userInfo"
            @update="updateUserInfo"
          />

          <OrdersPanel
            v-else-if="activeKey === 'orders'"
            :orders="orders"
          />

          <FavoritesPanel
            v-else-if="activeKey === 'favorites'"
            :favorites="favorites"
          />

          <MessagesPanel
            v-else-if="activeKey === 'messages'"
            :messages="messages"
          />

          <VendorManagementPanel
            v-else-if="activeKey.startsWith('vendor-') && isVendor"
            :vendor-type="activeKey.replace('vendor-', '')"
          />

          <WeddingPlanPanel
            v-else-if="activeKey === 'wedding-plan'"
            :plan="weddingPlan"
          />

          <SettingsPanel
            v-else-if="activeKey === 'settings'"
            :settings="userSettings"
            @update="updateSettings"
          />
        </div>
      </div>
    </div>
  </div>
</template>
