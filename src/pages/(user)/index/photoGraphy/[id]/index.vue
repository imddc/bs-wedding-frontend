<!-- src/views/PhotographyDetail.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NCarousel, NCarouselItem, NSpin } from 'naive-ui'
import { ArrowLeft, Award, Calendar, Camera, Check, Info, MapPin, MessageCircle, Shirt, Star, Store } from 'lucide-vue-next'
import { getPhotographyProduct } from '~/api/product'
import type { PhotographyProduct } from '~/api/product/type'

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
        未找到商品信息
      </div>
      <div v-else>
        <!-- 商品概览 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- 主图和轮播图 -->
            <div class="relative">
              <div v-if="product.mainImage || product.subImagesList?.length" class="h-96">
                <NCarousel
                  effect="fade"
                  dot-type="line"
                  autoplay
                  :interval="4000"
                  show-arrow
                >
                  <NCarouselItem v-if="product.mainImage">
                    <div class="h-96 w-full">
                      <img
                        :src="product.mainImage"
                        :alt="product.productName"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </NCarouselItem>
                  <NCarouselItem v-for="(img, index) in product.subImagesList" :key="index">
                    <div class="h-96 w-full">
                      <img
                        :src="img"
                        :alt="`${product.productName} - 图片${index + 1}`"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </NCarouselItem>
                </NCarousel>
              </div>
              <div v-else class="bg-gray-100 h-96 flex items-center justify-center">
                <Camera :size="64" class="text-gray-300" />
              </div>
              <div v-if="product.sales > 100" class="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                热销产品
              </div>
            </div>

            <!-- 商品信息 -->
            <div class="p-6 flex flex-col">
              <h1 class="text-2xl font-bold mb-2">
                {{ product.productName }}
              </h1>

              <div class="flex items-center mb-4">
                <div class="flex items-center">
                  <Star class="text-yellow-400" :size="20" />
                  <span class="ml-1 text-lg font-medium">{{ product.rating }}</span>
                </div>
                <div class="mx-4 text-gray-300">
                  |
                </div>
                <div class="text-gray-600">
                  已售 {{ product.sales }} 次
                </div>
              </div>

              <div class="text-red-600 text-3xl font-bold mb-4">
                ￥{{ product.price.toLocaleString() }}
              </div>

              <div class="mb-4 flex items-center text-gray-600">
                <MapPin :size="16" class="mr-1" />
                <span>{{ product.location || '未设定地区' }}</span>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <p class="text-gray-700">
                  {{ product.description || '暂无描述' }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="flex items-center">
                  <Camera class="text-gray-500 mr-2" :size="20" />
                  <div>
                    <div class="text-sm text-gray-500">
                      照片数量
                    </div>
                    <div class="font-medium">
                      {{ product.photoCount || '未设定' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <Shirt class="text-gray-500 mr-2" :size="20" />
                  <div>
                    <div class="text-sm text-gray-500">
                      服装套数
                    </div>
                    <div class="font-medium">
                      {{ product.costumeCount || '未设定' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <Award class="text-gray-500 mr-2" :size="20" />
                  <div>
                    <div class="text-sm text-gray-500">
                      摄影师等级
                    </div>
                    <div class="font-medium">
                      {{ product.photographerLevel || '未设定' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <Calendar class="text-gray-500 mr-2" :size="20" />
                  <div>
                    <div class="text-sm text-gray-500">
                      成立年份
                    </div>
                    <div class="font-medium">
                      {{ product.establishmentYears || '未设定' }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="product.tagsList && product.tagsList.length" class="mb-4">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tag, index) in product.tagsList"
                    :key="index"
                    class="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div v-if="product.shootingLocationsList && product.shootingLocationsList.length" class="mb-4">
                <h3 class="text-gray-700 font-medium mb-2">
                  拍摄地点
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(location, index) in product.shootingLocationsList"
                    :key="index"
                    class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {{ location }}
                  </span>
                </div>
              </div>

              <div class="mt-auto">
                <div class="flex gap-4">
                  <NButton
                    type="primary"
                    size="large"
                    class="flex-1"
                    color="#D32029"
                  >
                    立即预约
                  </NButton>
                  <NButton type="default" size="large" class="flex-1">
                    加入收藏
                  </NButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细信息部分 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 左侧详情 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-gray-200">
                <div class="p-4">
                  <h2 class="text-xl font-bold flex items-center">
                    <Info class="mr-2" :size="20" />
                    服务详情
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div v-if="product.detail" class="rich-text" v-html="product.detail" />
                <div v-else class="text-gray-500 text-center py-8">
                  暂无详细信息
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧商家信息 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div class="border-b border-gray-200">
                <div class="p-4">
                  <h2 class="text-xl font-bold flex items-center">
                    <Store class="mr-2" :size="20" />
                    商家信息
                  </h2>
                </div>
              </div>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Store :size="24" class="text-gray-400" />
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

                <div class="border-t border-gray-100 pt-4 mt-4">
                  <div class="mb-3">
                    <div class="text-sm text-gray-500 mb-1">
                      经营年限
                    </div>
                    <div>{{ product.establishmentYears ? `${product.establishmentYears}年` : '未设定' }}</div>
                  </div>
                  <div class="mb-3">
                    <div class="text-sm text-gray-500 mb-1">
                      地址
                    </div>
                    <div>{{ product.location || '未设定' }}</div>
                  </div>
                </div>

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

                <NButton type="default" block class="mt-4">
                  <MessageCircle class="mr-2" :size="16" />
                  联系商家
                </NButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photography-detail-container {
  background-color: #f9f8f6;
  min-height: 100vh;
}

.rich-text img {
  max-width: 100%;
  height: auto;
}

/* 中国风细节 */
h1,
h2 {
  font-family: 'STZhongsong', 'SimSun', serif;
}
</style>
