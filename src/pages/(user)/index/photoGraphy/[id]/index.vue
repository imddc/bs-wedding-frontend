<!-- src/views/PhotographyDetail.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAvatar, NButton, NSpin } from 'naive-ui'
import {
  ArrowLeft,
  ChartArea,
  FileText,
  ImageIcon,
  MapPin,
  Star,
} from 'lucide-vue-next'
import { getPhotographyProduct } from '~/api/product'
import type { PhotographyProduct } from '~/api/product/type'
import defaultAvatar from '~/assets/banner.png'
import OrderCreateModal from '~/components/order/OrderCreateModal/index.vue'
import { useOrderCreateModal } from '~/components/order/OrderCreateModal'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const product = ref<PhotographyProduct | null>(null)

const { show, open, confirm, submitting } = useOrderCreateModal({
  productId: computed(() => product.value?.id || 0),
  merchantId: computed(() => product.value?.merchantId || 0),
})

async function fetchProductDetail() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) {
      window.$message.error('无效的商品ID')
      return
    }

    const response = await getPhotographyProduct(id)
    if (response.success) {
      product.value = response.data
    } else {
      window.$message.error('获取商品详情失败')
    }
  } catch (error) {
    console.error('获取商品详情出错:', error)
    window.$message.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/photography')
}

onMounted(() => {
  fetchProductDetail()
})

// 图片相关
const allImages = computed(() => {
  const mainImage = product.value?.mainImage || ''
  const subImages = product.value?.subImagesList ? product.value.subImagesList : []
  return [mainImage, ...subImages]
})

// 格式化价格
function formatPrice(price: number) {
  return price.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 处理查看商家详情
function handleMerchantDetail() {
  // 实现查看商家详情逻辑
  router.push(`/merchant/${product.value?.merchantId}`)
}
</script>

<template>
  <div class="photography-detail-container">
    <div class="container mx-auto px-4 py-6">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <NButton class="flex items-center" @click="goBack">
          <ArrowLeft class="mr-1" :size="16" />
          返回列表
        </NButton>
      </div>

      <div v-if="loading" class="py-16 flex justify-center">
        <NSpin size="large" />
      </div>
      <div v-else-if="!product" class="py-16 text-center text-gray-500">
        未找到摄影作品信息
      </div>
      <div v-else>
        <!-- 摄影作品横幅 -->
        <div class="relative h-[500px] mb-6 rounded-lg overflow-hidden">
          <img
            v-if="product.mainImage"
            :src="product.mainImage"
            :alt="product.productName"
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full bg-red-50 flex items-center justify-center">
            <ImageIcon :size="80" class="text-red-200" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 class="text-3xl font-bold mb-2">
              {{ product.productName }}
            </h1>
            <div class="flex items-center text-sm mb-1">
              <MapPin :size="16" class="mr-1" />
              <span>{{ product.location || '未设定地区' }}</span>
              <span class="mx-2">•</span>
              <span>{{ product.establishmentYears ? `${product.establishmentYears}年历史` : '' }}</span>
            </div>
            <div class="flex items-center">
              <div class="flex items-center">
                <Star class="text-yellow-400" :size="16" />
                <span class="ml-1">{{ product.rating }}</span>
              </div>
              <span class="mx-2">•</span>
              <span>已完成 {{ product.sales }} 场婚纱摄影</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧主要内容 -->
          <div class="lg:col-span-2">
            <!-- 服务详情 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-red-100">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-red-800 flex items-center">
                    <FileText class="mr-2" :size="20" />
                    详细介绍
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div v-if="product.detail" class="rich-text" v-html="product.detail" />
                <div v-else class="text-center py-8 text-gray-500">
                  暂无详细介绍
                </div>
              </div>
            </div>

            <!-- 图片展示 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-red-100">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-red-800 flex items-center">
                    <ImageIcon class="mr-2" :size="20" />
                    作品展示
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div v-if="allImages.length > 1" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(img, index) in allImages"
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      :src="img"
                      :alt="`${product.productName} - 作品${index + 1}`"
                      class="w-full h-full object-cover hover:scale-105 transition duration-300"
                    >
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  暂无作品展示图片
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧预约和商家信息 -->
          <div class="lg:col-span-1">
            <!-- 价格预约卡片 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sticky top-4 border border-red-100/60">
              <div class="p-6">
                <!-- 价格区域 -->
                <div class="mb-8">
                  <div class="text-4xl font-bold text-red-800 mb-2 flex items-baseline">
                    ￥{{ formatPrice(product.price || 0) }}
                    <span class="text-base text-gray-500 font-normal ml-2">起</span>
                  </div>
                  <div class="text-sm text-gray-500 bg-red-50/50 rounded-lg p-3 border border-red-100/60">
                    价格可能因拍摄季节、时长和套餐选择而有所不同
                  </div>
                </div>

                <!-- 商家信息卡片 -->
                <div class="p-5 bg-gradient-to-br from-red-50/70 to-white rounded-xl border border-red-100/60 mb-8">
                  <div class="flex items-center gap-4 mb-4">
                    <NAvatar
                      :src="product.merchant?.avatar"
                      :fallback-src="defaultAvatar"
                      size="large"
                      round
                      class="border-2 border-white shadow-sm"
                    />
                    <div class="flex flex-col">
                      <div class="font-medium text-gray-800">
                        {{ product.merchant?.name || '未知商家' }}
                      </div>
                      <div class="text-sm text-gray-500 mt-0.5">
                        经营年限：{{ product.establishmentYears || '未知' }}年
                      </div>
                    </div>
                  </div>
                  <NButton
                    type="default"
                    block
                    class="!bg-gradient-to-r from-red-50 to-white hover:from-red-100/80 hover:to-white/90 border border-red-200/50 transition-all duration-300"
                    @click="handleMerchantDetail"
                  >
                    <template #icon>
                      <ChartArea :size="16" class="text-red-800" />
                    </template>
                    <span class="text-red-800 font-medium">查看商家详情</span>
                  </NButton>
                </div>

                <!-- 按钮组 -->
                <div class="space-y-4 mt-8">
                  <NButton
                    type="primary"
                    block
                    size="large"
                    :loading="submitting"
                    class="h-[52px] text-[15px] font-medium !bg-gradient-to-r from-red-800 via-red-700 to-red-800 hover:from-red-700 hover:via-red-600 hover:to-red-700 shadow-[0_2px_12px_rgba(185,28,28,0.2)] hover:shadow-[0_4px_16px_rgba(185,28,28,0.3)] transition-all duration-300 group"
                    @click="open"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div class="text-xl opacity-90 group-hover:scale-110 transition-transform" />
                      <span class="tracking-wide">立即预定</span>
                    </div>
                  </NButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用提取的组件 -->
    <OrderCreateModal
      v-model:show="show"
      :loading="submitting"
      @confirm="confirm"
    />
  </div>
</template>

<style scoped>
.photography-detail-container {
  background-color: #fef2f2;
  min-height: 100vh;
}

.rich-text img {
  max-width: 100%;
  height: auto;
}

/* 中国风细节 */
h1,
h2,
h3 {
  font-family: 'STZhongsong', 'SimSun', serif;
}

/* 添加弹窗样式 */
:deep(.n-modal) {
  --n-title-font-size: 18px;
  --n-title-font-weight: 600;
  --n-title-text-color: rgb(153, 27, 27);
}

:deep(.n-form-item-label) {
  font-size: 15px;
  font-weight: 500;
}
</style>
