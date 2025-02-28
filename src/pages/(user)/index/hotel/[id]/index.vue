<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  Camera,
  Phone,
  Share2,
  Star,
} from 'lucide-vue-next'

const message = useMessage()
const router = useRouter()
const selectedHall = ref(0)

// Hotel data
const hotel = ref({
  id: 1,
  name: '德云红事会馆',
  mainImage: 'https://picsum.photos/seed/hotel1/800/600',
  hallImages: [
    'https://picsum.photos/seed/hall1/800/600',
    'https://picsum.photos/seed/hall2/800/600',
    'https://picsum.photos/seed/hall3/800/600',
  ],
  phone: '号码隐私保护，请放心致电',
  location: '北京市朝阳区红事会路1号',
  price: '¥4988',
  priceUnit: '/桌起',
  ratings: 0,
  reviews: 0,
  region: '朝阳区',
  type: '特色餐厅',
  hallCount: 3,
  capacity: '2-40桌',
  menuCount: 6,
  halls: [
    {
      name: '多功能厅',
      image: 'https://picsum.photos/seed/hall1/800/600',
      capacity: 6,
    },
    {
      name: '钻石一号馆',
      image: 'https://picsum.photos/seed/hall2/800/600',
      capacity: 40,
    },
    {
      name: '中式厅',
      image: 'https://picsum.photos/seed/hall3/800/600',
      capacity: 35,
    },
  ],
  nearbyHotels: [
    {
      id: 101,
      name: '文恩艺术中心',
      image: 'https://picsum.photos/seed/nearby1/800/600',
      region: '朝阳区',
      rating: 4.9,
      ratingCount: 49,
      type: '婚礼堂',
      capacity: '8-33桌',
    },
    {
      id: 102,
      name: '东方花园酒店',
      image: 'https://picsum.photos/seed/nearby2/800/600',
      region: '朝阳区',
      rating: 4.7,
      ratingCount: 62,
      type: '豪华酒店',
      capacity: '10-100桌',
    },
  ],
})

// Methods
function selectHall(index: number) {
  selectedHall.value = index
}

function handlePhoneCall() {
  message.info('正在拨打电话...')
}

function checkAvailability() {
  message.info('正在查询档期...')
}

function shareHotel() {
  message.info('分享功能已触发')
}

function viewMap() {
  message.info('查看地图')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
    <!-- Back Button -->
    <div class="py-4">
      <NButton class="flex items-center text-gray-500 hover:text-primary-500" @click="goBack">
        返回
      </NButton>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Left: Hotel Image -->
      <div class="md:w-1/2">
        <img
          :src="hotel.mainImage"
          :alt="hotel.name"
          class="w-full h-auto rounded-md object-cover"
        >
      </div>

      <!-- Right: Hotel Info -->
      <div class="md:w-1/2">
        <h1 class="text-2xl font-bold mb-4">
          {{ hotel.name }}
        </h1>

        <!-- Phone -->
        <div class="mb-4 flex items-center">
          <div class="mr-2 text-gray-700">
            电话:
          </div>
          <NButton
            type="error"
            size="small"
            round
            class="flex items-center"
          >
            <Phone class="h-4 w-4 mr-1" />
            {{ hotel.phone }}
          </NButton>
        </div>

        <!-- Location -->
        <div class="mb-4 flex">
          <div class="mr-2 text-gray-700">
            地址:
          </div>
          <div class="flex items-center">
            <span>{{ hotel.location }}</span>
            <NButton
              text
              type="primary"
              size="small"
              class="ml-2"
              @click="viewMap"
            >
              地图
            </NButton>
          </div>
        </div>

        <!-- Price -->
        <div class="mb-6">
          <div class="text-red-500 text-2xl font-bold">
            {{ hotel.price }}<span class="text-base">{{ hotel.priceUnit }}</span>
            <span class="ml-4 text-gray-500 text-sm">{{ hotel.ratings }}分 · {{ hotel.reviews }}条点评</span>
          </div>
        </div>

        <!-- Hotel Attributes -->
        <div class="grid grid-cols-5 mb-8 text-center border-y border-gray-100 py-4">
          <div class="flex flex-col items-center">
            <div class="text-gray-500 text-sm mb-1">
              区域
            </div>
            <div class="font-medium">
              {{ hotel.region }}
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-gray-500 text-sm mb-1">
              类型
            </div>
            <div class="font-medium">
              {{ hotel.type }}
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-gray-500 text-sm mb-1">
              {{ hotel.hallCount }}个
            </div>
            <div class="font-medium">
              婚宴场地
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-gray-500 text-sm mb-1">
              容纳
            </div>
            <div class="font-medium">
              {{ hotel.capacity }}
            </div>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-gray-500 text-sm mb-1">
              {{ hotel.menuCount }}套
            </div>
            <div class="font-medium">
              菜单
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <NButton
            type="error"
            round
            size="large"
            class="flex-1 h-12"
            @click="handlePhoneCall"
          >
            <template #icon>
              <Phone class="h-5 w-5 mr-1" />
            </template>
            电话咨询
          </NButton>
          <NButton
            type="primary"
            round
            size="large"
            class="flex-1 h-12"
            @click="checkAvailability"
          >
            <template #icon>
              <Camera class="h-5 w-5 mr-1" />
            </template>
            查询档期
          </NButton>
          <NButton
            text
            size="large"
            class="h-12 px-4"
            @click="shareHotel"
          >
            <Share2 class="h-5 w-5" />
          </NButton>
        </div>
      </div>
    </div>

    <!-- Wedding Halls Section -->
    <div class="mt-12">
      <h2 class="text-xl font-bold mb-6">
        婚宴场地
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(hall, index) in hotel.halls"
          :key="index"
          class="border border-gray-100 rounded-md overflow-hidden hover:shadow-md transition-all cursor-pointer"
          @click="selectHall(index)"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="hall.image"
              :alt="hall.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="p-4">
            <h3 class="font-medium mb-2">
              {{ hall.name }}
            </h3>
            <div class="text-gray-500 text-sm">
              容纳桌数 {{ hall.capacity }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nearby Hotels Section -->
    <div class="mt-12 mb-16">
      <h2 class="text-xl font-bold mb-6">
        本地区精选酒店
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="nearby in hotel.nearbyHotels"
          :key="nearby.id"
          class="border border-gray-100 rounded-md overflow-hidden hover:shadow-md transition-all cursor-pointer"
          @click="router.push(`/wedding/hotel/${nearby.id}`)"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="nearby.image"
              :alt="nearby.name"
              class="w-full h-full object-cover"
            >
            <div class="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {{ nearby.capacity }}
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <div class="flex items-center">
                  <NTag
                    v-if="nearby.type === '婚礼堂'"
                    type="success"
                    size="small"
                    class="mr-2"
                  >
                    VR全景
                  </NTag>
                  <h3 class="font-medium">
                    {{ nearby.name }}
                  </h3>
                </div>
                <div class="flex items-center text-sm text-gray-500 mt-1">
                  <span>{{ nearby.region }}</span>
                  <span class="mx-2">·</span>
                  <div class="flex items-center">
                    <span>{{ nearby.rating }}</span>
                    <Star class="h-3 w-3 text-yellow-400 mx-0.5" />
                    <span>{{ nearby.ratingCount }}条评价</span>
                  </div>
                </div>
              </div>
              <div v-if="nearby.type" class="text-sm text-gray-500">
                {{ nearby.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
