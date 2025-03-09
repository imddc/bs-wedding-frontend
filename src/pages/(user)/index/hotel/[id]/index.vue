<!-- src/views/HotelDetail.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NSpin } from 'naive-ui'
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Hotel,
  ImageIcon,
  Info,
  MapPin,
  Maximize2,
  Star,
  Store,
  Users,
} from 'lucide-vue-next'
import { getHotelProduct } from '~/api/product'
import type { HotelProduct } from '~/api/product/type'
import OrderCreateModal, { useOrderCreateModal } from '~/components/order/OrderCreateModal'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const product = ref<HotelProduct | null>(null)

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
      window.$message.error('无效的酒店ID')
      return
    }

    const response = await getHotelProduct(id)
    if (response.success) {
      product.value = response.data
    } else {
      window.$message.error('获取酒店详情失败')
    }
  } catch (error) {
    console.error('获取酒店详情出错:', error)
    window.$message.error('获取酒店详情失败')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/hotel')
}

onMounted(() => {
  fetchProductDetail()
})
</script>

<template>
  <div class="hotel-detail-container">
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
        未找到酒店信息
      </div>
      <div v-else>
        <!-- 酒店横幅 -->
        <div class="relative h-[500px] mb-6 rounded-lg overflow-hidden">
          <img
            v-if="product.mainImage"
            :src="product.mainImage"
            :alt="product.productName"
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full bg-amber-50 flex items-center justify-center">
            <Hotel :size="80" class="text-amber-200" />
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
              <span>已接待 {{ product.sales }} 场婚宴</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧主要内容 -->
          <div class="lg:col-span-2">
            <!-- 酒店概览 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-amber-100">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-amber-800 flex items-center">
                    <Info class="mr-2" :size="20" />
                    酒店概览
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div class="mb-6">
                  <p class="text-gray-700 mb-4">
                    {{ product.description || '暂无描述' }}
                  </p>

                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div class="rounded-lg bg-amber-50 p-4">
                      <div class="flex items-center mb-2">
                        <Maximize2 class="text-amber-600 mr-2" :size="20" />
                        <span class="text-gray-700 font-medium">场地面积</span>
                      </div>
                      <div class="text-lg font-bold text-amber-800">
                        {{ product.venueSize ? `${product.venueSize}㎡` : '未设定' }}
                      </div>
                    </div>

                    <div class="rounded-lg bg-amber-50 p-4">
                      <div class="flex items-center mb-2">
                        <Users class="text-amber-600 mr-2" :size="20" />
                        <span class="text-gray-700 font-medium">容纳桌数</span>
                      </div>
                      <div class="text-lg font-bold text-amber-800">
                        {{ product.minTables && product.maxTables
                          ? `${product.minTables} - ${product.maxTables}桌`
                          : product.maxTables
                            ? `最多${product.maxTables}桌`
                            : '未设定' }}
                      </div>
                    </div>

                    <div class="rounded-lg bg-amber-50 p-4">
                      <div class="flex items-center mb-2">
                        <CalendarClock class="text-amber-600 mr-2" :size="20" />
                        <span class="text-gray-700 font-medium">经营年限</span>
                      </div>
                      <div class="text-lg font-bold text-amber-800">
                        {{ product.establishmentYears ? `${product.establishmentYears}年` : '未设定' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-6">
                  <h3 class="text-lg font-medium mb-3">
                    餐饮风格
                  </h3>
                  <div v-if="product.cateringStyleList && product.cateringStyleList.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="(style, index) in product.cateringStyleList"
                      :key="index"
                      class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                    >
                      {{ style }}
                    </span>
                  </div>
                  <div v-else class="text-gray-500">
                    暂无餐饮风格信息
                  </div>
                </div>

                <div v-if="product.tagsList && product.tagsList.length" class="border-t border-gray-100 pt-6 mt-6">
                  <h3 class="text-lg font-medium mb-3">
                    酒店特色
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in product.tagsList"
                      :key="index"
                      class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 图片展示 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-amber-100">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-amber-800 flex items-center">
                    <ImageIcon class="mr-2" :size="20" />
                    场地实景
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div v-if="product.subImagesList && product.subImagesList.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(img, index) in product.subImagesList"
                    :key="index"
                    class="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      :src="img"
                      :alt="`${product.productName} - 场景${index + 1}`"
                      class="w-full h-full object-cover hover:scale-105 transition duration-300"
                    >
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  暂无场地实景图片
                </div>
              </div>
            </div>

            <!-- 服务详情 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-amber-100">
                <div class="p-4">
                  <h2 class="text-xl font-bold text-amber-800 flex items-center">
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

          <!-- 右侧预约和商家信息 -->
          <div class="lg:col-span-1">
            <!-- 价格预约卡片 -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sticky top-4 border border-red-100/60">
              <div class="p-6">
                <!-- 价格区域 -->
                <div class="mb-8">
                  <div class="flex items-baseline">
                    <div class="text-4xl font-bold text-red-800">
                      ￥{{ product.price.toLocaleString() }}
                    </div>
                    <span class="text-base text-gray-500 font-normal ml-2">起</span>
                  </div>
                  <div class="mt-3 text-sm text-gray-500 bg-red-50/50 rounded-lg p-3 border border-red-100/60">
                    价格可能因日期、厅室和套餐选择而有所不同
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
                    @click="$router.push(`/merchant/${product.merchantId}`)"
                  >
                    <template #icon>
                      <Store :size="16" class="text-red-800" />
                    </template>
                    <span class="text-red-800 font-medium">查看商家详情</span>
                  </NButton>
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
.hotel-detail-container {
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
