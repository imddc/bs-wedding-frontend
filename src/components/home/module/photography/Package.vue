<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import { useMessage } from 'naive-ui'
// import axios from 'axios'
import PackageCard from './PackageCard.vue'

interface Package {
  id: number
  image: string
  title: string
  studio: string
  price: number
  featured?: boolean
}

// const message = useMessage()
const packages = ref<Package[]>([])
// const isLoading = ref(false)

// async function fetchPackages() {
//   isLoading.value = true
//   try {
//     const response = await axios.get('/api/wedding-packages')
//     packages.value = response.data
//   } catch (error) {
//     message.error('获取套餐信息失败，请稍后重试')
//     console.error('Error fetching packages:', error)
//   } finally {
//     isLoading.value = false
//   }
// }

// Alternatively, use static data if no API is available
function loadMockData() {
  packages.value = [
    {
      id: 1,
      image: '/images/packages/package1.jpg',
      title: '【店内热销】内外景婚纱照',
      studio: '水晶之恋婚纱摄影（国贸店）',
      price: 5999,
    },
    {
      id: 2,
      image: '/images/packages/package2.jpg',
      title: '本地专享|立减3000元',
      studio: '铂爵摄影(北京店)',
      price: 6299,
    },
    {
      id: 3,
      image: '/images/packages/package3.jpg',
      title: '性价比·喜嫁婚纱夜景',
      studio: '北京蒙娜丽莎婚纱摄影',
      price: 6599,
    },
    {
      id: 4,
      image: '/images/packages/package4.jpg',
      title: '《梦幻水晶系列1》',
      studio: '聚焦摄影（北京总店）',
      price: 6999,
    },
    {
      id: 5,
      image: '/images/packages/package5.jpg',
      title: '【超值推荐】 限时9折',
      studio: '北京金夫人婚纱摄影',
      price: 7299,
      featured: true,
    },
  ]
}

onMounted(() => {
  // Uncomment to use the API
  // fetchPackages()

  // Using mock data for now
  loadMockData()
})
</script>

<template>
  <div class="w-full bg-white p-6 rounded-lg shadow-sm container mx-auto">
    <h2 class="text-xl font-bold mb-4">
      热卖套餐
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <PackageCard
        v-for="pkg in packages"
        :key="pkg.id"
        :image="pkg.image"
        :title="pkg.title"
        :studio="pkg.studio"
        :price="pkg.price"
        :featured="!!pkg.featured"
      />
    </div>
  </div>
</template>
