<!-- src/views/wedding-package/WeddingPackageDetail.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NEmpty,
  NSpin,
  NTabPane,
  NTabs,
  NTag,
} from 'naive-ui'
import {
  ArrowLeft,
  CalendarClock,
  Camera,
  Check,
  Coins,
  Gift,
  MapPin,
  Mic2,
  Star,
} from 'lucide-vue-next'
import { confirmWeddingPackage, getWeddingPackageDetail } from '~/api/weddingPackage'
import type { WeddingPackageDetail } from '~/api/weddingPackage/type'
import { WeddingPackageStatus, WeddingPackageStatusMap } from '~/constants/weddingPackage'
import { handleImgUrl } from '~/utils/core'

const route = useRoute()
const router = useRouter()

// 方案ID
const packageId = ref<number>(Number(route.params.id))

// 方案详情
const packageDetail = ref<WeddingPackageDetail | null>(null)

// 加载状态
const loading = ref(false)

// 激活的Tab
const activeTab = ref('overview')

// 获取婚礼方案详情
async function fetchPackageDetail() {
  loading.value = true
  try {
    const response = await getWeddingPackageDetail(packageId.value)
    if (response.success) {
      packageDetail.value = response.data
    } else {
      window.$message.error('获取婚礼方案详情失败')
    }
  } catch (error) {
    window.$message.error('获取婚礼方案详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回列表
function backToList() {
  router.push('/weddingPackage')
}

// 确认方案
async function handleConfirmPackage() {
  try {
    const response = await confirmWeddingPackage(packageId.value)
    if (response.success) {
      window.$message.success('婚礼方案已确认')
      fetchPackageDetail() // 重新获取数据
    } else {
      window.$message.error('确认方案失败')
    }
  } catch (error) {
    window.$message.error('确认方案失败')
    console.error(error)
  }
}

// 格式化预算显示
function formatBudget(budget: number): string {
  if (!budget)
    return '0元'
  if (budget >= 10000) {
    return `${(budget / 10000).toFixed(1)}万`
  }
  return `${budget}元`
}

// 获取状态标签类型
function getStatusTagType(status: number): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case WeddingPackageStatus.DRAFT:
      return 'warning'
    case WeddingPackageStatus.CONFIRMED:
      return 'success'
    default:
      return 'default'
  }
}

// 处理标签转换为数组
function handleTags(tags?: string | string[]): string[] {
  if (!tags)
    return []
  if (Array.isArray(tags))
    return tags
  return tags.split(',').filter(Boolean)
}

// 计算节省金额
const savedAmount = computed(() => {
  if (!packageDetail.value)
    return 0

  // 假设每个商品单独购买会贵5%
  const photography = packageDetail.value.photographyProduct?.price || 0
  const venue = packageDetail.value.venueProduct?.price || 0
  const host = packageDetail.value.hostProduct?.price || 0

  const fullPrice = photography * 1.05 + venue * 1.05 + host * 1.05
  return fullPrice - packageDetail.value.totalPrice
})

// 初始化
onMounted(() => {
  fetchPackageDetail()
})
</script>

<template>
  <div class="wedding-package-detail-container">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-pink-800">
          婚礼方案详情
        </h1>
        <NButton class="mr-2" @click="backToList">
          <template #icon>
            <ArrowLeft :size="16" />
          </template>
          返回列表
        </NButton>
      </div>

      <div v-if="loading" class="py-16 flex justify-center">
        <NSpin size="large" />
      </div>

      <div v-else-if="!packageDetail" class="py-16">
        <NEmpty description="未找到方案详情">
          <template #extra>
            <NButton @click="backToList">
              返回列表
            </NButton>
          </template>
        </NEmpty>
      </div>

      <div v-else>
        <!-- 方案概览卡片 -->
        <NCard class="mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h2 class="text-xl font-bold mr-3">
                  {{ packageDetail.packageName }}
                </h2>
                <NTag :type="getStatusTagType(packageDetail.status)">
                  {{ WeddingPackageStatusMap[packageDetail.status as keyof typeof WeddingPackageStatusMap] }}
                </NTag>
              </div>

              <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                <div class="flex items-center">
                  <MapPin :size="16" class="mr-1" />
                  <span>{{ packageDetail.location }}</span>
                </div>
                <div class="flex items-center">
                  <Coins :size="16" class="mr-1" />
                  <span>预算: {{ formatBudget(packageDetail.budget || 0) }}</span>
                </div>
                <div class="flex items-center">
                  <CalendarClock :size="16" class="mr-1" />
                  <span>{{ new Date(packageDetail.createTime).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 md:mt-0">
              <NButton
                v-if="packageDetail.status === WeddingPackageStatus.DRAFT"
                type="success"
                class="mr-2"
                @click="handleConfirmPackage"
              >
                确认方案
              </NButton>
            </div>
          </div>

          <NDivider />

          <!-- 方案总价 -->
          <div class="bg-pink-50 p-4 rounded-lg mb-4">
            <div class="flex flex-col md:flex-row justify-between">
              <div>
                <div class="text-gray-600 mb-1">
                  方案总价
                </div>
                <div class="text-2xl font-bold text-pink-700">
                  ¥{{ packageDetail.totalPrice.toLocaleString() }}
                </div>
                <div class="flex items-center mt-1 text-sm text-pink-600">
                  <Check :size="16" class="mr-1" />
                  <span>为您节省约 ¥{{ savedAmount.toFixed(0) }}</span>
                </div>
              </div>

              <div class="mt-4 md:mt-0 self-end">
                <div class="text-sm text-gray-600 mb-1">
                  包含三大核心服务
                </div>
                <div class="flex gap-2">
                  <NTag type="success">
                    婚纱摄影
                  </NTag>
                  <NTag type="info">
                    婚宴酒店
                  </NTag>
                  <NTag type="warning">
                    司仪主持
                  </NTag>
                </div>
              </div>
            </div>
          </div>

          <!-- 选项卡导航 -->
          <NTabs v-model:value="activeTab" type="line" animated>
            <NTabPane name="overview" tab="方案概览">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4">
                <!-- 婚纱摄影服务卡片 -->
                <NCard class="flex flex-col h-full border-pink-200 hover:shadow-md transition">
                  <template #header>
                    <div class="flex items-center text-pink-700">
                      <Camera :size="18" class="mr-2" />
                      <span class="font-bold">婚纱摄影</span>
                    </div>
                  </template>

                  <div class="mb-3 h-48 overflow-hidden rounded-lg">
                    <img
                      v-if="packageDetail.photographyProduct?.mainImage"
                      :src="handleImgUrl(packageDetail.photographyProduct.mainImage)"
                      :alt="packageDetail.photographyProduct.productName"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Camera class="text-gray-400" :size="48" />
                    </div>
                  </div>

                  <h3 class="text-lg font-bold mb-2">
                    {{ packageDetail.photographyProduct.productName }}
                  </h3>

                  <p v-if="packageDetail.photographyProduct.description" class="text-gray-600 text-sm mb-3">
                    {{ packageDetail.photographyProduct.description }}
                  </p>

                  <div class="mt-auto">
                    <div class="flex justify-between items-center">
                      <div class="text-lg font-semibold text-pink-700">
                        ¥{{ packageDetail.photographyProduct.price.toLocaleString() }}
                      </div>
                      <div class="flex items-center">
                        <Star :size="16" class="text-yellow-500 mr-1" />
                        <span>{{ packageDetail.photographyProduct.rating }}</span>
                      </div>
                    </div>

                    <div class="flex gap-2 flex-wrap mt-3">
                      <NTag v-if="packageDetail.photographyProduct.costumeCount" size="small">
                        {{ packageDetail.photographyProduct.costumeCount }}套服装
                      </NTag>
                      <NTag v-if="packageDetail.photographyProduct.photoCount" size="small">
                        {{ packageDetail.photographyProduct.photoCount }}张精修
                      </NTag>
                    </div>
                  </div>
                </NCard>

                <!-- 婚宴酒店服务卡片 -->
                <NCard class="flex flex-col h-full border-blue-200 hover:shadow-md transition">
                  <template #header>
                    <div class="flex items-center text-blue-700">
                      <MapPin :size="18" class="mr-2" />
                      <span class="font-bold">婚宴酒店</span>
                    </div>
                  </template>

                  <div class="mb-3 h-48 overflow-hidden rounded-lg">
                    <img
                      v-if="packageDetail.venueProduct?.mainImage"
                      :src="handleImgUrl(packageDetail.venueProduct.mainImage)"
                      :alt="packageDetail.venueProduct.productName"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MapPin class="text-gray-400" :size="48" />
                    </div>
                  </div>

                  <h3 class="text-lg font-bold mb-2">
                    {{ packageDetail.venueProduct.productName }}
                  </h3>

                  <p v-if="packageDetail.venueProduct.description" class="text-gray-600 text-sm mb-3">
                    {{ packageDetail.venueProduct.description }}
                  </p>

                  <div class="mt-auto">
                    <div class="flex justify-between items-center">
                      <div class="text-lg font-semibold text-blue-700">
                        ¥{{ packageDetail.venueProduct.price.toLocaleString() }}
                      </div>
                      <div class="flex items-center">
                        <Star :size="16" class="text-yellow-500 mr-1" />
                        <span>{{ packageDetail.venueProduct.rating }}</span>
                      </div>
                    </div>

                    <div class="flex gap-2 flex-wrap mt-3">
                      <NTag v-if="packageDetail.venueProduct.venueSize" size="small">
                        {{ packageDetail.venueProduct.venueSize }}㎡
                      </NTag>
                      <NTag v-if="packageDetail.venueProduct.maxTables" size="small">
                        最多{{ packageDetail.venueProduct.maxTables }}桌
                      </NTag>
                    </div>
                  </div>
                </NCard>

                <!-- 司仪主持服务卡片 -->
                <NCard class="flex flex-col h-full border-purple-200 hover:shadow-md transition">
                  <template #header>
                    <div class="flex items-center text-purple-700">
                      <Mic2 :size="18" class="mr-2" />
                      <span class="font-bold">司仪主持</span>
                    </div>
                  </template>

                  <div class="mb-3 h-48 overflow-hidden rounded-lg">
                    <img
                      v-if="packageDetail.hostProduct?.mainImage"
                      :src="handleImgUrl(packageDetail.hostProduct.mainImage)"
                      :alt="packageDetail.hostProduct.productName"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Mic2 class="text-gray-400" :size="48" />
                    </div>
                  </div>

                  <h3 class="text-lg font-bold mb-2">
                    {{ packageDetail.hostProduct.productName }}
                  </h3>

                  <p v-if="packageDetail.hostProduct.description" class="text-gray-600 text-sm mb-3">
                    {{ packageDetail.hostProduct.description }}
                  </p>

                  <div class="mt-auto">
                    <div class="flex justify-between items-center">
                      <div class="text-lg font-semibold text-purple-700">
                        ¥{{ packageDetail.hostProduct.price.toLocaleString() }}
                      </div>
                      <div class="flex items-center">
                        <Star :size="16" class="text-yellow-500 mr-1" />
                        <span>{{ packageDetail.hostProduct.rating }}</span>
                      </div>
                    </div>

                    <div class="flex gap-2 flex-wrap mt-3">
                      <NTag v-if="packageDetail.hostProduct.hostingExperience" size="small">
                        {{ packageDetail.hostProduct.hostingExperience }}年经验
                      </NTag>
                      <NTag v-if="packageDetail.hostProduct.hostingStyle" size="small">
                        {{ packageDetail.hostProduct.hostingStyle }}风格
                      </NTag>
                    </div>
                  </div>
                </NCard>
              </div>

              <!-- 方案详情说明 -->
              <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center mb-3">
                  <Gift :size="18" class="mr-2 text-pink-700" />
                  <h3 class="text-lg font-bold">
                    方案说明
                  </h3>
                </div>
                <p class="text-gray-600">
                  本方案为您精心搭配了优质的婚纱摄影、婚宴酒店和司仪主持服务，助您打造完美婚礼。一站式解决婚礼核心需求，享受折扣优惠，省心省力。方案内商品均可单独调整，如有特殊需求，请联系客服。
                </p>
              </div>
            </NTabPane>

            <NTabPane name="photography" tab="婚纱摄影详情">
              <div class="py-4">
                <NDescriptions title="婚纱摄影商品详情" bordered>
                  <NDescriptionsItem label="商品名称">
                    {{ packageDetail.photographyProduct.productName }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品价格">
                    ¥{{ packageDetail.photographyProduct.price.toLocaleString() }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="评分">
                    {{ packageDetail.photographyProduct.rating }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品分类">
                    {{ packageDetail.photographyProduct.categoryId }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="地点">
                    {{ packageDetail.photographyProduct.location || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="销量">
                    {{ packageDetail.photographyProduct.sales }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="服装套数">
                    {{ packageDetail.photographyProduct.costumeCount || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="精修照片数量">
                    {{ packageDetail.photographyProduct.photoCount || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="摄影师级别">
                    {{ packageDetail.photographyProduct.photographerLevel || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="标签" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(tag, index) in handleTags(packageDetail.photographyProduct.tagsList)"
                        :key="index"
                        size="small"
                      >
                        {{ tag }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="拍摄地点" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(location, index) in handleTags(packageDetail.photographyProduct.shootingLocationsList)"
                        :key="index"
                        size="small"
                      >
                        {{ location }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="详细介绍" :span="3">
                    <div class="whitespace-pre-line">
                      {{ packageDetail.photographyProduct.detail || '暂无详细介绍' }}
                    </div>
                  </NDescriptionsItem>
                </NDescriptions>
              </div>
            </NTabPane>

            <NTabPane name="venue" tab="婚宴酒店详情">
              <div class="py-4">
                <NDescriptions title="婚宴酒店商品详情" bordered>
                  <NDescriptionsItem label="商品名称">
                    {{ packageDetail.venueProduct.productName }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品价格">
                    ¥{{ packageDetail.venueProduct.price.toLocaleString() }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="评分">
                    {{ packageDetail.venueProduct.rating }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品分类">
                    {{ packageDetail.venueProduct.categoryId }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="地点">
                    {{ packageDetail.venueProduct.location || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="销量">
                    {{ packageDetail.venueProduct.sales }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="场地大小">
                    {{ packageDetail.venueProduct.venueSize || '未指定' }}㎡
                  </NDescriptionsItem>
                  <NDescriptionsItem label="最大桌数">
                    {{ packageDetail.venueProduct.maxTables || '未指定' }}桌
                  </NDescriptionsItem>
                  <NDescriptionsItem label="最小起订">
                    {{ packageDetail.venueProduct.minTables || '未指定' }}桌
                  </NDescriptionsItem>
                  <NDescriptionsItem label="标签" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(tag, index) in handleTags(packageDetail.venueProduct.tagsList)"
                        :key="index"
                        size="small"
                      >
                        {{ tag }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="餐饮风格" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(style, index) in handleTags(packageDetail.venueProduct.cateringStyleList)"
                        :key="index"
                        size="small"
                      >
                        {{ style }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="详细介绍" :span="3">
                    <div class="whitespace-pre-line">
                      {{ packageDetail.venueProduct.detail || '暂无详细介绍' }}
                    </div>
                  </NDescriptionsItem>
                </NDescriptions>
              </div>
            </NTabPane>

            <NTabPane name="host" tab="司仪主持详情">
              <div class="py-4">
                <NDescriptions title="司仪主持商品详情" bordered>
                  <NDescriptionsItem label="商品名称">
                    {{ packageDetail.hostProduct.productName }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品价格">
                    ¥{{ packageDetail.hostProduct.price.toLocaleString() }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="评分">
                    {{ packageDetail.hostProduct.rating }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="商品分类">
                    {{ packageDetail.hostProduct.categoryId }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="地点">
                    {{ packageDetail.hostProduct.location || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="销量">
                    {{ packageDetail.hostProduct.sales }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="主持经验">
                    {{ packageDetail.hostProduct.hostingExperience || '未指定' }}年
                  </NDescriptionsItem>
                  <NDescriptionsItem label="主持风格">
                    {{ packageDetail.hostProduct.hostingStyle || '未指定' }}
                  </NDescriptionsItem>
                  <NDescriptionsItem label="标签" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(tag, index) in handleTags(packageDetail.hostProduct.tagsList)"
                        :key="index"
                        size="small"
                      >
                        {{ tag }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="可用语言" :span="2">
                    <div class="flex flex-wrap gap-2">
                      <NTag
                        v-for="(lang, index) in handleTags(packageDetail.hostProduct.languagesList)"
                        :key="index"
                        size="small"
                      >
                        {{ lang }}
                      </NTag>
                    </div>
                  </NDescriptionsItem>
                  <NDescriptionsItem label="详细介绍" :span="3">
                    <div class="whitespace-pre-line">
                      {{ packageDetail.hostProduct.detail || '暂无详细介绍' }}
                    </div>
                  </NDescriptionsItem>
                </NDescriptions>
              </div>
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wedding-package-detail-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}
</style>
