<!-- src/views/MyFavorites.vue -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NEmpty, NPagination, NSpin, NTabPane, NTabs } from 'naive-ui'
import { Camera, Heart, Hotel, Image, MapPin, TrashIcon, Users } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  deleteFavoriteByUserAndMerchant,
  pageFavorites,
} from '~/api/favorite'
import { getMerchantById } from '~/api/merchant'
import type { Favorite, FavoriteQueryParams } from '~/api/favorite/type'
import { MerchantType } from '~/api/merchant/type'
import type { MerchantInfo } from '~/api/merchant/type'
import { useUserStore } from '~/stores'

const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 收藏列表数据
const favorites = ref<Favorite[]>([])
const merchants = ref<MerchantInfo[]>([])
const loading = ref(false)
const deletingId = ref<number | null>(null)

// 分页参数
const pagination = reactive({
  current: 1,
  size: 8,
  total: 0,
  pages: 0,
})

// 查询参数
const queryParams = reactive<FavoriteQueryParams>({
  userId: userInfo.value?.id,
  current: 1,
  size: 8,
})

// 筛选后的商家
const filteredMerchants = computed(() => {
  return merchants.value
})

// 获取收藏列表
async function fetchFavorites() {
  loading.value = true
  merchants.value = [] // 清空现有商家列表

  try {
    const response = await pageFavorites(queryParams)
    if (response.success && response.data) {
      favorites.value = response.data.records
      pagination.total = response.data.total
      pagination.pages = response.data.pages
      pagination.current = response.data.current
      pagination.size = response.data.size

      // 获取每个收藏对应的商家详情
      await fetchMerchantDetails()
    } else {
      window.$message.error('获取收藏列表失败')
    }
  } catch (error) {
    window.$message.error('获取收藏列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取商家详情
async function fetchMerchantDetails() {
  if (favorites.value.length === 0)
    return

  const promises = favorites.value.map(async (favorite) => {
    try {
      const response = await getMerchantById(favorite.merchantId)
      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error(`获取商家(ID:${favorite.merchantId})详情失败`, error)
      return null
    }
  })

  const results = await Promise.all(promises)
  merchants.value = results.filter((item): item is MerchantInfo => item !== null)
}

// 取消收藏
async function handleCancelFavorite(merchantId: number) {
  deletingId.value = merchantId

  try {
    const response = await deleteFavoriteByUserAndMerchant(userInfo.value!.id, merchantId)
    if (response.success) {
      window.$message.success('已取消收藏')
      // 更新列表
      favorites.value = favorites.value.filter(f => f.merchantId !== merchantId)
      merchants.value = merchants.value.filter(m => m.id !== merchantId)

      // 如果当前页没有数据且不是第一页，则跳转到上一页
      if (merchants.value.length === 0 && pagination.current > 1) {
        queryParams.current = pagination.current - 1
        await fetchFavorites()
      } else if (pagination.total > 0) {
        // 更新总数
        pagination.total -= 1
      }
    } else {
      window.$message.error('取消收藏失败')
    }
  } catch (error) {
    window.$message.error('取消收藏失败')
    console.error(error)
  } finally {
    deletingId.value = null
  }
}

// 查看商家详情
function viewMerchantDetail(id: number) {
  router.push(`/merchant/${id}`)
}

// 获取商家类型图标
function getMerchantTypeIcon(type?: MerchantType) {
  switch (type) {
    case MerchantType.PHOTOGRAPHY:
      return Camera
    case MerchantType.HOTEL:
      return Hotel
    case MerchantType.HOST:
      return Users
    default:
      return Image
  }
}

// 页码变更
function handlePageChange(page: number) {
  queryParams.current = page
  fetchFavorites()
}

onMounted(() => {
  fetchFavorites()
})
</script>

<template>
  <div class="favorites-container">
    <!-- 头部横幅 -->
    <div
      class="banner relative h-48 bg-gradient-to-r from-red-800 to-red-600 mb-8 overflow-hidden"
    >
      <div class="container mx-auto px-4 h-full flex flex-col justify-center z-10 relative">
        <h1 class="text-3xl font-bold text-white mb-2">
          我的收藏
        </h1>
        <p class="text-xl text-white opacity-90">
          您收藏的精选商家一览
        </p>
      </div>
      <div class="absolute right-0 bottom-0 opacity-20">
        <Heart :size="120" color="white" />
      </div>
    </div>

    <div class="container mx-auto px-4 pb-8">
      <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <NTabs type="line" animated>
          <NTabPane name="all" tab="全部收藏">
            <div v-if="loading" class="py-16 flex justify-center">
              <NSpin size="large" />
            </div>

            <div v-else-if="merchants.length === 0" class="py-16 flex flex-col items-center justify-center">
              <NEmpty description="暂无收藏的商家" />
              <NButton
                class="mt-4"
                type="primary"
                color="#B91C1C"
                @click="router.push('/merchant')"
              >
                去浏览商家
              </NButton>
            </div>

            <div v-else>
              <!-- 收藏列表 -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div
                  v-for="merchant in filteredMerchants"
                  :key="merchant.id"
                  class="favorite-card bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition relative"
                >
                  <!-- 取消收藏按钮 -->
                  <div class="absolute top-2 right-2 z-10">
                    <NButton
                      circle
                      tertiary
                      type="error"
                      size="small"
                      :loading="deletingId === merchant.id"
                      @click.stop="handleCancelFavorite(merchant.id)"
                    >
                      <template #icon>
                        <TrashIcon :size="16" />
                      </template>
                    </NButton>
                  </div>

                  <div
                    class="h-40 bg-gray-100 overflow-hidden cursor-pointer"
                    @click="viewMerchantDetail(merchant.id)"
                  >
                    <img
                      v-if="merchant.logo"
                      :src="merchant.logo"
                      :alt="merchant.merchantName"
                      class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <component
                        :is="getMerchantTypeIcon(merchant.merchantType)"
                        class="text-gray-400"
                        :size="48"
                      />
                    </div>
                  </div>

                  <div class="p-4 cursor-pointer" @click="viewMerchantDetail(merchant.id)">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-bold line-clamp-1">
                        {{ merchant.merchantName }}
                      </h3>
                      <Heart class="text-red-500" :size="18" fill="#ef4444" />
                    </div>

                    <div class="flex items-center text-sm text-gray-500 mt-2 mb-1">
                      <MapPin :size="14" class="mr-1" />
                      <span>{{ merchant.city || '未知地区' }}</span>
                    </div>

                    <p class="text-gray-600 text-sm mb-2 line-clamp-2 h-10">
                      {{ merchant.description || '暂无描述' }}
                    </p>

                    <div class="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div class="text-xs text-gray-500">
                        收藏于: {{ new Date(
                          favorites.find(f => f.merchantId === merchant.id)?.createTime || '',
                        ).toLocaleDateString() }}
                      </div>
                      <div class="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">
                        {{ merchant.merchantTypeName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分页 -->
              <div v-if="pagination.total > 0" class="mt-6 flex justify-center">
                <NPagination
                  v-model:page="pagination.current"
                  :page-count="pagination.pages"
                  :page-size="pagination.size"
                  :item-count="pagination.total"
                  @update:page="handlePageChange"
                />
              </div>
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

/* 中国风细节 */
.banner h1 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

.favorite-card {
  transition: all 0.3s ease;
}

.favorite-card:hover {
  border-color: #dc2626;
}

/* 红色水墨边角效果 */
.favorite-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 12px 12px;
  border-color: transparent transparent rgba(220, 38, 38, 0.1) transparent;
  transition: all 0.3s ease;
}

.favorite-card:hover::after {
  border-width: 0 0 20px 20px;
  border-color: transparent transparent rgba(220, 38, 38, 0.2) transparent;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .banner {
    height: 10rem;
  }

  .banner h1 {
    font-size: 1.75rem;
  }

  .banner p {
    font-size: 1rem;
  }
}
</style>
