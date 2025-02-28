<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NPagination, NTag, useMessage } from 'naive-ui'
import { Star } from 'lucide-vue-next'
import { hosts as data, experienceOptions, priceOptions, sortOptions, styleOptions } from './helper'

const message = useMessage()

// Filter state
const selectedPrice = ref('all')
const selectedStyle = ref('all')
const selectedExperience = ref('all')
const sortBy = ref('comprehensive')
const currentPage = ref(1)
const pageSize = ref(12)

const hosts = ref(data)

// Filter logic
const filteredHosts = computed(() => {
  let result = [...hosts.value]

  // Apply price filter
  if (selectedPrice.value !== 'all') {
    result = result.filter((host) => {
      switch (selectedPrice.value) {
        case 'under3000':
          return host.price < 3000
        case '3000to5000':
          return host.price >= 3000 && host.price <= 5000
        case '5000to8000':
          return host.price > 5000 && host.price <= 8000
        case 'above8000':
          return host.price > 8000
        default:
          return true
      }
    })
  }

  // Apply style filter
  if (selectedStyle.value !== 'all') {
    result = result.filter(host => host.style === selectedStyle.value)
  }

  // Apply experience filter
  if (selectedExperience.value !== 'all') {
    result = result.filter((host) => {
      switch (selectedExperience.value) {
        case 'under3':
          return host.experience < 3
        case '3to5':
          return host.experience >= 3 && host.experience <= 5
        case '5to10':
          return host.experience > 5 && host.experience <= 10
        case 'above10':
          return host.experience > 10
        default:
          return true
      }
    })
  }

  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return b.experience - a.experience
      default:
        return b.rating - a.rating // Default comprehensive sort prioritizes rating
    }
  })

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredHosts.value.length / pageSize.value))

// Methods
function resetFilters() {
  selectedPrice.value = 'all'
  selectedStyle.value = 'all'
  selectedExperience.value = 'all'
  sortBy.value = 'comprehensive'
  currentPage.value = 1
}

function applyFilters() {
  currentPage.value = 1
  message.success('筛选条件已应用')
}

function viewDetails(host: any) {
  message.info(`查看${host.name}的详细信息`)
  // Navigate to host details page
  // router.push(`/hosts/${host.id}`)
}

function selectHost(host: any) {
  message.success(`已选择${host.name}作为您的婚礼主持人`)
  // Add host to wedding plan or open booking modal
}
</script>

<template>
  <div class="w-full bg-white p-6 container mx-auto space-y-6">
    <h2 class="text-xl font-bold">
      婚宴主持人
    </h2>

    <!-- Filter Section -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="mb-4 space-y-4">
        <!-- Price Filter -->
        <div>
          <h3 class="text-sm font-medium mb-2">
            价格区间
          </h3>
          <div class="flex flex-wrap gap-2">
            <NTag
              v-for="price in priceOptions"
              :key="price.value"
              :type="selectedPrice === price.value ? 'primary' : 'default'"
              size="large"
              class="cursor-pointer"
              @click="selectedPrice = price.value"
            >
              {{ price.label }}
            </NTag>
          </div>
        </div>

        <!-- Style Filter -->
        <div>
          <h3 class="text-sm font-medium mb-2">
            主持风格
          </h3>
          <div class="flex flex-wrap gap-2">
            <NTag
              v-for="style in styleOptions"
              :key="style.value"
              :type="selectedStyle === style.value ? 'primary' : 'default'"
              size="large"
              class="cursor-pointer"
              @click="selectedStyle = style.value"
            >
              {{ style.label }}
            </NTag>
          </div>
        </div>

        <!-- Experience Filter -->
        <div>
          <h3 class="text-sm font-medium mb-2">
            主持经验
          </h3>
          <div class="flex flex-wrap gap-2">
            <NTag
              v-for="exp in experienceOptions"
              :key="exp.value"
              :type="selectedExperience === exp.value ? 'primary' : 'default'"
              size="large"
              class="cursor-pointer"
              @click="selectedExperience = exp.value"
            >
              {{ exp.label }}
            </NTag>
          </div>
        </div>
      </div>

      <!-- Search and Reset -->
      <div class="flex justify-end gap-2">
        <NButton type="default" size="small" @click="resetFilters">
          重置
        </NButton>
        <NButton type="primary" size="small" @click="applyFilters">
          搜索
        </NButton>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="flex justify-between items-center">
      <div class="flex gap-4">
        <span
          v-for="sort in sortOptions"
          :key="sort.value"
          class="px-2 py-1 text-sm cursor-pointer"
          :class="[sortBy === sort.value ? 'text-primary-500 font-medium' : 'text-gray-500']"
          @click="sortBy = sort.value"
        >
          {{ sort.label }}
        </span>
      </div>
      <div class="text-sm text-gray-500">
        共找到 <span class="text-primary-500 font-medium">{{ filteredHosts.length }}</span> 名主持人
      </div>
    </div>

    <!-- Host List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="host in filteredHosts"
        :key="host.id"
        class="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
      >
        <!-- Host Image -->
        <div class="aspect-[4/3] relative overflow-hidden">
          <img :src="host.image" :alt="host.name" class="w-full h-full object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 class="text-white font-medium">
              {{ host.name }}
            </h3>
          </div>
        </div>

        <!-- Host Info -->
        <div class="p-4">
          <div class="flex justify-between mb-2">
            <div class="flex items-center">
              <Star class="h-4 w-4 text-yellow-400" />
              <span class="ml-1 text-sm">{{ host.rating }}</span>
              <span class="ml-2 text-xs text-gray-500">({{ host.reviewCount }}条评价)</span>
            </div>
            <div class="text-red-500 font-medium">
              ¥{{ host.price }}
            </div>
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
            <NTag
              v-for="tag in host.tags"
              :key="tag"
              size="small"
              type="info"
            >
              {{ tag }}
            </NTag>
          </div>

          <div class="text-xs text-gray-500 mb-3">
            主持场数: {{ host.weddingCount }}场 | 经验: {{ host.experience }}年
          </div>

          <div class="flex justify-between items-center">
            <NButton
              type="primary"
              ghost
              size="small"
              @click="viewDetails(host)"
            >
              查看详情
            </NButton>
            <NButton type="primary" size="small" @click="selectHost(host)">
              立即预约
            </NButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-8">
      <NPagination
        v-model:page="currentPage"
        :page-count="totalPages"
        :page-sizes="[12, 24, 36]"
        :page-size="pageSize"
        @update:page-size="pageSize = $event"
      />
    </div>
  </div>
</template>
