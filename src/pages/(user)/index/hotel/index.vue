<script setup lang="ts">
import { computed, ref } from 'vue'
import { NRate } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { Hotel } from '~/components/home/module/hotel/type'

const router = useRouter()

// Filter data
const districts = ref([
  { label: '全部', value: 'all' },
  { label: '朝阳区', value: 'chaoyang' },
  { label: '海淀区', value: 'haidian' },
  { label: '丰台区', value: 'fengtai' },
  { label: '西城区', value: 'xicheng' },
  { label: '东城区', value: 'dongcheng' },
])

const styles = ref([
  { label: '全部', value: 'all' },
  { label: '韩式', value: 'korean' },
  { label: '森系', value: 'forest' },
  { label: '欧美', value: 'western' },
  { label: '中式', value: 'chinese' },
  { label: '日系', value: 'japanese' },
  { label: '复古', value: 'vintage' },
])

const prices = ref([
  { label: '全部', value: 'all' },
  { label: '¥5000以下', value: 'under5000' },
  { label: '¥5000-¥10000', value: '5000to10000' },
  { label: '¥10000-¥15000', value: '10000to15000' },
  { label: '¥15000-¥20000', value: '15000to20000' },
  { label: '¥20000以上', value: 'above20000' },
])

// Selected filters
const selectedDistrict = ref('all')
const selectedStyle = ref('all')
const selectedPrice = ref('all')

// Hotel data
const hotels = ref([
  {
    id: 1,
    name: '梦幻婚纱摄影工作室 1',
    image: '/images/hotels/hotel1.jpg',
    featuredImage: '/images/hotels/featured1.jpg',
    rating: 3,
    location: '深圳',
    branch: '预约免费车接送店',
    price: '¥15000以上',
    priceValue: 15000,
    style: 'western',
    district: 'futian',
    recommended: true,
  },
  {
    id: 2,
    name: '梦幻婚纱摄影工作室 2',
    image: '/images/hotels/hotel2.jpg',
    featuredImage: '/images/hotels/featured2.jpg',
    rating: 3,
    location: '北京',
    branch: '预约免费车接送店',
    price: '¥15000以上',
    priceValue: 15000,
    style: 'korean',
    district: 'chaoyang',
    recommended: true,
  },
  {
    id: 3,
    name: '梦幻婚纱摄影工作室 3',
    image: '/images/hotels/hotel3.jpg',
    featuredImage: '/images/hotels/featured3.jpg',
    rating: 3,
    location: '广州',
    branch: '预约免费车接送店',
    price: '¥3000-8000',
    priceValue: 5000,
    style: 'forest',
    district: 'haizhu',
    recommended: true,
  },
  {
    id: 4,
    name: '水晶之恋婚纱摄影',
    image: '/images/hotels/hotel4.jpg',
    featuredImage: '/images/hotels/featured4.jpg',
    rating: 4,
    location: '北京',
    branch: '朝阳店',
    price: '¥6999起',
    priceValue: 6999,
    style: 'western',
    district: 'chaoyang',
    recommended: false,
  },
  {
    id: 5,
    name: '韩国匠艺婚纱摄影',
    image: '/images/hotels/hotel5.jpg',
    featuredImage: '/images/hotels/featured5.jpg',
    rating: 5,
    location: '北京',
    branch: '西城区店',
    price: '¥8888起',
    priceValue: 8888,
    style: 'korean',
    district: 'xicheng',
    recommended: false,
  },
])

// Filter hotels based on selected filters
const filteredHotels = computed(() => {
  return hotels.value.filter((hotel) => {
    // District filter
    if (selectedDistrict.value !== 'all' && hotel.district !== selectedDistrict.value) {
      return false
    }

    // Style filter
    if (selectedStyle.value !== 'all' && hotel.style !== selectedStyle.value) {
      return false
    }

    // Price filter
    if (selectedPrice.value !== 'all') {
      switch (selectedPrice.value) {
        case 'under5000':
          if (hotel.priceValue >= 5000)
            return false
          break
        case '5000to10000':
          if (hotel.priceValue < 5000 || hotel.priceValue > 10000)
            return false
          break
        case '10000to15000':
          if (hotel.priceValue < 10000 || hotel.priceValue > 15000)
            return false
          break
        case '15000to20000':
          if (hotel.priceValue < 15000 || hotel.priceValue > 20000)
            return false
          break
        case 'above20000':
          if (hotel.priceValue <= 20000)
            return false
          break
        default:
          break
      }
    }

    return true
  })
})

