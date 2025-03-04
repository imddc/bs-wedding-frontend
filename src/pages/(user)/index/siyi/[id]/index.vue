<!-- src/views/HostDetail.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NSpin } from 'naive-ui'
import {
  ArrowLeft,
  CalendarClock,
  Check,
  FileText,
  History,
  Languages,
  Sparkles,
  Star,
  Store,
  User,
  Video,
} from 'lucide-vue-next'
import { getHostProduct } from '~/api/product'
import type { HostProduct } from '~/api/product/type'
import { createOrder } from '~/api/order'
import type { OrdersCreateParams } from '~/api/order/type'
import { useUserStore } from '~/stores/userStore'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const product = ref<HostProduct | null>(null)
const userStore = useUserStore()

async function fetchProductDetail() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    if (Number.isNaN(id)) {
      window.$message.error('无效的司仪ID')
      return
    }

    const response = await getHostProduct(id)
    if (response.success) {
      product.value = response.data
    } else {
      window.$message.error('获取司仪详情失败')
    }
  } catch (error) {
    console.error('获取司仪详情出错:', error)
    window.$message.error('获取司仪详情失败')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/siyi')
}

function goToMerchant() {
  if (product.value?.merchantId) {
    router.push(`/merchant/${product.value.merchantId}`)
  } else {
    window.$message.warning('商家信息不可用')
  }
}

onMounted(() => {
  fetchProductDetail()
})

async function handleBooking() {
  const order: OrdersCreateParams = {
    productId: product.value?.id || 0,
    merchantId: product.value?.merchantId || 0,
    userId: userStore.userInfo?.id || 0,
    weddingDate: '',
    remark: '',
  }

  // 调用订单接口
  const response = await createOrder(order)
  if (response.success) {
    router.push(`/order/${response.data}`)
  } else {
    window.$message.error('预订失败')
  }
}
</script>

