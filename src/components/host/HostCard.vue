<script setup lang="ts">
import { NButton } from 'naive-ui'
import { Image, MapPin, Star } from 'lucide-vue-next'
import type { HostProduct } from '~/api/product/type'
import { handleImgUrl } from '~/utils/core'

const props = defineProps<{
  product: HostProduct
  isHot?: boolean
}>()

const emit = defineEmits<{
  viewDetails: [id: number]
}>()

function handleViewDetails() {
  emit('viewDetails', props.product.id)
}
</script>

<template>
  <div class="host-card relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full">
    <!-- 推荐标签 -->
    <div
      v-if="isHot"
      class="absolute top-2 right-2 px-2 py-1 rounded-full bg-indigo-600 text-white text-xs z-10"
    >
      推荐
    </div>

    <!-- 图片区域 -->
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="product.mainImage"
        :src="handleImgUrl(product.mainImage)"
        :alt="product.productName"
        class="w-full h-full object-cover object-top"
      >
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
        <Image class="text-gray-400" :size="48" />
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-70" />
      <div class="absolute bottom-2 left-2 text-white">
        <div class="text-lg font-bold line-clamp-1">
          {{ product.productName }}
        </div>
        <div class="flex items-center text-sm">
          <Star class="text-yellow-400 mr-1" :size="14" />
          <span>{{ product.rating }}</span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-3">
        <div class="text-indigo-800 font-bold">
          ￥{{ product.price.toLocaleString() }}
        </div>
        <div class="text-sm text-gray-500">
          <MapPin :size="14" class="inline mr-1" />
          <span>{{ product.location || '未知' }}</span>
        </div>
      </div>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2 min-h-10">
        {{ product.description || '暂无描述' }}
      </p>

      <!-- 特色标签 -->
      <div v-if="product.tagsList?.length" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in product.tagsList.slice(0, 2)"
          :key="tag"
          class="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <div :class="!isHot ? 'flex justify-end' : ''">
        <NButton
          type="primary"
          size="small"
          color="#991B1B"
          :block="isHot"
          class="!bg-gradient-to-r from-indigo-800 to-indigo-700 hover:from-indigo-700 hover:to-indigo-600 transition-colors"
          @click="handleViewDetails"
        >
          查看详情
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.host-card {
  transition: all 0.3s ease;
}

.host-card:hover {
  transform: translateY(-2px);
}
</style>