// Total number of hotels
const totalHotels = computed(() => {
  return filteredHotels.value.length
})

function clickHotel(hotel: Hotel) {
  router.push(`/hotel/${hotel.id}`)
}
</script>

<template>
  <div class="w-full bg-gray-50 container mx-auto mt-8">
    <!-- Filter Section -->
    <div class="bg-white p-6 mb-4 shadow-sm rounded-md">
      <!-- District Filter -->
      <div class="mb-4">
        <div class="text-sm font-medium mb-2">
          区域:
        </div>
        <div class="flex flex-wrap gap-4">
          <span
            v-for="district in districts"
            :key="district.value"
            class="cursor-pointer text-sm"
            :class="selectedDistrict === district.value ? 'text-red-500 font-medium' : 'text-gray-700'"
            @click="selectedDistrict = district.value"
          >
            {{ district.label }}
          </span>
        </div>
      </div>

      <!-- Style Filter -->
      <div class="mb-4">
        <div class="text-sm font-medium mb-2">
          风格:
        </div>
        <div class="flex flex-wrap gap-4">
          <span
            v-for="style in styles"
            :key="style.value"
            class="cursor-pointer text-sm"
            :class="selectedStyle === style.value ? 'text-red-500 font-medium' : 'text-gray-700'"
            @click="selectedStyle = style.value"
          >
            {{ style.label }}
          </span>
        </div>
      </div>

      <!-- Price Filter -->
      <div class="mb-2">
        <div class="text-sm font-medium mb-2">
          价格:
        </div>
        <div class="flex flex-wrap gap-4">
          <span
            v-for="price in prices"
            :key="price.value"
            class="cursor-pointer text-sm"
            :class="selectedPrice === price.value ? 'text-red-500 font-medium' : 'text-gray-700'"
            @click="selectedPrice = price.value"
          >
            {{ price.label }}
          </span>
        </div>
      </div>

      <!-- Result Count -->
      <div class="text-sm text-gray-500 mt-4">
        共 {{ totalHotels }} 个婚礼工作室
      </div>
    </div>

    <!-- Hotel List -->
    <div class="space-y-4">
      <div
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        class="bg-white p-4 rounded-md shadow-sm flex gap-4"
        @click="() => clickHotel(hotel)"
      >
        <!-- Hotel Thumbnail -->
        <div class="w-32 h-32 flex-shrink-0">
          <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover rounded-md">
        </div>

        <!-- Hotel Info -->
        <div class="flex-grow">
          <div class="flex items-center mb-2">
            <h3 class="text-lg font-medium">
              {{ hotel.name }}
            </h3>
            <div v-if="hotel.recommended" class="ml-auto bg-red-500 text-white text-xs py-0.5 px-2 rounded">
              本店主推
            </div>
          </div>

          <!-- Rating -->
          <div class="flex items-center mb-2">
            <NRate :value="hotel.rating" />
            <span class="ml-2 text-sm text-gray-600">{{ hotel.location }}</span>
            <span class="ml-2 text-sm text-gray-600">{{ hotel.branch }}</span>
          </div>

          <!-- Price -->
          <div class="mt-auto">
            <span class="text-red-500 font-bold text-xl">{{ hotel.price }}</span>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="w-40 h-24 rounded-md overflow-hidden hidden md:block">
          <img :src="hotel.featuredImage" :alt="`${hotel.name} featured`" class="w-full h-full object-cover">
        </div>
      </div>
    </div>
  </div>
</template>
