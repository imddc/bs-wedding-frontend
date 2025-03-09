<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAvatar, NButton, NImage, NRate, NScrollbar, NSpace, NTabPane, NTabs, NTag } from 'naive-ui'
import { ChartArea, Circle } from 'lucide-vue-next'
import { getPhotographyProduct } from '~/api/product'
import type { PhotographyProduct } from '~/api/product/type'
import type { OrdersCreateParams } from '~/api/order/type'
import { useUserStore } from '~/stores'
import { createOrder } from '~/api/order'
import defaultAvatar from '~/assets/banner.png'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const product = ref<PhotographyProduct | null>(null)

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

const userStore = useUserStore()
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

const subImagesList = computed(() => {
  return product.value?.subImagesList ? product.value.subImagesList : []
})

function handleImageClick(image: string) {
  // 这里可以触发事件来更新主图
  // 实现逻辑

  console.log(image)
}

// 当前显示的图片
const currentImage = ref(product.value?.mainImage || '')

// 所有图片列表
const allImages = computed(() => {
  const subImages = product.value?.subImagesList ? product.value.subImagesList : []
  return [product.value?.mainImage || '', ...subImages]
})

// 标签列表
const tagsList = computed(() => {
  return product.value?.tagsList ? product.value.tagsList : []
})

// 服务列表
const servicesList = computed(() => {
  return product.value?.servicesList ? product.value.servicesList : []
})

// 格式化价格
function formatPrice(price: number) {
  return price.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 处理图片预览
function handlePreview(image: string) {
  // 使用 naive-ui 的 createImagePreview
}

// 处理联系商家
function handleContact() {
  // 实现联系商家逻辑
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- 左侧图片区域 -->
      <div class="w-full lg:w-[600px] flex flex-col gap-4">
        <!-- 主图 -->
        <div class="relative rounded-lg overflow-hidden">
          <NImage
            :src="currentImage"
            :alt="product?.productName"
            class="w-full aspect-[4/3] object-cover cursor-zoom-in"
            object-fit="cover"
            preview-disabled
            @click="handlePreview(currentImage)"
          />
          <div
            class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors
                      flex items-center justify-center opacity-0 hover:opacity-100"
          >
            hha
          </div>
        </div>

        <!-- 子图列表 -->
        <div class="w-full">
          <NScrollbar x-scrollable>
            <div class="flex gap-2 py-2">
              <div
                v-for="(image, index) in allImages"
                :key="index"
                class="w-24 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all"
                :class="[
                  currentImage === image ? 'border-primary' : 'border-transparent',
                ]"
                @click="currentImage = image"
              >
                <NImage
                  :src="image"
                  :alt="`${product?.productName}-${index + 1}`"
                  class="w-full aspect-square object-cover"
                  object-fit="cover"
                  preview-disabled
                />
              </div>
            </div>
          </NScrollbar>
        </div>
      </div>

      <!-- 右侧商品信息 -->
      <div class="flex-1 flex flex-col gap-6">
        <h1 class="text-2xl font-medium text-gray-900">
          {{ product?.productName }}
        </h1>

        <!-- 评分和销量 -->
        <div class="flex items-center gap-3 text-sm text-gray-500">
          <NRate :value="product?.rating" readonly size="small" />
          <span class="text-primary">{{ product?.rating }}</span>
          <span>销量 {{ product?.sales || 0 }}</span>
        </div>

        <!-- 价格 -->
        <div class="flex items-baseline gap-2">
          <span class="text-gray-600">价格</span>
          <span class="text-3xl font-semibold text-primary">
            ¥{{ formatPrice(product?.price || 0) }}
          </span>
        </div>

        <!-- 商品标签 -->
        <div v-if="product?.tagsList" class="py-2">
          <NSpace>
            <NTag
              v-for="tag in tagsList"
              :key="tag"
              size="small"
              :bordered="false"
              type="success"
            >
              {{ tag }}
            </NTag>
          </NSpace>
        </div>

        <!-- 服务承诺 -->
        <div v-if="product?.servicesList" class="border-t border-b py-4">
          <div class="text-gray-600 mb-2">
            服务承诺
          </div>
          <NSpace>
            <div
              v-for="service in servicesList"
              :key="service"
              class="flex items-center gap-1 text-sm text-gray-600"
            >
              <Circle />
              <span>{{ service }}</span>
            </div>
          </NSpace>
        </div>

        <!-- 商家信息 -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-3">
            <NAvatar
              :src="merchant?.avatar"
              :fallback-src="defaultAvatar"
              size="medium"
            />
            <div class="flex flex-col">
              <div class="font-medium">
                {{ merchant?.name }}
              </div>
              <div class="text-sm text-gray-500">
                经营年限：{{ product.establishmentYears }}年
              </div>
            </div>
          </div>
          <NButton type="primary" @click="handleContact">
            <template #icon>
              <ChartArea />
            </template>
            联系商家
          </NButton>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="mt-12">
      <NTabs type="line" animated>
        <NTabPane name="detail" tab="商品详情">
          <div v-html="product.detail" />
        </NTabPane>
        <NTabPane name="comments" tab="用户评价">
          <!-- 评价组件 -->
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>
