<script setup lang="ts">
import { computed } from 'vue'
import { ComputerIcon, DiamondIcon, ThumbsUp } from 'lucide-vue-next'
import { handleImgUrl } from '~/utils/core'
import type { Company } from './type'

const props = defineProps<{
  company: Company
}>()

const ratingBadgeClass = computed(() => {
  switch (props.company.ratingType) {
    case 'comprehensive':
      return 'flex items-center bg-amber-100 text-amber-800 text-xs px-1 rounded'
    case 'premium':
      return 'flex items-center bg-red-100 text-red-800 text-xs px-1 rounded'
    case 'service':
    default:
      return 'flex items-center bg-blue-100 text-blue-800 text-xs px-1 rounded'
  }
})

const ratingIcon = computed(() => {
  switch (props.company.ratingType) {
    case 'comprehensive':
      return ComputerIcon
    case 'premium':
      return DiamondIcon
    case 'service':
    default:
      return ThumbsUp
  }
})
</script>

<template>
  <div class="flex bg-white rounded-md overflow-hidden hover:shadow-sm transition-all">
    <!-- Company Image -->
    <div class="w-24 h-24 flex-shrink-0 bg-gray-400">
      <img
        :src="handleImgUrl(company.image)"
        :alt="company.name"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Company Info -->
    <div class="flex flex-col flex-grow p-2">
      <h4 class="font-medium text-sm mb-1">
        {{ company.name }}
      </h4>

      <!-- Rating -->
      <div class="flex items-center mb-1">
        <span :class="ratingBadgeClass">
          <component :is="ratingIcon" class="size-3 mr-1" />
          {{ company.rating }}
        </span>
      </div>

      <!-- Price & Location -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>¥{{ company.price }}起 {{ company.priceType }} | {{ company.location }}</span>
      </div>
    </div>
  </div>
</template>