<template>
  <div class="host-detail-container">
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
        未找到司仪信息
      </div>
      <div v-else>
        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 左侧：司仪信息 -->
          <div class="lg:col-span-8">
            <!-- 司仪简介卡片 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="relative h-64 bg-gradient-to-r from-indigo-800 to-indigo-600">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="relative inline-block">
                      <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                          v-if="product.mainImage"
                          :src="product.mainImage"
                          :alt="product.productName"
                          class="w-full h-full object-cover"
                        >
                        <div v-else class="w-full h-full bg-indigo-200 flex items-center justify-center">
                          <User :size="48" class="text-indigo-400" />
                        </div>
                      </div>
                    </div>
                    <h1 class="text-3xl font-bold text-white mt-4">
                      {{ product.productName }}
                    </h1>
                    <div class="flex items-center justify-center text-white mt-2">
                      <div class="flex items-center mx-2">
                        <Star class="text-yellow-400" :size="16" />
                        <span class="ml-1">{{ product.rating }}</span>
                      </div>
                      <div class="mx-2">
                        |
                      </div>
                      <div class="mx-2">
                        {{ product.sales }}场经验
                      </div>
                      <div class="mx-2">
                        |
                      </div>
                      <div class="mx-2">
                        {{ product.location || '未知' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="flex flex-wrap gap-4 mb-6">
                  <div class="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                    <History class="text-indigo-600 mr-2" :size="18" />
                    <div>
                      <div class="text-sm text-gray-500">
                        主持经验
                      </div>
                      <div class="font-medium">
                        {{ product.hostingExperience ? `${product.hostingExperience}年` : '未设定' }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                    <Sparkles class="text-indigo-600 mr-2" :size="18" />
                    <div>
                      <div class="text-sm text-gray-500">
                        主持风格
                      </div>
                      <div class="font-medium">
                        {{ product.hostingStyle || '未设定' }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                    <Languages class="text-indigo-600 mr-2" :size="18" />
                    <div>
                      <div class="text-sm text-gray-500">
                        语言能力
                      </div>
                      <div class="font-medium">
                        {{ product.languagesList ? product.languagesList.join('、') : '未设定' }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                    <CalendarClock class="text-indigo-600 mr-2" :size="18" />
                    <div>
                      <div class="text-sm text-gray-500">
                        入行年份
                      </div>
                      <div class="font-medium">
                        {{ product.establishmentYears ? `${product.establishmentYears}年` : '未设定' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-6">
                  <h2 class="text-xl font-bold mb-3 text-gray-800">
                    个人简介
                  </h2>
                  <p class="text-gray-700">
                    {{ product.description || '暂无简介' }}
                  </p>
                </div>

                <div v-if="product.tagsList && product.tagsList.length" class="mb-6">
                  <h2 class="text-xl font-bold mb-3 text-gray-800">
                    个人特色
                  </h2>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in product.tagsList"
                      :key="index"
                      class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 作品展示 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-gray-200">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-gray-800 flex items-center">
                    <Video class="mr-2" :size="20" />
                    作品展示
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div v-if="product.subImagesList && product.subImagesList.length" class="grid grid-cols-1 gap-6">
                  <div
                    v-for="(img, index) in product.subImagesList"
                    :key="index"
                    class="rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      :src="img"
                      :alt="`${product.productName} - 作品${index + 1}`"
                      class="w-full object-cover"
                    >
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500 italic">
                  暂无作品展示，请联系司仪了解更多
                </div>
              </div>
            </div>

            <!-- 详细介绍 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-gray-200">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-gray-800 flex items-center">
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
          </div>

          <!-- 右侧：预约和商家信息 -->
          <div class="lg:col-span-4">
            <!-- 价格预约卡片 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6 sticky top-4">
              <div class="bg-indigo-50 p-6">
                <!-- 简化价格展示 -->
                <div class="flex items-end gap-2 mb-4">
                  <div class="text-3xl font-bold text-indigo-700">
                    ￥{{ product.price.toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-500">
                    / 场
                  </div>
                </div>

                <!-- 优化预订按钮 -->
                <NButton
                  type="primary"
                  block
                  size="large"
                  color="#4F46E5"
                  class="mt-2 hover:bg-indigo-700 transition-colors font-medium text-base"
                  @click="handleBooking"
                >
                  立即预订
                </NButton>

                <!-- 简单提示信息 -->
                <div class="mt-4 text-center text-xs text-gray-500">
                  <div class="flex justify-center gap-2">
                    <span>支持退款</span>
                    <span>|</span>
                    <span>平台担保</span>
                    <span>|</span>
                    <span>专业服务</span>
                  </div>
                </div>
              </div>

              <!-- 商家信息 -->
              <div class="p-6 border-t border-gray-200">
                <h3 class="font-bold text-lg mb-4">
                  商家信息
                </h3>

                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Store :size="24" class="text-indigo-500" />
                  </div>
                  <div>
                    <div class="font-bold">
                      {{ product.merchantName || '暂无商家信息' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      ID: {{ product.merchantId }}
                    </div>
                  </div>
                </div>

                <NButton
                  class="w-full mb-4"
                  type="default"
                  :disabled="!product.merchantId"
                  @click="goToMerchant"
                >
                  <div class="flex items-center justify-center">
                    <Store class="mr-2" :size="16" />
                    查看商家详情
                  </div>
                </NButton>

                <div v-if="product.servicesMap" class="border-t border-gray-100 pt-4 mt-4">
                  <div class="text-sm text-gray-500 mb-2">
                    提供服务
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(value, key) in product.servicesMap"
                      :key="key"
                      class="flex items-start"
                    >
                      <Check class="text-green-500 mr-2 flex-shrink-0 mt-1" :size="16" />
                      <div>
                        <span class="font-medium">{{ key }}:</span> {{ value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.host-detail-container {
  background-color: #f9f8f6;
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
</style>
