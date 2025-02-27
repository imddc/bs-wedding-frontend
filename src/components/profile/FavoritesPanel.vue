<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { NCard, NPagination, NTab, NTabs, useMessage } from 'naive-ui'
import { Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { FavoriteService } from '~/services/favoriteService'

// Import components
import FavoriteCard from '~/components/favorite/FavoriteCard.vue'

// Define interfaces
export interface FavoriteItem {
  id: number
  name: string
  coverImage: string
  description: string
  price: number
  rating: number
  reviewCount: number
  location: string
  tags: string[]
  vendorId: number
  type: string
  capacity?: number // For hotels
  style?: string // For photography
  experience?: number // For hosts
}

const props = defineProps<{
  favorites: FavoriteItem[]
}>()

const message = useMessage()
const router = useRouter()

// State
const activeTab = ref('photography')
const currentPage = ref(1)
const pageSize = ref(9)

// Computed
const filteredFavorites = computed(() => {
  // Filter by type
  const filtered = props.favorites.filter(item => item.type === activeTab.value)

  // Calculate pagination
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = Math.min(startIndex + pageSize.value, filtered.length)

  return filtered.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  const filtered = props.favorites.filter(item => item.type === activeTab.value)
  return Math.ceil(filtered.length / pageSize.value)
})

// Watch for tab changes
watch(activeTab, () => {
  currentPage.value = 1 // Reset page when tab changes
})

// Handle page change
function handlePageChange(page: number) {
  currentPage.value = page
}

// Remove from favorites
async function removeFavorite(id: number) {
  try {
    const { data } = await FavoriteService.removeFavorite(id)

    if (data.code === 200) {
      message.success('已从收藏中移除')

      // Remove item from local state
      const index = props.favorites.findIndex(item => item.id === id)
      if (index !== -1) {
        props.favorites.splice(index, 1)
      }
    } else {
      message.error(data.message || '移除收藏失败')
    }
  } catch (error) {
    message.error('移除收藏失败，请检查网络连接')
    console.error('Error removing favorite:', error)
  }
}

// Contact vendor
function contactVendor(vendorId: number) {
  router.push(`/messages?vendorId=${vendorId}`)
}

// Create order
function createOrder(item: FavoriteItem) {
  router.push({
    path: '/order/create',
    query: {
      vendorId: item.vendorId.toString(),
      type: item.type,
      productId: item.id.toString(),
    },
  })
}

// Navigate to detail
function navigateToDetail(item: FavoriteItem) {
  let path = ''

  switch (item.type) {
    case 'photography':
      path = `/photography/${item.id}`
      break
    case 'hotel':
      path = `/hotel/${item.id}`
      break
    case 'host':
      path = `/host/${item.id}`
      break
    default:
      break
  }

  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div>
    <NCard title="我的收藏" class="mb-4">
      <template #header-extra>
        <NTabs v-model:value="activeTab">
          <NTab name="photography">
            婚纱摄影
          </NTab>
          <NTab name="hotel">
            婚宴酒店
          </NTab>
          <NTab name="host">
            司仪主持
          </NTab>
        </NTabs>
      </template>

      <div v-if="filteredFavorites.length === 0" class="text-center py-16">
        <Heart class="mx-auto mb-4 text-gray-300" :size="48" />
        <p class="text-gray-500">
          暂无相关收藏
        </p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FavoriteCard
            v-for="item in filteredFavorites"
            :key="item.id"
            :item="item"
            :type="activeTab"
            @remove="removeFavorite"
            @contact="contactVendor"
            @order="createOrder"
            @navigate="navigateToDetail"
          />
        </div>

        <div class="mt-4 flex justify-center">
          <NPagination
            v-model:page="currentPage"
            :page-count="totalPages"
            :page-size="pageSize"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </NCard>
  </div>
</template>
