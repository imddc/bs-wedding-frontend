<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Gift,
  MapPin,
  MessageCircle,
  MessageSquare,
  ShoppingCart,
  Star,
} from 'lucide-vue-next'

const message = useMessage()
const selectedImage = ref(0)
const router = useRouter()

// Sample data - in a real app, this would come from an API
const photography = ref({
  id: 1,
  title: '韩国匠艺婚纱摄影',
  mainImage: 'https://picsum.photos/seed/5/800/600',
  subImages: Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${i + 1}/800/600`),
  rating: 4.7,
  location: '北京市朝阳区高碑店区区43-2',
  features: ['韩式风格', '外景拍摄', '专业化妆', '多套服装', '精修照片'],
  arrivalGift: '一盒相框礼盒',
  consultGift: '滴滴打车',
  priceRange: '¥4998-¥13140',
  description: '韩国匠艺婚纱摄影以精湛的摄影技术和独特的韩式风格著称，为新人提供高品质的婚纱摄影服务。我们拥有专业的摄影团队、精致的服装造型和多样化的场景选择，为每对新人打造独一无二的婚纱照。我们注重细节，追求完美，致力于捕捉每对新人最美好的瞬间。',
})

// Methods
function selectImage(index: number) {
  selectedImage.value = index
  // In a real implementation, you would update the main image
  photography.value.mainImage = photography.value.subImages[index]
}

function handleContact(type: 'phone' | 'chat') {
  if (type === 'phone') {
    message.info('正在拨打电话咨询...')
  } else {
    message.info('正在打开在线咨询...')
  }
}

function addToCart() {
  message.success('已添加到购物车')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="mt-10">
    <!-- Back Button -->
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 mb-4">
      <NButton
        secondary
        class="flex items-center transition-all duration-300 hover:bg-gray-100 rounded-full px-4"
        @click="goBack"
      >
        <ArrowLeft class="h-5 w-5 mr-1" />
        返回
      </NButton>
    </div>

    <!-- Main Container with responsive layout -->
    <div class="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left side - Gallery -->
        <div class="w-full lg:w-3/5 xl:w-2/3">
          <div class="relative">
            <!-- Main Image -->
            <div class="w-full overflow-hidden rounded-lg">
              <img
                :src="photography.mainImage"
                :alt="photography.title"
                class="w-full object-cover h-auto lg:h-[600px] rounded-lg"
              >
            </div>

            <!-- Thumbnail Gallery -->
            <div class="mt-4 grid grid-cols-5 gap-2">
              <div
                v-for="(image, index) in photography.subImages"
                :key="index"
                class="overflow-hidden rounded cursor-pointer border-2"
                :class="selectedImage === index ? 'border-primary-500' : 'border-transparent'"
                @click="selectImage(index)"
              >
                <img
                  :src="image"
                  :alt="`${photography.title} - ${index + 1}`"
                  class="w-full h-20 object-cover"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Details -->
        <div class="w-full lg:w-2/5 xl:w-1/3 mt-6 lg:mt-0">
          <!-- Title and Share -->
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-2xl font-bold">
              {{ photography.title }}
            </h1>
          </div>

          <!-- Rating -->
          <div class="flex items-center mb-6">
            <div class="flex items-center">
              <Star class="size-5 mr-1" />
              <span class="text-yellow-500 font-medium">{{ photography.rating }}分</span>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-center mb-6 text-gray-700">
            <MapPin class="h-5 w-5 mr-2" />
            <span>{{ photography.location }}</span>
          </div>

          <!-- Studio Features -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">
              工作室特色
            </h3>
            <div class="flex flex-wrap gap-2">
              <NTag
                v-for="(feature, index) in photography.features"
                :key="index"
                type="info"
                size="medium"
              >
                {{ feature }}
              </NTag>
            </div>
          </div>

          <!-- Services -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">
              服务内容
            </h3>
            <div class="space-y-2">
              <div v-if="photography.arrivalGift" class="flex items-center">
                <Gift class="h-5 w-5 text-red-500 mr-2" />
                <span>到店礼：{{ photography.arrivalGift }}</span>
              </div>
              <div v-if="photography.consultGift" class="flex items-center">
                <MessageSquare class="h-5 w-5 text-red-500 mr-2" />
                <span>咨询礼：{{ photography.consultGift }}</span>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-8">
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-2">拍摄均价</span>
              <span class="text-xl text-red-500 font-bold">{{ photography.priceRange }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <NButton
              type="primary"
              size="large"
              round
              class="rounded-full h-12 bg-primary-500 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] flex items-center justify-center"
              @click="handleContact('chat')"
            >
              <template #icon>
                <MessageCircle class="h-5 w-5 mr-1" />
              </template>
              在线咨询
            </NButton>

            <NButton
              type="warning"
              size="large"
              round
              class="mt-4 rounded-full h-12 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] flex items-center justify-center"
              @click="addToCart"
            >
              <template #icon>
                <ShoppingCart class="h-5 w-5 mr-1" />
              </template>
              加入购物车
            </NButton>
          </div>

          <!-- Add to Cart Button -->
        </div>
      </div>

      <!-- Studio Details -->
      <div class="mt-12">
        <h2 class="text-xl font-bold mb-6">
          工作室详情
        </h2>
        <div class="bg-gray-50 p-6 rounded-lg">
          <div class="prose max-w-none">
            <p>{{ photography.description }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <!-- <img
                v-for="(image, index) in photography.studioImages"
                :key="index"
                :src="image"
                :alt="`Studio image ${index + 1}`"
                class="w-full h-40 object-cover rounded-lg"
                > -->
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Reviews -->
      <div class="mt-12 mb-16">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">
            客户评价
          </h2>
        </div>
        <!-- <div class="space-y-6">
          <div v-for="(review, index) in photography.reviews.slice(0, 3)" :key="index" class="border-b pb-6">
          <div class="flex items-center mb-2">
          <img :src="review.avatar" :alt="review.name" class="w-10 h-10 rounded-full mr-3">
          <div>
          <div class="font-medium">
          {{ review.name }}
          </div>
          <div class="flex text-yellow-400">
          <Star
          v-for="i in 5"
          :key="i"
          class="h-4 w-4"
          :class="[i <= review.rating ? 'fill-current' : 'text-gray-300']"
          />
          </div>
          </div>
          <div class="ml-auto text-sm text-gray-500">
          {{ review.date }}
          </div>
          </div>
          <p class="text-gray-700">
          {{ review.comment }}
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
          <img
          v-for="(image, imgIndex) in review.images"
          :key="imgIndex"
          :src="image"
          :alt="`Review image ${imgIndex + 1}`"
          class="w-16 h-16 object-cover rounded"
          >
          </div>
          </div>
          </div> -->
      </div>
    </div>
  </div>
</template>
