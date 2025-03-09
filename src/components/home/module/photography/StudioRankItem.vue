<script setup lang="ts">
import { computed, h } from 'vue'
import { handleImgUrl } from '~/utils/core'

interface StudioRankItemProps {
  rank?: string
  logo: string
  name: string
  rating: string
  price: string
  reviewCount: string
  area: string
  type: string
}

const props = defineProps<StudioRankItemProps>()

// Computed classes
const rankClass = computed(() => {
  const rankNumber = Number.parseInt(props.rank || '0')
  if (rankNumber === 1)
    return 'bg-red-500'
  if (rankNumber === 2)
    return 'bg-red-400'
  if (rankNumber === 3)
    return 'bg-orange-400'
  return 'bg-gray-400'
})

const ratingClass = computed(() => {
  if (props.type === 'blue')
    return 'bg-blue-50 text-blue-600'
  return 'bg-amber-50 text-amber-600'
})

const heartClass = computed(() => {
  if (props.type === 'blue')
    return 'fill-blue-600'
  return 'fill-amber-600'
})

// Heart Icon Component
const HeartIcon = {
  render: () => h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: '24',
    height: '24',
  }, [
    h('path', {
      d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    }),
  ]),
}
</script>

<template>
  <div class="studio-rank-item flex items-start hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
    <!-- Rank Badge (if provided) -->
    <div v-if="rank" class="rank-badge flex-shrink-0 w-6 h-6 flex items-center justify-center text-white font-bold text-xs rounded mr-2" :class="[rankClass]">
      {{ rank }}
    </div>
    <div v-else class="w-6 mr-2" />

    <!-- Studio Logo -->
    <div class="w-16 h-16 flex-shrink-0 mr-3">
      <img
        :src="handleImgUrl(logo)"
        :alt="name"
        class="w-full h-full object-cover rounded"
      >
    </div>

    <!-- Studio Info -->
    <div class="flex-grow min-w-0">
      <h3 class="font-medium text-sm line-clamp-1 mb-1">
        {{ name }}
      </h3>

      <!-- Rating and Price -->
      <div class="flex items-center gap-1 mb-1">
        <div class="rating-badge flex items-center text-xs rounded px-1.5 py-0.5" :class="[ratingClass]">
          <HeartIcon class="w-3 h-3 mr-0.5" :class="heartClass" />
          <span>{{ rating }}</span>
        </div>
        <span class="text-gray-600 text-xs">{{ price }}</span>
      </div>

      <!-- Review Count and Area -->
      <div class="flex items-center text-xs text-gray-500">
        <span>{{ reviewCount }}</span>
        <span class="mx-1">·</span>
        <span>{{ area }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
