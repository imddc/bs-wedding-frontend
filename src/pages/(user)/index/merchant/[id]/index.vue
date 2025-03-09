<!-- src/views/MerchantDetail.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NCard, NDivider, NEmpty, NSpin, NTabPane, NTabs, NTag } from 'naive-ui'
import { ArrowLeft, Camera, Heart, Hotel, MapPin, Phone, User, Users } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { getMerchantById } from '~/api/merchant'
import { getProducts } from '~/api/product'
import { checkFavoriteExists, createFavorite, deleteFavoriteByUserAndMerchant } from '~/api/favorite'
import { useUserStore } from '~/stores'
import { MerchantType } from '~/api/merchant/type'
import type { MerchantInfo } from '~/api/merchant/type'
import type { Product, ProductQueryParams } from '~/api/product/type'
import { handleImgUrl } from '~/utils/core'
import MerchantProductCard from '~/components/merchant/MerchantProductCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const merchantId = Number(route.params.id)

// 商家详情数据
const merchant = ref<MerchantInfo | null>(null)
const loading = ref(false)
const favorited = ref(false)
const favoriteLoading = ref(false)
const favoriteId = ref<number | null>(null)

// 获取商家详情
async function fetchMerchantDetail() {
  if (!merchantId)
    return

  loading.value = true
  try {
    const response = await getMerchantById(merchantId)
    if (response.success) {
      merchant.value = response.data
    } else {
      window.$message.error('获取商家详情失败')
    }
  } catch (error) {
    window.$message.error('获取商家详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回列表页
function goBack() {
  router.push('/merchant')
}

// 检查是否已收藏
async function checkIsFavorited() {
  if (!merchantId || !userInfo.value?.id)
    return

  try {
    const response = await checkFavoriteExists({
      userId: userInfo.value.id,
      merchantId,
    })

    if (response.success) {
      favorited.value = response.data
    }
  } catch (error) {
    console.error('检查收藏状态失败', error)
  }
}

// 收藏商家
async function toggleFavorite() {
  if (!userInfo.value?.id) {
    window.$message.warning('请先登录')
    return
  }

  if (favoriteLoading.value)
    return
  favoriteLoading.value = true

  try {
    if (favorited.value) {
      // 取消收藏
      const response = await deleteFavoriteByUserAndMerchant(userInfo.value.id, merchantId)
      if (response.success) {
        favorited.value = false
        window.$message.success('已取消收藏')
        // 更新收藏计数
        if (merchant.value) {
          merchant.value.favoriteCount = Math.max(0, merchant.value.favoriteCount - 1)
        }
      } else {
        window.$message.error('取消收藏失败')
      }
    } else {
      // 添加收藏
      const response = await createFavorite({
        userId: userInfo.value.id,
        merchantId,
      })

      if (response.success) {
        favorited.value = true
        favoriteId.value = response.data
        window.$message.success('收藏成功')
        // 更新收藏计数
        if (merchant.value) {
          merchant.value.favoriteCount += 1
        }
      } else {
        window.$message.error('收藏失败')
      }
    }

    checkIsFavorited()
  } catch (error) {
    window.$message.error('操作失败，请稍后重试')
    console.error('收藏操作失败', error)
  } finally {
    favoriteLoading.value = false
  }
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
      return User
  }
}

// 商家产品列表数据
const productList = ref<Product[]>([])
const productLoading = ref(false)

// 获取商家产品
async function fetchMerchantProducts() {
  if (!merchantId)
    return

  productLoading.value = true
  try {
    const params: ProductQueryParams = {
      merchantId: `${merchantId}`,
      status: 1, // 获取上架的产品
      pageSize: 10,
      pageNum: 1,
    }

    const response = await getProducts(params)
    if (response.success) {
      productList.value = response.data.list
    } else {
      window.$message.error('获取商家产品失败')
    }
  } catch (error) {
    window.$message.error('获取商家产品失败')
    console.error(error)
  } finally {
    productLoading.value = false
  }
}

function handleViewProduct(id: number) {
  // 根据商品类型跳转到不同的详情页
  const product = productList.value.find(p => p.id === id)
  if (!product)
    return

  const routeMap: Record<number, string> = {
    1: '/photography',
    2: '/hotel',
    3: '/siyi',
  }

  const route = routeMap[product.productType]
  if (route) {
    router.push(`${route}/${id}`)
  }
}

onMounted(() => {
  fetchMerchantDetail()
    .then(() => {
      // 获取商家详情成功后加载产品
      fetchMerchantProducts()
    })
    .then(() => {
      checkIsFavorited()
    })
})
</script>

<template>
  <div class="merchant-detail-container">
    <!-- 返回按钮 -->
    <div class="my-4 container mx-auto px-4">
      <NButton class="flex items-center" @click="goBack">
        <ArrowLeft class="mr-1" :size="16" />
        返回列表
      </NButton>
    </div>

    <div class="container mx-auto px-4">
      <div v-if="loading" class="py-16 flex justify-center">
        <NSpin size="large" />
      </div>

      <div v-else-if="!merchant" class="py-16">
        <NEmpty description="未找到商家信息" />
      </div>

      <div v-else class="flex flex-col md:flex-row gap-6">
        <!-- 左侧商家信息 -->
        <div class="w-full md:w-2/3">
          <!-- 商家基本信息卡片 -->
          <NCard class="mb-6">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/3 h-60 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="merchant.logo"
                  :src="handleImgUrl(merchant.logo)"
                  :alt="merchant.merchantName"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <component
                    :is="getMerchantTypeIcon(merchant.merchantType)"
                    class="text-gray-400"
                    :size="64"
                  />
                </div>
              </div>

              <div class="md:w-2/3 md:pl-6 pt-4 md:pt-0">
                <div class="flex justify-between items-start">
                  <h1 class="text-2xl font-bold merchant-name">
                    {{ merchant.merchantName }}
                  </h1>
                  <NButton
                    circle
                    :quaternary="!favorited"
                    :type="favorited ? 'error' : 'default'"
                    :loading="favoriteLoading"
                    @click="toggleFavorite"
                  >
                    <template #icon>
                      <Heart :fill="favorited ? '#e03131' : 'none'" />
                    </template>
                  </NButton>
                </div>

                <NTag :type="merchant.status === 1 ? 'success' : 'warning'" class="mt-2">
                  {{ merchant.statusName }}
                </NTag>
                <NTag type="info" class="ml-2">
                  {{ merchant.merchantTypeName }}
                </NTag>

                <p class="text-gray-600 my-4">
                  {{ merchant.description || '暂无商家描述' }}
                </p>

                <NDivider />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-if="merchant.city" class="flex items-center text-gray-600">
                    <MapPin :size="16" class="mr-2" />
                    <span>{{ merchant.city }}</span>
                  </div>
                  <div v-if="merchant.address" class="flex items-center text-gray-600">
                    <MapPin :size="16" class="mr-2" />
                    <span>{{ merchant.address }}</span>
                  </div>
                  <div v-if="merchant.contactPhone" class="flex items-center text-gray-600">
                    <Phone :size="16" class="mr-2" />
                    <span>{{ merchant.contactPhone }}</span>
                  </div>
                  <div v-if="merchant.contactPerson" class="flex items-center text-gray-600">
                    <User :size="16" class="mr-2" />
                    <span>{{ merchant.contactPerson }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div class="flex items-center">
                    <Heart class="text-red-500 mr-1" :size="16" />
                    <span>{{ merchant.favoriteCount }} 人收藏</span>
                  </div>
                  <div class="text-gray-500 text-sm">
                    入驻时间：{{ new Date(merchant.createTime).toLocaleDateString() }}
                  </div>
                </div>
              </div>
            </div>
          </NCard>

          <!-- 商家详情标签页 -->
          <NCard>
            <NTabs type="line" animated>
              <NTabPane name="products" tab="产品服务">
                <div v-if="productLoading" class="py-8 flex justify-center">
                  <NSpin size="medium" />
                </div>
                <div v-else-if="productList.length === 0" class="py-8 text-center text-gray-500">
                  暂无产品服务
                </div>
                <div v-else class="space-y-4">
                  <MerchantProductCard
                    v-for="product in productList"
                    :key="product.id"
                    :product="product"
                    :merchant-type="merchant?.merchantType"
                    @view-details="handleViewProduct"
                  />
                </div>
              </NTabPane>

              <NTabPane name="about" tab="商家介绍">
                <div class="prose max-w-none">
                  <div v-if="merchant.description" class="mb-6">
                    <h3 class="text-lg font-bold mb-2">
                      关于我们
                    </h3>
                    <p class="whitespace-pre-line">
                      {{ merchant.description }}
                    </p>
                  </div>
                  <div v-else class="py-8 text-center text-gray-500">
                    商家暂未提供详细介绍
                  </div>
                </div>
              </NTabPane>
            </NTabs>
          </NCard>
        </div>

        <!-- 右侧边栏 -->
        <div class="w-full md:w-1/3">
          <!-- 联系卡片 -->
          <NCard title="联系商家" class="mb-6">
            <div class="space-y-4">
              <div v-if="merchant.contactPhone" class="flex items-center">
                <Phone :size="18" class="mr-2 text-red-600" />
                <span class="font-medium">{{ merchant.contactPhone }}</span>
              </div>
              <div v-if="merchant.contactPerson" class="flex items-center">
                <User :size="18" class="mr-2 text-red-600" />
                <span>联系人：{{ merchant.contactPerson }}</span>
              </div>
              <NButton
                block
                type="primary"
                color="#B91C1C"
                class="mt-2"
              >
                在线咨询
              </NButton>
            </div>
          </NCard>

          <!-- 地址卡片 -->
          <NCard v-if="merchant.address" title="商家地址" class="mb-6">
            <div class="space-y-3">
              <div class="flex items-start">
                <MapPin :size="18" class="mr-2 mt-1 flex-shrink-0 text-red-600" />
                <div>
                  <div v-if="merchant.city" class="text-gray-800 mb-1">
                    {{ merchant.city }}
                  </div>
                  <div class="text-gray-600">
                    {{ merchant.address }}
                  </div>
                </div>
              </div>
            </div>
          </NCard>

          <!-- 推荐商家 -->
          <NCard title="类似商家推荐">
            <div class="space-y-3">
              <div class="text-center text-gray-500 py-4">
                暂无推荐商家
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merchant-detail-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

/* 中国风元素 */
.merchant-name {
  font-family: 'STZhongsong', 'SimSun', serif;
}

/* 自定义红色边框效果 */
.n-card {
  transition: all 0.3s ease;
}

.n-card:hover {
  border-color: rgba(185, 28, 28, 0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 水墨效果边角 */
.n-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle at top right, transparent 8px, rgba(185, 28, 28, 0.05) 8px);
}
</style>
