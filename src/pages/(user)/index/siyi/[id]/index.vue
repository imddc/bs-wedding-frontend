<!-- src/views/HostDetail.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
import OrderCreateModal, { useOrderCreateModal } from '~/components/order/OrderCreateModal'
import { handleImgUrl } from '~/utils/core'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const product = ref<HostProduct | null>(null)

// 使用 hook 管理预约逻辑
const { show, open, confirm, submitting } = useOrderCreateModal({
  productId: computed(() => product.value?.id || 0),
  merchantId: computed(() => product.value?.merchantId || 0),
})

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
                          :src="handleImgUrl(product.mainImage)"
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
                      :src="handleImgUrl(img)"
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
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sticky top-4 border border-red-100/60">
              <div class="p-6">
                <!-- 价格区域 -->
                <div class="mb-8">
                  <div class="flex items-baseline">
                    <div class="text-4xl font-bold text-red-800">
                      ￥{{ product.price.toLocaleString() }}
                    </div>
                    <span class="text-base text-gray-500 font-normal ml-2">/ 场</span>
                  </div>
                  <div class="mt-3 text-sm text-gray-500 bg-red-50/50 rounded-lg p-3 border border-red-100/60">
                    价格可能因婚礼时长、服务内容和档期而有所调整
                  </div>
                </div>

                <!-- 商家信息卡片 -->
                <div class="p-5 bg-gradient-to-br from-red-50/70 to-white rounded-xl border border-red-100/60 mb-8">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border-2 border-white shadow-sm">
                      <Store :size="24" class="text-red-600" />
                    </div>
                    <div class="flex flex-col">
                      <div class="font-medium text-gray-800">
                        {{ product.merchantName || '未知商家' }}
                      </div>
                      <div class="text-sm text-gray-500 mt-0.5">
                        经营年限：{{ product.establishmentYears || '未知' }}年
                      </div>
                    </div>
                  </div>
                  <NButton
                    type="default"
                    block
                    class="!bg-white/80 hover:!bg-white transition-colors border border-red-200/50"
                    @click="goToMerchant"
                  >
                    <template #icon>
                      <Store :size="16" class="text-red-800" />
                    </template>
                    <span class="text-red-800 font-medium">查看商家详情</span>
                  </NButton>
                </div>

                <!-- 主持特色 -->
                <div class="p-5 bg-red-50/30 rounded-xl border border-red-100/60 mb-8">
                  <h3 class="text-base font-medium text-gray-800 mb-4 flex items-center">
                    <Sparkles class="text-red-600 mr-2" :size="18" />
                    主持特色
                  </h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <Languages class="text-red-500 mr-2" :size="16" />
                      <span class="font-medium text-gray-700">语言能力:</span>
                      <span class="ml-2 text-gray-600">{{ product.languagesList ? product.languagesList.join('、') : '未设定' }}</span>
                    </div>
                    <div class="flex items-center">
                      <History class="text-red-500 mr-2" :size="16" />
                      <span class="font-medium text-gray-700">主持经验:</span>
                      <span class="ml-2 text-gray-600">{{ product.hostingExperience ? `${product.hostingExperience}年` : '未设定' }}</span>
                    </div>
                    <div class="flex items-center">
                      <CalendarClock class="text-red-500 mr-2" :size="16" />
                      <span class="font-medium text-gray-700">入行年份:</span>
                      <span class="ml-2 text-gray-600">{{ product.establishmentYears ? `${product.establishmentYears}年` : '未设定' }}</span>
                    </div>
                  </div>
                </div>

                <!-- 按钮组 -->
                <div class="space-y-4">
                  <NButton
                    type="primary"
                    block
                    size="large"
                    color="#991B1B"
                    :loading="submitting"
                    class="h-[52px] text-[15px] font-medium !bg-gradient-to-r from-red-800 via-red-700 to-red-800 hover:from-red-700 hover:via-red-600 hover:to-red-700 shadow-[0_2px_12px_rgba(185,28,28,0.2)] hover:shadow-[0_4px_16px_rgba(185,28,28,0.3)] transition-all duration-300 group"
                    @click="open"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div class="i-carbon-calendar-add text-xl opacity-90 group-hover:scale-110 transition-transform" />
                      <span class="tracking-wide">立即预定</span>
                    </div>
                  </NButton>
                </div>

                <!-- 服务内容 -->
                <div v-if="product.servicesMap" class="mt-8 pt-6 border-t border-red-100/60">
                  <h3 class="text-base font-medium text-gray-800 mb-4 flex items-center">
                    <Check class="text-red-600 mr-2" :size="18" />
                    服务内容
                  </h3>
                  <div class="space-y-3">
                    <div
                      v-for="(value, key) in product.servicesMap"
                      :key="key"
                      class="flex items-start"
                    >
                      <Check class="text-red-500 mr-2 flex-shrink-0 mt-1" :size="16" />
                      <div>
                        <span class="font-medium text-gray-700">{{ key }}:</span>
                        <span class="ml-1 text-gray-600">{{ value }}</span>
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

    <!-- 添加预约弹窗组件 -->
    <OrderCreateModal
      v-model:show="show"
      :loading="submitting"
      @confirm="confirm"
    />
  </div>
</template>

<style scoped>
.host-detail-container {
  background-color: #fef2f2; /* 更新背景色以匹配红色主题 */
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
