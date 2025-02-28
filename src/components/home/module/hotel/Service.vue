<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import HotelCard from './HotelCard.vue'
import CompanyCard from './CompanyCard.vue'
import type { Company, Hotel } from './type'

const hotels = ref<Hotel[]>([
  {
    id: 1,
    name: '德云红事会馆',
    image: '/images/hotels/deyun.jpg',
    rating: 3.9,
    features: ['特色餐厅'],
    location: '朝阳区 | 四惠',
    tables: '2-40桌',
    price: 4988,
  },
  {
    id: 2,
    name: '北京厦航嘉年华酒店',
    image: '/images/hotels/xiahang.jpg',
    rating: 3.9,
    features: ['奢华五星'],
    location: '丰台区 | 六里桥',
    tables: '12-40桌',
    price: 6999,
  },
  {
    id: 3,
    name: '北京富力万丽酒店',
    image: '/images/hotels/fuli.jpg',
    rating: 3.9,
    features: ['奢华五星'],
    location: '朝阳区 | 国贸',
    tables: '6-60桌',
    price: 5880,
  },
  {
    id: 4,
    name: '北京粤财JW万豪酒店',
    image: '/images/hotels/jwmarriott.jpg',
    rating: 3.9,
    features: ['奢华五星'],
    location: '西城区 | 西单',
    tables: '30-50桌',
    price: 7888,
  },
])

const companies = ref<Company[]>([
  {
    id: 1,
    name: 'FreeWedding自在婚礼(北京店)',
    image: '/images/companies/freewedding.jpg',
    rating: 4.2,
    ratingType: 'service',
    price: 2999,
    priceType: '4评价',
    location: '朝阳区',
  },
  {
    id: 2,
    name: 'Sunny喜铺婚礼策划',
    image: '/images/companies/sunny.jpg',
    rating: 4.7,
    ratingType: 'comprehensive',
    price: 4980,
    priceType: '711评价',
    location: '朝阳区',
  },
  {
    id: 3,
    name: 'TIME婚礼定制',
    image: '/images/companies/time.jpg',
    rating: 4.3,
    ratingType: 'service',
    price: 22880,
    priceType: '170评价',
    location: '朝阳区',
  },
  {
    id: 4,
    name: 'H+婚礼定制(北京店)',
    image: '/images/companies/hplus.jpg',
    rating: 4.9,
    ratingType: 'premium',
    price: 2999,
    priceType: '16评价',
    location: '朝阳区',
  },
  {
    id: 5,
    name: '金丽人婚礼策划',
    image: '/images/companies/jinliren.jpg',
    rating: 4.8,
    ratingType: 'premium',
    price: 7286,
    priceType: '1273评价',
    location: '丰台区',
  },
])
</script>

<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold mb-4">
      办婚礼
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 人气酒店 Section -->
      <div class="bg-red-50 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">
            人气酒店
          </h3>
          <RouterLink to="/hotels" class="text-gray-500 text-sm flex items-center">
            查看更多
            <ChevronRight class="h-4 w-4 ml-1" />
          </RouterLink>
        </div>

        <div class="space-y-4">
          <HotelCard
            v-for="hotel in hotels"
            :key="hotel.id"
            :hotel="hotel"
          />
        </div>
      </div>

      <!-- 人气婚庆公司 Section -->
      <div class="bg-red-50 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">
            人气婚庆公司
          </h3>
          <RouterLink to="/companies" class="text-gray-500 text-sm flex items-center">
            查看更多
            <ChevronRight class="h-4 w-4 ml-1" />
          </RouterLink>
        </div>

        <div class="space-y-4">
          <CompanyCard
            v-for="company in companies"
            :key="company.id"
            :company="company"
          />
        </div>
      </div>
    </div>
  </div>
</template>
